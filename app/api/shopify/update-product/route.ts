import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getShopifyCredentials } from "@/lib/shopify";

export async function POST(req: Request) {
  try {
    const { storeId, itemId, previousQuantity } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("id", storeId)
      .eq("owner_id", user.id)
      .single();
    if (!store) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { accessToken, shopName } = await getShopifyCredentials(storeId);
    if (!accessToken || !shopName) return NextResponse.json({ error: "Shopify not connected" }, { status: 400 });

    // Fetch current item from Supabase (including quantity and Shopify IDs)
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("*, item_images(*)")
      .eq("id", itemId)
      .single();
    if (itemError) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    // First, get the product details to understand the current options structure
    const productQuery = `
      query {
        product(id: "${item.shopify_product_id}") {
          options {
            id
            name
            position
            values
          }
          variants(first: 10) {
            edges {
              node {
                id
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          media(first: 250) { 
            nodes { id } 
          }
        }
      }
    `;
    
    const productResponse = await fetch(`https://${shopName}/admin/api/2023-10/graphql.json`, {
      method: "POST",
      headers: { "X-Shopify-Access-Token": accessToken, "Content-Type": "application/json" },
      body: JSON.stringify({ query: productQuery }),
    });
    
    const productData = await productResponse.json();
    if (productData.errors) {
      console.error("Error fetching product details:", productData.errors);
      return NextResponse.json({ error: "Failed to fetch product details" }, { status: 500 });
    }
    
    const productOptions = productData.data.product.options;
    const currentVariant = productData.data.product.variants.edges[0].node;
    const currentMediaIds = productData.data.product.media.nodes.map((node: { id: string }) => node.id);
    
    // Prepare variant option updates
    const variantInput: { id: string; price: string; options?: string[] } = {
      id: item.shopify_variant_id,
      price: item.price.toString(),
    };
    
    // Map the current variant's selected options with the updated values
    const updatedOptions: string[] = [];
    
    // Match existing options with new values from the item
    productOptions.forEach((option: { name: string; values: string[] }) => {
      let newValue = null;
      
      if (option.name.toLowerCase() === "size" && item.size) {
        newValue = item.size;
      } else if (option.name.toLowerCase() === "color" && item.color) {
        newValue = item.color;
      } else if (option.name.toLowerCase() === "condition" && item.condition) {
        newValue = item.condition;
      }
      
      // If we found a new value, add it to updatedOptions
      if (newValue) {
        updatedOptions.push(newValue);
      }
    });
    
    if (updatedOptions.length > 0) {
      variantInput["options"] = updatedOptions;
    }

    const deltaValue = item.quantity - previousQuantity;
    console.log("🚀 ~ POST ~ deltaValue:", deltaValue)
    console.log("🚀 ~ POST ~ item.quantity:", item.quantity)
    if (item.shopify_inventory_item_id && item.shopify_location_id) {
      const inventoryMutation = `
        mutation {
          inventoryAdjustQuantities(input: {
            changes: [{
              inventoryItemId: "${item.shopify_inventory_item_id}",
              locationId: "${item.shopify_location_id}",
              delta: ${deltaValue},
            }],
            name: "available",
            reason: "correction"
          }) {
            inventoryAdjustmentGroup {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `;
      const inventoryResponse = await fetch(`https://${shopName}/admin/api/2025-01/graphql.json`, {
        method: "POST",
        headers: { "X-Shopify-Access-Token": accessToken, "Content-Type": "application/json" },
        body: JSON.stringify({ query: inventoryMutation }),
      });
      const inventoryResult = await inventoryResponse.json();
      console.log("🚀 ~ POST ~ inventoryResult:", inventoryResult);
      console.log("🚀 ~ POST ~ inventoryResult:", inventoryResult.data.inventoryAdjustQuantities.inventoryAdjustmentGroup);

      if (inventoryResult.errors || inventoryResult.data.inventoryAdjustQuantities.userErrors.length > 0) {
        console.error("Error adjusting inventory:", inventoryResult.errors || inventoryResult.data.inventoryAdjustQuantities.userErrors);
        // Optionally, rollback Supabase update or notify the user
      }
    }

    // Determine media to delete
    const currentItemMediaIds = item.item_images.map((img: { shopify_media_id: string }) => img.shopify_media_id).filter((id: string) => id);
    const mediaToDelete = currentMediaIds.filter((id: string) => !currentItemMediaIds.includes(id));

    // Delete removed media
    if (mediaToDelete.length > 0) {
      const deleteMutation = `
        mutation {
          productDeleteMedia(productId: "${item.shopify_product_id}", mediaIds: [${mediaToDelete.map((id: string) => `"${id}"`).join(",")}]) {
            deletedMediaIds
            userErrors { field message }
          }
        }
      `;
      const deleteResponse = await fetch(`https://${shopName}/admin/api/2023-10/graphql.json`, {
        method: "POST",
        headers: { "X-Shopify-Access-Token": accessToken, "Content-Type": "application/json" },
        body: JSON.stringify({ query: deleteMutation }),
      });
      const deleteResult = await deleteResponse.json();
      if (deleteResult.errors || (deleteResult.data.productDeleteMedia.userErrors && deleteResult.data.productDeleteMedia.userErrors.length > 0)) {
        console.error("Error deleting media:", deleteResult.errors || deleteResult.data.productDeleteMedia.userErrors);
      }
    }

   
        let hierarchy = [];
        let currentId = item.category_id;
        while (currentId) {
          const { data } = await supabase
            .from("categories")
            .select("id, name, parent_id")
            .eq("id", currentId)
            .single();
          if (!data) break;
          hierarchy.unshift(data.name);
          currentId = data.parent_id;
        }
      
        console.log("🚀 ~ POST ~ hierarchy:", hierarchy)

  
    // Prepare new media
    const newImages = item.item_images.filter((img: { shopify_media_id: string | null }) => !img.shopify_media_id);
    const mediaInput = newImages.map((img: { image_url: string }) => ({
      originalSource: img.image_url,
      mediaContentType: "IMAGE",
      alt: "Product image",
    }));

    // Update product details in Shopify
    const updateMutation = `
      mutation UpdateProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
        productUpdate(input: $input, media: $media) {
          product {
            id
            media(first: 10) { nodes { id } }
          }
          userErrors { field message }
        }
      }
    `;

    
    const variables = {
      input: {
        id: item.shopify_product_id,
        title: item.title,
        descriptionHtml: item.description || "",
        tags: item.tags || [],
        vendor: item.brand || "",
        productType: hierarchy.join(" > "),
        variants: [variantInput],
      },
      media: mediaInput,
    };

    const updateResponse = await fetch(`https://${shopName}/admin/api/2023-10/graphql.json`, {
      method: "POST",
      headers: { "X-Shopify-Access-Token": accessToken, "Content-Type": "application/json" },
      body: JSON.stringify({ query: updateMutation, variables }),
    });
    const updateResult = await updateResponse.json();

    if (updateResult.errors || (updateResult.data.productUpdate.userErrors && updateResult.data.productUpdate.userErrors.length > 0)) {
      console.error("Error updating product:", updateResult.errors || updateResult.data.productUpdate.userErrors);
      return NextResponse.json({ error: updateResult.errors || updateResult.data.productUpdate.userErrors }, { status: 500 });
    }

    // Update new images with shopify_media_id
    const newMediaNodes = updateResult.data.productUpdate.product.media.nodes;
    if (newImages.length > 0 && newMediaNodes.length > 0) {
      const { data: updatedImages } = await supabase
        .from("item_images")
        .select("id")
        .eq("item_id", item.id)
        .is("shopify_media_id", null)
        .order("display_order");
        
      if (updatedImages) {
        await Promise.all(
          updatedImages.map(async (img, index) => {
            if (index < newMediaNodes.length) {
              await supabase
                .from("item_images")
                .update({ shopify_media_id: newMediaNodes[index].id })
                .eq("id", img.id);
            }
          })
        );
      }
    }

    return NextResponse.json({ message: "Product and inventory updated successfully in Shopify" });
  } catch (error: unknown) {
    console.error("Unexpected error in /api/shopify/update-product:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Internal server error" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { createShopifyProduct, getCategoryHierarchy, publishProduct } from "../create-product/route";

interface ShopifyProduct {
  id: number;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  status: string;
  tags: string;
  admin_graphql_api_id: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  published_scope: string;
  handle: string;
  variants: any[];
  images: any[];
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const shop = searchParams.get("shop");

  if (!code || !shop) {
    return NextResponse.json({ error: "Missing code or shop" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Exchange code for access token
  const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    }),
  });

  const { access_token } = await response.json();

  const { data: store } = await supabase
    .from("stores")
    .update({
      shopify_access_token: access_token,
      shopify_shop_name: shop,
      last_sync_time: new Date().toISOString()
    })
    .eq("owner_id", user.id)
    .select()
    .single();

    console.log("🚀 ~ GET ~ access_token:", access_token)
    console.log("🚀 ~ GET ~ shop:", shop)

  // Import all existing products
  try {
    await importExistingProducts(shop, access_token, store.id);
  } catch (error: any) {
    console.error("Error importing existing products:", error);
  }

  try {
    await exportExistingItemsToShopify(shop, access_token, store.id);
  } catch (error) {
    console.error("Error exporting existing items to Shopify:", error);
  }

  const redirectURL = new URL("/inventory", process.env.NEXT_PUBLIC_APP_URL);
  return NextResponse.redirect(redirectURL);
}


async function exportExistingItemsToShopify(shopName: string, accessToken: string, storeId: string) {
  console.log("Starting export of existing Paperclip Retail items to Shopify...");
  const supabase = await createClient();

  // Fetch items that haven't been synced to Shopify
  const { data: items, error: fetchError } = await supabase
    .from("items")
    .select("*")
    .eq("store_id", storeId)
    .is("shopify_product_id", null)
    // Optionally filter by list_on_shopify if it exists in your schema
    // .eq("list_on_shopify", true);

  if (fetchError) {
    console.error("Error fetching items:", fetchError);
    throw fetchError;
  }

  console.log(`Found ${items.length} items to export to Shopify`);

  for (const item of items) {
    try {
      // Fetch item images
      const { data: images, error: imageError } = await supabase
        .from("item_images")
        .select("*")
        .eq("item_id", item.id)
        .order("display_order");

      if (imageError) {
        console.error(`Error fetching images for item ${item.id}:`, imageError);
        continue; // Skip to next item on error
      }

      // Fetch category hierarchy
      const categoryHierarchy = await getCategoryHierarchy(item.category_id, supabase);

      // Create Shopify product
      const shopifyProduct = await createShopifyProduct(
        shopName,
        accessToken,
        item,
        images,
        categoryHierarchy
      );

      // Publish the product to the Online Store
      await publishProduct(shopifyProduct.productId, shopName, accessToken);

      // Update the item with Shopify IDs
      const { error: updateError } = await supabase
        .from("items")
        .update({
          shopify_product_id: shopifyProduct.productId,
          shopify_variant_id: shopifyProduct.variantId,
          shopify_inventory_item_id: shopifyProduct.inventoryItemId,
          shopify_location_id: shopifyProduct.locationId,
          list_on_shopify: true, // Set to true since it's now on Shopify
        })
        .eq("id", item.id);

      if (updateError) {
        console.error(`Error updating item ${item.id} with Shopify IDs:`, updateError);
        continue; // Skip to next item on error
      }

      console.log(`Successfully exported item ${item.id} to Shopify with product ID ${shopifyProduct.productId}`);
    } catch (error) {
      console.error(`Error exporting item ${item.id} to Shopify:`, error);
    }
  }

  console.log("Completed exporting items to Shopify");
}


async function importExistingProducts(shopName: string, accessToken: string, storeId: string) {
  console.log("Starting import of existing Shopify products...");
  let hasMoreProducts = true;
  let nextPageParams = "";

  // Create a job record to track import progress
  const supabase = await createClient();
  const { data: importJob } = await supabase
    .from("import_jobs")
    .insert({
      store_id: storeId,
      source: "shopify",
      status: "processing",
      total_items: 0,
      processed_items: 0
    })
    .select()
    .single();

  let totalProcessed = 0;
  let errorCount = 0;

  try {
    while (hasMoreProducts) {
      // Fetch a page of products from Shopify
      const productsUrl = `https://${shopName}/admin/api/2023-07/products.json?limit=50${nextPageParams}`;
      const response = await fetch(productsUrl, {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("Error fetching products from Shopify:", error);
        throw new Error(`Failed to fetch products: ${error}`);
      }

      const productsData = await response.json();
      console.log("🚀 ~ importExistingProducts ~ productsData:", productsData)
      const products = productsData.products;
      console.log("🚀 ~ importExistingProducts ~ products:", products)

      if (!products || products.length === 0) {
        hasMoreProducts = false;
        continue;
      }

      // Update the import job with total count on first page
      if (!nextPageParams) {
        await supabase
          .from("import_jobs")
          .update({ total_items: products.length })
          .eq("id", importJob.id);
      }

      // Process each product
      for (const product of products) {
        try {
          console.log("🚀 ~ importExistingProducts ~ product:", product)
          // Add debug logging before webhook call
          console.log("Calling webhook with product:", {
            id: product.id,
            title: product.title
          });
      
          const webhookResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/webhooks`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-shopify-topic": "products/create",
              "x-shopify-shop-domain": shopName,
              // Add this header to bypass HMAC validation for internal calls
              "x-internal-call": "true"
            },
            body: JSON.stringify(product)
          });
      
          // Add response logging
          const responseText = await webhookResponse.text();
          console.log("Webhook response:", {
            status: webhookResponse.status,
            statusText: webhookResponse.statusText,
            body: responseText
          });
      
          if (!webhookResponse.ok) {
            throw new Error(`Webhook failed: ${webhookResponse.status} - ${responseText}`);
          }
          
          totalProcessed++;
          console.log(`Processed product ${totalProcessed}: ${product.title}`);
        } catch (error) {
          console.error(`Error processing product ${product.id}:`, error);
          errorCount++;
        }

        // Update progress every 5 products
        if (totalProcessed % 5 === 0) {
          await supabase
            .from("import_jobs")
            .update({ processed_items: totalProcessed })
            .eq("id", importJob.id);
        }
      }

      // Check for Link header for pagination
      const linkHeader = response.headers.get("Link");
      if (linkHeader && linkHeader.includes('rel="next"')) {
        const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
        if (match && match[1]) {
          const nextUrl = new URL(match[1]);
          nextPageParams = nextUrl.search;
        } else {
          hasMoreProducts = false;
        }
      } else {
        hasMoreProducts = false;
      }
    }

    // Update import job as completed
    await supabase
      .from("import_jobs")
      .update({ 
        status: errorCount > 0 ? "completed_with_errors" : "completed",
        processed_items: totalProcessed,
        error_count: errorCount,
        completed_at: new Date().toISOString()
      })
      .eq("id", importJob.id);

    console.log(`Imported ${totalProcessed} products from Shopify with ${errorCount} errors`);
    
    // Update the store's last sync time
    await supabase
      .from("stores")
      .update({ last_sync_time: new Date().toISOString() })
      .eq("id", storeId);

  } catch (error: any) {
    console.error("Error during product import:", error);
    
    // Update import job as failed
    await supabase
      .from("import_jobs")
      .update({ 
        status: "failed",
        processed_items: totalProcessed,
        error_count: errorCount,
        completed_at: new Date().toISOString(),
        error_message: error.toString()
      })
      .eq("id", importJob.id);
  }
}
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getShopifyCredentials } from "@/lib/shopify";
import fetch from "node-fetch";

export async function POST(request: Request) {
  try {
    // Parse request body
    const { itemId, storeId } = await request.json();
    if (!itemId || !storeId) {
      return NextResponse.json(
        { error: "Missing itemId or storeId" },
        { status: 400 }
      );
    }

    // Initialize Supabase client and authenticate user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify store ownership
    const { data: store } = await supabase
      .from("stores")
      .select("id")
      .eq("id", storeId)
      .eq("owner_id", user.id)
      .single();
    if (!store) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Fetch item details to check for external listings
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("shopify_product_id, paperclip_marketplace_id")
      .eq("id", itemId)
      .single();
    if (itemError) throw itemError;

    let shopifyDeleted = true;
    let paperclipDeleted = true;

    // Delete from Shopify if listed
    if (item.shopify_product_id) {
      try {
        const { accessToken, shopName } = await getShopifyCredentials(storeId);
        const mutation = `
          mutation {
            productDelete(input: {id: "${item.shopify_product_id}"}) {
              deletedProductId
              userErrors {
                field
                message
              }
            }
          }
        `;
        const response = await fetch(
          `https://${shopName}/admin/api/2025-01/graphql.json`,
          {
            method: "POST",
            headers: {
              "X-Shopify-Access-Token": accessToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: mutation }),
          }
        );
        
        interface ShopifyResponse {
          data?: {
            productDelete: {
              deletedProductId: string;
              userErrors: Array<{
                field: string;
                message: string;
              }>;
            };
          };
          errors?: Array<{
            message: string;
          }>;
        }

        const result = (await response.json()) as ShopifyResponse;
        if (result.errors || (result.data?.productDelete.userErrors.length ?? 0) > 0) {
          throw new Error("Shopify deletion failed");
        }
      } catch (error) {
        shopifyDeleted = false;
      }
    }

    // Delete from Paperclip if listed
    if (item.paperclip_marketplace_id) {
      console.log("🚀 ~ POST ~ item.paperclip_marketplace_id:", item.paperclip_marketplace_id)
      try {
        const paperclipToken = await getPaperclipToken(user.id);
        
        // Adjusted endpoint and payload according to API requirements.
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items/delete`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${paperclipToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ itemId: item.paperclip_marketplace_id }),
          }
        );
        if (!response.ok) {
          console.error("Paperclip API error:", response.statusText);
          throw new Error("Paperclip deletion failed");
        }
      } catch (error) {
        console.error("Error deleting from Paperclip:", error);
        paperclipDeleted = false;
      }
    }

    // Proceed with soft delete in Supabase only if external deletions succeed
    if (shopifyDeleted && paperclipDeleted) {
      const { error: deleteError } = await supabase
        .from("items")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", itemId);
      if (deleteError) throw deleteError;
      return NextResponse.json(
        { message: "Item successfully deleted" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Failed to delete from external platforms" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting item:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Utility function to get Paperclip token
async function getPaperclipToken(userId: string): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("user_tokens")
    .select("paperclip_token")
    .eq("user_id", userId)
    .single();
  if (error || !data) {
    throw new Error("Unable to authenticate with Paperclip");
  }
  return data.paperclip_token;
}

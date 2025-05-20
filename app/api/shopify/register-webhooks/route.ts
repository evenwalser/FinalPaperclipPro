import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getShopifyCredentials } from "@/lib/shopify";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { storeId } = await req.json();
    if (!storeId) {
      return NextResponse.json({ error: "Missing storeId" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
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

    // Get Shopify credentials
    const { accessToken, shopName } = await getShopifyCredentials(storeId);
    if (!accessToken || !shopName) {
      return NextResponse.json({ error: "Shopify not connected" }, { status: 400 });
    }

    // Generate a webhook secret
    const webhookSecret = crypto.randomBytes(32).toString('hex');
    
    // Store the webhook secret
    await supabase
      .from("stores")
      .update({ 
        shopify_webhook_secret: webhookSecret,
        shopify_domain: `${shopName}`
      })
      .eq("id", storeId);

    // Get the base URL for webhooks
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourapp.com';
    const webhookUrl = `${baseUrl}/api/shopify/webhooks`;

    // Define the webhooks to register
    const webhooks = [
      { topic: "products/create" },
      { topic: "products/update" },
      { topic: "products/delete" },
      { topic: "inventory_levels/update" }
    ];

    // Register each webhook
    const results = await Promise.all(
      webhooks.map(async (webhook) => {
        const mutation = `
          mutation {
            webhookSubscriptionCreate(
              topic: ${webhook.topic.toUpperCase()}
              webhookSubscription: {
                callbackUrl: "${webhookUrl}"
                format: JSON
              }
            ) {
              webhookSubscription {
                id
              }
              userErrors {
                field
                message
              }
            }
          }
        `;

        const response = await fetch(
          `https://${shopName}/admin/api/2023-10/graphql.json`,
          {
            method: "POST",
            headers: {
              "X-Shopify-Access-Token": accessToken,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ query: mutation }),
          }
        );

        const result = await response.json();
        return {
          topic: webhook.topic,
          success: !result.errors && result.data?.webhookSubscriptionCreate?.userErrors.length === 0,
          errors: result.errors || result.data?.webhookSubscriptionCreate?.userErrors,
          id: result.data?.webhookSubscriptionCreate?.webhookSubscription?.id
        };
      })
    );

    return NextResponse.json({ 
      message: "Webhooks registration process completed",
      webhooks: results
    });
  } catch (error) {
    console.error("Error registering webhooks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 
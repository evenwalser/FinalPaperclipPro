import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getShopifyCredentials } from "@/lib/shopify";

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

    // Fetch all webhook subscriptions
    const query = `
      query {
        webhookSubscriptions(first: 100) {
          edges {
            node {
              id
              endpoint {
                ... on WebhookHttpEndpoint {
                  callbackUrl
                }
              }
            }
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
        body: JSON.stringify({ query }),
      }
    );

    const result = await response.json();
    if (result.errors) {
      return NextResponse.json({ error: "Failed to fetch webhooks" }, { status: 500 });
    }

    // Get the base URL for webhooks to find matching ones
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://yourapp.com';
    const webhookUrl = `${baseUrl}/api/shopify/webhooks`;

    // Filter webhooks by the callback URL
    const webhooksToDelete = result.data.webhookSubscriptions.edges
      .filter((edge: any) => {
        const callbackUrl = edge.node.endpoint?.callbackUrl;
        return callbackUrl && callbackUrl === webhookUrl;
      })
      .map((edge: any) => edge.node.id);

    // Delete each webhook
    const deletionResults = await Promise.all(
      webhooksToDelete.map(async (webhookId: string) => {
        const mutation = `
          mutation {
            webhookSubscriptionDelete(id: "${webhookId}") {
              deletedWebhookSubscriptionId
              userErrors {
                field
                message
              }
            }
          }
        `;

        const deleteResponse = await fetch(
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

        const deleteResult = await deleteResponse.json();
        return {
          id: webhookId,
          success: !deleteResult.errors && 
                  deleteResult.data?.webhookSubscriptionDelete?.deletedWebhookSubscriptionId === webhookId,
          errors: deleteResult.errors || deleteResult.data?.webhookSubscriptionDelete?.userErrors
        };
      })
    );

    // Remove webhook secret from store record
    await supabase
      .from("stores")
      .update({ shopify_webhook_secret: null })
      .eq("id", storeId);

    return NextResponse.json({
      message: "Webhooks unregistration process completed",
      webhooks: deletionResults
    });
  } catch (error) {
    console.error("Error unregistering webhooks:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import fetch from "node-fetch";

export async function POST(request: NextRequest) {
  // Verify webhook secret
  const secret = request.headers.get("X-Webhook-Secret");
  if (secret !== process.env.LOW_STOCK_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const payload = await request.json();
    const { record } = payload;
    console.log("🚀 ~ POST ~ record:", record)
    const { item_id, paperclip_marketplace_id } = record;

    // Initialize Supabase client
    const supabase = await createClient();

    // Fetch store_id and owner_id to get the Paperclip token
    const { data: item, error: itemError } = await supabase
      .from("items")
      .select("store_id")
      .eq("id", item_id)
      .single();
    if (itemError) throw itemError;

    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("owner_id")
      .eq("id", item.store_id)
      .single();
    if (storeError) throw storeError;

    const { data: tokenData, error: tokenError } = await supabase
      .from("user_tokens")
      .select("paperclip_token")
      .eq("user_id", store.owner_id)
      .single();
    if (tokenError) throw tokenError;

    const paperclipToken = tokenData.paperclip_token;

    // Delete the item from Paperclip
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items/delete`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paperclipToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: paperclip_marketplace_id }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("Paperclip API error:", errText);
      throw new Error(`Failed to delete item: ${errText}`);
    }

    // Update the item in Supabase to reflect it’s no longer listed
    await supabase
      .from("items")
      .update({
        paperclip_marketplace_id: null,
        listed_on_paperclip: false,
      })
      .eq("id", item_id);

    // Mark the deletion as processed
    await supabase
      .from("paperclip_deletions")
      .update({ status: "processed", processed_at: new Date().toISOString() })
      .eq("id", record.id);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting item from Paperclip:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
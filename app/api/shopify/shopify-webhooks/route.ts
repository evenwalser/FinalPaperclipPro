import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Handle POST request
export async function POST(req: Request) {
  try {
    // Extract HMAC header
    const hmacHeader = req.headers.get("x-shopify-hmac-sha256");

    if (!hmacHeader) {
      return NextResponse.json(
        { error: "Missing HMAC header" },
        { status: 400 }
      );
    }

    // Get raw body as Buffer
    const rawBody = Buffer.from(await req.arrayBuffer());

    // Verify the webhook's authenticity
    const apiSecret = process.env.SHOPIFY_API_SECRET; 
    if (!apiSecret) {
      return NextResponse.json(
        { error: "Shopify API secret not configured" },
        { status: 500 }
      );
    }

    const calculatedHmac = crypto
      .createHmac("sha256", apiSecret)
      .update(rawBody)
      .digest("base64");
    console.log("🚀 ~ POST ~ calculatedHmac:", calculatedHmac);
    console.log("🚀 ~ POST ~ hmacHeader:", hmacHeader);
    if (calculatedHmac !== hmacHeader) {
      console.log("unauthorized");
      return NextResponse.json(
        { error: "Unauthorized: Invalid HMAC" },
        { status: 401 }
      );
    }

    // Parse the JSON payload
    const payload = JSON.parse(rawBody.toString("utf-8"));
    const { inventory_item_id, location_id, available } = payload;

    console.log("🚀 ~ POST ~ payload:", payload);

    const fullInventoryItemId = `gid://shopify/InventoryItem/${inventory_item_id}`; // e.g., "gid://shopify/InventoryItem/48987871543519"
    const fullLocationId = `gid://shopify/Location/${location_id}`;

    // Initialize Supabase client
    const supabase = await createClient();

    // Find the item in your database
    const { data: item, error: fetchError } = await supabase
      .from("items")
      .select("id, quantity")
      .eq("shopify_inventory_item_id", fullInventoryItemId)
      .eq("shopify_location_id", fullLocationId)
      .single();

    if (fetchError || !item) {
      console.error("Item not found:", {
        inventory_item_id,
        location_id,
        fetchError,
      });
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Update the item's quantity
    const { error: updateError } = await supabase
      .from("items")
      .update({ quantity: available })
      .eq("id", item.id);

    if (updateError) {
      console.error("Failed to update quantity:", updateError);
      return NextResponse.json(
        { error: "Failed to update quantity" },
        { status: 500 }
      );
    }

    console.log(`Updated item ${item.id} quantity to ${available}`);

    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

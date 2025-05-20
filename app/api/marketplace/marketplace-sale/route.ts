// /app/api/webhooks/marketplace-sale/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import crypto from "crypto";

export async function POST(request: Request) {
  const supabase = await createClient();

  // Verify webhook signature (optional, depends on marketplace requirements)
  const signature = request.headers.get("marketplace-signature");
  if (!signature) {
    return NextResponse.json({ error: "No signature provided" }, { status: 400 });
  }

  const rawBody = await request.text();
  const secret = process.env.MARKETPLACE_WEBHOOK_SECRET || "";
  const computedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (computedSignature !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);

  // Assuming payload contains an array of items sold
  const soldItems = body.items || []; // Adjust based on actual payload structure

  try {
    for (const soldItem of soldItems) {
      const marketplaceProductId = soldItem.product_id;
      const soldQuantity = soldItem.quantity;

      // Find item in Supabase
      const { data: item, error } = await supabase
        .from("items")
        .select("id, quantity")
        .eq("marketplace_product_id", marketplaceProductId)
        .single();

      if (error || !item) {
        console.error("Item not found for marketplace_product_id:", marketplaceProductId);
        continue;
      }

      // Update local quantity
      const newQuantity = item.quantity - soldQuantity;
      if (newQuantity < 0) {
        console.error("Insufficient stock for item:", item.id);
        // Optionally notify admin or adjust stock
        continue;
      }

      const { error: updateError } = await supabase
        .from("items")
        .update({ quantity: newQuantity })
        .eq("id", item.id);

      if (updateError) {
        console.error("Failed to update item quantity:", updateError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
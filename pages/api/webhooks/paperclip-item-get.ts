// File: pages/api/webhooks/paperclip-item-get.ts

import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`[Webhook] Received request: ${req.method}`);

  if (req.method !== "GET") {
    console.warn("[Webhook] Method not allowed:", req.method);
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const itemId = req.query.id as string;
  if (!itemId) {
    console.error("[Webhook] Missing item ID in query parameters");
    return res.status(400).json({ error: "Missing item ID" });
  }

  console.log("[Webhook] Fetching item:", itemId);

  const supabase = createClient();

  try {
    // Get the item with all related data
    const { data: items, error: itemError } = await supabase
      .from("items")
      .select(`
        *,
        category:categories (
          id,
          name,
          paperclip_marketplace_id
        ),
        images:item_images (
          id,
          image_url,
          display_order
        ),
        store:stores (
          id
        )
      `)
      .eq("paperclip_marketplace_id", itemId)
      .is('deleted_at', null);  // Only get non-deleted items

    if (itemError) {
      console.error("[Webhook] Error fetching item:", itemError);
      return res.status(500).json({ error: "Error fetching item" });
    }

    if (!items || items.length === 0) {
      console.warn("[Webhook] Item not found or deleted:", itemId);
      return res.status(404).json({ error: "Item not found or has been deleted" });
    }

    const item = items[0]; // Get the first (and should be only) item

    // Transform the data to match the expected format
    const response = {
      id: item.paperclip_marketplace_id,
      name: item.title,
      description: item.description,
      price: item.price.toString(),
      quantity: item.quantity,
      categoryId: item.category?.paperclip_marketplace_id,
      condition_type: item.condition === "New" ? 0 : item.condition === "Refurbished" ? 1 : 4,
      size: item.size || "",
      brand: item.brand || "",
      tags: item.tags || [],
      media: item.images?.map((img: any) => img.image_url) || [],
      userId: item.store?.paperclip_marketplace_id,
      color: item.color || null,
      logo_url: item.logo_url || null,
      created_at: item.created_at,
      updated_at: item.updated_at
    };

    console.log("[Webhook] Successfully fetched item:", itemId);
    return res.status(200).json(response);
  } catch (err) {
    console.error("[Webhook] Handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
} 
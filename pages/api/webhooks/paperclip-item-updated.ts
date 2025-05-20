// File: pages/api/paperclip-item-updated.ts

import type { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import { IncomingForm, Fields, Files } from "formidable";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/client";

export const config = { api: { bodyParser: false } };

function computeHMAC(raw: Buffer, secret: string): string {
  return crypto.createHmac("sha256", secret).update(raw).digest("hex");
}

type ConditionType = 0 | 1 | 4 | number;
function mapConditionFromMarketplace(c: ConditionType): string {
  switch (c) {
    case 0:
      return "New";
    case 1:
      return "Refurbished";
    default:
      return "Used";
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log(`[Webhook] Received request: ${req.method}`);

  if (req.method !== "POST") {
    console.warn("[Webhook] Method not allowed:", req.method);
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const contentType = (req.headers["content-type"] || "").toLowerCase();
  console.log("[Webhook] Content-Type:", contentType);

  let payload: any;
  const mediaUrls: string[] = [];

  // Handle JSON content type
  if (contentType.includes("application/json")) {
    let rawBody: Buffer;
    try {
      rawBody = await getRawBody(req);
      console.log("[Webhook] Raw body read successfully");
      payload = JSON.parse(rawBody.toString());
      console.log("[Webhook] Parsed JSON payload:", payload);
    } catch (err) {
      console.error("[Webhook] Error reading or parsing JSON:", err);
      return res.status(400).json({ error: "Invalid JSON" });
    }
  }
  // Handle multipart/form-data content type
  else if (contentType.includes("multipart/form-data")) {
    console.log("[Webhook] Processing multipart form data");
    const form = new IncomingForm({ multiples: true });
    let fields: Fields, files: Files;

    try {
      // Get the raw body first for HMAC verification
      const rawBody = await getRawBody(req);
      
      // Verify HMAC if signature is present
      const signature = req.headers["x-paperclip-signature"];
      if (signature) {
        const expectedSignature = computeHMAC(rawBody, process.env.PAPERCLIP_WEBHOOK_SECRET || "");
        if (signature !== expectedSignature) {
          console.error("[Webhook] Invalid HMAC signature");
          return res.status(401).json({ error: "Invalid signature" });
        }
      }

      // Create a proper readable stream with all required methods
      const { Readable } = require('stream');
      const mockReq = new Readable({
        read() {
          this.push(rawBody);
          this.push(null);
        }
      });

      // Add required properties
      Object.assign(mockReq, {
        headers: req.headers,
        rawBody: rawBody,
        pipe: (stream: any) => {
          stream.write(rawBody);
          stream.end();
          return stream;
        },
        pause: () => mockReq,
        resume: () => mockReq,
        destroy: () => {},
        on: (event: string, handler: Function) => {
          if (event === 'data') {
            process.nextTick(() => handler(rawBody));
          }
          if (event === 'end') {
            process.nextTick(() => handler());
          }
          return mockReq;
        }
      });

      // Parse the form data using the mock request
      ({ fields, files } = await new Promise<{ fields: Fields; files: Files }>(
        (resolve, reject) =>
          form.parse(mockReq as any, (err, f, fi) =>
            err ? reject(err) : resolve({ fields: f, files: fi })
          )
      ));
      console.log("[Webhook] Form parsed successfully:", { fields, files });

      if (!fields.payload) {
        console.error("[Webhook] Missing payload field in form data", fields);
        return res.status(400).json({ error: "Missing payload field" });
      }

      // Parse the payload field
      try {
        const rawField = Array.isArray(fields.payload)
          ? fields.payload[0]
          : fields.payload;
        payload = JSON.parse(rawField as string);
        console.log("[Webhook] Parsed payload:", payload);
      } catch (err) {
        console.error("[Webhook] Invalid payload JSON in form:", err);
        return res.status(400).json({ error: "Invalid JSON payload" });
      }

      // Process uploaded files
      const mediaFiles = Array.isArray(files.media)
        ? files.media
        : files.media
        ? [files.media]
        : [];

      if (mediaFiles.length) {
        const supabase = createClient();
        for (const file of mediaFiles) {
          const diskPath = (file as any).filepath || (file as any).path;
          let buffer: Buffer;
          try {
            buffer = await fs.readFile(diskPath as string);
          } catch (readErr) {
            console.error("File read error:", readErr);
            continue;
          }

          const filename =
            (file as any).originalFilename || path.basename(diskPath as string);
          const key = `items/${Date.now()}-${filename}`;

          const { error: upErr } = await supabase.storage
            .from("item-images")
            .upload(key, buffer, { upsert: true });
          if (upErr) {
            console.error("Supabase upload error:", upErr);
            continue;
          }

          const {
            data: { publicUrl },
          } = supabase.storage.from("item-images").getPublicUrl(key);
          mediaUrls.push(publicUrl);
        }
      }
    } catch (err) {
      console.error("[Webhook] Form parse error:", err);
      return res.status(400).json({ error: "Invalid form-data" });
    }
  } else {
    console.warn("[Webhook] Unsupported Content-Type:", contentType);
    return res.status(415).json({ error: "Unsupported Content-Type" });
  }

  // Collect media URLs from payload (for both JSON and multipart)
  if (Array.isArray(payload?.item?.media)) {
    payload.item.media.forEach((u: any) => {
      if (typeof u === "string") mediaUrls.push(u);
    });
  }

  const { event, item } = payload;
  console.log("[Webhook] Event:", event);

  if (event !== "item_updated") {
    console.warn("[Webhook] Ignoring unsupported event:", event);
    return res.status(400).json({ error: "Unsupported event" });
  }
  console.log("[Webhook] Proceeding with item update:", item.id);

  const supabase = createClient();

  try {
    const { data: existing, error: findErr } = await supabase
      .from("items")
      .select("id, category_id")
      .eq("paperclip_marketplace_id", item.id)
      .single();

    if (findErr || !existing) {
      console.error("[Webhook] Item not found in Supabase:", findErr);
      return res.status(404).json({ error: "Item not found or deleted" });
    }

    console.log("[Webhook] Found item in DB:", existing);

    let categoryId = existing.category_id;
    if (item.categoryId) {
      const { data: cat, error: catErr } = await supabase
        .from("categories")
        .select("id")
        .eq("paperclip_marketplace_id", item.categoryId)
        .single();

      if (!catErr && cat) {
        categoryId = cat.id;
        console.log("[Webhook] Resolved category:", categoryId);
      }
    }
    const colorName = typeof item.color === "string" ? item.color.trim() : null;
    const ageName   = typeof item.age   === "string" ? item.age.trim()   : null;
    const logoUrl: string | null = typeof item.logo_url === 'string' ? item.logo_url : null;

    const getOrCreateLookup = async (
      table: "colors" | "ages",
      name: string
    ) =>  {
      // try to find existing row
      const { data: found, error: findErr } = await supabase
        .from(table)
        .select("id")
        .eq("name", name)
        .limit(1)
        .single();
    
      if (findErr && findErr.code !== "PGRST116") {
        // PGRST116 = “no rows found”
        throw findErr;
      }
      if (found) return found.id;
    
      // otherwise insert a new one
      const { data: inserted, error: insertErr } = await supabase
        .from(table)
        .insert({ name })
        .select("id")
        .single();
      if (insertErr) throw insertErr;
      return inserted.id;
    }
    
    // 3️⃣ Resolve the two FK IDs (or leave null)
    let color_id: string | null = null;
    let age_id:   string | null = null;
    
    if (colorName) color_id = await getOrCreateLookup("colors", colorName);
    if (ageName)   age_id   = await getOrCreateLookup("ages",   ageName);
    
    const { error: updateErr } = await supabase
      .from("items")
      .update({
        title: item.name,
        description: item.description,
        price: parseFloat(item.price),
        quantity: item.quantity,
        condition: mapConditionFromMarketplace(item.condition_type),
        size: item.size ?? "",
        brand: item.brand ?? "",
        tags: item.tags ?? [],
        category_id: categoryId,
        color:    colorName,
        age: ageName,
        color_id,
        age_id,
        logo_url: logoUrl,
      })
      .eq("id", existing.id);

    if (updateErr) throw updateErr;
    console.log("[Webhook] Item core fields updated");

    if (mediaUrls.length) {
      const { data: existingImgs } = await supabase
        .from("item_images")
        .select("id, image_url")
        .eq("item_id", existing.id);

      const existingSet = new Set(existingImgs?.map((i) => i.image_url) || []);
      const incomingSet = new Set(mediaUrls);

      const toDelete = existingImgs
        ?.filter((i) => !incomingSet.has(i.image_url))
        .map((i) => i.id);

      if (toDelete?.length) {
        await supabase.from("item_images").delete().in("id", toDelete);
        console.log("[Webhook] Deleted old images:", toDelete);
      }

      const newOnes = mediaUrls.filter((u) => !existingSet.has(u));
      if (newOnes.length) {
        const uploads = newOnes.map((url, idx) => ({
          item_id: existing.id,
          image_url: url,
          display_order: (existingImgs?.length ?? 0) + idx,
        }));
        await supabase.from("item_images").insert(uploads);
        console.log("[Webhook] Added new images:", uploads);
      }

      const { data: allImgs } = await supabase
        .from("item_images")
        .select("id, image_url")
        .eq("item_id", existing.id);

      if (allImgs) {
        for (let i = 0; i < mediaUrls.length; i++) {
          const url = mediaUrls[i];
          const match = allImgs.find((img) => img.image_url === url);
          if (match) {
            await supabase
              .from("item_images")
              .update({ display_order: i })
              .eq("id", match.id);
          }
        }
        console.log("[Webhook] Reordered images");
      }
    }

    console.log("[Webhook] Successfully updated item:", existing.id);
    return res
      .status(200)
      .json({ message: "Item updated successfully", itemId: existing.id });
  } catch (err) {
    console.error("[Webhook] Handler error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

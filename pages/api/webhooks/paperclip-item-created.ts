// File: pages/api/paperclip-webhook.ts

import type { NextApiRequest, NextApiResponse } from "next";
import getRawBody from "raw-body";
import {
  IncomingForm,
  File as FormidableFile,
  Fields,
  Files,
} from "formidable";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/client";

// Disable Next.js automatic body parsing so we can verify the raw payload
export const config = {
  api: { bodyParser: false },
};

// Helper: compute HMAC sha256 hex digest (optional)
function computeHMAC(rawBody: Buffer, secret: string): string {
  return crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
}

// Helper: map marketplace condition codes to your labels
type ConditionType = 0 | 1 | 4 | number;
function mapConditionFromMarketplace(conditionType: ConditionType): string {
  switch (conditionType) {
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
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const contentType = (req.headers["content-type"] || "").toLowerCase();
  let payload: any;
  const mediaUrls: string[] = [];

  // 1️⃣ Handle JSON
  if (contentType.includes("application/json")) {
    try {
      const rawBody = await getRawBody(req);
      payload = JSON.parse(rawBody.toString());

      // Verify HMAC if signature is present
      const signature = req.headers["x-paperclip-signature"];

      if (!signature) {
        console.error("Missing signature header");
        return res.status(400).json({ error: "Missing signature header" });
      }
      if (signature) {
        const expectedSignature = computeHMAC(
          rawBody,
          process.env.PAPERCLIP_WEBHOOK_SECRET || ""
        );
        if (signature !== expectedSignature) {
          return res.status(401).json({ error: "Invalid signature" });
        }
      }
    } catch (err) {
      console.error("JSON parse error:", err);
      return res.status(400).json({ error: "Invalid JSON" });
    }

    // collect any URL-based media
    Array.isArray(payload?.item?.media) &&
      payload.item.media.forEach(
        (u: any) => typeof u === "string" && mediaUrls.push(u)
      );

    // 2️⃣ Handle multipart/form-data
  } else if (contentType.includes("multipart/form-data")) {
    console.log("Multipart form data detected");
    const form = new IncomingForm({ multiples: true });
    let fields: Fields, files: Files;
    console.log("Formidable form:", form);
    try {
      // Get the raw body first for HMAC verification
      const rawBody = await getRawBody(req);
      console.log("🚀 ~ rawBody:", rawBody);

      // Verify HMAC if signature is present
      const signature = req.headers["x-paperclip-signature"];
      console.log("🚀 ~ signature:", signature);

      if (!signature) {
        console.error("Missing signature header");
        return res.status(400).json({ error: "Missing signature header" });
      }

      if (signature) {
        console.log("Signature:", signature);
        const expectedSignature = computeHMAC(
          rawBody,
          process.env.PAPERCLIP_WEBHOOK_SECRET || ""
        );
        console.log("🚀 ~ expectedSignature:", expectedSignature);
        if (signature !== expectedSignature) {
          return res.status(401).json({ error: "Invalid signature" });
        }
      }

      // Create a proper readable stream with all required methods
      const { Readable } = require("stream");
      const mockReq = new Readable({
        read() {
          this.push(rawBody);
          this.push(null);
        },
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
          if (event === "data") {
            process.nextTick(() => handler(rawBody));
          }
          if (event === "end") {
            process.nextTick(() => handler());
          }
          return mockReq;
        },
      });

      // Parse the form data using the mock request
      ({ fields, files } = await new Promise<{ fields: Fields; files: Files }>(
        (resolve, reject) =>
          form.parse(mockReq as any, (err, f, fi) =>
            err ? reject(err) : resolve({ fields: f, files: fi })
          )
      ));

      if (!fields.payload) {
        console.error("Missing payload field; got:", fields);
        return res.status(400).json({ error: "Missing payload field" });
      }

      try {
        const rawField = Array.isArray(fields.payload)
          ? fields.payload[0]
          : fields.payload;
        payload = JSON.parse(rawField as string);
      } catch (err) {
        console.error("Invalid JSON payload field:", err);
        return res.status(400).json({ error: "Invalid JSON payload" });
      }

      // collect any URL-based media
      Array.isArray(payload?.item?.media) &&
        payload.item.media.forEach(
          (u: any) => typeof u === "string" && mediaUrls.push(u)
        );

      // read uploaded files into buffers
      const mediaFiles = Array.isArray(files.media)
        ? (files.media as FormidableFile[])
        : files.media
        ? [files.media as FormidableFile]
        : [];

      console.log("Media files:", mediaFiles);
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
          console.log("🚀 ~ publicUrl:", publicUrl);
          mediaUrls.push(publicUrl);
        }
      }
    } catch (err) {
      console.error("Form parse error:", err);
      return res.status(400).json({ error: "Invalid form-data" });
    }

    // 3️⃣ Unsupported content type
  } else {
    return res.status(415).json({ error: "Unsupported Content-Type" });
  }

  // 4️⃣ Common processing
  console.log("Parsed event:", payload.event);
  console.log("Item data:", payload.item);
  console.log("Media URLs:", mediaUrls);

  const { event, item } = payload;
  if (event !== "item_created") {
    return res.status(400).json({ error: "Unsupported event type" });
  }

  const supabase = createClient();
  try {
    // Dedupe
    const { data: existing, error: existErr } = await supabase
      .from("items")
      .select("id")
      .eq("paperclip_marketplace_id", item.id)
      .maybeSingle();
    if (existErr) throw existErr;
    if (existing) {
      return res
        .status(200)
        .json({ message: "Item already exists", itemId: existing.id });
    }

    // Lookup user
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .select("id, store_id")
      .eq("paperclip_marketplace_id", item.userId)
      .single();
    if (userErr || !userData?.store_id) {
      console.error("User/store lookup failed:", userErr);
      return res.status(404).json({ error: "User or store not found" });
    }

    // Resolve category
    let categoryId: number | null = null;
    const { data: catData, error: catErr } = await supabase
      .from("categories")
      .select("id")
      .eq("paperclip_marketplace_id", item.categoryId)
      .single();
    if (!catErr && catData) categoryId = catData.id;
    else {
      const { data: defaults } = await supabase
        .from("categories")
        .select("id")
        .limit(1);
      categoryId = defaults?.[0]?.id ?? null;
    }
    // extract the raw strings
    const colorName = typeof item.color === "string" ? item.color.trim() : null;
    const ageName = typeof item.age === "string" ? item.age.trim() : null;
    const logoUrl = typeof item.logo_url === "string" ? item.logo_url : null;

    // helper to find-or-create a lookup record
    const getOrCreateLookup = async (
      table: "colors" | "ages",
      name: string
    ) => {
      // 1) try to find
      const { data: found, error: findErr } = await supabase
        .from(table)
        .select("id")
        .eq("name", name)
        .limit(1)
        .single();

      if (findErr && findErr.code !== "PGRST116" /* no rows */) {
        throw findErr;
      }
      if (found) {
        return found.id;
      }

      // 2) insert new
      const { data: inserted, error: insertErr } = await supabase
        .from(table)
        .insert({ name })
        .select("id")
        .single();

      if (insertErr) {
        throw insertErr;
      }
      return inserted.id;
    };

    // resolve the two lookup IDs (or leave null if no value given)
    let color_id: string | null = null;
    let age_id: string | null = null;

    if (colorName) {
      color_id = await getOrCreateLookup("colors", colorName);
    }
    if (ageName) {
      age_id = await getOrCreateLookup("ages", ageName);
    }

    // Insert item
    const insertPayload = {
      title: item.name,
      description: item.description,
      price: parseFloat(item.price),
      quantity: item.quantity ?? 1,
      category_id: categoryId,
      color: colorName,
      age: ageName,
      color_id : color_id,
      age_id : age_id,
      logo_url: logoUrl,
      condition: mapConditionFromMarketplace(item.condition_type),
      size: item.size ?? "",
      brand: item.brand ?? "",
      available_in_store: true,
      list_on_paperclip: true,
      store_id: userData.store_id,
      created_by: userData.id,
      paperclip_marketplace_id: item.id,
      paperclip_listed_at: new Date().toISOString(),
      listed_on_paperclip: true,
      tags: item.tags ?? [],
    };
    const { data: newItem, error: itemErr } = await supabase
      .from("items")
      .insert(insertPayload)
      .select()
      .single();
    if (itemErr) throw itemErr;

    // Save image records
    if (mediaUrls.length) {
      const uploads = mediaUrls.map((url, idx) => ({
        item_id: newItem.id,
        image_url: url,
        display_order: idx,
      }));
      const { error: imgErr } = await supabase
        .from("item_images")
        .insert(uploads);
      if (imgErr) console.error("Failed to save images:", imgErr);
    }

    return res
      .status(201)
      .json({ message: "Item created successfully", itemId: newItem.id });
  } catch (err) {
    console.error("Processing error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

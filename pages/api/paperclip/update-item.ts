import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/client";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
import fetch from "node-fetch";

export const config = {
  api: { bodyParser: false },
};

const supabase = createClient();

async function getPaperclipToken(userId: string): Promise<string> {
  const { data, error } = await supabase
    .from("user_tokens")
    .select("paperclip_token")
    .eq("user_id", userId)
    .single();

  if (error || !data) {
    console.error("Error fetching Paperclip token:", error);
    throw new Error("Unable to authenticate with Paperclip");
  }
  return data.paperclip_token;
}

function mapConditionToType(condition: string): number {
  switch (condition.toLowerCase()) {
    case "new":
      return 0;
    case "refurbished":
      return 1;
    case "used":
      return 4;
    default:
      return 0;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const form = formidable({ multiples: true, keepExtensions: true });

  try {
    const { fields, files } = await new Promise<{ fields: formidable.Fields; files: formidable.Files; }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("⚠️ formidable parse error", err);
          return reject(err);
        }
        console.log("✅ formidable parsed fields:", fields);
        console.log("✅ formidable parsed files:", files);
        resolve({ fields, files });
      });
    });

    const getField = (field: string | string[] | undefined): string => 
      field ? (Array.isArray(field) ? field[0] : field) : "";

    const userId = getField(fields.userId) || "";
    const paperclipItemId = getField(fields.paperclipItemId) || "";
    const name = getField(fields.name) || "";
    const description = getField(fields.description) || "";
    const colorId = getField(fields.colorId) || "";
    const price = getField(fields.price) || "0";
    const quantity = getField(fields.quantity) || "1";
    const condition = getField(fields.condition) || "new";
    const size = getField(fields.size) || "";
    const brand = getField(fields.brand) || "";
    const age = getField(fields.age) || "";
    console.log("🚀 ~ handler ~ age:", age)
    const color = getField(fields.color) || "";
    const categoryId = getField(fields.categoryId) || "1";
    const tags = fields.tags ? JSON.parse(getField(fields.tags)) : [];

    const paperclipToken = await getPaperclipToken(userId);
    console.log("🚀 ~ handler ~ paperclipToken:", paperclipToken)

    const formDataToSend = new FormData();
    formDataToSend.append("name", name.trim());
    formDataToSend.append("description", description.trim());
    formDataToSend.append("price", parseFloat(price).toString());
    formDataToSend.append("quantity", parseInt(quantity).toString());
    formDataToSend.append("conditionType", mapConditionToType(condition).toString());
    formDataToSend.append("size", size);
    formDataToSend.append("brand", brand);
    formDataToSend.append("age", age);
    formDataToSend.append("color", color);
    formDataToSend.append("categoryId", categoryId);
    formDataToSend.append("colorId", colorId);
    formDataToSend.append("packageSize", "Medium");
    tags.forEach((t: string, i: number) => formDataToSend.append(`tags[${i}]`, t));

    if (files.media) {
      const mediaArr = Array.isArray(files.media) ? files.media : [files.media];
      mediaArr.forEach((file, idx) => {
        formDataToSend.append(
          `media[${idx}]`,
          fs.createReadStream(file.filepath),
          {
            filename: file.originalFilename || `media-${idx}`,
            contentType: file.mimetype || undefined,
          }
        );
      });
    }
    const headers = {
      Authorization: `Bearer ${paperclipToken}`,
    };
    
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items/${paperclipItemId}`,
      {
        method: "POST",
        headers,
        body: formDataToSend as any,
      }
      
    );
    console.log("🚀 ~ handler ~ paperclipItemId:", paperclipItemId)

    if (!apiRes.ok) {
      const txt = await apiRes.text();
      console.log("🚀 ~ handler ~ txt:", txt)
      console.error(
        `📦 Paperclip API error: [${apiRes.status} ${apiRes.statusText}]`,
        txt
      );
      return res.status(apiRes.status).json({ error: txt });
    }

    const result = await apiRes.json();
    console.log("🚀 ~ handler ~ result:", result)
    return res.status(200).json(result);

  } catch (err: any) {
    console.error("Error in /update-item:", err);
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}
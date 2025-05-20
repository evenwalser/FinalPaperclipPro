import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@/utils/supabase/client";
import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
import fetch from "node-fetch";

export const config = {
  api: { bodyParser: false },
};

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // create the formidable parser
  const form = formidable({ multiples: true, keepExtensions: true });

  try {
    // await the parse to complete
    const { fields, files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
    console.log("🚀 ~ handler ~ fields:", fields);
    // normalize fields
    const userId =
      (Array.isArray(fields.userId) ? fields.userId[0] : fields.userId) || "";
    console.log("🚀 ~ handler ~ userId:", userId);
    const name =
      (Array.isArray(fields.name) ? fields.name[0] : fields.name) || "";
    console.log("🚀 ~ handler ~ name:", name);
    const description =
      (Array.isArray(fields.description)
        ? fields.description[0]
        : fields.description) || "";
    console.log("🚀 ~ handler ~ description:", description);
    const price =
      (Array.isArray(fields.price) ? fields.price[0] : fields.price) || "0";
    console.log("🚀 ~ handler ~ price:", price);
    const condition =
      (Array.isArray(fields.condition)
        ? fields.condition[0]
        : fields.condition) || "new";
    console.log("🚀 ~ handler ~ condition:", condition);
    const categoryId =
      (Array.isArray(fields.categoryId)
        ? fields.categoryId[0]
        : fields.categoryId) || "";
    const colorId =  (Array.isArray(fields.colorId) ? fields.colorId[0] : fields.colorId) || "";
    console.log("🚀 ~ handler ~ colorId:", colorId);
    const retailId =
      (Array.isArray(fields.retailId) ? fields.retailId[0] : fields.retailId) ||
      "";
    console.log("🚀 ~ handler ~ retailId:", retailId);
    const tagsField = fields.tags;
    console.log("🚀 ~ handler ~ tagsField:", tagsField);
    const tags = tagsField
    ? JSON.parse(Array.isArray(tagsField) ? tagsField[0] : tagsField)
    : [];
      console.log('tags')
    console.log("🚀 ~ handler ~ tags:", tags);
    const brand = Array.isArray(fields.brand)
      ? fields.brand[0]
      : fields.brand ?? "";
      const age = Array.isArray(fields.age)
      ? fields.age[0]
      : fields.age ?? "";
    console.log("🚀 ~ handler ~ brand:", brand);
    const size = Array.isArray(fields.size)
      ? fields.size[0]
      : fields.size ?? "";
    console.log("🚀 ~ handler ~ size:", size);

    // get token
    const supabase = createClient();
    const paperclipToken = await getPaperclipToken(userId);
    console.log("🚀 ~ paperclipToken:", paperclipToken)

    // build FormData for Paperclip
    const formDataToSend = new FormData();
    formDataToSend.append("name", name.trim());
    formDataToSend.append("description", description.trim());
    formDataToSend.append("price", parseFloat(price).toString());
    formDataToSend.append("age", age.trim());
    formDataToSend.append("colorId", colorId);
    formDataToSend.append(
      "conditionType",
      mapConditionToType(condition).toString()
    );
    formDataToSend.append("packageSize", "Medium");
    formDataToSend.append("brand", brand.trim());
    formDataToSend.append("size", size.trim());
    formDataToSend.append("retailId", retailId);
    formDataToSend.append("categoryId", categoryId);
    interface Tag {
      id: string;
      name: string;
    }

    // The existing code with types
    tags.forEach((t: Tag | string, i: number) => formDataToSend.append(`tags[${i}]`, typeof t === 'string' ? t : t.id));

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

    // call Paperclip
    const apiRes = await fetch(
      `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paperclipToken}`,
        },
        body: formDataToSend as any,
      }
    );
    console.log("🚀 ~ handler ~ apiRes:", apiRes);
    if (!apiRes.ok) {
      const txt = await apiRes.text();
      console.error("Paperclip API error:", txt);
      console.error("Paperclip API error:", apiRes.status);
      return res.status(apiRes.status).json({ error: txt });
    }
    const result = (await apiRes.json()) as { data?: { id?: string } };
    console.log("🚀 ~ handler ~ result:", result);

    // optional: update your Supabase table
    if (retailId) {
      const { error: updErr } = await supabase
        .from("items")
        .update({
          paperclip_marketplace_id: result?.data?.id,
          paperclip_listed_at: new Date().toISOString(),
          listed_on_paperclip: true,
        })
        .eq("id", retailId);

      if (updErr) console.error("Supabase update error:", updErr);
    }

    // finally—send the response
    return res.status(200).json(result);
  } catch (err: any) {
    console.error("Error in /create-items:", err);
    // if it's a parsing error, it'll come through here
    return res.status(500).json({ error: err.message || "Unknown error" });
  }
}

import { createClient } from "@/utils/supabase/client";
import FormData from "form-data";
import type { ReadStream } from "fs";
import { Readable } from "stream"; // <-- NEW: Import Readable to convert Buffer to stream
import fetch from "node-fetch";// Needed to fetch remote images

const supabase = createClient();

export async function getPaperclipToken(userId: string): Promise<string> {
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

 interface ListOnPaperclipParams {
  userId: string;
  itemDetails: {
    name: string;
    description: string;
    price: string;
    condition: string;
  };
  images: string[];
  selectedCategories: {
    level1?: number;
    level2?: number;
    level3?: number;
  };
  brand?: string;
  size?: string;
  color?: string;
}

// Helper to fetch image from URL as Buffer
async function fetchImageAsBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch image from URL: ${url}`);
  return await res.buffer();
}

export async function listOnPaperclipMarket({
  userId,
  itemDetails,
  images,
  selectedCategories,
  brand,
  size,
  color,
}: ListOnPaperclipParams): Promise<any> {
  const paperclipToken = await getPaperclipToken(userId);
  console.log("🚀 ~ paperclipToken:", paperclipToken);

  const formData = new FormData();
//   formData.append("name", itemDetails.name.trim());
  formData.append("name", "Example item");

//   formData.append("description", itemDetails.description.trim());
  formData.append("description", "A cool item");

//   formData.append("price", parseFloat(itemDetails.price).toString());
formData.append("price", 49.99);


//   const categoryId =
//     selectedCategories.level3 ??
//     selectedCategories.level2 ??
//     selectedCategories.level1 ??
//     1;
const categoryId = 1;

//   formData.append("categoryId", categoryId.toString());
  formData.append("categoryId", 1);

//   formData.append(
//     "conditionType",
//     mapConditionToType(itemDetails.condition).toString()
//   );
  formData.append(
    "conditionType",
    0
  );

  formData.append("packageSize", "Medium");
//   console.log('images', images)

//   formData.append("media", JSON.stringify(images));
const dummyMedia = ["https://example.com/image1.jpg"]

// const payload = {
//     name: itemDetails.name.trim(),
//     description: itemDetails.description.trim(),
//     categoryId: categoryId,
//     price: parseFloat(itemDetails.price),
//     conditionType: mapConditionToType(itemDetails.condition),
//     packageSize: "Medium", // Adjust as necessary
//     media: images, // Array of image URLs
//   };

const payload ={
    "name": "Example item",
    "description": "test item",
    "categoryId": 1,
    "price": 49.99,
    "conditionTyp": 0,
    "packageSize": "Medium",
    "retailId": "1234343",
    "tags":["h","j"],
    "media": 
      ["https://example.com/image1.jpg", "https://example.com/image2.jpg"]
  }
console.log("🚀 ~ payload:", payload)

  
  // Append it to formData as a JSON string
  formData.append("media", JSON.stringify(images));
 // Fetch all images concurrently and append to FormData
//  const imageBuffers = await Promise.all(
//     images.map((image) => fetchImageAsBuffer(image?.url))
//   );

//   imageBuffers.forEach((buffer, index) => {
//     const extension = images[index].url.split(".").pop() || "jpg"; // Extract extension from URL
//     formData.append("images", buffer, { filename: `image-${index}.${extension}` });
//   });
//   if (brand) formData.append("brand", brand);
//   if (size) formData.append("size", size);
//   if (size) formData.append("size", 'Medium');

//   if (color) formData.append("colorId", "1");

  const response = await fetch(`${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paperclipToken}`,
      ...formData.getHeaders(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Paperclip API error:", errText);
    throw new Error(`Failed to list item: ${errText}`);
  }

  return await response.json();
}
//   console.log("🚀 ~ images:", images)

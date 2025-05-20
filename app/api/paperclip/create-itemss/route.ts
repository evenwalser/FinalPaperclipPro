import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client"; // Ensure this path is valid in your project
import { IncomingForm } from "formidable";
import FormData from "form-data";
import fetch from "node-fetch"; // For fetching remote images
import { readFileSync } from "fs";

// Initialize Supabase client
const supabase = createClient();

// Utility function to fetch the Paperclip token for a user
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

// Helper function to map an item's condition from string to a number value.
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

// Define interface for expected parameters.
export interface ListOnPaperclipParams {
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
  retailId?: string; // New field for dynamic retail ID
  tags?: string[];
}

// Main function to list an item on Paperclip Market
async function listOnPaperclipMarket({
  userId,
  itemDetails,
  images,
  selectedCategories,
  brand,
  size,
  color,
  retailId, // dynamic retail id from the payload
  tags,  
}: ListOnPaperclipParams): Promise<any> {
  // Retrieve token from your database via Supabase
  const paperclipToken = await getPaperclipToken(userId);
  console.log("Paperclip token:", paperclipToken);

  // Create and configure form data if you intend to use it
  const formData = new FormData();
  formData.append("name", itemDetails.name.trim());
  formData.append("description", itemDetails.description.trim());
  formData.append("price", parseFloat(itemDetails.price).toString());

  // Determine category: if level3 is missing, fallback to level2 or level1 (with a default of 1)
//   const categoryId =
//     selectedCategories.level3 ?? selectedCategories.level2 ?? selectedCategories.level1 ?? 1;
  const categoryId = 1;

  formData.append("categoryId", categoryId.toString());
  formData.append("conditionType", mapConditionToType(itemDetails.condition).toString());
  formData.append("packageSize", "Medium");

  const payload = {
    name: itemDetails.name.trim(),
    description: itemDetails.description.trim(),
    categoryId: categoryId,
    price: parseFloat(itemDetails.price),
    conditionType: mapConditionToType(itemDetails.condition),
    packageSize: "Medium",
    retailId: retailId || "", // Using dynamic retailId or fallback if not provided
    tags: tags || [],         // Using dynamic tags array or default empty array
    media: images,
    brand: brand,
  };



  console.log("Payload:", payload);

  const response = await fetch(`${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${paperclipToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),  
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("Paperclip API error:", errText);
    throw new Error(`Failed to list item: ${errText}`);
  }

  const result = await response.json();
  console.log("Paperclip API response:", result);

  // If a supabaseItemId is provided then update the corresponding row in Supabase with the returned Paperclip marketplace id
  if (retailId) {
    const { error: updateError } = await supabase
      .from("items")
      .update({
        paperclip_marketplace_id: (result as { data: { id: string } })?.data.id,  // Store the Paperclip marketplace ID
        paperclip_listed_at: new Date().toISOString(), // Optionally record the listed timestamp
        listed_on_paperclip: true, // Flag indicating that the item is listed
      })
      .eq("id", retailId);
    if (updateError) {
      console.error("Failed to update item with Paperclip marketplace id:", updateError);
      throw new Error("Paperclip item created but failed to update your item record.");
    }
  }

  // You can perform any additional logic here (e.g., sending notifications) before returning the result.
  return result;
 
}

// API endpoint handler
export async function POST(request: NextRequest) {
  let params: ListOnPaperclipParams;
  try {
    params = await request.json();
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  try {
    const result = await listOnPaperclipMarket(params);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

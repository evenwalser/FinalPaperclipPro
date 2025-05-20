import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client"; // Adjust the path as needed
import fetch from "node-fetch";

// Initialize Supabase client
const supabase = createClient();

// Utility to retrieve the Paperclip token for a given user
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

// Convert a condition string to a numeric value expected by Paperclip API
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

// Define the expected request parameters for updating a Paperclip item.
export interface UpdatePaperclipParams {
  userId: string;
  paperclipItemId: string; // The Paperclip marketplace item ID (from your create flow)
  itemDetails: {
    name: string;
    description: string;
    price: string;
    quantity: number;
    condition: string;
    size?: string;
    brand?: string;
    age?: string;
    color?: string;
    tags?: string[];
  };
  images: string[]; // Array of image URLs
  selectedCategories: {
    level1?: number;
    level2?: number;
    level3?: number;
  };
}

// Main function to update an item on the Paperclip marketplace.
async function updatePaperclipItem({
  userId,
  paperclipItemId,
  itemDetails,
  images,
  selectedCategories,
}: UpdatePaperclipParams): Promise<any> {
  // Retrieve the token needed to authorize with the Paperclip API.
  const paperclipToken = await getPaperclipToken(userId);

  // Determine the category ID from the provided selection.
  // Here we prefer level3, then level2, then level1 (with a default of 1 if none provided).
//   const categoryId =
//     selectedCategories.level3 ??
//     selectedCategories.level2 ??
//     selectedCategories.level1 ??
//     1;

  const categoryId = 2;

  // Build the payload that the Paperclip API expects. Note we use "title" for the name.
  // Adjust or add further fields if your marketplace API requires them.
  
  const payload = {
    name: itemDetails.name.trim(),
    description: itemDetails.description.trim(),
    price: parseFloat(itemDetails.price),
    quantity: itemDetails.quantity,
    images: images,
    category_id: categoryId,
    conditionType: mapConditionToType(itemDetails.condition),
    packageSize: "Medium", // You can make this dynamic if needed.
    tags: itemDetails.tags
  };

  console.log("Updating Paperclip item with payload:", payload);

  // Call the Paperclip update endpoint via a PUT request.
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/items/${paperclipItemId}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paperclipToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errText = await response.text();
    console.error("Paperclip update API error:", errText);
    throw new Error(`Failed to update item on Paperclip: ${errText}`);
  }

  // Return the updated Paperclip response.
  return await response.json();
}

// API route handler for PUT requests to update the Paperclip item.
export async function POST(request: NextRequest) {
  let params: UpdatePaperclipParams;
  try {
    params = await request.json();
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid JSON payload" },
      { status: 400 }
    );
  }

  try {
    const result = await updatePaperclipItem(params);
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Update route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

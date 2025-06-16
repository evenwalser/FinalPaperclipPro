import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import fetch from "node-fetch";

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

// POST handler - reject an offer
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User Id is required" },
        { status: 400 }
      );
    }

    const paperclipToken = await getPaperclipToken(userId);
    const offerId = params.id;

    // Call the Paperclip API to reject the offer
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/offers/reject/${offerId}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paperclipToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Paperclip reject offer API error:", errorText);
      throw new Error(`Failed to reject offer: ${errorText}`);
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Reject offer route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

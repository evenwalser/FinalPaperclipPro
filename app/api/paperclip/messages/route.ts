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

// GET handler - fetch messages
export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const userParam = searchParams.get("user");

    if (!userParam) {
      return NextResponse.json(
        { error: "User parameter is required" },
        { status: 400 }
      );
    }

    const user = JSON.parse(userParam);

    const paperclipToken = await getPaperclipToken(user.id);

    // Build the API URL
    let apiUrl = `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/messages?userId=${userId}`;
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${paperclipToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Paperclip messages API error:", errorText);
      throw new Error(`Failed to fetch messages: ${errorText}`);
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Messages GET route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST handler - send a message
export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { user, ...rest } = payload;

    // Validate required fields
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "User object with id is required" },
        { status: 400 }
      );
    }

    if (!rest.userId || !rest.message) {
      return NextResponse.json(
        { error: "userId and message are required" },
        { status: 400 }
      );
    }

    const paperclipToken = await getPaperclipToken(user.id);

    // Validate the API URL
    if (!process.env.NEXT_PUBLIC_PAPERCLIP_API_URL) {
      return NextResponse.json(
        { error: "Paperclip API URL is not configured" },
        { status: 500 }
      );
    }

    // Build the correct payload for Paperclip API
    // The Paperclip API expects: { userId: string, message: string }
    const paperclipPayload = {
      receiverId: rest.userId,
      message: rest.message,
      // Add any additional fields that might be needed
      ...(rest.attachment && { attachment: rest.attachment }),
      ...(rest.isOffer && { isOffer: rest.isOffer }),
      ...(rest.offerData && { offerData: rest.offerData }),
    };

    // Log the full request details
    const apiUrl = `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/messages`;
    const apiUrlAlt = `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/messages`;

    // Test if the API endpoint is reachable
    try {
      const testResponse = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paperclipToken}`,
          "Content-Type": "application/json",
        },
      });

      const testResponseAlt = await fetch(apiUrlAlt, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${paperclipToken}`,
          "Content-Type": "application/json",
        },
      });
    } catch (testError) {
      console.error("Test request failed:", testError);
    }

    // Try the main request
    let response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paperclipToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(paperclipPayload),
    });

    // If the first attempt fails, try the alternative URL
    if (!response.ok && response.status === 404) {
      response = await fetch(apiUrlAlt, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${paperclipToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paperclipPayload),
      });
    }

    if (!response.ok) {
      const errorText = await response.text();

      // Detailed logging for debugging
      console.error("Paperclip send message API error:");
      console.error("Status:", response.status);
      console.error("Status Text:", response.statusText);
      console.error("URL:", response.url);
      console.error("Payload sent:", JSON.stringify(paperclipPayload, null, 2));
      console.error("Raw error response:", errorText);

      // Check if it's an HTML error page
      if (
        errorText.includes("<!DOCTYPE html>") ||
        errorText.includes("<html")
      ) {
        console.error("Received HTML error page instead of JSON response");

        // Try to extract more information from the HTML response
        const titleMatch = errorText.match(/<title>(.*?)<\/title>/);
        const title = titleMatch ? titleMatch[1] : "Unknown error";

        return NextResponse.json(
          {
            error:
              "Paperclip API returned an HTML error page. This usually indicates a server configuration issue or invalid endpoint.",
            details: `Status: ${response.status}, URL: ${response.url}, Title: ${title}`,
            rawError: errorText.substring(0, 500), // First 500 chars of the error
          },
          { status: 502 }
        );
      }

      // Try to parse as JSON if it's not HTML
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(
          {
            error:
              errorJson.error || errorJson.message || "Paperclip API error",
            details: errorJson,
          },
          { status: response.status }
        );
      } catch {
        // If it's not JSON either, return the raw text
        throw new Error(`Paperclip API error ${response.status}: ${errorText}`);
      }
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Messages POST route error:", error.message || error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

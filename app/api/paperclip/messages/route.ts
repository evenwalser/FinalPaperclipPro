import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import fetch from "node-fetch";
import FormData from "form-data";
import { Readable } from "stream";

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
    let payload;
    let user;
    let contentType = request.headers.get("content-type") || "";

    // Handle FormData for file uploads
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      user = JSON.parse(formData.get("user") as string);

      // Create a new FormData instance for the Paperclip API
      const apiFormData = new FormData();

      // Add text fields
      apiFormData.append("receiverId", formData.get("receiverId"));
      apiFormData.append("message", formData.get("message"));

      if (formData.get("attachmentType")) {
        apiFormData.append("attachmentType", formData.get("attachmentType"));
      }

      if (formData.get("attachmentItemId")) {
        apiFormData.append(
          "attachmentItemId",
          formData.get("attachmentItemId")
        );
      }

      // Handle multiple file uploads
      const files = formData.getAll("attachmentImages");
      for (const file of files) {
        if (file instanceof Blob) {
          const buffer = Buffer.from(await file.arrayBuffer());
          const stream = Readable.from(buffer);
          // Use a unique field name for each file to ensure they're sent as an array
          apiFormData.append("attachmentImages[]", stream, {
            filename: (file as File).name,
            contentType: file.type,
          });
        }
      }

      payload = apiFormData;
    } else {
      // Handle JSON payload
      const jsonData = await request.json();
      user = jsonData.user;
      const { user: _, ...rest } = jsonData;
      payload = rest;
    }

    // Validate required fields
    if (!user || !user.id) {
      return NextResponse.json(
        { error: "User object with id is required" },
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

    // Use the correct API endpoint
    const apiUrl = `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4/messages`;

    // Send request to Paperclip API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${paperclipToken}`,
        ...(contentType.includes("multipart/form-data")
          ? payload.getHeaders()
          : { "Content-Type": "application/json" }),
      },
      body: contentType.includes("multipart/form-data")
        ? payload
        : JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Paperclip send message API error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });

      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(
          {
            error:
              errorJson.error || errorJson.message || "Paperclip API error",
          },
          { status: response.status }
        );
      } catch {
        return NextResponse.json(
          { error: `Paperclip API error: ${errorText}` },
          { status: response.status }
        );
      }
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error: any) {
    console.error("Messages POST route error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

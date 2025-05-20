// /app/api/create-marketplace-product/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json(); // Parse incoming request body

    // Send the data to the external API
    const response = await fetch("https://api.restful-api.dev/objects/4", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body), // Send the parsed body
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to create product in marketplace" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error creating marketplace product:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

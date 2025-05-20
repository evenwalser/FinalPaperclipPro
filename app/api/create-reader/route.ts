import { createSimulatedReader } from "@/lib/stripe"
import { saveTransaction } from "@/utils/supabase/client"
import {  NextResponse } from "next/server"

export  async function POST (request: Request) {
    try {
      // Create the simulated reader
      const reader = await createSimulatedReader();
      console.log("Created reader:", JSON.stringify(reader));
      await saveTransaction({
        type: "reader_initialized",
        status: "success",
        reader_id: reader.id,
        amount: 0,
        payment_intent_id: "N/A",
      });
      const responseData = {
        reader: JSON.parse(JSON.stringify(reader))
      };
  
      // Return a plain object response
      return NextResponse.json({ data: responseData });
    } catch (error: any) {
      console.error("Reader creation error:", error);
      return NextResponse.json(
        {
          error: error.message || "Unknown error",
          code: error.raw?.code || "internal_error",
        },
        { status: 500 }
      );
    }
  }
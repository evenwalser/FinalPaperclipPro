import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  
  try {
    const { token, marketplace_user_id, marketplace_api_token } = await request.json();

    if (!token || !marketplace_user_id || !marketplace_api_token) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Look up the token
    const { data: tokenData, error: tokenError } = await supabase
      .from('account_linking_tokens')
      .select('*')
      .eq('token', token)
      .eq('used', false)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update the user's marketplace ID
    const { error: userError } = await supabase
      .from('users')
      .update({ paperclip_marketplace_id: marketplace_user_id })
      .eq('id', tokenData.user_id);

    if (userError) {
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 }
      );
    }

    // Store the marketplace API token
    const { error: tokenStoreError } = await supabase
      .from('user_tokens')
      .upsert({
        user_id: tokenData.user_id,
        paperclip_token: marketplace_api_token,
      }, {
        onConflict: 'user_id'
      });

    if (tokenStoreError) {
      return NextResponse.json(
        { error: "Failed to store API token" },
        { status: 500 }
      );
    }

    // Mark the linking token as used
    const { error: updateTokenError } = await supabase
      .from('account_linking_tokens')
      .update({ used: true })
      .eq('token', token);

    if (updateTokenError) {
      console.error("Failed to mark token as used:", updateTokenError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error linking account:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 
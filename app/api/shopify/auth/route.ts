import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");
  const storeId = searchParams.get("store_id");
  if (!shop || !storeId) {
    return NextResponse.json(
      { error: "Shop and store_id parameters are required" },
      { status: 400 }
    );
  }
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify the store belongs to the user
  const { data: store } = await supabase
    .from("stores")
    .select("id")
    .eq("id", storeId)
    .eq("owner_id", user.id)
    .single();

  if (!store) {
    return NextResponse.json(
      { error: "Store not found or not owned by user" },
      { status: 404 }
    );
  }

  // Include store_id in the state parameter
  const state = JSON.stringify({ storeId });
  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${
    process.env.SHOPIFY_API_KEY
  }&scope=read_products,write_products,write_publications,write_inventory,read_inventory&redirect_uri=${
    process.env.NEXT_PUBLIC_APP_URL
  }/api/shopify/callback&state=${encodeURIComponent(state)}`;

  return NextResponse.redirect(authUrl);
}

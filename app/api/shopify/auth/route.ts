import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get('shop');
  if (!shop) {
    return NextResponse.json({ error: 'Shop parameter is required' }, { status: 400 });
  }
  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${process.env.SHOPIFY_API_KEY}&scope=read_products,write_products,write_publications,write_inventory,read_inventory&redirect_uri=${process.env.NEXT_PUBLIC_APP_URL}/api/shopify/callback`;
  return NextResponse.redirect(authUrl);
}

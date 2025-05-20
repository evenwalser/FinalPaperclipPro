// app/api/shopify/route.ts
import { NextResponse } from 'next/server';
import { createShopifyProduct } from '@/lib/shopify';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { storeId, item } = body;

    // Call your Shopify product creation function
    const shopifyProduct = await createShopifyProduct(storeId, item);
    return NextResponse.json(shopifyProduct, { status: 200 });
  } catch (error) {
    console.error('Shopify API error:', error);
    return NextResponse.json(
      { error: 'Failed to create Shopify product' },
      { status: 500 }
    );
  }
}

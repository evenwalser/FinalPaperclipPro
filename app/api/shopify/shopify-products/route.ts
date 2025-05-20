// File: app/api/shopify-products/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Extract access token and shop domain from query parameters
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('accessToken');
  const shopDomain = searchParams.get('shopDomain');

  if (!accessToken || !shopDomain) {
    return NextResponse.json(
      { error: 'Missing access token or shop domain' },
      { status: 400 }
    );
  }

  try {
    const products = await fetchAllShopifyProducts(accessToken, shopDomain);
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Error fetching products' },
      { status: 500 }
    );
  }
}

// Function to fetch all Shopify products with pagination
async function fetchAllShopifyProducts(accessToken: string, shopDomain: string): Promise<any[]> {
  const products: any[] = [];
  let url: string | null = `https://${shopDomain}/admin/api/2025-01/products.json?limit=250`;
  while (url) {
    const response: Response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accessToken,
      },
      // Optionally disable caching
      cache: 'no-store',
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Shopify products');
    }
    
    const data = await response.json();
    products.push(...data.products);

    // Get the next page URL from the "Link" header, if present
    const linkHeader = response.headers.get('Link');
    const nextLink = linkHeader
      ? linkHeader.split(',').find((s) => s.includes('rel="next"'))
      : null;
    url = nextLink ? nextLink.split(';')[0].trim().slice(1, -1) : null;
  }

  return products;
}

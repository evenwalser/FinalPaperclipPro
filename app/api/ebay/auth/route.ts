import { NextResponse } from 'next/server';

export async function GET() {
    const authUrl = `https://auth.ebay.com/oauth2/authorize?client_id=${process.env.EBAY_CLIENT_ID}&response_type=code&redirect_uri=${process.env.EBAY_REDIRECT_URI}&scope=https://api.ebay.com/oauth/api_scope/sell.inventory https://api.ebay.com/oauth/api_scope/sell.account https://api.ebay.com/oauth/api_scope/commerce.taxonomy.readonly`;
    return NextResponse.redirect(authUrl);
  }
  
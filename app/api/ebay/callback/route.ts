import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
  
    if (!code) {
      return NextResponse.json({ error: "Missing authorization code" }, { status: 400 });
    }
  
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    // Exchange code for access and refresh tokens
    const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.EBAY_CLIENT_ID}:${process.env.EBAY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.EBAY_REDIRECT_URI!,
      }),
    });
  
    if (!response.ok) {
      return NextResponse.json({ error: "Failed to exchange code for tokens" }, { status: 500 });
    }
  
    const { access_token, refresh_token, expires_in } = await response.json();
  
    // Store tokens in Supabase
    const { error } = await supabase
      .from('user_ebay_integrations')
      .upsert({
        user_id: user.id,
        access_token,
        refresh_token,
        token_expiry: new Date(Date.now() + expires_in * 1000).toISOString(),
        last_sync_time: null, // Placeholder for future sync functionality
      });
  
    if (error) {
      return NextResponse.json({ error: "Failed to store tokens" }, { status: 500 });
    }
  
    // Redirect to settings page after successful authentication
    const redirectURL = new URL('/settings', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    redirectURL.searchParams.set('tab', 'ebay-integration');
    return NextResponse.redirect(redirectURL);
  }
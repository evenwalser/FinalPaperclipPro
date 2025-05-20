import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const BASEURL = process.env.NEXT_PUBLIC_PAPERCLIP_API_URL
  ? `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4`
  : null;

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const supabase = await createClient();
  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('Supabase auth error:', error);
    return NextResponse.redirect(`${origin}/auth/auth-code-error`);
  }

  const userId = sessionData.user.id;
  const name = sessionData.user.user_metadata.full_name || sessionData.user.user_metadata.name || 'Unknown';
  // const providerToken = sessionData?.provider_token;

  // Check and insert user
  const { data: existingUser, error: fetchError } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.error('Error fetching user:', fetchError);
  }

  if (!existingUser) {
    const { error: insertError } = await supabase
      .from('users')
      .insert({ id: userId, name });

    if (insertError) {
      console.error('Error inserting user:', insertError);
      return NextResponse.redirect(`${origin}/login?error=Could not create user`);
    }
  }

  // Prepare Paperclip payload
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ') || firstName;
  const email = sessionData?.user?.email;
  const googleIdentity = sessionData?.user?.identities?.find(id => id.provider === 'google');
  const providerId = googleIdentity ? googleIdentity?.identity_data?.sub : userId;

  const loginPayload = {
    firstName,
    lastName,
    source: 'google',
    email,
    timezone: 'Europe/London', // Consider making this dynamic later
    id: providerId,
    // userToken: providerToken,
  };
  console.log('Paperclip payload:', loginPayload);

  // Validate BASEURL
  if (!BASEURL) {
    console.error('Paperclip API URL is not defined');
    return NextResponse.redirect(`${origin}/login?error=Server configuration error`);
  }
  console.log('Paperclip API URL:', `${BASEURL}/login`);

  // Call Paperclip /login
  let loginResponse;
  try {
    loginResponse = await fetch(`${BASEURL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(loginPayload),
    });
    console.log('Paperclip response status:', loginResponse.status);
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.redirect(`${origin}/login?error=Network error with Paperclip`);
  }

  if (!loginResponse.ok) {
    console.error('Paperclip request failed with status:', loginResponse.status);
    return NextResponse.redirect(`${origin}/login?error=Paperclip login failed`);
  }

  const contentType = loginResponse.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    console.error('Non-JSON response:', await loginResponse.text());
    return NextResponse.redirect(`${origin}/login?error=Invalid Paperclip response`);
  }

  const loginData = await loginResponse.json();
  console.log('Paperclip response data:', loginData);

  if (loginData.code !== 1) {
    console.error('Paperclip login unsuccessful:', loginData);
    return NextResponse.redirect(`${origin}/login?error=Paperclip login failed`);
  }

  // Store Paperclip token
  const { error: tokenError } = await supabase
    .from('user_tokens')
    .upsert(
      { user_id: userId, paperclip_token: loginData.data.api_token },
      { onConflict: 'user_id' }
    );

  if (tokenError) {
    console.error('Error storing Paperclip token:', tokenError);
    return NextResponse.redirect(`${origin}/login?error=Token storage failed`);
  }

  const paperclipUserId = loginData.data.userId;
  if (paperclipUserId && (!existingUser)) {
    const { error: updateError } = await supabase
      .from('users')
      .update({ paperclip_marketplace_id: paperclipUserId })
      .eq('id', userId);
    if (updateError) {
      console.error('Error updating Paperclip Marketplace ID:', updateError);
    }
  }


  // Redirect
  const forwardedHost = request.headers.get('x-forwarded-host');
  const isLocalEnv = process.env.NODE_ENV === 'development';

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}
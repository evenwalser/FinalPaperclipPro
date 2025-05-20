import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

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
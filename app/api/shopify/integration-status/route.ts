import { NextResponse } from 'next/server';
import { createClient } from "@/utils/supabase/server";

export async function GET(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('stores')
    .select('shopify_access_token, last_sync_time')
    .eq('owner_id', user.id)
    .single();

  if (error || !data) {
    return NextResponse.json({ connected: false, lastSyncTime: null });
  }

  const connected = !!data.shopify_access_token;
  const lastSyncTime = data.last_sync_time || null;

  return NextResponse.json({ connected, lastSyncTime });
}
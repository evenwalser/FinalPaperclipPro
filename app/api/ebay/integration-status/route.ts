import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
  
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  
    const { data, error } = await supabase
      .from('user_ebay_integrations')
      .select('access_token, last_sync_time')
      .eq('user_id', user.id)
      .single();
  
    if (error || !data) {
      return NextResponse.json({ connected: false, lastSyncTime: null });
    }
  
    return NextResponse.json({
      connected: !!data.access_token,
      lastSyncTime: data.last_sync_time,
    });
  }
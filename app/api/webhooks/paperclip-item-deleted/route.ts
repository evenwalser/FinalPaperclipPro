import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/utils/supabase/client';

// Helper function to compute HMAC signature
function computeHMAC(rawBody: Buffer, secret: string): string {
  return crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
}
export async function POST(request: NextRequest) {
  // Extract the signature from the header
  const signature = request.headers.get('X-Paperclip-Signature');
  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  try {
    // Get the raw body as a Buffer for HMAC verification
    const rawBody = Buffer.from(await request.arrayBuffer());
    
    // Retrieve the shared secret from environment variables
    const secret = process.env.PAPERCLIP_WEBHOOK_SECRET;
    if (!secret) {
      throw new Error('Missing PAPERCLIP_WEBHOOK_SECRET environment variable');
    }

    // Compute and verify the HMAC signature
    const computedSignature = computeHMAC(rawBody, secret);
    if (computedSignature !== signature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
    }

    // Parse the JSON payload
    const body = JSON.parse(rawBody.toString());
    console.log("Paperclip item deleted webhook:", body);
    
    const { event, item_id } = body;

    // Ensure the event is 'item_deleted'
    if (event !== 'item_deleted') {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    // Initialize Supabase client
    const supabase = createClient();

    // Find the item in the database using paperclip_marketplace_id
    const { data: item, error: findError } = await supabase
      .from('items')
      .select('id, deleted_at')
      .eq('paperclip_marketplace_id', item_id)
      .single();

    if (findError || !item) {
      return NextResponse.json({ error: 'Item not found in retail system' }, { status: 404 });
    }

    if (item.deleted_at) {
      return NextResponse.json({ 
        message: 'Item already unlisted from Paperclip',
        itemId: item.id 
      }, { status: 200 });
    }

    // Option 1: Mark the item as unlisted on Paperclip but don't delete it from retail
    const { error: updateError } = await supabase
      .from('items')
      .update({
        deleted_at: new Date().toISOString(),
      })
      .eq('id', item.id);

    if (updateError) {
      throw updateError;
    }

    // Option 2 (Alternative): Delete the item from the retail system
    // Only uncomment if you want to completely delete the item when deleted from marketplace
    /*
    // First delete associated images
    const { error: deleteImagesError } = await supabase
      .from('item_images')
      .delete()
      .eq('item_id', item.id);

    if (deleteImagesError) {
      throw deleteImagesError;
    }

    // Then delete the item itself
    const { error: deleteItemError } = await supabase
      .from('items')
      .delete()
      .eq('id', item.id);

    if (deleteItemError) {
      throw deleteItemError;
    }
    */

    return NextResponse.json({ 
      message: 'Item unlisted from Paperclip successfully',
      itemId: item.id 
    }, { status: 200 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
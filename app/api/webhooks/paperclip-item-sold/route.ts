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
    console.log("🚀 ~ POST ~ rawBody:", rawBody)

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
    console.log("🚀 ~ POST ~ body:", body)
    const { event, item_id, quantity_sold } = body;

    // Ensure the event is 'item_sold'
    if (event !== 'item_sold') {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    // Initialize Supabase client
    const supabase = createClient();

    // Find the item in the database using paperclip_marketplace_id
    const { data: item, error } = await supabase
      .from('items')
      .select('id, quantity')
      .eq('paperclip_marketplace_id', item_id)
      .single();

    if (error || !item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Calculate the new quantity
    const newQuantity = item.quantity - quantity_sold;
    if (newQuantity < 0) {
      return NextResponse.json({ error: 'Insufficient quantity' }, { status: 400 });
    }

    // Update the item quantity in the database
    const { error: updateError } = await supabase
      .from('items')
      .update({ quantity: newQuantity })
      .eq('id', item.id);

    if (updateError) {
      throw updateError;
    }

    // Respond with success
    return NextResponse.json(
      { message: 'Quantity updated successfully', quantity: newQuantity },
      { status: 200 }
    );
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
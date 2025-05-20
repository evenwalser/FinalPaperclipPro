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
    console.log("Paperclip item created webhook:", body);
    
    const { event, item } = body;

    // Ensure the event is 'item_created'
    if (event !== 'item_created') {
      return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    }

    // Initialize Supabase client
    const supabase = createClient();

    // Check if this item already exists in our system (by marketplace_id)
    const { data: existingItem } = await supabase
      .from('items')
      .select('id')
      .eq('paperclip_marketplace_id', item.id)
      .maybeSingle();

    if (existingItem) {
      return NextResponse.json({ message: 'Item already exists', itemId: existingItem.id }, { status: 200 });
    }

    // Get user information by marketplace user_id to link the item to the correct store
    const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, store_id')
    .eq('paperclip_marketplace_id', item.userId)
    .single();
    console.log("🚀 ~ POST ~ useritem error:", item.userId)
  if (userError || !userData || !userData.store_id) {
    console.log("🚀 ~ POST ~ userError:", userError)
    return NextResponse.json({ error: 'User or store not found' }, { status: 404 });
  }

    if (userError || !userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const paperclipCategoryId = item.categoryId;
    // Determine categories based on the marketplace category
    // This requires mapping between marketplace categories and your local categories
    // For simplicity, you might want to use a default category initially
    const { data: categoryData, error: categoryError } = await supabase
    .from('categories')
    .select('id')
    .eq('paperclip_marketplace_id', paperclipCategoryId)
    .single();
    
    let categoryId = null;
    if (categoryError || !categoryData) {
      console.warn(`No matching category found for paperclip_marketplace_id: ${paperclipCategoryId}`);
      // Fall back to a default category
      const { data: defaultCategory } = await supabase
        .from('categories')
        .select('id')
        .limit(1);
      if (defaultCategory && defaultCategory.length > 0) {
        categoryId = defaultCategory[0].id;
      }
    } else {
      categoryId = categoryData.id;
    }

    // Create new item in your system
    const { data: newItem, error: itemError } = await supabase
      .from('items')
      .insert({
        title: item.name,                 //name
        description: item.description,    //description
        price: parseFloat(item.price),     //price
        quantity: item.quantity || 1,
        category_id: categoryId,          //categorId
        condition: mapConditionFromMarketplace(item.condition_type),  // condition
        size: item.size || '',
        brand: item.brand || '',          // brand
        available_in_store: true,
        list_on_paperclip: true,
        store_id: userData.store_id,
        created_by: userData.id,
        paperclip_marketplace_id: item.id,  // marketplace_id
        paperclip_listed_at: new Date().toISOString(),
        listed_on_paperclip: true,
        tags: item.tags || [],  // tags
      })
      .select()
      .single();

    if (itemError) {
      throw itemError;
    }

    // Process images if available
    if (item.media && item.media.length > 0) {    // media is an array of image URLs
      const imageUploads = item.media.map((imageUrl: string, index: number) => ({
        item_id: newItem.id,
        image_url: imageUrl,
        display_order: index,
      }));

      const { error: imagesError } = await supabase
        .from('item_images')
        .insert(imageUploads);

      if (imagesError) {
        console.error('Error saving item images:', imagesError);
      }
    }

    return NextResponse.json({ 
      message: 'Item created successfully', 
      itemId: newItem.id 
    }, { status: 201 });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Helper function to map condition type from marketplace to retail format
function mapConditionFromMarketplace(conditionType: number): string {
  switch (conditionType) {
    case 0:
      return 'New';
    case 1:
      return 'Refurbished';
    case 4:
    default:
      return 'Used';
  }
}
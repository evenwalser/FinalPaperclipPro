import Stripe from 'stripe';
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";
import { getShopifyCredentials } from '@/lib/shopify';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(req: Request) {
  const supabase = createClient();
  
  try {
    const sig = req.headers.get('stripe-signature');
    const body = await getRawBody(req);

    if (!sig) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    console.log(`Received webhook event: ${event.type}`);

    switch (event.type) {
      case 'terminal.reader.action_succeeded':
        await handleReaderSuccess(event, supabase);
        break;
      case 'terminal.reader.action_failed':
        await handleReaderFailure(event, supabase);
        break;
      case 'payment_intent.succeeded':
        await handlePaymentIntentSuccess(event, supabase);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailure(event, supabase);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (err: any) {
    console.error(`Webhook error: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }
}

// Utility to get raw body as Buffer
async function getRawBody(req: Request): Promise<Buffer> {
  const chunks: Buffer[] = [];
  const reader = req.body?.getReader();
  
  if (reader) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) chunks.push(Buffer.from(value));
    }
  }
  
  return Buffer.concat(chunks);
}

// Event handlers
async function handleReaderSuccess(event: Stripe.Event, supabase: any) {
  const reader = event.data.object as Stripe.Terminal.Reader;
  const paymentIntentId = reader.action?.process_payment_intent?.payment_intent;
  if (paymentIntentId) {
    await processTerminalPayment(
      typeof paymentIntentId === 'string' ? paymentIntentId : paymentIntentId.id,
      'succeeded',
      supabase
    );
  }
}

async function handleReaderFailure(event: Stripe.Event, supabase: any) {
  const reader = event.data.object as Stripe.Terminal.Reader;
  const paymentIntentId = reader.action?.process_payment_intent?.payment_intent;
  if (paymentIntentId) {
    await processTerminalPayment(
      typeof paymentIntentId === 'string' ? paymentIntentId : paymentIntentId.id,
      'failed',
      supabase
    );
  }
}

async function handlePaymentIntentSuccess(event: Stripe.Event, supabase: any) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  if (paymentIntent.payment_method_types.includes('card_present')) {
    await processTerminalPayment(paymentIntent.id, 'succeeded', supabase);
  }
}

async function handlePaymentIntentFailure(event: Stripe.Event, supabase: any) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;
  if (paymentIntent.payment_method_types.includes('card_present')) {
    await processTerminalPayment(paymentIntent.id, 'failed', supabase);
  }
}

// Core processing function with deduplication
async function processTerminalPayment(paymentIntentId: string, status: 'succeeded' | 'failed', supabase: any) {
  console.log(`Processing payment ${paymentIntentId} with status: ${status}`);

  // 1. Retrieve payment context
  const { data: context, error: contextError } = await supabase
    .from('terminal_payment_context')
    .select('*')
    .eq('payment_intent_id', paymentIntentId)
    .single();

  if (contextError) {
    console.error('Error retrieving payment context:', contextError);
    return;
  }

  // 2. Handle failed payments
  if (status === 'failed') {
    await supabase
      .from('terminal_payment_context')
      .update({ 
        status: 'failed',
        processed_at: new Date().toISOString()
      })
      .eq('payment_intent_id', paymentIntentId);

    await supabase
      .from('payments')
      .update({ 
        status: 'failed',
        updated_at: new Date().toISOString()
      })
      .eq('payment_id', paymentIntentId);
    return;
  }

  // 3. Atomic status update for successful payments
  const { data: updatedContext, error: updateError } = await supabase
    .from('terminal_payment_context')
    .update({ status: 'processing' })
    .eq('payment_intent_id', paymentIntentId)
    .eq('status', 'pending')
    .select()
    .single();

  if (updateError || !updatedContext) {
    console.log(`Payment ${paymentIntentId} is already being processed or was processed`);
    return;
  }

  try {
    let saleId: string;

    // 4. Check for existing sale
    const { data: existingSale } = await supabase
      .from('sales')
      .select('id, status')
      .eq('payment_id', paymentIntentId)
      .single();

    if (existingSale) {
      saleId = existingSale.id;
      if (existingSale.status === 'pending') {
        await supabase
          .from('sales')
          .update({
            status: 'completed',
            payment_status: 'paid',
            updated_at: new Date().toISOString()
          })
          .eq('id', saleId);
      }

      // 5. Check for existing sale_items
      const { data: existingSaleItems, error: saleItemsError } = await supabase
        .from('sale_items')
        .select('id')
        .eq('sale_id', saleId);
        console.log("🚀 ~ processTerminalPayment ~ existingSaleItems:", existingSaleItems)

      if (!saleItemsError && (!existingSaleItems || existingSaleItems.length === 0)) {
        const items = context.items || [];
        const saleItems = items.map((item: any) => ({
          sale_id: saleId,
          item_id: item.id,
          quantity: item.quantity,
          price: item.price,
        }));
        await supabase.from('sale_items').insert(saleItems);
      }
    } else {
      // 6. Create new sale if it doesn't exist
      const saleData = {
        total_amount: context.final_amount,
        original_amount: context.original_amount,
        discount_type: context.discount_type,
        discount_value: context.discount_value,
        payment_method: 'card',
        status: 'completed',
        payment_status: 'paid',
        amount_tendered: context.final_amount,
        change_amount: 0,
        customer_id: context.customer_id,
        store_id: context.store_id,
        payment_id: paymentIntentId,
        receipt_id: context.receipt_id || `${Date.now().toString().slice(-10)}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`
      };

      const { data: saleRecord, error: saleError } = await supabase
        .from('sales')
        .insert(saleData)
        .select()
        .single();

      if (saleError) throw saleError;
      saleId = saleRecord.id;

      // 7. Insert sale_items
      const items = context.items || [];
      const saleItems = items.map((item: any) => ({
        sale_id: saleId,
        item_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));
      
      console.log("🚀 ~ saleItems ~ saleItems:", saleItems)
      const { error: saleItemsError } = await supabase
        .from('sale_items')
        .insert(saleItems);
      if (saleItemsError) throw saleItemsError;

      const updates = items.map((item: any) => ({
        itemId: item.id,
        quantityDelta: -item.quantity,
      }));
  
      const { accessToken, shopName } = await getShopifyCredentials(context.store_id);
      if (accessToken && shopName) {
        const itemIds = updates.map((u: { itemId: string; quantityDelta: number }) => u.itemId);
        const { data: itemsData } = await supabase
          .from('items')
          .select('id, shopify_inventory_level_id')
          .in('id', itemIds);
  
        const itemMap = new Map(itemsData.map((item: { id: string; shopify_inventory_level_id: string }) => [item.id, item.shopify_inventory_level_id]));
  
        for (const update of updates) {
          const inventoryLevelId = itemMap.get(update.itemId);
          if (inventoryLevelId) {
            const mutation = `
              mutation {
                inventoryAdjustQuantity(input: {
                  inventoryLevelId: "${inventoryLevelId}",
                  availableDelta: ${update.quantityDelta}
                }) {
                  inventoryLevel {
                    id
                    available
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }
            `;
  
            const response = await fetch(`https://${shopName}/admin/api/2023-10/graphql.json`, {
              method: 'POST',
              headers: {
                'X-Shopify-Access-Token': accessToken,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query: mutation }),
            });
  
            const result = await response.json();
            if (result.errors || result.data.inventoryAdjustQuantity.userErrors.length > 0) {
              console.error('Error updating Shopify inventory:', result.errors || result.data.inventoryAdjustQuantity.userErrors);
            }
          }
        }
      }
    }

    // 8. Inventory update removed - assume trigger handles it

    // 9. Update payment record
    await supabase
      .from('payments')
      .update({ 
        order_id: saleId,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('payment_id', paymentIntentId);

    // 10. Mark context as processed
    await supabase
      .from('terminal_payment_context')
      .update({ 
        status: 'processed',
        processed_at: new Date().toISOString()
      })
      .eq('payment_intent_id', paymentIntentId);

    console.log(`Successfully processed terminal payment ${paymentIntentId}`);
  } catch (error) {
    console.error('Error processing terminal payment:', error);
    await supabase
      .from('terminal_payment_context')
      .update({ 
        status: 'failed',
        processed_at: new Date().toISOString()
      })
      .eq('payment_intent_id', paymentIntentId);
  }
}
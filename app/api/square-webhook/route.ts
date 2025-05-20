import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Verify Square webhook signature
    const signatureHeader = request.headers.get('x-square-signature');
    const body = await request.text();
    
    const hash = crypto
      .createHmac('sha256', process.env.SQUARE_WEBHOOK_SIGNATURE_KEY!)
      .update(body)
      .digest('base64');

    if (hash !== signatureHeader) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Handle payment status updates
    if (event.type === 'payment.updated') {
      const payment = event.data.object.payment;
      const { data: paymentRecord, error: queryError } = await supabase
        .from('payments')
        .select('*')
        .eq('payment_link_id', payment.payment_link_id)
        .single();

      if (queryError) throw queryError;

      // Update payment status
      const { error: updateError } = await supabase
        .from('payments')
        .update({
          status: payment.status,
          square_payment_id: payment.id,
          updated_at: new Date().toISOString(),
        })
        .eq('id', paymentRecord.id);

      if (updateError) throw updateError;

      // If payment is successful, create sale record and update inventory
      if (payment.status === 'COMPLETED') {
        // Create sale record
        const { data: sale, error: saleError } = await supabase
          .from('sales')
          .insert({
            total_amount: paymentRecord.amount,
            payment_method: 'card',
            status: 'completed',
            payment_status: 'paid',
            store_id: paymentRecord.store_id,
            customer_id: paymentRecord.customer_id,
          })
          .select()
          .single();

        if (saleError) throw saleError;

        // Create sale items
        const saleItems = paymentRecord.items.map((item: any) => ({
          sale_id: sale.id,
          item_id: item.id,
          quantity: item.quantity,
          price: item.price,
        }));

        const { error: saleItemsError } = await supabase
          .from('sale_items')
          .insert(saleItems);

        if (saleItemsError) throw saleItemsError;

        // Update inventory
        for (const item of paymentRecord.items) {
          const { error: inventoryError } = await supabase.rpc(
            'update_item_quantity',
            {
              p_item_id: item.id,
              p_quantity_change: -item.quantity,
            }
          );

          if (inventoryError) throw inventoryError;
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook Error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
} 
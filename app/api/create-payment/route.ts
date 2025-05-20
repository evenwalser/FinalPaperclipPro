import { NextResponse } from 'next/server';
import { SquareClient, SquareEnvironment } from 'square';
import { createClient } from '@/utils/supabase/server';

// Securely initialize the Square client using environment variables
const client = new SquareClient({
  environment: process.env.NEXT_PUBLIC_SQUARE_ENVIRONMENT === 'production' 
    ? SquareEnvironment.Production 
    : SquareEnvironment.Sandbox,
  token: process.env.SQUARE_ACCESS_TOKEN,
});

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { amount, orderId, items, customerData, storeId } = await request.json();
    
    // Validate input
    if (!amount || !orderId || !items || !customerData || !storeId) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Create or update customer in Square
    // const { result: squareCustomer } = await client.customersApi.createCustomer({
    //   idempotencyKey: crypto.randomUUID(),
    //   givenName: customerData.name.split(' ')[0],
    //   familyName: customerData.name.split(' ').slice(1).join(' '),
    //   emailAddress: customerData.email,
    //   phoneNumber: customerData.phone,
    // });

    // Create payment link
    const amountCents = Math.round(Number(amount) * 100);
    const response = await client.checkout.paymentLinks.create({
      idempotencyKey: crypto.randomUUID(),
      quickPay: {
        name: `Order #${orderId}`,
        priceMoney: {
          amount: BigInt(amountCents),
          currency: 'USD',
        },
        locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID as string,
      },
      checkoutOptions: {
        // redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/pos/result?orderId=${orderId}`,
        redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/pos/result?done=true`,
        // customerOption: {
        //   customer: squareCustomer.customer?.id,
        // },
      },
    });

    // Store pending payment in Supabase
    const { data: paymentRecord, error: dbError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        amount: amount,
        status: 'pending',
        payment_link_id: response.paymentLink?.id,
        // square_customer_id: squareCustomer.customer?.id,
        square_customer_id: '1234',
        store_id: storeId,
        customer_data: customerData,
        items: items,
      })
      .select()
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({ 
      url: response.paymentLink?.url,
      paymentId: paymentRecord.id 
    });

  } catch (error: any) {
    console.error('Payment Link Creation Error:', {
      message: error.message,
      errors: error.errors,
      statusCode: error.statusCode
    });

    return NextResponse.json(
      { 
        error: "Payment processing failed",
        details: error.errors || error.message 
      },
      { status: 500 }
    );
  }
}
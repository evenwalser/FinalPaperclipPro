import { NextResponse } from "next/server";
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2025-02-24.acacia',
    });

    const body = await req.json();
    const { readerId, paymentIntentId } = body;

    if (!readerId || !paymentIntentId) {
      return NextResponse.json(
        { error: 'Reader ID and Payment Intent ID are required' },
        { status: 400 }
      );
    }

    try {
      // Process the payment intent
      const processResult = await stripe.terminal.readers.processPaymentIntent(
        readerId,
        { payment_intent: paymentIntentId }
      );
      
      return NextResponse.json({ 
        success: true, 
        data: processResult 
      });
    } catch (stripeError: any) {
      console.error('Stripe error processing payment:', stripeError);
      
      // Check if it's an intent_invalid_state error
      if (stripeError.code === 'intent_invalid_state') {
        return NextResponse.json(
          { 
            error: 'Payment intent must be in the requires_payment_method state to be processed by a reader.',
            code: 'intent_invalid_state'
          },
          { status: 400 }
        );
      }
      
      throw stripeError;
    }
  } catch (error: any) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

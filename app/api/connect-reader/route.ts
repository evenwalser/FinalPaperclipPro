import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST(request: Request) {
  try {
    const { readerId } = await request.json();
    
    if (!readerId) {
      return NextResponse.json({ 
        error: 'Reader ID is required' 
      }, { status: 400 });
    }
    
    // Get the reader details
    const reader = await stripe.terminal.readers.retrieve(readerId);
    
    return NextResponse.json({
      reader
    });
  } catch (error: any) {
    console.error('Error connecting to reader:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to connect to reader' 
    }, { status: 500 });
  }
} 
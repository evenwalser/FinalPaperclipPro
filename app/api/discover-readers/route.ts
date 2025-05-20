import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-02-24.acacia',
});

export async function POST() {
  try {
    const locations = await stripe.terminal.locations.list();
    
    if (!locations.data || locations.data.length === 0) {
      return NextResponse.json({ 
        error: 'No locations found. Please create a location in Stripe Dashboard.' 
      }, { status: 400 });
    }
    
    // Use the first location by default
    const locationId = locations.data[0].id;
    
    // Discover readers
    const discoveryResult = await stripe.terminal.readers.list({
      location: locationId,
    });
    
    return NextResponse.json({
      readers: discoveryResult.data
    });
  } catch (error: any) {
    console.error('Error discovering readers:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to discover readers' 
    }, { status: 500 });
  }
} 
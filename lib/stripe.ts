import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-02-24.acacia'
})

// Create Payment Intent
export const createPaymentIntent = async (amount : any) => {
  return await stripe.paymentIntents.create({
    amount,
    currency: 'gbp',
    payment_method_types: ['card_present'],
    capture_method: 'manual',
    metadata: {
      system: 'nextjs_pos'
    }
  })
}

// Process Payment on Reader
export const processPaymentOnReader = async (readerId : any, paymentIntentId : any) => {
  return await stripe.terminal.readers.processPaymentIntent(readerId, {
    payment_intent: paymentIntentId,
    process_config: {
      enable_customer_cancellation: true
    }
  })
}

// Create Simulated Reader
export const createSimulatedReader = async () => {
    try {
      const reader = await stripe.terminal.readers.create({
        registration_code: 'simulated-wpe',
        label: 'POS Terminal',
        location: process.env.NEXT_PUBLIC_TERMINAL_LOCATION_ID || ''
      });
  
      // Create a pure plain object with no prototype
      const plainReader = Object.create(null);
      plainReader.id = reader.id;
      plainReader.object = reader.object;
      plainReader.device_type = reader.device_type;
      plainReader.label = reader.label;
      plainReader.status = reader.status;
  
      return plainReader;
    } catch (error) {
      console.error('Error creating simulated reader:', error);
      throw error;
    }
  };
// Capture Payment
export const capturePaymentIntent = async (paymentIntentId : any) => {
  return await stripe.paymentIntents.capture(paymentIntentId)
}

// Get Reader Details
export const getReader = async (readerId : any) => {
  return await stripe.terminal.readers.retrieve(readerId)
}

export default stripe
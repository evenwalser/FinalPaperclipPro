// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIsS
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = Deno.env.get('TWILIO_ACCOUNT_SID');
const TWILIO_AUTH_TOKEN = Deno.env.get('TWILIO_AUTH_TOKEN');
const TWILIO_PHONE_NUMBER = Deno.env.get('TWILIO_PHONE_NUMBER');


const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

Deno.serve(async (req: Request): Promise<Response> => {
  const payload = await req.json();
  
  if (payload.type === 'INSERT' && payload.table === 'notifications') {
    const notification = payload.record;
    const metadata = notification.metadata;
    
    if (notification.type === 'low_stock' && metadata.low_stock_alert_enabled) {
      const channels: string[] = metadata.notification_channels || [];
      
      // Handle SMS notifications
      if (channels.includes('sms') && metadata.user_phone) {
        try {
          await client.messages.create({
            body: `[Low Stock Alert] ${notification.content}`,
            from: TWILIO_PHONE_NUMBER,
            to: metadata.user_phone
          });
          console.log(`SMS sent to ${metadata.user_phone}`);
        } catch (error) {
          console.error('Twilio error:', error);
        }
      }
    }
  }
  
  return new Response('OK', { status: 200 });
});

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-notification-sms' \
    --header 'Authorization: Bearer YOUR_ACCESS_TOKEN' \
    --header 'Content-Type: application/json' \
    --data '{"type":"INSERT","table":"notifications","record":{"type":"low_stock","content":"Item XYZ is low on stock","metadata":{"low_stock_alert_enabled":true,"notification_channels":["sms"],"user_phone":"+1234567890"}}}'
*/
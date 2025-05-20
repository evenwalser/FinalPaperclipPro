// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from 'npm:@supabase/supabase-js@2'
import { Resend } from 'npm:resend@4.0.0'
console.log("Hello from Functions!")
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req,res) => {
  // res.setHeader("Access-Control-Allow-Origin","*")
  // res.setHeader("Access-Control-Allow-Headers","authorization, content-type")
  // res.setHeader("Access-Control-Allow-Methods","POST, OPTIONS")

  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    })}
  console.log('method', req.method)
  try {
    // const { email, store_id, store_name } = await req.json();
    
    // Initialize clients
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization")! } } }
    );

    const resend = new Resend("re_Lsh7YSnC_4QhYR1xVFuda93WrTG1a4nUy" as string);

    // Generate unique token
    const token = "4QhYR1xVFuda93WrTG1a4nUy";
    const email = 'textmail@yopmail.com';
    const store_id = 14;
    const store_name = 'my_store';

    

    // Store invitation
    const { error: dbError } = await supabase
      .from("invitations")
      .insert({
        email,
        store_id,
        token,
        role: "sales_associate",
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      });

    if (dbError) throw dbError;

    // Create email content
    const inviteLink = `${Deno.env.get("APP_URL")}/accept-invite?token=${token}&email=${email}`;
    
    // Send email
    const { error: emailError } = await resend.emails.send({
      from: "textmail@yopmail.com",
      to: email,
      subject: `Join ${store_name} Team`,
      html: `
        <h1>You're Invited!</h1>
        <p>Join ${store_name} as a Sales Associate</p>
        <a href="${inviteLink}">Accept Invitation</a>
        <p>Link valid for 7 days</p>
      `,
    });

    if (emailError) throw emailError;

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/send-invitation-email' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

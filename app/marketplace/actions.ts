'use server'

import { createClient } from '@/utils/supabase/server';
import crypto from 'crypto';

// Function to generate a secure random token
function generateSecureToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function generateLinkingToken() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('Not authenticated');
  }

  // Generate a secure token
  const token = generateSecureToken();
  console.log("🚀 ~ generateLinkingToken ~ token:", token)
  
  // Store the token in a new table called 'account_linking_tokens'
  const { error: tokenError } = await supabase
    .from('account_linking_tokens')
    .insert({
      user_id: user.id,
      token: token,
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes expiry
      used: false
    });

  if (tokenError) {
    console.error('Token generation error:', tokenError);
    throw new Error(`Failed to generate linking token: ${tokenError.message}`);
  }

  // Generate the deep link URL
  const deepLinkUrl = ` https://paperclip.test-app.link?linkToken=${token}`;
  
  return { deepLinkUrl, token };
}
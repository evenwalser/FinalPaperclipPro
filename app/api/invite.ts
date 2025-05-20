import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/utils/supabase/admin'; // Ensure this is set up properly

type ResponseData = {
  message?: string;
  error?: string;
};

export default async function handler(  
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Ensure that the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Create user with Admin API (note: confirm email on user creation)
    const { error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: true, // Automatically confirm the email on creation
    });

    if (createUserError) throw createUserError;

    // Generate password reset link
    const { data, error: resetError } = await supabaseAdmin.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`, // Your site URL for redirection
      }
    );


    if (resetError) throw resetError;
    
    // Log the password reset link or send it via email (email sending logic should be here)
    console.log('Password reset link:', data);

    // Send successful response
    return res.status(200).json({ message: 'Invitation sent successfully' });
  } catch (error) {
    // Handle errors and send them back to the client
    console.error(error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}

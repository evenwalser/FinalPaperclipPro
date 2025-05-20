'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

// Use environment variables for production/staging
const BASEURL = `${process.env.NEXT_PUBLIC_PAPERCLIP_API_URL}/v4`;

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const name = (formData.get("name") as string).trim();
  const email = (formData.get("email") as string).trim();
  const password = (formData.get("password") as string).trim();
  const confirmPassword = (formData.get("confirmPassword") as string).trim();

  // Check if passwords match
  if (password !== confirmPassword) {
    redirect('/login?tab=signup&error=Passwords do not match');
  }

  // Sign up with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  if (error) {
    redirect('/login?tab=signup&error=' + encodeURIComponent(error.message));
  }

  // Insert user into 'users' table
  const { error: userError } = await supabase
    .from("users")
    .insert({
      id: data.user?.id,
      name,
    });

  if (userError) {
    if (!data?.user?.id) {
      redirect("/login?tab=signup&error=" + encodeURIComponent("User ID is missing"));
    }
    await supabase.auth.admin.deleteUser(data.user.id);
    let errMsg = "Could not create user record";
    const lowerMsg = userError.message.toLowerCase();
    if (lowerMsg.includes("duplicate") || lowerMsg.includes("already exists")) {
      errMsg = "Email already exists";
    }
    redirect("/login?tab=signup&error=" + encodeURIComponent(errMsg));
  }

  // Register with Paperclip Marketplace
  const firstName = name.split(' ')[0];
  const lastName = name.split(' ').slice(1).join(' ') || firstName; // Use firstName if no last name
  const nickname = ''; // Can be empty per requirements
  const timezone = 'Europe/London'; // Default timezone

  const registerResponse = await fetch(`${BASEURL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
      firstName,
      lastName,
      nickname,
      timezone,
    }),
  });

  if (!registerResponse.ok) {
    if (!data?.user?.id) {
      redirect("/login?tab=signup&error=" + encodeURIComponent("User ID is missing"));
    }
    await supabase.auth.admin.deleteUser(data.user.id);
    redirect('/login?tab=signup&error=' + encodeURIComponent('PaperClip registration failed'));
  }

  const registerData = await registerResponse.json();
  if (registerData.code !== 1) {
    if (!data?.user?.id) {
      redirect("/login?tab=signup&error=" + encodeURIComponent("User ID is missing"));
    }
    await supabase.auth.admin.deleteUser(data.user.id);
    redirect('/login?tab=signup&error=' + encodeURIComponent('PaperClip registration failed'));
  }
  
  // // Log in to Paperclip to get access token
  // const loginResponse = await fetch(`${BASEURL}/login`, {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     email,
  //     password,
  //   }),
  // });

  // if (!loginResponse.ok) {
  //   await supabase.auth.admin.deleteUser(data?.user?.id);
  //   redirect('/login?tab=signup&error=' + encodeURIComponent('Paperclip login failed'));
  // }

  // const loginData = await loginResponse.json();
  // if (loginData.code !== 1) {
  //   await supabase.auth.admin.deleteUser(data?.user?.id);
  //   redirect('/login?tab=signup&error=' + encodeURIComponent('Paperclip login failed'));
  // }

  // Store the Paperclip token
  // const { error: tokenError } = await supabase
  //   .from('user_tokens')
  //   .insert({
  //     user_id: data?.user?.id,
  //     paperclip_token: loginData.data.api_token,
  //   });

  // if (tokenError) {
  //   console.error('Error storing Paperclip token:', tokenError);
  //   // Log the error; user is already created, so no rollback needed
  // }

  revalidatePath('/login', 'page');
  redirect('/login');
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get('email') as string).trim();
  const password = (formData.get('password') as string).trim();

  // Log in with Supabase
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

  console.log("🚀 ~ login ~ authData:", authData)
  if (error) {
    redirect('/login?tab=login&error=' + encodeURIComponent(error.message));
  }

  // Log in to Paperclip Marketplace
  const loginResponse = await fetch(`${BASEURL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!loginResponse.ok) {
    redirect('/login?tab=login&error=' + encodeURIComponent('Paperclip login failed'));
  }

  const loginData = await loginResponse.json();
  if (loginData.code !== 1) {
    redirect('/login?tab=login&error=' + encodeURIComponent('Paperclip login failed'));
  }

  const paperclipUserId = loginData.data.userId;
  if (!paperclipUserId) {
    redirect('/login?tab=login&error=' + encodeURIComponent('Paperclip user ID missing'));
  }

  const { error: updateError } = await supabase
      .from('users')
      .update({ paperclip_marketplace_id: paperclipUserId })
      .eq('id', authData.user.id);
    if (updateError) {
      console.error('Error updating Paperclip ID:', updateError);
    }

  // Store or update the Paperclip token
  const { error: tokenError } = await supabase
    .from('user_tokens')
    .upsert({
      user_id: authData?.user?.id,
      paperclip_token: loginData.data.api_token,
    }, {
      onConflict: 'user_id'
    });


  if (tokenError) {
    console.error('Error storing Paperclip token:', tokenError);
    // Log the error; proceed since login succeeded
  }

  revalidatePath('/', 'page');
  redirect('/');
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error logging out:", error.message);
    return redirect("/error");
  }

  return redirect("/login");
}



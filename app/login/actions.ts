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

  revalidatePath('/login', 'page');
  redirect('/login');
}

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = (formData.get('email') as string).trim();
  const password = (formData.get('password') as string).trim();

  // Log in with Supabase
  const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect('/login?tab=login&error=' + encodeURIComponent(error.message));
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



"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
  });

  if (error) {
    return redirect("/reset-password?error=Could not send reset email");
  }

  return redirect("/reset-password?success=Check your email for a reset link");
}
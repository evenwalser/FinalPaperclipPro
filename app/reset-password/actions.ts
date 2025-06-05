"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function resetPassword(formData: FormData) {
  const supabase = await createClient();
  const email = (formData.get("email") as string).trim();

  // Send password reset email
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/update-password`,
  });

  if (error) {
    console.log("🚀 ~ resetPassword ~ error:", error)
    return redirect("/reset-password?error=Could not send reset email");
  }

 return redirect(
  "/reset-password?success=If your email is registered, a password reset link will be sent to your email. Check your inbox and spam folder."
);
}
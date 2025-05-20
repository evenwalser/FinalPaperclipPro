import { createClient } from "./server";


interface UserData {
  authUser: any;
  userData: any;
  error: string | undefined;
}

export async function getUserData(): Promise<UserData | null> {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: userData, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  return { 
    authUser: user, 
    userData,
    error: error?.message 
  };
}

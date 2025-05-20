import { getUserData } from "@/utils/supabase/actions";

export default async function Private() {
  const userDataResponse = await getUserData();

  // Early return if userDataResponse is null
  if (!userDataResponse) {
    return <div>You are not logged in</div>;
  }

  const { authUser, userData } = userDataResponse;

  return (
    <div>
      <h1>Welcome {userData?.name}</h1>
      <p>Email: {authUser?.email}</p>
      <p>Member since: {new Date(userData?.created_at).toLocaleDateString()}</p>
    </div>
  );
}

import HomePage from "@/components/homepage";
import { createSClient } from "@/supabase/server";

export default async function Home() {
  const supabase = await createSClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let summaries = null;

  if (user) {
    const { data, error } = await supabase
      .from("summaries")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    summaries = data || [];
  }

  return (
    <>
      <HomePage user={user} summaries={summaries} />
    </>
  );
}

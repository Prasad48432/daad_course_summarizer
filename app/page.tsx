import HomePage from "@/components/homepage";
import { createSClient } from "@/supabase/server";

export default async function Home() {
  const supabase = await createSClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <HomePage user={user} />
    </>
  );
}

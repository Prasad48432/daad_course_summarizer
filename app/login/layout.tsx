import { createSClient } from "@/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    redirect("/");
    return;
  }

  return <>{children}</>;
}

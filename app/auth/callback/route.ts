import { NextResponse } from "next/server";
import { createSClient } from "@/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createSClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (error || !user) {
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}

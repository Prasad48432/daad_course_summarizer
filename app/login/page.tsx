"use client";

import { createClient } from "@/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function LoginPage() {
  const supabase = createClient();
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}` },
    });
  };

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-linear-to-b from-white to-muted/40">
      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="p-8 space-y-6 text-center">
          <h1 className="text-2xl font-semibold">Welcome</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to start summarising DAAD courses.
          </p>
          <Button size="lg" onClick={signInWithGoogle}>
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}

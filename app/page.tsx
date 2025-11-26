"use client";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DAAD_REGEX =
  /^https:\/\/www2\.daad\.de\/deutschland\/studienangebote\/international-programmes\/en\/detail\/(\d+)\/?(#.*)?$/;

export default function HomePage() {
  const [user, setUser] = useState<any>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    // get current user + subscribe to auth changes
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const isValid = useMemo(() => DAAD_REGEX.test(url.trim()), [url]);

  const handleSummarize = async () => {
    setError(null);
    setResult(null);
    if (!isValid) {
      setError("Please paste a valid DAAD course link.");
      return;
    }
    setLoading(true);
    try {
      // get access token to call our API
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error("Not authenticated.");

      const r = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ url }),
      });

      const j = await r.json();
      if (!r.ok) throw new Error(j.message || "Failed to summarize");
      setResult(j.markdown);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-b from-white to-muted/40 flex flex-col items-center justify-center p-6">
      {user && (
        <div>
          <p>Signed in as {user.email}</p>
        </div>
      )}
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardContent className="p-8 space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight">
              DAAD Course Summariser
            </h1>
            <p className="text-muted-foreground">
              Paste a DAAD course link to get a clean, human-friendly summary.
            </p>
          </div>

          {!user ? (
            <div className="rounded-2xl border bg-card p-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You must be signed in to use the summariser.
              </p>
              <Button onClick={() => (window.location.href = "/login")}>
                Sign in with Google
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label htmlFor="daad">DAAD course link</Label>
                <Input
                  id="daad"
                  placeholder="https://www2.daad.de/deutschland/studienangebote/international-programmes/en/detail/8357/#tab_overview"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  inputMode="url"
                />
                {!isValid && url.length > 0 && (
                  <p className="text-xs text-destructive">
                    Link must match the DAAD pattern: …/detail/&lt;number&gt;
                  </p>
                )}
              </div>
              <div className="flex gap-3">
                <Button
                  disabled={!isValid || loading}
                  onClick={handleSummarize}
                >
                  {loading ? "Summarising…" : "Summarise"}
                </Button>
                <Button variant="ghost" onClick={() => supabase.auth.signOut()}>
                  Sign out
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          )}

          <footer className="text-xs text-muted-foreground pt-2">
            No navbar. Clean and focused ✨
          </footer>
        </CardContent>
      </Card>
    </main>
  );
}

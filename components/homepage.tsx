"use client";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { createClient } from "@/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AdBanner from "@/components/adbanner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Copy, Sparkle, Sparkles, X } from "lucide-react";
import Image from "next/image";
import Loader from "@/components/loader";
import UserNav from "@/components/user-nav";
import { User } from "@supabase/supabase-js";

const DAAD_REGEX =
  /^https:\/\/www2\.daad\.de\/deutschland\/studienangebote\/international-programmes\/en\/detail\/(\d+)\/?(#.*)?$/;

export default function HomePage({ user }: { user: User | null }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(true);
  const [result, setResult] = useState<string | null>(
    `**Course Summary**\n- Course: Master of Science in Automotive Software Engineering\n- University: Chemnitz University of Technology, Chemnitz, Germany\n- Duration: 4 semesters (2 years)\n- Language of instruction: English (100%)\n- Tuition fees: None; semester contribution approx. 330 EUR (includes public transport)\n- Application deadlines: 15 July (winter semester), 15 January (summer semester)\n- Admission requirements: Bachelor’s degree in Computer Science or related fields\n- English language requirements: IELTS 5.5, TOEFL iBT 72, or equivalent\n- Integrated research internship and options for specialisation\n- Funding opportunities and support services available for international students\n\n**Cleaned Description**\nThe Master’s in Automotive Software Engineering at Chemnitz University of Technology is a research-oriented programme focused on the development of complex automotive software systems. The curriculum covers key areas such as automotive software technology, embedded systems, real-time and communication systems, and computer science. Students can specialise in topics like automotive software platforms or software verification.\n\nThe programme includes a mandatory research internship, which can be completed at the university or in industry. Courses are taught entirely in English, and students are required to reach at least A2 level in German by the end of the third semester. The university offers support with internships, part-time jobs, accommodation, and career planning. No tuition fees are charged, but students must pay a semester contribution that covers public transport. Funding options are available for international students.`
  );

  const supabase = useMemo(() => createClient(), []);

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
      setDialogOpen(true);
      setUrl("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  };

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4 gap-4">
      <div className="flex items-center justify-between w-full max-w-2xl">
        <div className="flex items-center gap-2">
          <Image
            src="/daad.png"
            alt="DAAD Course Summariser"
            width={48}
            height={48}
            className="w-10 h-10"
          />
        </div>

        {user ? (
          <UserNav user={user} />
        ) : (
          <Button onClick={signInWithGoogle}>
            {" "}
            <Image
              width={16}
              height={16}
              src="/google.svg"
              className="w-4 h-4 invert inline-block"
              alt="Google"
            />{" "}
            Sign in
          </Button>
        )}
      </div>
      {process.env.NODE_ENV === "production" && (
        <div className="bg-background w-full max-w-7xl h-24">
          <AdBanner
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
            dataAdSlot="2737076335315038"
          />
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-7xl">
          <DialogHeader>
            <DialogTitle>Course summary</DialogTitle>
            <DialogDescription>
              Here is the summary generated for the DAAD course you provided.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-2 mt-4 custom-scrollbar">
            <div className="prose dark:prose-invert max-w-none">
              <ReactMarkdown>{result}</ReactMarkdown>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">
                Close <X />
              </Button>
            </DialogClose>
            <Button
              onClick={() => {
                if (result) navigator.clipboard.writeText(result);
              }}
            >
              Copy <Copy />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card className="w-full max-w-2xl">
        <CardContent className="p-5 space-y-6">
          <div className="space-y-1">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-semibold tracking-tight bricolage">
              DAAD Course Summariser
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">
              Paste a DAAD course link to get a clean, human-friendly summary.
            </p>
          </div>

          {!user ? (
            <div className="rounded-2xl border bg-card p-6 text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                You must be signed in to use the summariser.
              </p>
              <Button onClick={signInWithGoogle}>
                <Image
                  width={16}
                  height={16}
                  src="/google.svg"
                  className="w-4 h-4 invert inline-block"
                  alt="Google"
                />
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
                  className="text-sm"
                  disabled={loading}
                />
                {!isValid && url.length > 0 && (
                  <p className="text-xs text-destructive">
                    Link must match the DAAD pattern: …/detail/&lt;number&gt;
                  </p>
                )}
              </div>
              <div className="flex gap-3 w-full">
                <Button
                  disabled={!isValid || loading}
                  onClick={handleSummarize}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      Summarising <Loader className="bg-primary-foreground" />
                    </>
                  ) : (
                    <>
                      Summarise <Sparkles />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {process.env.NODE_ENV === "production" && (
        <div className="bg-background w-full max-w-7xl h-24">
          <AdBanner
            dataAdFormat="auto"
            dataFullWidthResponsive={true}
            dataAdSlot="2737076335315038"
          />
        </div>
      )}
    </main>
  );
}

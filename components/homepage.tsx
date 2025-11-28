"use client";
import { useMemo, useState } from "react";
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
import { Copy, Sparkles, University, X } from "lucide-react";
import Image from "next/image";
import Loader from "@/components/loader";
import UserNav from "@/components/user-nav";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import SummaryRenderer from "./summary-renderer";

const DAAD_REGEX =
  /^https:\/\/www2\.daad\.de\/deutschland\/studienangebote\/international-programmes\/en\/detail\/(\d+)\/?(#.*)?$/;

export default function HomePage({ user }: { user: User | null }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [result, setResult] = useState<string | null>(null);

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
            <SummaryRenderer data={result} />
            {result}
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
                  placeholder="Enter your daad course link here"
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

      <div className="flex items-center justify-between w-full max-w-2xl px-2">
        <p>Other Tools</p>
        <div className="flex items-center gap-2">
          <Button size={"sm"} className="rounded-full cursor-pointer">
            <Link href={"/admit-evaluator"} className="flex items-center gap-2">
              Admit Evaluator <University />
            </Link>
          </Button>
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-4 text-[15px] leading-relaxed mt-6">
        <h1 className="text-2xl font-bold">
          DAAD Course Summariser – Free AI Tool for Students Applying to Germany
        </h1>

        <p>
          The DAAD Course Summariser is a free tool designed to help
          international students quickly understand German university programmes
          listed on the official DAAD (German Academic Exchange Service)
          website. While DAAD provides extremely valuable information, the
          course pages are often long, data-heavy, and difficult to read on
          mobile devices. This tool solves that problem by transforming any DAAD
          course link into a clear, short and student-friendly summary within
          seconds.
        </p>

        <h2 className="text-xl font-semibold mt-4">What This Tool Does</h2>
        <p>
          With one click, the summariser extracts key academic details such as
          admission requirements, deadlines, teaching language, programme
          duration, fees, and eligibility criteria. Instead of scrolling through
          long descriptions, students receive a clean, organised summary they
          can easily understand. It is especially useful for applicants
          exploring multiple German universities or comparing course options
          before preparing their applications.
        </p>

        <h2 className="text-xl font-semibold mt-4">Why This Tool Is Helpful</h2>
        <p>
          Every year thousands of students apply to German universities, but
          many struggle to interpret DAAD course pages because they contain
          technical language, long paragraphs, or incomplete formatting. This
          summariser simplifies that information into concise points, making it
          easier to decide whether a course matches your academic background,
          skills, and goals.
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>Faster understanding of programme structure</li>
          <li>Clear admission requirements and English test scores</li>
          <li>Tuition fees and semester contribution breakdown</li>
          <li>Exact application deadlines for EU & non-EU students</li>
          <li>Teaching language and university details</li>
          <li>Ideal applicant profile based on course description</li>
        </ul>

        <h2 className="text-xl font-semibold mt-4">
          Who Can Use the DAAD Course Summariser?
        </h2>
        <p>
          This tool is designed for bachelor’s students, working professionals,
          or graduates planning to pursue a master’s degree in Germany. It is
          especially helpful for students from India, Pakistan, Bangladesh,
          Nigeria, Brazil and other countries where DAAD is commonly used to
          research German universities.
        </p>

        <p>
          Whether you are applying to technical universities, universities of
          applied sciences, or research institutes, this tool provides the
          clarity needed to shortlist the right programmes.
        </p>

        <h2 className="text-xl font-semibold mt-4">How to Use the Tool</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Go to the official DAAD website and open any programme page.</li>
          <li>
            Copy the full URL of the course (e.g.,
            https://www2.daad.de/…/detail/12345/).
          </li>
          <li>Paste it into the input box on this page.</li>
          <li>Click to generate your summary.</li>
        </ol>

        <p>
          Within seconds, your personalised summary appears, highlighting the
          most important parts of the course. You can also copy the results for
          later use.
        </p>

        <h2 className="text-xl font-semibold mt-4">
          Why This Site Is Safe and Trustworthy
        </h2>
        <p>
          This website uses secure API calls, does not store your DAAD links
          permanently, and only fetches publicly available course information.
          Your data is not shared with any third party. The summaries are
          generated through a structured process designed to ensure accuracy and
          avoid misinformation.
        </p>

        <h2 className="text-xl font-semibold mt-4">Future Features</h2>
        <p>
          We are also working on new tools for students applying to Germany,
          including:
        </p>
        <ul className="list-disc list-inside space-y-1">
          <li>Admission chances evaluator</li>
          <li>University finder by profile</li>
          <li>IELTS/GRE requirement checker</li>
          <li>Visa document assistant</li>
        </ul>

        <p>
          These improvements aim to make the German university application
          process simpler and more transparent for international students.
        </p>
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
    </main>
  );
}

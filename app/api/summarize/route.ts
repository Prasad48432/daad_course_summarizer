import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const DAAD_REGEX =
  /^https:\/\/www2\.daad\.de\/deutschland\/studienangebote\/international-programmes\/en\/detail\/(\d+)\/?(#.*)?$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const url: string = (body?.url || "").trim();

    if (!DAAD_REGEX.test(url)) {
      return NextResponse.json(
        { message: "Invalid DAAD link." },
        { status: 400 }
      );
    }

    // -------- Auth ----------
    const authHeader = req.headers.get("authorization");
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : undefined;

    if (!accessToken) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    const pub = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: userData, error: userErr } = await pub.auth.getUser(
      accessToken
    );

    if (userErr || !userData.user) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }

    const userId = userData.user.id;

    // -------- Daily Quota ----------
    const svc = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const today = new Date().toISOString().slice(0, 10);

    const { data: usageRow } = await svc
      .from("usage")
      .select("id,count")
      .eq("user_id", userId)
      .eq("day", today)
      .maybeSingle();

    const isPremium = false; // Replace if premium logic added
    const limit = isPremium ? 50 : 5;
    const used = usageRow?.count ?? 0;

    if (used >= limit) {
      return NextResponse.json(
        {
          message:
            "Daily quota reached. Upgrade to Premium for a higher limit.",
        },
        { status: 429 }
      );
    }

    console.log("url provided is ", url);

    // -------- Call Vectorshift Pipeline ----------
    const vsResp = await fetch(
      "https://api.vectorshift.ai/v1/pipeline/6927147ad3b0f7d99b2cf9b0/run",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.VECTORSHIFT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: {
            input_0: url,
          },
        }),
      }
    );

    console.log("Vectorshift response status: ", vsResp.status);
    console.log("Vectorshift response headers: ", vsResp.headers);
    console.log("Vectorshift response body: ", await vsResp.clone().text());

    if (!vsResp.ok) {
      const t = await vsResp.text();
      return NextResponse.json(
        { message: `Vectorshift error: ${t}` },
        { status: 502 }
      );
    }

    const vsData = await vsResp.json();
    const markdown: string = vsData?.outputs?.output_0 ?? "";

    // -------- Update Usage ----------
    if (!usageRow) {
      await svc.from("usage").insert({
        user_id: userId,
        day: today,
        count: 1,
      });
    } else {
      await svc
        .from("usage")
        .update({ count: used + 1 })
        .eq("id", usageRow.id);
    }

    return NextResponse.json({ markdown });
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message || "Unexpected error" },
      { status: 500 }
    );
  }
}

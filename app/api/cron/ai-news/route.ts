import { type NextRequest, NextResponse } from "next/server";
import { AiNewsAggregator } from "@/lib/news/aggregator";

export const maxDuration = 60; // Max duration for Vercel/serverless execution

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  // If no CRON_SECRET is set in development, permit localhost/internal trigger
  if (!secret) {
    const host = request.headers.get("host") || "";
    return host.includes("localhost") || host.includes("127.0.0.1");
  }

  const authHeader = request.headers.get("authorization");
  if (authHeader && authHeader === `Bearer ${secret}`) return true;

  const urlSecret = request.nextUrl.searchParams.get("key");
  if (urlSecret && urlSecret === secret) return true;

  return false;
}

export async function GET(request: NextRequest) {
  return handleCron(request);
}

export async function POST(request: NextRequest) {
  return handleCron(request);
}

async function handleCron(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: "Unauthorized. Missing or invalid cron secret." },
      { status: 401 }
    );
  }

  const force = request.nextUrl.searchParams.get("force") === "true";

  try {
    const aggregator = new AiNewsAggregator();
    const result = await aggregator.refreshDailyNews(force);

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error: unknown) {
    const message = (error as Error)?.message || "Failed to execute cron";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

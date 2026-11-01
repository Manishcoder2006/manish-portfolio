import { type NextRequest, NextResponse } from "next/server";
import { AiNewsAggregator } from "@/lib/news/aggregator";

// In-memory rate limiting map for admin triggers: max 5 requests per 10 minutes
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000;
  const limit = 5;

  const current = rateLimitMap.get(ip);
  if (!current || current.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (current.count >= limit) {
    return false;
  }

  current.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") || "admin";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many manual refresh requests. Please wait a few minutes." },
      { status: 429 }
    );
  }

  const adminKey = process.env.ADMIN_SECRET_KEY;
  const providedKey = request.headers.get("x-admin-key") || request.nextUrl.searchParams.get("key");

  // In production, require ADMIN_SECRET_KEY
  if (process.env.NODE_ENV === "production" && (!adminKey || providedKey !== adminKey)) {
    return NextResponse.json(
      { error: "Unauthorized. Valid x-admin-key header required." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json().catch(() => ({}));
    const force = Boolean(body?.force ?? true); // Admin manual trigger defaults to force=true

    const aggregator = new AiNewsAggregator();
    const result = await aggregator.refreshDailyNews(force);

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: (error as Error)?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

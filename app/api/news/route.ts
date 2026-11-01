import { NextResponse } from "next/server";
import { AiNewsAggregator } from "@/lib/news/aggregator";


export async function GET() {
  try {
    const aggregator = new AiNewsAggregator();
    const data = await aggregator.getDailyNews();
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch (error: unknown) {
    console.error("[API /api/news] Error fetching news:", error);
    return NextResponse.json(
      { error: "Failed to load daily AI news." },
      { status: 500 }
    );
  }
}

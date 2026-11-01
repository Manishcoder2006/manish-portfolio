"use client";

import { useState, useEffect } from "react";
import type { AiNewsArticle } from "@/lib/news/types";
import { formatRelativeTime } from "@/lib/news/utils";

interface DailyAiNewsProps {
  initialArticles: AiNewsArticle[];
  initialLastUpdatedIst: string;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  "AI Models and LLMs": { bg: "rgba(245, 135, 26, 0.12)", text: "#f5871a", border: "rgba(245, 135, 26, 0.3)" },
  "AI Agents": { bg: "rgba(248, 184, 8, 0.12)", text: "#b84d00", border: "rgba(248, 184, 8, 0.3)" },
  "Generative AI": { bg: "rgba(184, 77, 0, 0.1)", text: "#b84d00", border: "rgba(184, 77, 0, 0.25)" },
  "Machine Learning and Deep Learning": { bg: "rgba(12, 11, 10, 0.08)", text: "#0c0b0a", border: "rgba(12, 11, 10, 0.2)" },
  "AI Research": { bg: "rgba(97, 90, 82, 0.1)", text: "#615a52", border: "rgba(97, 90, 82, 0.25)" },
  "Robotics": { bg: "rgba(245, 135, 26, 0.15)", text: "#f5871a", border: "rgba(245, 135, 26, 0.35)" },
  "AI Tools and Developer Platforms": { bg: "rgba(184, 77, 0, 0.12)", text: "#b84d00", border: "rgba(184, 77, 0, 0.3)" },
  "AI Industry and Funding": { bg: "rgba(248, 184, 8, 0.15)", text: "#b84d00", border: "rgba(248, 184, 8, 0.35)" },
};

function CategoryIcon({ category }: { category: string }) {
  if (category.includes("Agent")) {
    return (
      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2a8 8 0 0 0-8 8v12l8-4 8 4V10a8 8 0 0 0-8-8z" />
        <circle cx="9" cy="10" r="1" />
        <circle cx="15" cy="10" r="1" />
      </svg>
    );
  }
  if (category.includes("Model") || category.includes("LLM")) {
    return (
      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    );
  }
  if (category.includes("Tool") || category.includes("Platform")) {
    return (
      <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="m18 15-6-6-6 6" />
      </svg>
    );
  }
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export function DailyAiNews({ initialArticles, initialLastUpdatedIst }: DailyAiNewsProps) {
  const [mounted, setMounted] = useState(false);
  const [articles, setArticles] = useState<AiNewsArticle[]>(initialArticles);
  const [lastUpdated, setLastUpdated] = useState<string>(initialLastUpdatedIst);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleManualRefresh = async () => {
    setRefreshing(true);
    setStatusMessage("Fetching latest AI stories...");
    try {
      const res = await fetch("/api/admin/refresh-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ force: true }),
      });
      const data = await res.json();
      if (res.ok && data.articles) {
        setArticles(data.articles);
        setLastUpdated(new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata", hour: "2-digit", minute: "2-digit" }) + " IST");
        setStatusMessage("Updated with latest stories!");
      } else {
        setStatusMessage(data.message || data.error || "Refreshed with cached stories.");
      }
    } catch {
      setStatusMessage("Could not refresh right now. Showing cached stories.");
    } finally {
      setRefreshing(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  return (
    <div className="w-full">
      {/* Meta Bar: Timestamp, Source Attribution & Manual Refresh Trigger */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-ink/10 pb-4">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-pill bg-mist px-3 py-1 font-body text-[13px] font-medium text-slate">
            <span className="size-2 rounded-pill bg-flame animate-pulse" aria-hidden="true" />
            Updated: {lastUpdated}
          </span>
          <span className="hidden font-body text-[13px] text-fog sm:inline">
            Ground-verified via Gemini Search
          </span>
        </div>

        <button
          onClick={handleManualRefresh}
          disabled={refreshing}
          type="button"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-pill border border-ink/20 bg-paper px-3.5 py-1.5 font-body text-[13px] font-semibold text-ink transition-colors hover:border-flame hover:text-ember disabled:opacity-50"
          aria-label="Refresh top 5 AI stories"
        >
          <svg
            className={`size-3.5 ${refreshing ? "animate-spin" : ""}`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M3 21v-5h5" />
          </svg>
          <span>{refreshing ? "Refreshing…" : "Refresh Feed"}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="mb-6 rounded-tile bg-mist p-3 font-body text-[14px] text-ember transition-all">
          {statusMessage}
        </div>
      )}

      {/* 5 News Cards Grid */}
      <div className="grid gap-6">
        {articles.map((article, idx) => {
          const isExpanded = expandedId === article.id;
          const catStyle = CATEGORY_COLORS[article.category] || {
            bg: "rgba(12, 11, 10, 0.08)",
            text: "#0c0b0a",
            border: "rgba(12, 11, 10, 0.2)",
          };

          return (
            <article
              key={article.id || idx}
              className="group relative rounded-card border border-ink/10 bg-mist/50 p-6 transition-all duration-300 hover:border-flame/40 hover:bg-mist hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] min-[900px]:p-8"
            >
              {/* Top metadata row: Number, Category pill, Publisher & Relative Time */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-display text-[15px] font-extrabold text-ember">
                    0{idx + 1}
                  </span>
                  <span
                    className="inline-flex items-center gap-1.5 rounded-pill px-2.5 py-0.5 font-body text-[12px] font-semibold tracking-wide"
                    style={{
                      backgroundColor: catStyle.bg,
                      color: catStyle.text,
                      border: `1px solid ${catStyle.border}`,
                    }}
                  >
                    <CategoryIcon category={article.category} />
                    {article.category}
                  </span>
                </div>

                <div className="flex items-center gap-2 font-body text-[13px] text-slate">
                  <span className="font-semibold text-ink">{article.source_name}</span>
                  <span aria-hidden="true">•</span>
                  <span>{mounted ? formatRelativeTime(article.published_at) : "Today"}</span>
                </div>
              </div>

              {/* Headline */}
              <h3 className="font-display text-[length:clamp(20px,2vw,28px)] font-bold leading-[1.25] tracking-[-0.03em] text-ink group-hover:text-ember transition-colors">
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline hover:underline"
                >
                  {article.title}
                </a>
              </h3>

              {/* Factual 60-100 words Summary */}
              <p className="mt-3 font-body text-[15px] leading-[1.55] text-slate">
                {article.summary}
              </p>

              {/* Expandable "Why It Matters To Developers" Drawer */}
              {article.why_it_matters && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => toggleExpand(article.id)}
                    className="inline-flex cursor-pointer items-center gap-1.5 font-body text-[13px] font-semibold text-ember transition-colors hover:text-ink"
                    aria-expanded={isExpanded}
                  >
                    <svg
                      className={`size-3.5 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span>{isExpanded ? "Hide Developer Context" : "Why It Matters To Developers"}</span>
                  </button>

                  {isExpanded && (
                    <div className="mt-3 rounded-tile border border-amber/30 bg-paper p-4 text-[14px] leading-relaxed text-ink shadow-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-flame font-bold">↳</span>
                        <p className="font-body text-slate">{article.why_it_matters}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Bottom Actions: Read Full Story Link */}
              <div className="mt-5 flex items-center justify-between border-t border-ink/8 pt-4">
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-body text-[14px] font-semibold text-ink transition-colors hover:text-ember group/link"
                >
                  <span>Read Full Story on {article.source_name}</span>
                  <svg
                    className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M7 17l9.2-9.2M17 17V8H8" />
                  </svg>
                </a>

                {article.relevance_score && (
                  <span className="font-body text-[12px] text-fog">
                    Score: {Math.round(article.relevance_score)}/100
                  </span>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

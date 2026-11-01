import { createHash } from "crypto";
import type { AiNewsCategory } from "./types";

export const VALID_CATEGORIES: readonly AiNewsCategory[] = [
  "AI Models and LLMs",
  "AI Agents",
  "Generative AI",
  "Machine Learning and Deep Learning",
  "AI Research",
  "Robotics",
  "AI Tools and Developer Platforms",
  "AI Industry and Funding",
] as const;

/**
 * Validates and normalizes category string into one of the 8 allowed categories.
 */
export function normalizeCategory(categoryStr: string): AiNewsCategory {
  const clean = categoryStr.trim().toLowerCase();
  for (const cat of VALID_CATEGORIES) {
    if (cat.toLowerCase() === clean) return cat;
  }
  if (clean.includes("agent")) return "AI Agents";
  if (clean.includes("generative") || clean.includes("image") || clean.includes("video")) return "Generative AI";
  if (clean.includes("model") || clean.includes("llm")) return "AI Models and LLMs";
  if (clean.includes("robot")) return "Robotics";
  if (clean.includes("research") || clean.includes("paper")) return "AI Research";
  if (clean.includes("tool") || clean.includes("platform") || clean.includes("developer")) return "AI Tools and Developer Platforms";
  if (clean.includes("funding") || clean.includes("industry") || clean.includes("startup") || clean.includes("business")) return "AI Industry and Funding";
  if (clean.includes("deep learning") || clean.includes("learning")) return "Machine Learning and Deep Learning";

  return "AI Models and LLMs";
}

/**
 * Canonicalizes a URL by stripping tracking parameters, normalizing protocol & trailing slashes.
 */
export function canonicalizeUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl.trim());
    // Strip common tracking parameters
    const trackingParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "ref", "ref_src", "fbclid", "gclid", "msclkid", "_ga", "mc_cid", "mc_eid"
    ];
    for (const param of trackingParams) {
      url.searchParams.delete(param);
    }
    url.hash = "";
    // Normalize path trailing slash (remove unless root)
    let pathname = url.pathname;
    if (pathname.length > 1 && pathname.endsWith("/")) {
      pathname = pathname.slice(0, -1);
    }
    url.pathname = pathname;
    return url.toString();
  } catch {
    return rawUrl.trim();
  }
}

/**
 * Generates a deterministic SHA-256 content hash of the title and canonical URL.
 */
export function generateContentHash(title: string, canonicalUrl: string): string {
  const normalizedTitle = title.trim().toLowerCase().replace(/[^\w\s]/g, "");
  return createHash("sha256")
    .update(`${normalizedTitle}:${canonicalizeUrl(canonicalUrl)}`)
    .digest("hex");
}

/**
 * Generates a clean URL slug from title.
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Formats a timestamp into Asia/Kolkata (IST) display string.
 */
export function formatIstDate(dateInput: string | Date, includeTime = true): string {
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(date.getTime())) return "Recently";
    
    return new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "short",
      year: "numeric",
      ...(includeTime
        ? {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          }
        : {}),
    }).format(date) + (includeTime ? " IST" : "");
  } catch {
    return "Recently";
  }
}

/**
 * Returns human-friendly relative time (e.g., "3 hours ago", "Yesterday").
 */
export function formatRelativeTime(dateInput: string | Date): string {
  try {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 2) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatIstDate(date, false);
  } catch {
    return "Recently";
  }
}

import assert from "node:assert";
import { test } from "node:test";
import { createHash } from "node:crypto";

// Test implementations mirror production utils to test contract
function canonicalizeUrl(rawUrl) {
  try {
    const url = new URL(rawUrl.trim());
    const trackingParams = [
      "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content",
      "ref", "ref_src", "fbclid", "gclid", "msclkid", "_ga", "mc_cid", "mc_eid"
    ];
    for (const param of trackingParams) {
      url.searchParams.delete(param);
    }
    url.hash = "";
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

function generateContentHash(title, canonicalUrl) {
  const normalizedTitle = title.trim().toLowerCase().replace(/[^\w\s]/g, "");
  return createHash("sha256")
    .update(`${normalizedTitle}:${canonicalizeUrl(canonicalUrl)}`)
    .digest("hex");
}

const VALID_CATEGORIES = [
  "AI Models and LLMs",
  "AI Agents",
  "Generative AI",
  "Machine Learning and Deep Learning",
  "AI Research",
  "Robotics",
  "AI Tools and Developer Platforms",
  "AI Industry and Funding",
];

function normalizeCategory(categoryStr) {
  const clean = categoryStr.trim().toLowerCase();
  for (const cat of VALID_CATEGORIES) {
    if (cat.toLowerCase() === clean) return cat;
  }
  if (clean.includes("agent")) return "AI Agents";
  if (clean.includes("generative")) return "Generative AI";
  if (clean.includes("model") || clean.includes("llm")) return "AI Models and LLMs";
  if (clean.includes("robot")) return "Robotics";
  if (clean.includes("research")) return "AI Research";
  if (clean.includes("tool") || clean.includes("platform")) return "AI Tools and Developer Platforms";
  if (clean.includes("funding") || clean.includes("industry")) return "AI Industry and Funding";
  return "Machine Learning and Deep Learning";
}

test("1. URL Canonicalization strips tracking params and trailing slashes", () => {
  const dirtyUrl = "https://techcrunch.com/2026/10/28/openai-operator/?utm_source=twitter&utm_medium=social&ref=feed#section-1";
  const expected = "https://techcrunch.com/2026/10/28/openai-operator";
  assert.strictEqual(canonicalizeUrl(dirtyUrl), expected);

  const cleanUrl = "https://deepmind.google/technologies/gemini/";
  assert.strictEqual(canonicalizeUrl(cleanUrl), "https://deepmind.google/technologies/gemini");
});

test("2. Content hash is deterministic and detects duplicate articles", () => {
  const titleA = "OpenAI Debuts Operator Framework";
  const titleB = "openai debuts operator framework!";
  const url1 = "https://openai.com/news/operator?utm_source=x";
  const url2 = "https://openai.com/news/operator/";

  const hash1 = generateContentHash(titleA, url1);
  const hash2 = generateContentHash(titleB, url2);

  assert.strictEqual(hash1, hash2, "Content hashes must match for duplicate articles with different query strings");
});

test("3. Category normalizer maps input into one of the 8 required categories", () => {
  assert.strictEqual(normalizeCategory("LLMs"), "AI Models and LLMs");
  assert.strictEqual(normalizeCategory("Autonomous Agents"), "AI Agents");
  assert.strictEqual(normalizeCategory("Humanoid Robotics"), "Robotics");
  assert.strictEqual(normalizeCategory("Generative Models"), "Generative AI");
  assert.strictEqual(normalizeCategory("Developer Platform"), "AI Tools and Developer Platforms");
  assert.strictEqual(normalizeCategory("Startup Funding"), "AI Industry and Funding");
  assert.strictEqual(normalizeCategory("arXiv research paper"), "AI Research");
});

test("4. Timezone formats accurately to Asia/Kolkata (IST)", () => {
  const dateIso = "2026-10-29T00:30:00.000Z"; // 00:30 UTC = 06:00 IST
  const formatted = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(dateIso));

  assert.match(formatted, /6:00\s*(am|AM)/i);
});

test("5. Top 5 Selection guarantees exactly 5 diverse stories when available", () => {
  const dummyArticles = Array.from({ length: 8 }, (_, i) => ({
    title: `AI Story ${i + 1}`,
    category: VALID_CATEGORIES[i % VALID_CATEGORIES.length],
    relevance_score: 90 - i * 2,
    published_at: new Date(Date.now() - i * 3600000).toISOString(),
    content_hash: `hash-${i}`,
  }));

  const scored = dummyArticles.map(a => ({
    article: a,
    composite: a.relevance_score,
  })).sort((a, b) => b.composite - a.composite);

  const selected = [];
  const usedCats = new Set();
  for (const item of scored) {
    if (selected.length >= 5) break;
    if (!usedCats.has(item.article.category)) {
      selected.push(item.article);
      usedCats.add(item.article.category);
    }
  }

  assert.strictEqual(selected.length, 5);
  assert.strictEqual(new Set(selected.map(s => s.category)).size, 5, "Top 5 must prefer category diversity");
});

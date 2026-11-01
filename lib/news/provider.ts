import type { AiNewsArticle, AiNewsCategory } from "./types";
import { canonicalizeUrl, generateContentHash, normalizeCategory, slugify } from "./utils";

export interface AiNewsProvider {
  name: string;
  fetchDailyAiNews(options?: { hoursBack?: number }): Promise<AiNewsArticle[]>;
}

interface RawCandidateArticle {
  title: string;
  source_name: string;
  source_url: string;
  summary: string;
  why_it_matters: string;
  category: string;
  published_at?: string;
  relevance_score?: number;
}

export class GeminiSearchGroundingProvider implements AiNewsProvider {
  name = "Gemini with Google Search Grounding";

  private apiKey: string | null;
  private model: string;

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.model = process.env.GEMINI_MODEL || "gemini-3.5-flash-lite";
  }

  async fetchDailyAiNews(options: { hoursBack?: number } = {}): Promise<AiNewsArticle[]> {
    if (!this.apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }

    const hours = options.hoursBack || 24;
    const nowIso = new Date().toISOString();

    const systemPrompt = `You are an elite AI research engineer and technology journalist for YourDevelopers community.
Your mission: Discover, verify, filter, and summarize the most significant, factually true AI news stories published within the last ${hours} hours.

Target trusted primary sources:
- Official announcements: OpenAI, Google DeepMind, Anthropic, Meta AI, Microsoft, NVIDIA, xAI.
- Reputable tech outlets: TechCrunch, The Verge, Ars Technica, MIT Technology Review, VentureBeat, Reuters Tech.
- Lab publications / arXiv.

CRITICAL RULES:
1. NEVER invent or hallucinate headlines, dates, quotes, statistics, or URLs.
2. Every story MUST be grounded in real verifiable events from the search results.
3. Summary must be factual, balanced, and roughly 60-100 words.
4. "why_it_matters" must specifically explain why developers, AI engineers, or students care (architecture impact, developer API, tooling, deployment costs).
5. Categorize strictly as one of:
   - "AI Models and LLMs"
   - "AI Agents"
   - "Generative AI"
   - "Machine Learning and Deep Learning"
   - "AI Research"
   - "Robotics"
   - "AI Tools and Developer Platforms"
   - "AI Industry and Funding"
6. Return at least 6-8 candidate articles in JSON format so the top 5 can be selected.

JSON schema required:
[
  {
    "title": "string",
    "source_name": "string",
    "source_url": "valid absolute URL",
    "summary": "60-100 words factual summary",
    "why_it_matters": "string",
    "category": "one of the 8 categories",
    "published_at": "ISO 8601 timestamp string",
    "relevance_score": number between 70 and 100
  }
]`;

    const userPrompt = `Today's date and time is ${nowIso}.
Search for major breakthrough AI announcements, open-source model releases, developer tooling updates, and AI infrastructure news published in the past ${hours} hours.
Rank the most impactful stories for software developers and return valid JSON following the schema.`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

    const requestBody = {
      contents: [
        {
          role: "user",
          parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        },
      ],
      tools: [{ googleSearch: {} }],
      generationConfig: {
        temperature: 0.1,
        responseMimeType: "application/json",
      },
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000); // 45s timeout

    let rawResponse: Response;
    try {
      rawResponse = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
    } catch (err: unknown) {
      clearTimeout(timeout);
      const isAbort = (err as Error)?.name === "AbortError";
      throw new Error(isAbort ? "Gemini API request timed out after 45s." : `Gemini API network failure: ${(err as Error)?.message}`);
    } finally {
      clearTimeout(timeout);
    }

    if (!rawResponse.ok) {
      const errText = await rawResponse.text();
      throw new Error(`Gemini API returned HTTP ${rawResponse.status}: ${errText}`);
    }

    const responseJson = await rawResponse.json();
    const textOutput = responseJson?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textOutput) {
      throw new Error("Gemini returned empty content or missing search grounded output.");
    }

    let parsed: RawCandidateArticle[];
    try {
      // Strip potential markdown ```json wrappers if returned
      const cleanJson = textOutput.trim().replace(/^```json\s*/, "").replace(/\s*```$/, "");
      parsed = JSON.parse(cleanJson);
      if (!Array.isArray(parsed)) {
        throw new Error("Expected JSON array of articles");
      }
    } catch (err) {
      throw new Error(`Failed to parse Gemini JSON output: ${(err as Error)?.message}\nRaw: ${textOutput.slice(0, 300)}`);
    }

    const validArticles: AiNewsArticle[] = [];
    const seenHashes = new Set<string>();

    for (const item of parsed) {
      if (!item.title || !item.source_url || !item.summary) continue;

      const canonicalUrl = canonicalizeUrl(item.source_url);
      if (!canonicalUrl.startsWith("http")) continue;

      const hash = generateContentHash(item.title, canonicalUrl);
      if (seenHashes.has(hash)) continue;
      seenHashes.add(hash);

      const category: AiNewsCategory = normalizeCategory(item.category || "");
      let publishedAt = item.published_at;
      if (!publishedAt || isNaN(new Date(publishedAt).getTime())) {
        publishedAt = new Date().toISOString();
      }

      validArticles.push({
        id: `ai-news-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: item.title.trim(),
        slug: slugify(item.title),
        summary: item.summary.trim(),
        why_it_matters: (item.why_it_matters || "").trim(),
        source_name: (item.source_name || "Tech Source").trim(),
        source_url: canonicalUrl,
        image_url: null,
        category,
        published_at: publishedAt,
        fetched_at: new Date().toISOString(),
        relevance_score: Math.min(100, Math.max(50, Number(item.relevance_score) || 85)),
        is_featured: false,
        content_hash: hash,
        status: "published",
      });
    }

    return validArticles;
  }
}

/**
 * Provider factory for swappable AI news research backends.
 */
export function getAiNewsProvider(): AiNewsProvider {
  // Provider-agnostic factory. Easily swap to Grok or Anthropic if configured.
  return new GeminiSearchGroundingProvider();
}

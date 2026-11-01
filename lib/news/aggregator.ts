import { AiNewsRepository } from "./repository";
import { getAiNewsProvider, type AiNewsProvider } from "./provider";
import type { AiNewsArticle, AiNewsResponse } from "./types";
import { formatIstDate } from "./utils";

export class AiNewsAggregator {
  private provider: AiNewsProvider;

  constructor(provider?: AiNewsProvider) {
    this.provider = provider || getAiNewsProvider();
  }

  /**
   * Fetches the current daily news from repository.
   */
  async getDailyNews(): Promise<AiNewsResponse> {
    const articles = await AiNewsRepository.getActiveNews();
    const lastUpdatedIst = await AiNewsRepository.getLastUpdatedIst();
    return {
      articles,
      lastUpdatedIst,
      totalStories: articles.length,
    };
  }

  /**
   * Executes the full automated daily refresh pipeline.
   * - Acquires lock
   * - Gathers candidates (24h with 48h-72h fallback)
   * - Deduplicates and ranks top 5
   * - Persists results transactionally
   * - Retains previous set on failure
   */
  async refreshDailyNews(force = false): Promise<{
    success: boolean;
    message: string;
    articles: AiNewsArticle[];
    skipped?: boolean;
  }> {
    // 1. Check if already refreshed today in IST (unless force=true)
    if (!force) {
      const alreadyRefreshed = await AiNewsRepository.hasRefreshedTodayIst();
      if (alreadyRefreshed) {
        const existing = await AiNewsRepository.getActiveNews();
        return {
          success: true,
          message: "Daily news has already been updated for today in IST.",
          articles: existing,
          skipped: true,
        };
      }
    }

    // 2. Acquire lock
    const { lockId, acquired } = await AiNewsRepository.acquireRunLock();
    if (!acquired) {
      const existing = await AiNewsRepository.getActiveNews();
      return {
        success: false,
        message: "Another news refresh is currently in progress. Please wait.",
        articles: existing,
      };
    }

    let fetchedCandidates: AiNewsArticle[] = [];

    try {
      // 3. Try primary 24-hour window
      try {
        fetchedCandidates = await this.provider.fetchDailyAiNews({ hoursBack: 24 });
      } catch (err: unknown) {
        console.warn("[AiNewsAggregator] 24h search attempt had warning:", (err as Error)?.message);
      }

      // 4. Fallback: if fewer than 5 high-quality stories, expand to 48-72h window
      if (fetchedCandidates.length < 5) {
        console.info("[AiNewsAggregator] Fewer than 5 stories found in 24h; expanding window to 72h...");
        try {
          const fallbackCandidates = await this.provider.fetchDailyAiNews({ hoursBack: 72 });
          // Combine and deduplicate
          const combined = [...fetchedCandidates, ...fallbackCandidates];
          const seen = new Set<string>();
          fetchedCandidates = [];
          for (const item of combined) {
            if (!seen.has(item.content_hash)) {
              seen.add(item.content_hash);
              fetchedCandidates.push(item);
            }
          }
        } catch (err: unknown) {
          console.warn("[AiNewsAggregator] 72h fallback search failed:", (err as Error)?.message);
        }
      }

      // 5. If provider returned no articles (e.g. no API key configured or network down)
      if (fetchedCandidates.length === 0) {
        const previousSet = await AiNewsRepository.getActiveNews();
        await AiNewsRepository.releaseRunLock(
          lockId,
          "failed",
          0,
          previousSet.length,
          "No new candidate stories retrieved from provider. Retained previous successful set."
        );
        return {
          success: false,
          message: "Could not fetch new stories. Retained previous successful dataset.",
          articles: previousSet,
        };
      }

      // 6. Rank articles: Recency, Relevance Score, and Category Diversity
      const ranked = this.rankAndSelectTop5(fetchedCandidates);

      // 7. Save to repository
      await AiNewsRepository.saveArticles(ranked);

      // 8. Release lock
      await AiNewsRepository.releaseRunLock(
        lockId,
        "success",
        fetchedCandidates.length,
        ranked.length,
        undefined,
        {
          timestampIst: formatIstDate(new Date()),
          provider: this.provider.name,
        }
      );

      return {
        success: true,
        message: `Successfully published ${ranked.length} AI news stories for today.`,
        articles: ranked,
      };
    } catch (error: unknown) {
      const errMessage = (error as Error)?.message || "Unknown error occurred";
      console.error("[AiNewsAggregator] Refresh error:", error);
      
      const previousSet = await AiNewsRepository.getActiveNews();
      await AiNewsRepository.releaseRunLock(
        lockId,
        "failed",
        fetchedCandidates.length,
        previousSet.length,
        errMessage
      );

      return {
        success: false,
        message: `Refresh failed: ${errMessage}. Previous successful news set was retained.`,
        articles: previousSet,
      };
    }
  }

  /**
   * Ranks candidates by relevance score, recency, and ensures diversity across categories.
   */
  private rankAndSelectTop5(candidates: AiNewsArticle[]): AiNewsArticle[] {
    const scored = [...candidates].map(article => {
      const ageHours = (Date.now() - new Date(article.published_at).getTime()) / (1000 * 3600);
      // Recency decay: lose 1 point for every 4 hours old
      const recencyBonus = Math.max(0, 20 - ageHours * 0.25);
      const compositeScore = article.relevance_score + recencyBonus;
      return { article, compositeScore };
    });

    // Sort descending by composite score
    scored.sort((a, b) => b.compositeScore - a.compositeScore);

    // Pick top 5 with preference for diverse categories
    const selected: AiNewsArticle[] = [];
    const usedCategories = new Set<string>();

    // Pass 1: pick high-scoring unique categories
    for (const item of scored) {
      if (selected.length >= 5) break;
      if (!usedCategories.has(item.article.category)) {
        selected.push(item.article);
        usedCategories.add(item.article.category);
      }
    }

    // Pass 2: fill remaining slots up to 5 if needed
    for (const item of scored) {
      if (selected.length >= 5) break;
      if (!selected.some(s => s.content_hash === item.article.content_hash)) {
        selected.push(item.article);
      }
    }

    // Set first one as featured
    if (selected.length > 0) {
      selected[0].is_featured = true;
    }

    return selected.slice(0, 5);
  }
}

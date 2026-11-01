import fs from "fs";
import path from "path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { AiNewsArticle, AiNewsRunLog } from "./types";
import { INITIAL_SEED_ARTICLES } from "./seed";
import { formatIstDate } from "./utils";

const DATA_DIR = path.join(process.cwd(), "data");
const LOCAL_STORE_PATH = path.join(DATA_DIR, "ai_news.json");

interface LocalStoreData {
  lastUpdated: string;
  activeLock?: { id: string; expiresAt: number } | null;
  articles: AiNewsArticle[];
  runs: AiNewsRunLog[];
}

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    return createClient(url, key, {
      auth: { persistSession: false },
    });
  } catch (error) {
    console.warn("[AiNewsRepository] Failed to initialize Supabase client:", error);
    return null;
  }
}

function readLocalStore(): LocalStoreData {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      const content = fs.readFileSync(LOCAL_STORE_PATH, "utf-8");
      return JSON.parse(content) as LocalStoreData;
    }
  } catch (error) {
    console.error("[AiNewsRepository] Error reading local store:", error);
  }

  // Initial seed state
  return {
    lastUpdated: INITIAL_SEED_ARTICLES[0]?.published_at || "2026-10-29T02:00:00.000Z",
    activeLock: null,
    articles: INITIAL_SEED_ARTICLES,
    runs: [],
  };
}

function writeLocalStore(data: LocalStoreData): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error("[AiNewsRepository] Error writing local store:", error);
  }
}

export class AiNewsRepository {
  /**
   * Retrieves the current top 5 active AI news stories.
   */
  static async getActiveNews(): Promise<AiNewsArticle[]> {
    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { data, error } = await supabase
          .from("ai_news")
          .select("*")
          .eq("status", "published")
          .order("published_at", { ascending: false })
          .limit(5);

        if (!error && data && data.length > 0) {
          return data as AiNewsArticle[];
        }
      } catch (err) {
        console.warn("[AiNewsRepository] Supabase fetch failed, falling back to local store:", err);
      }
    }

    const localData = readLocalStore();
    return (localData.articles && localData.articles.length > 0)
      ? localData.articles.slice(0, 5)
      : INITIAL_SEED_ARTICLES;
  }

  /**
   * Saves newly verified articles and sets them as the current active set.
   */
  static async saveArticles(newArticles: AiNewsArticle[]): Promise<boolean> {
    if (!newArticles || newArticles.length === 0) return false;

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        // Upsert into Supabase
        const { error } = await supabase.from("ai_news").upsert(
          newArticles.map(a => ({
            ...a,
            status: "published",
            fetched_at: new Date().toISOString(),
          })),
          { onConflict: "content_hash" }
        );

        if (error) {
          console.error("[AiNewsRepository] Supabase upsert error:", error);
        }
      } catch (err) {
        console.error("[AiNewsRepository] Supabase save exception:", err);
      }
    }

    // Always update local store so local dev & fallback cache stays in sync
    const localData = readLocalStore();
    localData.lastUpdated = new Date().toISOString();
    localData.articles = newArticles;
    writeLocalStore(localData);
    return true;
  }

  /**
   * Checks if news has already been refreshed today in Asia/Kolkata (IST).
   */
  static async hasRefreshedTodayIst(): Promise<boolean> {
    const localData = readLocalStore();
    if (!localData.lastUpdated) return false;

    const lastDate = new Date(localData.lastUpdated);
    const now = new Date();

    // Compare date components in Asia/Kolkata timezone
    const lastIst = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "short" }).format(lastDate);
    const nowIst = new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "short" }).format(now);

    return lastIst === nowIst;
  }

  /**
   * Acquires a lock to prevent concurrent executions of the aggregator.
   * Locks automatically expire after 10 minutes to prevent deadlocks.
   */
  static async acquireRunLock(): Promise<{ lockId: string; acquired: boolean }> {
    const lockId = `lock-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const nowMs = Date.now();
    const LOCK_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

    const localData = readLocalStore();
    if (localData.activeLock && localData.activeLock.expiresAt > nowMs) {
      return { lockId: "", acquired: false };
    }

    localData.activeLock = {
      id: lockId,
      expiresAt: nowMs + LOCK_EXPIRATION_MS,
    };
    writeLocalStore(localData);
    return { lockId, acquired: true };
  }

  /**
   * Releases execution lock and records a run log.
   */
  static async releaseRunLock(
    lockId: string,
    status: "success" | "failed",
    storiesFetched: number,
    storiesPublished: number,
    errorMessage?: string,
    metadata?: Record<string, unknown>
  ): Promise<void> {
    const localData = readLocalStore();
    if (localData.activeLock?.id === lockId) {
      localData.activeLock = null;
    }

    const runLog: AiNewsRunLog = {
      id: `run-${Date.now()}`,
      status,
      started_at: new Date(Date.now() - 5000).toISOString(),
      completed_at: new Date().toISOString(),
      stories_fetched: storiesFetched,
      stories_published: storiesPublished,
      error_message: errorMessage,
      metadata,
    };

    localData.runs = [runLog, ...(localData.runs || []).slice(0, 30)];
    writeLocalStore(localData);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        await supabase.from("ai_news_runs").insert([runLog]);
      } catch (err) {
        console.warn("[AiNewsRepository] Failed to log run to Supabase:", err);
      }
    }
  }

  /**
   * Returns human-readable last updated string in IST.
   */
  static async getLastUpdatedIst(): Promise<string> {
    const localData = readLocalStore();
    return formatIstDate(localData.lastUpdated || INITIAL_SEED_ARTICLES[0]?.published_at || "2026-10-29T02:00:00.000Z");
  }
}

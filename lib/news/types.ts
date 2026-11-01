export type AiNewsCategory =
  | "AI Models and LLMs"
  | "AI Agents"
  | "Generative AI"
  | "Machine Learning and Deep Learning"
  | "AI Research"
  | "Robotics"
  | "AI Tools and Developer Platforms"
  | "AI Industry and Funding";

export interface AiNewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string; // 60-100 words factual summary
  why_it_matters: string; // Explanation for developers, engineers, students
  source_name: string; // e.g. "Google DeepMind", "OpenAI", "TechCrunch"
  source_url: string;
  image_url?: string | null;
  category: AiNewsCategory;
  published_at: string; // ISO 8601 string
  fetched_at: string; // ISO 8601 string
  relevance_score: number; // 0-100
  is_featured: boolean;
  content_hash: string; // SHA-256 of canonical url + title
  status: "published" | "archived";
}

export interface AiNewsRunLog {
  id: string;
  status: "running" | "success" | "failed";
  started_at: string;
  completed_at?: string;
  stories_fetched: number;
  stories_published: number;
  error_message?: string;
  metadata?: Record<string, unknown>;
}

export interface AiNewsResponse {
  articles: AiNewsArticle[];
  lastUpdatedIst: string;
  totalStories: number;
  isStaleFallback?: boolean;
}

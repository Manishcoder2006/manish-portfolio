-- Migration: Create AI News Aggregator tables, indexes, constraints, and RLS policies
-- Created: 2026-10-29

-- 1. Create ai_news table
CREATE TABLE IF NOT EXISTS public.ai_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    summary TEXT NOT NULL,
    why_it_matters TEXT NOT NULL,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    fetched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    relevance_score NUMERIC(5, 2) NOT NULL DEFAULT 80.00,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    content_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'published',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT ai_news_content_hash_unique UNIQUE (content_hash),
    CONSTRAINT ai_news_source_url_unique UNIQUE (source_url),
    CONSTRAINT ai_news_status_check CHECK (status IN ('published', 'archived', 'draft'))
);

-- 2. Create ai_news_runs table for execution logging and locking
CREATE TABLE IF NOT EXISTS public.ai_news_runs (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL CHECK (status IN ('running', 'success', 'failed')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    stories_fetched INTEGER NOT NULL DEFAULT 0,
    stories_published INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create Indexes for query performance
CREATE INDEX IF NOT EXISTS idx_ai_news_published_at ON public.ai_news (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_news_status_published ON public.ai_news (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_news_category ON public.ai_news (category);
CREATE INDEX IF NOT EXISTS idx_ai_news_is_featured ON public.ai_news (is_featured);
CREATE INDEX IF NOT EXISTS idx_ai_news_content_hash ON public.ai_news (content_hash);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.ai_news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_news_runs ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies for ai_news
-- Public read access to published news
CREATE POLICY "Allow public read access to published ai_news"
    ON public.ai_news
    FOR SELECT
    USING (status = 'published');

-- Service role full access
CREATE POLICY "Allow service role full access to ai_news"
    ON public.ai_news
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 6. RLS Policies for ai_news_runs
CREATE POLICY "Allow service role full access to ai_news_runs"
    ON public.ai_news_runs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 7. Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_ai_news_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_ai_news_updated_at ON public.ai_news;
CREATE TRIGGER trigger_ai_news_updated_at
    BEFORE UPDATE ON public.ai_news
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_ai_news_updated_at();

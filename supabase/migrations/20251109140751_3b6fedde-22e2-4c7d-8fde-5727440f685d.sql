-- Create short_urls table for URL shortening
CREATE TABLE public.short_urls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  short_code TEXT NOT NULL UNIQUE,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  full_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  click_count INTEGER NOT NULL DEFAULT 0
);

-- Create index on short_code for fast lookups
CREATE INDEX idx_short_urls_short_code ON public.short_urls(short_code);

-- Create index on article_id for lookups
CREATE INDEX idx_short_urls_article_id ON public.short_urls(article_id);

-- Enable Row Level Security
ALTER TABLE public.short_urls ENABLE ROW LEVEL SECURITY;

-- Allow public to read short URLs (needed for redirect)
CREATE POLICY "Public users can read short URLs"
ON public.short_urls
FOR SELECT
USING (true);

-- Allow authenticated users to insert short URLs
CREATE POLICY "Authenticated users can insert short URLs"
ON public.short_urls
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update click counts
CREATE POLICY "Authenticated users can update short URLs"
ON public.short_urls
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);
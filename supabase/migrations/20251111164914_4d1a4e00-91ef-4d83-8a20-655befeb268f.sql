-- Backfill aggregated counters on articles from existing engagement tables
-- Likes
UPDATE public.articles SET likes_count = 0;
UPDATE public.articles a
SET likes_count = c.cnt
FROM (
  SELECT article_id, COUNT(*)::int AS cnt
  FROM public.article_likes
  GROUP BY article_id
) c
WHERE c.article_id = a.id;

-- Views
UPDATE public.articles SET views_count = 0;
UPDATE public.articles a
SET views_count = c.cnt
FROM (
  SELECT article_id, COUNT(*)::bigint AS cnt
  FROM public.article_views
  GROUP BY article_id
) c
WHERE c.article_id = a.id;

-- Comments (approved only)
UPDATE public.articles SET comments_count = 0;
UPDATE public.articles a
SET comments_count = c.cnt
FROM (
  SELECT article_id, COUNT(*)::int AS cnt
  FROM public.article_comments
  WHERE status = 'approved'
  GROUP BY article_id
) c
WHERE c.article_id = a.id;
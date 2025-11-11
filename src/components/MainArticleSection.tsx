import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

const MainArticleSection = () => {
  const { data: mainArticle } = useQuery({
    queryKey: ["main-article"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          categories:primary_category_id(name, slug),
          videos(is_live)
        `)
        .eq("is_published", true)
        .eq("is_featured", true)
        .eq("is_top_story", false)
        .order("homepage_rank", { ascending: true })
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  if (!mainArticle) return null;

  const isLive = mainArticle.videos?.is_live;
  const categoryName = mainArticle.categories?.name;
  const categorySlug = mainArticle.categories?.slug;

  return (
    <section className="mb-10">
      <Link
        to={`/article/${mainArticle.slug}`}
        className="group block"
      >
        <article className="overflow-hidden rounded-lg bg-card transition-shadow hover:shadow-lg">
          <div className="grid gap-0 lg:grid-cols-2">
            {/* Image Section */}
            <div className="relative aspect-video overflow-hidden bg-muted">
              <img
                src={mainArticle.cover_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"}
                alt={mainArticle.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {isLive && (
                <div className="absolute top-3 left-3 bg-news-live px-3 py-1 text-xs font-bold text-white">
                  LIVE
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-center p-4 lg:p-6">
              {categoryName && (
                <div className="mb-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {categoryName}
                  </span>
                </div>
              )}
              
              <h2 className="mb-3 line-clamp-2 text-xl lg:text-2xl font-bold leading-tight transition-colors group-hover:text-primary">
                {mainArticle.title}
              </h2>
              
              {mainArticle.summary && (
                <p className="mb-3 text-sm lg:text-base text-muted-foreground line-clamp-2">
                  {mainArticle.summary}
                </p>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {mainArticle.published_at && (
                  <time>
                    {new Date(mainArticle.published_at).toLocaleDateString('he-IL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                )}
                {mainArticle.published_at && mainArticle.author && <span>·</span>}
                {mainArticle.author && (
                  <span>{mainArticle.author}</span>
                )}
              </div>
              
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                  {(mainArticle as any).likes_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                  {(mainArticle as any).comments_count || 0}
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                  {(mainArticle as any).views_count || 0}
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </section>
  );
};

export default MainArticleSection;
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { Skeleton } from "@/components/ui/skeleton";

const HeroSection = () => {
  const { data: featuredArticle, isLoading } = useQuery({
    queryKey: ["featured-article"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          categories:primary_category_id (name, slug),
          videos (is_live)
        `)
        .eq("is_published", true)
        .eq("is_top_story", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return null;

  if (!featuredArticle) return null;

  const timeAgo = featuredArticle.published_at
    ? formatDistanceToNow(new Date(featuredArticle.published_at), { addSuffix: true, locale: he })
    : "";

  return (
    <section className="mb-10">
      <Link to={`/news/${featuredArticle.slug}`} className="group">
        <div className="grid gap-6 overflow-hidden rounded-lg bg-card lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden bg-muted lg:order-2">
            {featuredArticle.cover_url ? (
              <img
                src={featuredArticle.cover_url}
                alt={featuredArticle.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="eager"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-6xl font-bold text-muted-foreground/20">TVGRAM</span>
              </div>
            )}
            {featuredArticle.videos?.is_live && (
              <div className="absolute top-4 left-4 bg-news-live px-3 py-1 text-sm font-bold text-white">
                LIVE
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-6 lg:order-1 lg:p-8">
            {featuredArticle.categories && (
              <div className="mb-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {featuredArticle.categories.name}
                </span>
              </div>
            )}
            
            <h1 className="mb-4 line-clamp-2 text-3xl font-bold leading-tight transition-colors group-hover:text-primary lg:text-4xl">
              {featuredArticle.title}
            </h1>
            
            {featuredArticle.summary && (
              <p className="mb-4 line-clamp-3 text-lg text-muted-foreground">
                {featuredArticle.summary}
              </p>
            )}
            
            <div className="flex items-center gap-4">
              {timeAgo && (
                <span className="text-sm text-muted-foreground">{timeAgo}</span>
              )}
              {featuredArticle.author && (
                <>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{featuredArticle.author}</span>
                </>
              )}
            </div>
            
            <div className="mt-6">
              <span className="inline-flex items-center font-semibold text-primary group-hover:underline">
                לכתבה המלאה ←
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default HeroSection;

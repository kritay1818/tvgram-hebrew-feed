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

  if (isLoading) {
    return (
      <section className="mb-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="aspect-video w-full" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </section>
    );
  }

  if (!featuredArticle) return null;

  const timeAgo = featuredArticle.published_at
    ? formatDistanceToNow(new Date(featuredArticle.published_at), { addSuffix: true, locale: he })
    : "";

  return (
    <section className="mb-8">
      <Link to={`/news/${featuredArticle.slug}`} className="group">
        <div className="grid gap-0 overflow-hidden rounded-lg border-2 border-primary/30 bg-card shadow-xl shadow-primary/10 lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-video overflow-hidden bg-muted lg:order-2">
            {featuredArticle.cover_url ? (
              <img
                src={featuredArticle.cover_url}
                alt={featuredArticle.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="eager"
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <span className="text-6xl font-bold text-primary/30">TVGRAM</span>
              </div>
            )}
            {featuredArticle.videos?.is_live && (
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-news-live px-4 py-2 text-sm font-bold text-white shadow-lg">
                <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
                LIVE
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center bg-gradient-to-br from-card to-secondary/20 p-8 lg:order-1 lg:p-10">
            {featuredArticle.categories && (
              <div className="mb-3">
                <span className="inline-block rounded-full bg-primary px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
                  {featuredArticle.categories.name}
                </span>
              </div>
            )}
            
            <h1 className="mb-4 line-clamp-3 text-3xl font-black leading-tight text-white transition-colors group-hover:text-primary lg:text-5xl">
              {featuredArticle.title}
            </h1>
            
            {featuredArticle.summary && (
              <p className="mb-6 line-clamp-3 text-lg leading-relaxed text-foreground/80">
                {featuredArticle.summary}
              </p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-foreground/60">
              {timeAgo && <span>{timeAgo}</span>}
              {featuredArticle.author && (
                <>
                  <span>·</span>
                  <span>{featuredArticle.author}</span>
                </>
              )}
            </div>
            
            <div className="mt-6">
              <span className="inline-flex items-center rounded-full bg-primary px-6 py-2 font-bold text-white transition-all group-hover:bg-primary/80 group-hover:shadow-lg">
                קרא עוד ←
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default HeroSection;

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
    <section className="mb-8">
      <Link 
        to={`/article/${mainArticle.slug}`}
        className="group block"
      >
        <article className="relative overflow-hidden rounded-lg shadow-xl transition-all hover:shadow-2xl" style={{
          background: 'linear-gradient(135deg, #0066cc 0%, #0099ff 100%)'
        }}>
          <div className="grid gap-0 lg:grid-cols-[45%_55%]">
            {/* Image Section */}
            <div className="relative aspect-[16/9] lg:aspect-auto overflow-hidden">
              <img
                src={mainArticle.cover_url || "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800"}
                alt={mainArticle.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {isLive && (
                <div className="absolute top-4 left-4 flex items-center gap-1.5 rounded bg-news-live px-3 py-1.5 text-sm font-bold text-white">
                  <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-white"></span>
                  LIVE
                </div>
              )}
            </div>

            {/* Content Section - White text on blue gradient */}
            <div className="flex flex-col justify-center p-8 lg:p-12 text-white">
              {categoryName && (
                <Badge 
                  variant="outline" 
                  className="mb-4 w-fit text-xs font-semibold border-white/30 bg-white/10 text-white hover:bg-white/20"
                >
                  {categoryName}
                </Badge>
              )}
              
              <h2 className="mb-4 text-3xl font-bold leading-tight text-white lg:text-4xl drop-shadow-sm">
                {mainArticle.title}
              </h2>
              
              {mainArticle.summary && (
                <p className="mb-6 text-lg text-white/90 line-clamp-3">
                  {mainArticle.summary}
                </p>
              )}

              <div className="flex items-center gap-4 text-sm text-white/80">
                {mainArticle.author && (
                  <span className="font-medium">{mainArticle.author}</span>
                )}
                {mainArticle.published_at && (
                  <time>
                    {new Date(mainArticle.published_at).toLocaleDateString('he-IL', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                )}
              </div>
            </div>
          </div>
        </article>
      </Link>
    </section>
  );
};

export default MainArticleSection;
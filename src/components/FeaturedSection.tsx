import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import StandardArticleCard from "./StandardArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedSection = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["featured-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          categories:primary_category_id (name, slug),
          videos (is_live)
        `)
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("published_at", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <Skeleton className="mb-4 h-8 w-32" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video" />
          ))}
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight">
        מומלצים
      </h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <StandardArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            summary={article.summary || undefined}
            coverUrl={article.cover_url || undefined}
            slug={article.slug}
            isLive={article.videos?.is_live}
            publishedAt={article.published_at || undefined}
            author={article.author || undefined}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedSection;

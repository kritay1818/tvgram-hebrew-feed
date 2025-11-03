import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import StandardArticleCard from "./StandardArticleCard";
import { Skeleton } from "@/components/ui/skeleton";

const LatestNews = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["latest-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          categories:primary_category_id (name, slug),
          videos (is_live)
        `)
        .eq("is_published", true)
        .eq("is_top_story", false)
        .eq("is_featured", false)
        .order("published_at", { ascending: false })
        .limit(12);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video" />
          ))}
        </div>
      </section>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight">
          חדשות אחרונות
        </h2>
        <p className="text-muted-foreground">אין חדשות זמינות כרגע</p>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight">
        חדשות אחרונות
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

export default LatestNews;

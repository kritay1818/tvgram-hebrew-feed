import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ArticleCard from "./ArticleCard";

const FeaturedArticles = () => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["featured-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          primary_category:categories!articles_primary_category_id_fkey(name, slug)
        `)
        .eq("is_published", true)
        .eq("is_featured", true)
        .order("homepage_rank", { ascending: true })
        .order("published_at", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !articles || articles.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-bold">כתבות מומלצות</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            summary={article.summary || undefined}
            coverUrl={article.cover_url || undefined}
            slug={article.slug}
            category={article.primary_category?.name}
          />
        ))}
      </div>
    </section>
  );
};

export default FeaturedArticles;

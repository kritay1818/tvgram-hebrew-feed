import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import LargeArticleCard from "./LargeArticleCard";
import StandardArticleCard from "./StandardArticleCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface CategorySectionGridProps {
  categorySlug: string;
  limit?: number;
}

const CategorySectionGrid = ({ categorySlug, limit = 7 }: CategorySectionGridProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["category-articles-grid", categorySlug, limit],
    queryFn: async () => {
      const { data: category } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("slug", categorySlug)
        .single();

      if (!category) return null;

      const { data: articles, error } = await supabase
        .from("articles")
        .select(`
          *,
          videos (is_live)
        `)
        .eq("primary_category_id", category.id)
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return { category, articles };
    },
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3]" />
          ))}
        </div>
      </section>
    );
  }

  if (!data || !data.articles || data.articles.length === 0) return null;

  const { category, articles } = data;
  const [firstArticle, ...restArticles] = articles;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold uppercase tracking-tight">
          {category.name}
        </h2>
        <Link to={`/category/${category.slug}`}>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
            ראה עוד ←
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Large featured card */}
        {firstArticle && (
          <div className="md:col-span-2 lg:col-span-1">
            <LargeArticleCard
              id={firstArticle.id}
              title={firstArticle.title}
              summary={firstArticle.summary || undefined}
              coverUrl={firstArticle.cover_url || undefined}
              slug={firstArticle.slug}
              categoryName={category.name}
              isLive={firstArticle.videos?.is_live}
              publishedAt={firstArticle.published_at || undefined}
              author={firstArticle.author || undefined}
            />
          </div>
        )}
        
        {/* Standard cards */}
        {restArticles.slice(0, 6).map((article) => (
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

export default CategorySectionGrid;

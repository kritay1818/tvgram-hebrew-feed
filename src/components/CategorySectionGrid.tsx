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
        .order("homepage_rank", { ascending: true, nullsFirst: false })
        .order("published_at", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return { category, articles };
    },
  });

  if (isLoading) return null;

  if (!data || !data.articles || data.articles.length === 0) return null;

  const { category, articles } = data;
  const [firstArticle, ...restArticles] = articles;

  return (
    <section id={`category-${category.slug}`} className="mb-12 scroll-mt-20">
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="bg-news-live px-4 py-2 w-full md:w-auto flex justify-center md:justify-start">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white">
            {category.name}
          </h2>
        </div>
        <Link to={`/category/${category.slug}`}>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
            ראה עוד ←
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {/* All articles use StandardArticleCard for consistency */}
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

export default CategorySectionGrid;

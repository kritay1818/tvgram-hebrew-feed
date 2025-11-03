import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ArticleCard from "./ArticleCard";
import { Link } from "react-router-dom";

interface CategorySectionProps {
  categorySlug: string;
  categoryName: string;
  limit?: number;
}

const CategorySection = ({ categorySlug, categoryName, limit = 3 }: CategorySectionProps) => {
  const { data: articles, isLoading } = useQuery({
    queryKey: ["category-articles", categorySlug],
    queryFn: async () => {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", categorySlug)
        .single();

      if (!category) return [];

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          primary_category:categories!articles_primary_category_id_fkey(name, slug)
        `)
        .eq("primary_category_id", category.id)
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading || !articles || articles.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-news-category">{categoryName}</h2>
        <Link 
          to={`/category/${categorySlug}`}
          className="text-sm font-medium text-primary hover:underline"
        >
          כל הכתבות →
        </Link>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
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

export default CategorySection;

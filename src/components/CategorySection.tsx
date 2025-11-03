import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import ArticleRow from "./ArticleRow";

interface CategorySectionProps {
  categorySlug: string;
  categoryName: string;
  limit?: number;
}

const CategorySection = ({ categorySlug, categoryName, limit = 4 }: CategorySectionProps) => {
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
        .select("*")
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
    <section className="mb-6">
      <div className="mb-3 bg-primary px-4 py-2">
        <h2 className="text-xl font-bold text-primary-foreground">{categoryName}</h2>
      </div>
      
      <div className="space-y-4 bg-card p-4">
        {articles.map((article) => (
          <ArticleRow
            key={article.id}
            article={{
              id: article.id,
              title: article.title,
              summary: article.summary || undefined,
              cover_url: article.cover_url || undefined,
              slug: article.slug,
            }}
          />
        ))}
      </div>
    </section>
  );
};

export default CategorySection;

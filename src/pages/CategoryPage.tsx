import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";
import CategoryNav from "@/components/CategoryNav";

const CategoryPage = () => {
  const { slug } = useParams();

  const { data: category } = useQuery({
    queryKey: ["category", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["nav-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_in_nav", true)
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const { data: articles, isLoading } = useQuery({
    queryKey: ["category-articles-full", slug],
    queryFn: async () => {
      const { data: cat } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", slug)
        .single();

      if (!cat) return [];

      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          primary_category:categories!articles_primary_category_id_fkey(name, slug)
        `)
        .eq("primary_category_id", cat.id)
        .eq("is_published", true)
        .order("homepage_rank", { ascending: true, nullsFirst: false })
        .order("published_at", { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          {/* Mobile Category Navigation */}
          <CategoryNav categories={categories} />
          
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-news-category">
              {slug === 'online' ? 'חדשות ברשת' : slug === 'recommended' ? 'מומלצים' : category?.name || slug}
            </h1>
            {category?.description && (
              <p className="mt-2 text-muted-foreground">
                {category.description}
              </p>
            )}
          </div>
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <div className="mt-2 h-4 bg-muted"></div>
                <div className="mt-2 h-4 w-2/3 bg-muted"></div>
              </div>
            ))}
          </div>
        ) : articles && articles.length > 0 ? (
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
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">אין כתבות בקטגוריה זו</p>
          </div>
        )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;

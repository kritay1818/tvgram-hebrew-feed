import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { format } from "date-fns";
import { he } from "date-fns/locale";

const ArticlePage = () => {
  const { slug } = useParams();

  const { data: article, isLoading } = useQuery({
    queryKey: ["article", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select(`
          *,
          primary_category:categories!articles_primary_category_id_fkey(name, slug),
          video:videos(*)
        `)
        .eq("slug", slug)
        .single();
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-3/4 bg-muted"></div>
            <div className="aspect-video bg-muted"></div>
          </div>
        </main>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold">הכתבה לא נמצאה</h1>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <article className="container py-8">
        <div className="mx-auto max-w-4xl">
          {article.primary_category && (
            <div className="mb-4">
              <span className="inline-block bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                {article.primary_category.name}
              </span>
            </div>
          )}
          
          <h1 className="mb-4 text-4xl font-bold leading-tight">
            {article.title}
          </h1>
          
          {article.summary && (
            <p className="mb-6 text-xl text-muted-foreground">
              {article.summary}
            </p>
          )}
          
          <div className="mb-6 flex items-center gap-4 text-sm text-muted-foreground">
            {article.author && <span>מאת: {article.author}</span>}
            {article.published_at && (
              <span>
                {format(new Date(article.published_at), "d MMMM yyyy, HH:mm", { locale: he })}
              </span>
            )}
          </div>
          
          {article.cover_url && (
            <div className="mb-8 overflow-hidden rounded-lg">
              <img
                src={article.cover_url}
                alt={article.title}
                className="h-auto w-full max-h-[350px] object-cover"
              />
            </div>
          )}
          
          {article.video && article.video.video_url && (
            <div className="mb-8 aspect-video overflow-hidden rounded-lg bg-black">
              <iframe
                src={article.video.video_url}
                className="h-full w-full"
                allowFullScreen
                title={article.title}
              />
            </div>
          )}
          
          {article.body_html && (
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: article.body_html }}
            />
          )}
          
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default ArticlePage;

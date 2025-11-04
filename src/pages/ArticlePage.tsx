import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import AdBanner from "@/components/AdBanner";
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
        .eq("is_published", true)
        .maybeSingle();
      
      if (error) throw error;
      return data;
    },
  });

  const { data: relatedArticles } = useQuery({
    queryKey: ["related-articles", article?.primary_category_id, article?.id],
    queryFn: async () => {
      if (!article?.primary_category_id || !article?.id) return [];
      
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, slug, cover_url, published_at")
        .eq("primary_category_id", article.primary_category_id)
        .eq("is_published", true)
        .neq("id", article.id)
        .order("published_at", { ascending: false })
        .limit(6);
      
      if (error) throw error;
      return data;
    },
    enabled: !!article?.primary_category_id && !!article?.id,
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
          {/* Ad at the top */}
          <AdBanner size="leaderboard" className="mb-6" />
          
          {article.primary_category && (
            <nav className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <a href="/" className="hover:text-primary">ראשי</a>
              <span>/</span>
              <a href={`/category/${article.primary_category.slug}`} className="hover:text-primary">
                {article.primary_category.name}
              </a>
            </nav>
          )}
          
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
          
          {/* Ad below the picture */}
          <AdBanner size="leaderboard" className="my-8" />
          
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
              className="prose prose-lg max-w-none dark:prose-invert"
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
          
          {/* Ad at the bottom */}
          <AdBanner size="leaderboard" className="my-8" />
          
          <ShareButtons title={article.title} />
        </div>
        
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="container mt-12">
            <h2 className="mb-6 text-2xl font-bold">כתבות קשורות</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <a
                  key={related.id}
                  href={`/news/${related.slug}`}
                  className="group block overflow-hidden rounded-lg bg-card transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-video overflow-hidden bg-muted">
                    {related.cover_url ? (
                      <img
                        src={related.cover_url}
                        alt={related.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-2xl font-bold text-muted-foreground/20">TVGRAM</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="line-clamp-2 font-bold group-hover:text-primary">
                      {related.title}
                    </h3>
                    {related.published_at && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {format(new Date(related.published_at), "d MMM yyyy", { locale: he })}
                      </p>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </article>
      
      <Footer />
    </div>
  );
};

export default ArticlePage;

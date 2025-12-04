import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShareButtons from "@/components/ShareButtons";
import MgidWidget from "@/components/MgidWidget";
import MgidMainWidget from "@/components/MgidMainWidget";
import MgidSidebarWidget from "@/components/MgidSidebarWidget";
import VideoSidebar from "@/components/VideoSidebar";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { getAnonSessionId } from "@/lib/session";
import { Heart, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

const ArticlePage = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const sessionId = getAnonSessionId();
  
  const [commentAuthor, setCommentAuthor] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [likeDelta, setLikeDelta] = useState(0);
  const [viewDelta, setViewDelta] = useState(0);

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
      return data as any;
    },
  });

  // Check if user already liked this article
  const { data: userLike } = useQuery({
    queryKey: ["article-like", article?.id, sessionId],
    queryFn: async () => {
      if (!article?.id) return null;
      
      const { data } = await supabase
        .from("article_likes" as any)
        .select("id")
        .eq("article_id", article.id)
        .eq("session_id", sessionId)
        .maybeSingle();
      
      return data;
    },
    enabled: !!article?.id,
  });

  // Fetch approved comments
  const { data: comments } = useQuery({
    queryKey: ["article-comments", article?.id],
    queryFn: async () => {
      if (!article?.id) return [];
      
      const { data, error } = await supabase
        .from("article_comments" as any)
        .select("id, author_name, content, created_at")
        .eq("article_id", article.id)
        .order("created_at", { ascending: true });
      
      if (error) throw error;
      return data as any[];
    },
    enabled: !!article?.id,
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

  // Track article view
  useEffect(() => {
    if (!article?.id) return;
    
    const trackView = async () => {
      try {
        const { error } = await supabase
          .from("article_views" as any)
          .insert({ article_id: article.id, session_id: sessionId });
        if (!error) {
          setViewDelta(1);
        }
      } catch (error) {
        console.log("View already tracked");
      } finally {
        queryClient.invalidateQueries({ queryKey: ["article", slug] });
      }
    };
    
    trackView();
  }, [article?.id, sessionId, slug, queryClient]);

  // Like/Unlike mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      if (!article?.id) return;
      
      if (userLike) {
        // Unlike
        await supabase
          .from("article_likes" as any)
          .delete()
          .eq("article_id", article.id)
          .eq("session_id", sessionId);
      } else {
        // Like
        await supabase
          .from("article_likes" as any)
          .insert({ article_id: article.id, session_id: sessionId });
      }
    },
    onSuccess: async () => {
      setLikeDelta((d) => (userLike ? Math.max(0, d - 1) : d + 1));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["article-like", article?.id, sessionId] }),
        queryClient.invalidateQueries({ queryKey: ["article", slug] }),
      ]);
      // Reset local delta after refetch settles
      setTimeout(() => setLikeDelta(0), 400);
    },
  });

  // Comment submission mutation
  const commentMutation = useMutation({
    mutationFn: async () => {
      if (!article?.id || !commentContent.trim()) return;
      
      await supabase
        .from("article_comments" as any)
        .insert({
          article_id: article.id,
          author_name: commentAuthor.trim() || null,
          content: commentContent.trim(),
          status: "approved",
        });
    },
    onSuccess: async () => {
      toast({
        title: "תגובה נשלחה",
        description: "התגובה שלך פורסמה",
      });
      setCommentAuthor("");
      setCommentContent("");
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["article-comments", article?.id] }),
        queryClient.invalidateQueries({ queryKey: ["article", slug] }),
      ]);
    },
    onError: () => {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בשליחת התגובה. אנא נסה שנית",
        variant: "destructive",
      });
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
    <div className="min-h-screen bg-background relative">
      <MgidSidebarWidget />
      <div className="hidden md:block">
        <VideoSidebar />
      </div>
      <Header />
      
      <article className="py-8 md:pl-56">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
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
          
          <h1 className="mb-4 text-4xl font-bold leading-tight text-foreground">
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
                src={`${article.cover_url}${article.cover_url.includes('?') ? '&' : '?'}width=900&height=600&resize=cover`}
                alt={article.title}
                className="h-auto w-full max-h-[350px] object-cover"
                loading="eager"
                fetchPriority="high"
                width="900"
                height="600"
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
              className="prose prose-lg max-w-none text-foreground dark:prose-invert [&_h1]:text-foreground [&_h2]:text-foreground [&_h3]:text-foreground [&_h4]:text-foreground [&_h5]:text-foreground [&_h6]:text-foreground [&_p]:text-foreground [&_li]:text-foreground [&_strong]:text-foreground [&_em]:text-foreground [&_span]:text-foreground"
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

          {/* Engagement Stats & Like Button */}
          <div className="mt-8 flex items-center gap-6 border-y border-border py-4">
            <Button
              variant={userLike ? "default" : "outline"}
              size="sm"
              onClick={() => likeMutation.mutate()}
              disabled={likeMutation.isPending}
              className="gap-2 text-foreground"
            >
              <Heart className={userLike ? "fill-current" : ""} size={18} />
              <span>{(article.likes_count || 0) + likeDelta}</span>
            </Button>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle size={18} />
              <span>{article.comments_count || 0}</span>
            </div>
            
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye size={18} />
              <span>{(article.views_count || 0) + viewDelta}</span>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <h2 className="mb-6 text-2xl font-bold">תגובות ({comments?.length || 0})</h2>
            
            {/* Comment Form */}
            <div className="mb-8 rounded-lg border border-border bg-card p-6">
              <h3 className="mb-4 text-lg font-semibold">הוסף תגובה</h3>
              <div className="space-y-4">
                <Input
                  placeholder="שם (אופציונלי)"
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                />
                <Textarea
                  placeholder="תוכן התגובה"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  rows={4}
                />
                <Button
                  onClick={() => commentMutation.mutate()}
                  disabled={!commentContent.trim() || commentMutation.isPending}
                >
                  {commentMutation.isPending ? "שולח..." : "שלח תגובה"}
                </Button>
              </div>
            </div>
            
            {/* Comments List */}
            {comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="rounded-lg border border-border bg-card p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-semibold">
                        {comment.author_name || "אנונימי"}
                      </span>
                      <span>•</span>
                      <span>
                        {format(new Date(comment.created_at), "d MMMM yyyy, HH:mm", { locale: he })}
                      </span>
                    </div>
                    <p className="text-foreground">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">אין תגובות עדיין. היה הראשון להגיב!</p>
            )}
          </div>
          
          <ShareButtons title={article.title} articleSlug={article.slug} />
          
          
          {/* MGID Widget */}
          <MgidWidget />
        </div>
        
        {relatedArticles && relatedArticles.length > 0 && (
          <div className="mx-auto mt-12 max-w-6xl px-4 md:px-6">
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
                    <h3 className="line-clamp-2 font-bold text-foreground group-hover:text-primary">
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
      
      {/* MGID Widget at bottom of page */}
      <div className="mx-auto max-w-4xl px-4 md:px-6">
        <MgidMainWidget />
      </div>
      
      <Footer />
    </div>
  );
};

export default ArticlePage;

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HomePoll from "@/components/HomePoll";
import MainArticleSection from "@/components/MainArticleSection";
import CategorySectionGrid from "@/components/CategorySectionGrid";
import CategoryNav from "@/components/CategoryNav";

// Lazy load non-critical components to reduce main-thread work
const MgidWidget = lazy(() => import("@/components/MgidWidget"));
const MgidSidebarWidget = lazy(() => import("@/components/MgidSidebarWidget"));
const MgidMainWidget = lazy(() => import("@/components/MgidMainWidget"));
const VideoSidebar = lazy(() => import("@/components/VideoSidebar"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  const location = useLocation();
  
  // Handle scroll to section after navigation
  useEffect(() => {
    const state = location.state as { scrollTo?: string };
    if (state?.scrollTo) {
      // Small delay to ensure content is rendered
      setTimeout(() => {
        const element = document.getElementById(state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location]);
  // Single coordinated query for all homepage data
  const { data: homepageData, isLoading, error } = useQuery({
    queryKey: ["homepage-data"],
    queryFn: async () => {
      // Fetch categories
      const { data: categories, error: categoriesError } = await supabase
        .from("categories")
        .select("*")
        .eq("is_in_nav", true)
        .order("order_index", { ascending: true });
      
      if (categoriesError) throw categoriesError;

      // Fetch hero article (top story)
      const { data: heroArticle, error: heroError } = await supabase
        .from("articles")
        .select("*, categories(name, slug), videos(is_live)")
        .eq("is_published", true)
        .eq("is_top_story", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (heroError) console.error("Hero article error:", heroError);

      // Fetch main featured article
      const { data: mainArticle, error: mainError } = await supabase
        .from("articles")
        .select("*, categories(name, slug), videos(is_live)")
        .eq("is_published", true)
        .eq("is_featured", true)
        .eq("is_top_story", false)
        .order("homepage_rank", { ascending: true, nullsFirst: false })
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (mainError) console.error("Main article error:", mainError);

      // Fetch homepage poll
      const { data: homepagePoll } = await supabase
        .from("category_polls")
        .select(`
          *,
          category_poll_options (
            id,
            option_text,
            order_index
          )
        `)
        .is("category_id", null)
        .eq("is_active", true)
        .gt("ends_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      // Fetch articles for all categories (3 per category)
      const categoryArticlesPromises = categories.map(async (category) => {
        const { data } = await supabase
          .from("articles")
          .select("*, videos(is_live)")
          .eq("primary_category_id", category.id)
          .eq("is_published", true)
          .order("homepage_rank", { ascending: true, nullsFirst: false })
          .order("published_at", { ascending: false })
          .limit(3);
        
        return { categoryId: category.id, articles: data || [] };
      });

      const categoryArticles = await Promise.all(categoryArticlesPromises);
      const articlesByCategory = Object.fromEntries(
        categoryArticles.map(({ categoryId, articles }) => [categoryId, articles])
      );

      return {
        categories: categories || [],
        heroArticle: heroArticle || null,
        mainArticle: mainArticle || null,
        homepagePoll: homepagePoll || null,
        articlesByCategory,
      };
    },
  });

  console.log("Query state - isLoading:", isLoading, "error:", error, "data:", homepageData);
  if (error) {
    console.error("Homepage query error:", error);
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-destructive mb-2">Error loading homepage</p>
        <p className="text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>;
  }

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!homepageData) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground">No content available</p>
    </div>;
  }

  const { categories, heroArticle, mainArticle, homepagePoll, articlesByCategory } = homepageData;

  return <div className="min-h-screen bg-background relative">
      <Header />
      <Suspense fallback={<div />}>
        <div className="hidden md:block">
          <VideoSidebar />
        </div>
        
        {/* MGID Sidebar Widget - Right side dead area */}
        <MgidSidebarWidget />
      </Suspense>
      
      <main className="w-full py-8 md:pl-56">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          {/* Mobile Category Navigation */}
          <CategoryNav categories={categories} />
          
          {/* Hero Featured Article */}
          {heroArticle && <HeroSection article={heroArticle} />}
          
          {/* Homepage Poll */}
          {homepagePoll && <HomePoll poll={homepagePoll} />}
          
          {/* Main Featured Article */}
          {mainArticle && <MainArticleSection article={mainArticle} />}
          
          {/* MGID Main Widget */}
          <Suspense fallback={<div className="my-8" />}>
            <MgidMainWidget />
          </Suspense>
          
          {/* Dynamic category sections */}
          {categories?.map((category, index) => <div key={category.id}>
              <CategorySectionGrid 
                category={category} 
                articles={articlesByCategory[category.id] || []}
              />
              {/* MGID Widget after every 3 sections */}
              {index % 3 === 2 && (
                <Suspense fallback={<div className="my-8" />}>
                  <MgidWidget />
                </Suspense>
              )}
            </div>)}
        </div>
      </main>
      
      <Suspense fallback={<div />}>
        <Footer />
      </Suspense>
    </div>;
};
export default Index;
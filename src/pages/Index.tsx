import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HomePoll from "@/components/HomePoll";
import MainArticleSection from "@/components/MainArticleSection";
import CategoryNav from "@/components/CategoryNav";
import LazyCategory from "@/components/LazyCategory";
import HeroSkeleton from "@/components/skeletons/HeroSkeleton";
import ArticleSkeleton from "@/components/skeletons/ArticleSkeleton";
import PollSkeleton from "@/components/skeletons/PollSkeleton";

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
  // Load categories immediately
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await supabase
        .from("categories")
        .select("*")
        .eq("is_in_nav", true)
        .order("order_index", { ascending: true });
      return data || [];
    },
  });

  // Load hero article independently
  const { data: heroArticle, isLoading: heroLoading } = useQuery({
    queryKey: ["hero-article"],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("*, categories!articles_primary_category_id_fkey(name, slug), videos(is_live)")
        .eq("is_published", true)
        .eq("is_top_story", true)
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  // Load main article independently
  const { data: mainArticle, isLoading: mainLoading } = useQuery({
    queryKey: ["main-article"],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("*, categories!articles_primary_category_id_fkey(name, slug), videos(is_live)")
        .eq("is_published", true)
        .eq("is_featured", true)
        .eq("is_top_story", false)
        .order("homepage_rank", { ascending: true, nullsFirst: false })
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  // Load poll independently
  const { data: homepagePoll, isLoading: pollLoading } = useQuery({
    queryKey: ["homepage-poll"],
    queryFn: async () => {
      const { data } = await supabase
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
      return data;
    },
  });

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
          <CategoryNav categories={categories || []} />
          
          {/* Hero Featured Article */}
          {heroLoading ? <HeroSkeleton /> : heroArticle && <HeroSection article={heroArticle} />}
          
          {/* Homepage Poll */}
          {pollLoading ? <PollSkeleton /> : homepagePoll && <HomePoll poll={homepagePoll} />}
          
          {/* Main Featured Article */}
          {mainLoading ? <ArticleSkeleton /> : mainArticle && <MainArticleSection article={mainArticle} />}
          
          {/* MGID Main Widget */}
          <Suspense fallback={<div className="my-8" />}>
            <MgidMainWidget />
          </Suspense>
          
          {/* Dynamic category sections - lazy loaded */}
          {categories?.map((category, index) => (
            <div key={category.id}>
              <LazyCategory category={category} index={index} />
              {/* MGID Widget after every 3 sections */}
              {index % 3 === 2 && (
                <Suspense fallback={<div className="my-8" />}>
                  <MgidWidget />
                </Suspense>
              )}
            </div>
          ))}
        </div>
      </main>
      
      <Suspense fallback={<div />}>
        <Footer />
      </Suspense>
    </div>;
};
export default Index;
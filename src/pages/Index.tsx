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
  // Fetch all categories in navigation order
  const {
    data: categories
  } = useQuery({
    queryKey: ["nav-categories"],
    queryFn: async () => {
      const {
        data,
        error
      } = await supabase.from("categories").select("*").eq("is_in_nav", true).order("order_index", {
        ascending: true
      });
      if (error) throw error;
      return data;
    }
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
          <CategoryNav categories={categories} />
          
          {/* Hero Featured Article */}
          <HeroSection />
          
          {/* Homepage Poll */}
          <HomePoll />
          
          {/* Main Featured Article */}
          <MainArticleSection />
          
          {/* MGID Main Widget */}
          <Suspense fallback={<div className="my-8" />}>
            <MgidMainWidget />
          </Suspense>
          
          {/* Dynamic category sections */}
          {categories?.map((category, index) => <div key={category.id}>
              <CategorySectionGrid categorySlug={category.slug} limit={3} />
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
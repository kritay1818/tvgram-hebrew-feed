import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MainArticleSection from "@/components/MainArticleSection";
import CategorySectionGrid from "@/components/CategorySectionGrid";
import MgidWidget from "@/components/MgidWidget";
import MgidSidebarWidget from "@/components/MgidSidebarWidget";
import VideoSidebar from "@/components/VideoSidebar";
import Footer from "@/components/Footer";
import CategoryNav from "@/components/CategoryNav";

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
  return <div className="min-h-screen bg-background">
      <Header />
      <div className="hidden md:block">
        <VideoSidebar />
      </div>
      
      {/* MGID Sidebar Widget - Between sidebar and content */}
      <div className="hidden md:block fixed left-56 top-24 w-64 z-10">
        <MgidSidebarWidget />
      </div>
      
      <main className="w-full py-8 md:pl-56 md:pr-64">
        <div className="mx-auto max-w-4xl px-4 md:px-6">
          {/* Mobile Category Navigation */}
          <CategoryNav categories={categories} />
          
          {/* Hero Featured Article */}
          <HeroSection />
          
          {/* Main Featured Article */}
          <MainArticleSection />
          
          {/* Dynamic category sections */}
          {categories?.map((category, index) => <div key={category.id}>
              <CategorySectionGrid categorySlug={category.slug} limit={7} />
              {/* MGID Widget after every 3 sections */}
              {index % 3 === 2 && <MgidWidget />}
            </div>)}
        </div>
      </main>
      
      <Footer />
    </div>;
};
export default Index;
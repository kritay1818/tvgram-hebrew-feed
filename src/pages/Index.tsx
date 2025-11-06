import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import MainArticleSection from "@/components/MainArticleSection";
import CategorySectionGrid from "@/components/CategorySectionGrid";
import AdBanner from "@/components/AdBanner";
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
      
      <main className="w-full py-8 md:pl-56 px-4 md:px-6">
        {/* Mobile Category Navigation */}
        <CategoryNav categories={categories} />
        
        {/* Hero Featured Article */}
        <HeroSection />
        
        {/* Ad after hero */}
        <AdBanner size="leaderboard" className="mx-[5px] mb-6 px-0" />
        
        {/* Main Featured Article */}
        <MainArticleSection />
        
        {/* Dynamic category sections */}
        {categories?.map((category, index) => <div key={category.id}>
            <CategorySectionGrid categorySlug={category.slug} limit={7} />
            {/* Ad between every 2 sections */}
            {index % 2 === 1 && <AdBanner size="leaderboard" className="my-8" />}
          </div>)}
      </main>
      
      <Footer />
    </div>;
};
export default Index;
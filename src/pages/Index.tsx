import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySectionGrid from "@/components/CategorySectionGrid";
import AdBanner from "@/components/AdBanner";
import LiveSidebar from "@/components/LiveSidebar";
import WatchCarousel from "@/components/WatchCarousel";
import FeaturedSection from "@/components/FeaturedSection";
import LatestNews from "@/components/LatestNews";

const Index = () => {
  // Fetch all categories in navigation order
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

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <Header />
      
      <main className="container max-w-7xl py-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main content */}
          <div>
            {/* Hero Top Story */}
            <HeroSection />
            
            {/* Live sidebar - mobile only (collapsible section) */}
            <div className="lg:hidden">
              <LiveSidebar />
            </div>
            
            {/* Ad after hero */}
            <AdBanner size="leaderboard" />
            
            {/* Featured section */}
            <FeaturedSection />
            
            {/* Ad after featured */}
            <AdBanner size="leaderboard" />
            
            {/* Latest news */}
            <LatestNews />
            
            {/* Ad after latest */}
            <AdBanner size="leaderboard" />
            
            {/* Dynamic category sections */}
            {categories?.map((category, index) => (
              <div key={category.id}>
                <CategorySectionGrid
                  categorySlug={category.slug}
                  limit={7}
                />
                {/* Ad between every 2 sections */}
                {index % 2 === 1 && <AdBanner size="leaderboard" />}
              </div>
            ))}
            
            {/* Watch now carousel */}
            <WatchCarousel />
          </div>
          
          {/* Live sidebar - desktop only */}
          <div className="hidden lg:block">
            <LiveSidebar />
          </div>
        </div>
      </main>
      
      <footer className="border-t bg-card py-6">
        <div className="container text-center">
          <div className="mb-2 flex items-center justify-center gap-2">
            <span className="text-xl font-bold text-primary">TVGRAM</span>
            <span className="text-xl font-bold text-primary">TVGRAM</span>
            <span className="text-xl font-bold text-primary">TVGRAM</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2025 כל הזכויות שמורות
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

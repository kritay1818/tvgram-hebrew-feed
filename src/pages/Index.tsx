import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySectionGrid from "@/components/CategorySectionGrid";
import AdBanner from "@/components/AdBanner";

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
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-7xl py-8 px-4">
        {/* Hero Featured Article */}
        <HeroSection />
        
        {/* Ad after hero */}
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
      </main>
      
      <footer className="border-t border-primary/20 bg-card py-8 shadow-inner">
        <div className="container text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <span className="text-2xl font-black text-primary">TVGRAM</span>
            <span className="text-xl text-primary/50">×</span>
            <span className="text-xl font-bold text-white">NEWS</span>
          </div>
          <p className="text-sm text-foreground/60">
            © 2025 כל הזכויות שמורות
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

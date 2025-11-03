import Header from "@/components/Header";
import LiveSection from "@/components/LiveSection";
import CategorySection from "@/components/CategorySection";
import BannerAd from "@/components/BannerAd";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-4xl py-6">
        {/* Main LIVE Section */}
        <LiveSection />
        
        {/* סלבס Section */}
        <CategorySection 
          categorySlug="celebs" 
          categoryName="סלבס" 
          limit={4}
        />
        
        {/* VOD Section */}
        <CategorySection 
          categorySlug="vod" 
          categoryName="VOD" 
          limit={4}
        />
        
        {/* Banner Ad */}
        <BannerAd />
        
        {/* פלילי Section */}
        <CategorySection 
          categorySlug="crime" 
          categoryName="פלילי" 
          limit={4}
        />
        
        {/* Additional VOD Sections */}
        <CategorySection 
          categorySlug="politics" 
          categoryName="פוליטיקה" 
          limit={4}
        />
        
        <CategorySection 
          categorySlug="news" 
          categoryName="חדשות" 
          limit={4}
        />
        
        <CategorySection 
          categorySlug="sport" 
          categoryName="ספורט" 
          limit={4}
        />
        
        {/* Another Banner Ad */}
        <BannerAd />
        
        {/* Bottom LIVE Section */}
        <LiveSection />
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

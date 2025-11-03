import Header from "@/components/Header";
import LiveSection from "@/components/LiveSection";
import FeaturedArticles from "@/components/FeaturedArticles";
import CategorySection from "@/components/CategorySection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <LiveSection />
        
        <FeaturedArticles />
        
        <CategorySection 
          categorySlug="celebs" 
          categoryName="סלבס" 
        />
        
        <div className="my-8 flex items-center justify-center bg-muted p-8">
          <span className="text-sm font-semibold text-muted-foreground">
            פרסומת
          </span>
        </div>
        
        <CategorySection 
          categorySlug="crime" 
          categoryName="פלילי" 
        />
        
        <CategorySection 
          categorySlug="vod" 
          categoryName="VOD" 
        />
      </main>
      
      <footer className="border-t bg-muted py-8">
        <div className="container text-center">
          <p className="text-2xl font-bold text-primary">TVGRAM</p>
          <p className="mt-2 text-sm text-muted-foreground">
            © 2025 כל הזכויות שמורות
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const LivePage = () => {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 items-center gap-2 bg-news-live px-4 text-sm font-bold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
              LIVE
            </div>
            <h1 className="text-4xl font-bold">שידורים חיים</h1>
          </div>
        </div>
        
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <iframe 
                src="https://www.youtube.com/embed/live_stream?channel=UCDkHYlC5yVaTVenaGKtCvEw"
                width="560" 
                height="315"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
              </iframe>
            </div>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LivePage;

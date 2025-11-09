import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const VodPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [
    { value: "מצחיק", label: "מצחיק" },
    { value: "אקטואלי", label: "אקטואלי" },
    { value: "דרמתי", label: "דרמתי" },
    { value: "חדשות", label: "חדשות" },
    { value: "ספורט", label: "ספורט" },
  ];

  const { data: videos, isLoading } = useQuery({
    queryKey: ["vod-videos", selectedCategory],
    queryFn: async () => {
      let query = supabase
        .from("videos")
        .select("*")
        .eq("is_live", false);
      
      if (selectedCategory) {
        query = query.eq("category", selectedCategory);
      }
      
      const { data, error } = await query.order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-news-category">VOD</h1>
            <p className="mt-2 text-muted-foreground">סרטונים מוקלטים</p>
          </div>
        
        {/* Category Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            הכל
          </Button>
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <div className="mt-4 h-6 bg-muted"></div>
                <div className="mt-2 h-4 w-2/3 bg-muted"></div>
              </div>
            ))}
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="relative aspect-video bg-black">
                  {video.thumb_url ? (
                    <img
                      src={video.thumb_url}
                      alt={video.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl font-bold text-white/20">TVGRAM</span>
                    </div>
                  )}
                  {video.duration_seconds && (
                    <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 text-xs text-white">
                      {Math.floor(video.duration_seconds / 60)}:{String(video.duration_seconds % 60).padStart(2, '0')}
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="mb-2 text-lg font-bold line-clamp-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{video.description}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">אין סרטונים זמינים כרגע</p>
          </div>
        )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default VodPage;

import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";

const LivePage = () => {
  const { data: videos, isLoading } = useQuery({
    queryKey: ["all-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .order("is_live", { ascending: false })
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

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
        
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <div className="mt-2 h-4 bg-muted"></div>
                <div className="mt-1 h-3 w-2/3 bg-muted"></div>
              </div>
            ))}
          </div>
        ) : videos && videos.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
            {videos.map((video) => (
              <Card key={video.id} className="overflow-hidden">
                <div className="relative aspect-video bg-black">
                  {video.video_url ? (
                    <iframe
                      src={video.video_url}
                      className="h-full w-full"
                      allowFullScreen
                      title={video.title}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-4xl font-bold text-white/20">TVGRAM</span>
                    </div>
                  )}
                  {video.is_live && (
                    <div className="absolute top-2 right-2 bg-news-live px-2 py-0.5 text-[10px] font-bold text-white">
                      LIVE
                    </div>
                  )}
                </div>
                <CardContent className="p-3">
                  <h3 className="mb-1 text-sm font-bold line-clamp-2">{video.title}</h3>
                  {video.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">{video.description}</p>
                  )}
                  {video.viewer_count && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {video.viewer_count.toLocaleString()} צופים
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center">
            <p className="text-muted-foreground">אין שידורים זמינים כרגע</p>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default LivePage;

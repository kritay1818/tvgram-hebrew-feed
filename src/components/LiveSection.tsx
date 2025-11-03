import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

const LiveSection = () => {
  const { data: liveVideos } = useQuery({
    queryKey: ["live-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("is_live", true)
        .order("created_at", { ascending: false })
        .limit(1);
      
      if (error) throw error;
      return data;
    },
  });

  if (!liveVideos || liveVideos.length === 0) return null;

  const liveVideo = liveVideos[0];

  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 items-center gap-2 bg-news-live px-3 text-sm font-bold text-white">
          <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
          LIVE
        </div>
        <h2 className="text-2xl font-bold">שידור חי</h2>
      </div>
      
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-black">
          {liveVideo.video_url ? (
            <iframe
              src={liveVideo.video_url}
              className="h-full w-full"
              allowFullScreen
              title={liveVideo.title}
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-6xl font-bold text-white/20">TVGRAM</span>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 text-xl font-bold">{liveVideo.title}</h3>
          {liveVideo.description && (
            <p className="text-muted-foreground">{liveVideo.description}</p>
          )}
          {liveVideo.viewer_count && (
            <p className="mt-2 text-sm text-muted-foreground">
              {liveVideo.viewer_count.toLocaleString()} צופים
            </p>
          )}
        </CardContent>
      </Card>
    </section>
  );
};

export default LiveSection;

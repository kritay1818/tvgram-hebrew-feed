import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
    <section className="mb-6">
      <div className="mb-3 flex items-center gap-2 bg-news-live px-4 py-2">
        <span className="h-3 w-3 animate-pulse rounded-full bg-white"></span>
        <h2 className="text-xl font-bold text-white">LIVE</h2>
      </div>
      
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
      
      <div className="bg-card p-4">
        <h3 className="mb-2 text-xl font-bold">{liveVideo.title}</h3>
        {liveVideo.description && (
          <p className="text-sm text-muted-foreground">{liveVideo.description}</p>
        )}
      </div>
    </section>
  );
};

export default LiveSection;

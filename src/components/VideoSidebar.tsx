import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

const VideoSidebar = () => {
  const { data: liveVideos } = useQuery({
    queryKey: ["sidebar-live"],
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

  const { data: vodVideos } = useQuery({
    queryKey: ["sidebar-vod"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("is_live", false)
        .order("created_at", { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data;
    },
  });

  const liveVideo = liveVideos?.[0];

  return (
    <aside className="fixed left-0 top-20 bottom-8 w-64 border-r bg-gradient-to-b from-[#1a2332] to-[#0f1419] text-white overflow-hidden flex flex-col rounded-r-lg">
      {/* Live Section */}
      {liveVideo && (
        <div className="flex-shrink-0">
          <div className="bg-news-live px-3 py-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white"></span>
            <h2 className="text-sm font-bold">שידור חי</h2>
          </div>
          
          <Link to="/live" className="block">
            <div className="relative aspect-video bg-black">
              {liveVideo.thumb_url ? (
                <img
                  src={liveVideo.thumb_url}
                  alt={liveVideo.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-2xl font-bold text-white/20">LIVE</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
            <div className="p-2 bg-[#1a2332]/80">
              <p className="text-xs font-semibold line-clamp-2">{liveVideo.title}</p>
            </div>
          </Link>
        </div>
      )}

      {/* VOD Section */}
      <div className="flex-1 min-h-0 flex flex-col">
        <div className="bg-[#2a3544] px-3 py-2 flex-shrink-0">
          <h2 className="text-sm font-bold">צפה עכשיו</h2>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="space-y-3 p-3">
            {vodVideos?.map((video) => (
              <Link
                key={video.id}
                to="/vod"
                className="group flex gap-3 rounded p-2 hover:bg-white/5 transition-colors"
              >
                <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded bg-black">
                  {video.thumb_url ? (
                    <img
                      src={video.thumb_url}
                      alt={video.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-xs font-bold text-white/40">TVGRAM</span>
                    </div>
                  )}
                  {video.duration_seconds && (
                    <div className="absolute bottom-1 left-1 bg-black/80 px-1 rounded text-[10px]">
                      {Math.floor(video.duration_seconds / 60)}:{String(video.duration_seconds % 60).padStart(2, '0')}
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0 py-1">
                  <h3 className="text-xs font-semibold line-clamp-2 leading-tight">
                    {video.title}
                  </h3>
                  {video.description && (
                    <p className="text-[10px] text-white/60 line-clamp-1 mt-0.5">
                      {video.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </ScrollArea>
      </div>
    </aside>
  );
};

export default VideoSidebar;

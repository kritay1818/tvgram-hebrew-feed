import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const LiveSidebar = () => {
  const { data: liveVideos, isLoading } = useQuery({
    queryKey: ["live-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("is_live", true)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <aside className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="aspect-video w-full" />
      </aside>
    );
  }

  if (!liveVideos || liveVideos.length === 0) return null;

  return (
    <aside className="space-y-4">
      <div className="flex items-center gap-2 bg-news-live px-4 py-2">
        <span className="h-3 w-3 animate-pulse rounded-full bg-white"></span>
        <h2 className="text-lg font-bold text-white">LIVE עכשיו</h2>
      </div>
      
      {liveVideos.map((video) => (
        <a
          key={video.id}
          href={video.video_url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="group block"
        >
          <div className="overflow-hidden rounded-lg bg-card transition-shadow hover:shadow-lg">
            <div className="relative aspect-video overflow-hidden bg-muted">
              {video.thumb_url ? (
                <img
                  src={video.thumb_url}
                  alt={video.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-2xl font-bold text-muted-foreground/20">TVGRAM</span>
                </div>
              )}
              <div className="absolute top-2 left-2 bg-news-live px-2 py-1 text-xs font-bold text-white">
                LIVE
              </div>
            </div>
            
            <div className="p-3">
              <h3 className="line-clamp-2 text-sm font-bold leading-tight transition-colors group-hover:text-primary">
                {video.title}
              </h3>
              {video.description && (
                <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                  {video.description}
                </p>
              )}
            </div>
          </div>
        </a>
      ))}
    </aside>
  );
};

export default LiveSidebar;

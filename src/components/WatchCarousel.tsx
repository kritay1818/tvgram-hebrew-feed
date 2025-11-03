import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const WatchCarousel = () => {
  const { data: videos, isLoading } = useQuery({
    queryKey: ["watch-videos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("is_live", false)
        .order("homepage_rank", { ascending: true })
        .order("created_at", { ascending: false })
        .limit(8);
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <section className="mb-8">
        <Skeleton className="mb-4 h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video" />
          ))}
        </div>
      </section>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight">
          צפו עכשיו
        </h2>
        <p className="text-muted-foreground">אין סרטונים זמינים כרגע</p>
      </section>
    );
  }

  return (
    <section className="mb-8">
      <h2 className="mb-4 text-2xl font-bold uppercase tracking-tight">
        צפו עכשיו
      </h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {videos.map((video) => (
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
              </div>
              
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-bold leading-tight transition-colors group-hover:text-primary">
                  {video.title}
                </h3>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default WatchCarousel;

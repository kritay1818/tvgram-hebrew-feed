import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Facebook, Instagram, Youtube } from "lucide-react";

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

  const { data: breakingNews } = useQuery({
    queryKey: ["sidebar-breaking"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("id, title, slug, cover_url, published_at")
        .eq("is_published", true)
        .order("published_at", { ascending: false })
        .limit(5);
      
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
    <aside className="fixed left-0 top-20 bottom-8 w-56 border-r bg-gradient-to-b from-[#1a2332] to-[#0f1419] text-white overflow-hidden flex flex-col rounded-r-lg">
      {/* Live Section */}
      {liveVideo && (
        <div className="flex-shrink-0">
          <div className="bg-news-live px-3 py-2 items-center gap-2 hidden md:flex">
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

      {/* Breaking News Section */}
      {breakingNews && breakingNews.length > 0 && (
        <div className="flex-shrink-0 border-t border-white/10">
          <div className="bg-[#c62828] px-3 py-2 hidden md:block">
            <h2 className="text-sm font-bold">מבזקים</h2>
          </div>
          
          <div className="space-y-2 p-3 max-h-[180px] overflow-y-auto">
            {breakingNews.map((article) => (
              <Link
                key={article.id}
                to={`/news/${article.slug}`}
                className="group block rounded p-2 hover:bg-white/5 transition-colors"
              >
                <div className="flex gap-2 items-start">
                  <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded bg-black">
                    {article.cover_url ? (
                      <img
                        src={article.cover_url}
                        alt={article.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-[10px] font-bold text-white/40">TVGRAM</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold line-clamp-2 leading-tight">
                      {article.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* VOD Section */}
      <div className="flex-1 min-h-0 flex flex-col border-t border-white/10">
        <div className="bg-[#2a3544] px-3 py-2 flex-shrink-0 hidden md:block">
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

      {/* Social Media Section */}
      <div className="flex-shrink-0 border-t border-white/10 bg-[#1a2332] p-4">
        <div className="flex justify-center gap-4">
          <a
            href="https://www.facebook.com/tvgram.co.il/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#1877f2] transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://www.instagram.com/tvgram_live/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#e4405f] transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://www.tiktok.com/@tvgram_"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
            aria-label="TikTok"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@TvgramLive"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#ff0000] transition-colors"
            aria-label="YouTube"
          >
            <Youtube size={24} />
          </a>
        </div>
      </div>
    </aside>
  );
};

export default VideoSidebar;

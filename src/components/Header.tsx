import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Header = () => {
  const { data: hasLive } = useQuery({
    queryKey: ["has-live-videos"],
    queryFn: async () => {
      const { data } = await supabase
        .from("videos")
        .select("id")
        .eq("is_live", true)
        .limit(1)
        .maybeSingle();
      return !!data;
    },
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">TVGRAM</span>
        </Link>
        
        <nav className="flex gap-4 lg:gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            חדשות
          </Link>
          <Link to="/category/sport" className="text-sm font-medium transition-colors hover:text-primary">
            ספורט
          </Link>
          <Link to="/category/politics" className="text-sm font-medium transition-colors hover:text-primary">
            פוליטי
          </Link>
          <Link to="/category/celebs" className="text-sm font-medium transition-colors hover:text-primary">
            סלבס
          </Link>
          <Link to="/vod" className="text-sm font-medium transition-colors hover:text-primary">
            VOD
          </Link>
          <Link to="/category/crime" className="text-sm font-medium transition-colors hover:text-primary">
            פלילי
          </Link>
          <Link to="/category/online" className="text-sm font-medium transition-colors hover:text-primary">
            ברשת
          </Link>
          <Link 
            to="/category/recommended" 
            className="text-sm font-medium transition-colors hover:text-primary"
          >
            מומלצים
          </Link>
          {hasLive && (
            <Link 
              to="/live" 
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-accent"
            >
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-news-live"></span>
              LIVE
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

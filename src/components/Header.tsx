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
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Left side - nav items */}
        <div className="flex items-center gap-3 lg:gap-6">
          <Link to="/category/crime" className="text-sm font-medium transition-colors hover:text-primary hidden lg:block">
            פלילי
          </Link>
          <Link to="/category/politics" className="text-sm font-medium transition-colors hover:text-primary hidden lg:block">
            פוליטי
          </Link>
        </div>
        
        {/* Center - Logo */}
        <Link to="/" className="flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1">
            <span className="text-xl lg:text-2xl font-bold" style={{ fontFamily: 'Arial Black, sans-serif' }}>
              <span className="bg-[#1a1a2e] text-white px-2 py-0.5">TV</span>
              <span className="text-foreground">⊚</span>
            </span>
            <span className="text-xl lg:text-2xl font-bold text-foreground">GRAM</span>
            <span className="text-base lg:text-lg font-bold text-muted-foreground ml-1">NEWS</span>
          </div>
        </Link>
        
        {/* Right side - nav items + LIVE button */}
        <div className="flex items-center gap-3 lg:gap-6">
          <Link 
            to="/" 
            className="rounded bg-[#1a1a2e] px-4 py-1.5 text-sm font-medium text-white hover:opacity-90"
          >
            ראשי
          </Link>
          <Link to="/category/sport" className="text-sm font-medium transition-colors hover:text-primary hidden lg:block">
            ספורט
          </Link>
          <Link to="/category/celebs" className="text-sm font-medium transition-colors hover:text-primary hidden lg:block">
            לייף-סטייל
          </Link>
          <Link to="/category/online" className="text-sm font-medium transition-colors hover:text-primary hidden lg:block">
            בטחוני
          </Link>
          {hasLive && (
            <Link 
              to="/live" 
              className="flex items-center gap-1.5 rounded bg-news-live px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white"></span>
              LIVE
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

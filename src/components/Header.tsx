import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

const Header = () => {
  const location = useLocation();
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

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-card/95 shadow-lg shadow-primary/5 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Left side - nav items */}
        <div className="flex items-center gap-3 lg:gap-6">
          <Link 
            to="/" 
            className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
              isActive("/") 
                ? "bg-[#1a1a2e] text-white hover:opacity-90" 
                : "hover:text-primary"
            }`}
          >
            ראשי
          </Link>
          <Link 
            to="/category/crime" 
            className={`rounded px-4 py-1.5 text-sm font-medium transition-colors hidden lg:block ${
              isActive("/category/crime") 
                ? "bg-[#1a1a2e] text-white hover:opacity-90" 
                : "hover:text-primary"
            }`}
          >
            פלילי
          </Link>
          <Link 
            to="/category/politics" 
            className={`rounded px-4 py-1.5 text-sm font-medium transition-colors hidden lg:block ${
              isActive("/category/politics") 
                ? "bg-[#1a1a2e] text-white hover:opacity-90" 
                : "hover:text-primary"
            }`}
          >
            פוליטי
          </Link>
        </div>
        
        {/* Center - Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img src={logo} alt="TVGRAM LIVE" className="h-12 w-auto" />
        </Link>
        
        {/* Right side - nav items + LIVE button */}
        <div className="flex items-center gap-3 lg:gap-6">
          <Link 
            to="/category/sport" 
            className={`rounded px-4 py-1.5 text-sm font-medium transition-colors hidden lg:block ${
              isActive("/category/sport") 
                ? "bg-[#1a1a2e] text-white hover:opacity-90" 
                : "hover:text-primary"
            }`}
          >
            ספורט
          </Link>
          <Link 
            to="/category/celebs" 
            className={`rounded px-4 py-1.5 text-sm font-medium transition-colors hidden lg:block ${
              isActive("/category/celebs") 
                ? "bg-[#1a1a2e] text-white hover:opacity-90" 
                : "hover:text-primary"
            }`}
          >
            לייף-סטייל
          </Link>
          <Link 
            to="/category/online" 
            className={`rounded px-4 py-1.5 text-sm font-medium transition-colors hidden lg:block ${
              isActive("/category/online") 
                ? "bg-[#1a1a2e] text-white hover:opacity-90" 
                : "hover:text-primary"
            }`}
          >
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

import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { Menu, Moon, Sun } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  
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

  const { data: categories } = useQuery({
    queryKey: ["nav-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("id, name, slug")
        .eq("is_in_nav", true)
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "ראשי" },
    ...(categories?.map(cat => ({
      path: `/category/${cat.slug}`,
      label: cat.name
    })) || []),
    { path: "/vod", label: "VOD" },
  ];

  const NavLink = ({ path, label, onClick }: { path: string; label: string; onClick?: () => void }) => (
    <Link 
      to={path}
      onClick={onClick}
      className={`rounded px-4 py-1.5 text-sm font-medium transition-colors ${
        isActive(path) 
          ? "bg-[#1a1a2e] text-white hover:opacity-90" 
          : "hover:text-primary"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Mobile - Hamburger Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <button className="p-2 hover:bg-accent rounded-md">
              <Menu className="h-6 w-6" />
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px]">
            <nav className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => (
                <NavLink 
                  key={item.path} 
                  path={item.path} 
                  label={item.label}
                  onClick={() => setIsOpen(false)}
                />
              ))}
              {hasLive && (
                <Link 
                  to="/live"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-1.5 rounded bg-news-live px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 w-fit"
                >
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-white"></span>
                  LIVE
                </Link>
              )}
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop - Navigation Items */}
        <div className="hidden lg:flex items-center gap-3 lg:gap-6">
          {navItems.slice(0, 5).map((item) => (
            <NavLink key={item.path} path={item.path} label={item.label} />
          ))}
        </div>
        
        {/* Center - Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <img src={logo} alt="TVGRAM LIVE" className="h-12 md:h-16 lg:h-20 w-auto" />
        </Link>
        
        {/* Right side - nav items + LIVE button + Theme toggle */}
        <div className="flex items-center gap-3 lg:gap-6">
          <div className="hidden lg:flex items-center gap-3 lg:gap-6">
            {navItems.slice(5).map((item) => (
              <NavLink key={item.path} path={item.path} label={item.label} />
            ))}
          </div>
          {hasLive && (
            <Link 
              to="/live" 
              className="flex items-center gap-1.5 rounded bg-news-live px-3 py-1.5 text-xs font-bold text-white hover:opacity-90"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-white"></span>
              LIVE
            </Link>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-9 w-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

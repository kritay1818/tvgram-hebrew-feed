import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";
import { Menu, Moon, Sun, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const displayCategories = categories?.slice(0, 9) || [];
  const moreCategories = categories?.slice(9) || [];

  const navItems = [
    { path: "/", label: "ראשי" },
    ...displayCategories.map(cat => ({
      path: `/category/${cat.slug}`,
      label: cat.name
    })),
    { path: "/vod", label: "VOD" },
  ];

  const NavLink = ({ path, label, onClick }: { path: string; label: string; onClick?: () => void }) => (
    <Link 
      to={path}
      onClick={onClick}
      className={`rounded px-3 py-1.5 text-sm font-medium transition-colors whitespace-nowrap flex items-center ${
        isActive(path) 
          ? "bg-[#1a1a2e] text-white hover:opacity-90" 
          : "text-white hover:opacity-80"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-[100] w-full border-b bg-header shadow-sm">
      <div className="container h-16">
        <div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] items-center h-full gap-3">
          {/* Left - Navigation Items */}
          <div className="flex items-center gap-2 justify-start overflow-hidden">
            {navItems.slice(0, 7).map((item) => (
              <NavLink key={item.path} path={item.path} label={item.label} />
            ))}
          </div>
          
          {/* Center - Logo */}
          <Link to="/" className="flex items-center justify-center px-4">
            <img src={logo} alt="TVGRAM LIVE" className="h-10 w-auto" width="80" height="80" />
          </Link>
          
          {/* Right - nav items + More dropdown + LIVE button + Theme toggle */}
          <div className="flex items-center gap-2 justify-end overflow-hidden">
            {navItems.slice(7).map((item) => (
              <NavLink key={item.path} path={item.path} label={item.label} />
            ))}
            {moreCategories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded px-3 py-1.5 text-sm font-medium transition-colors text-white hover:opacity-80 flex items-center gap-1 whitespace-nowrap h-[34px]">
                    עוד
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-background border z-50">
                  {moreCategories.map((cat) => (
                    <DropdownMenuItem key={cat.id} asChild>
                      <Link 
                        to={`/category/${cat.slug}`}
                        className="cursor-pointer text-sm"
                      >
                        {cat.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            {hasLive && (
              <Link 
                to="/live" 
                className="flex items-center gap-1.5 rounded bg-news-live px-3 py-1.5 text-xs font-bold text-white hover:opacity-90 whitespace-nowrap"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-white"></span>
                LIVE
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-[34px] w-[34px] text-white hover:bg-white/10"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="flex lg:hidden h-full items-center justify-between gap-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <button className="p-2 hover:bg-white/10 rounded-md text-white">
                <Menu className="h-6 w-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] bg-background z-[110] overflow-y-auto">
              <nav className="flex flex-col gap-4 mt-8 pb-8">
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.path) 
                        ? "bg-primary text-primary-foreground" 
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
                {moreCategories.length > 0 && (
                  <>
                    <div className="text-xs font-bold text-muted-foreground px-2 mt-2">עוד</div>
                    {moreCategories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/category/${cat.slug}`}
                        onClick={() => setIsOpen(false)}
                        className={`rounded px-3 py-2 text-sm font-medium transition-colors ${
                          isActive(`/category/${cat.slug}`) 
                            ? "bg-primary text-primary-foreground" 
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </>
                )}
                {hasLive && (
                  <Link 
                    to="/live"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-1.5 rounded bg-news-live px-3 py-2 text-xs font-bold text-white hover:opacity-90 w-fit"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-white"></span>
                    LIVE
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2">
            <img src={logo} alt="TVGRAM LIVE" className="h-12 w-auto" />
          </Link>

          <div className="flex items-center gap-2">
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
              className="h-9 w-9 text-white hover:bg-white/10"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

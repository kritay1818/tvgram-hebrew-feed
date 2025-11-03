import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CategoryNav from "@/components/CategoryNav";
import AdBanner from "@/components/AdBanner";

const MobileSwipeView = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const { data: articles } = useQuery({
    queryKey: ["swipe-articles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("articles")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(20);
      
      if (error) throw error;
      return data;
    },
  });

  const { data: categories } = useQuery({
    queryKey: ["nav-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("is_in_nav", true)
        .order("order_index", { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="md:hidden fixed inset-0 top-16 bg-background">
      {/* Category Navigation */}
      <div className="absolute top-0 left-0 right-0 z-40 bg-background border-b">
        <CategoryNav categories={categories} />
      </div>

      {/* Ad Banner below categories */}
      <div className="absolute top-14 left-0 right-0 z-40 bg-background">
        <AdBanner size="leaderboard" className="mx-[5px] mb-2" />
      </div>

      <Carousel
        setApi={setApi}
        orientation="vertical"
        className="h-full w-full pt-36"
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
          dragFree: false,
          containScroll: "trimSnaps",
        }}
      >
        <CarouselContent className="h-full">
          {articles.map((article, index) => (
            <>
              <CarouselItem key={article.id} className="h-full pt-0">
              <div className="relative h-full w-full flex flex-col">
                {/* Article Image */}
                <div className="relative h-[45vh] w-full overflow-hidden bg-muted">
                  {article.cover_url ? (
                    <img
                      src={article.cover_url}
                      alt={article.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <span className="text-2xl font-bold text-muted-foreground">TVGRAM</span>
                    </div>
                  )}
                </div>

                {/* Article Content */}
                <div className="flex-1 px-4 py-6 overflow-y-auto touch-pan-y">
                  <Link to={`/article/${article.slug}`}>
                    <h2 className="mb-3 text-2xl font-bold leading-tight hover:text-primary">
                      {article.title}
                    </h2>
                  </Link>
                  
                  {article.summary && (
                    <p className="mb-4 text-base text-muted-foreground leading-relaxed">
                      {article.summary}
                    </p>
                  )}

                  <Link
                    to={`/article/${article.slug}`}
                    className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                  >
                    קרא עוד
                  </Link>
                </div>
              </div>
            </CarouselItem>
            
            {/* Ad Banner every 3 articles */}
            {(index + 1) % 3 === 0 && index < articles.length - 1 && (
              <CarouselItem key={`ad-${index}`} className="h-full pt-0 flex items-center justify-center">
                <AdBanner size="leaderboard" className="mx-[5px]" />
              </CarouselItem>
            )}
          </>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Progress Indicator */}
      <div className="fixed top-32 left-1/2 -translate-x-1/2 flex gap-1 z-50">
        {articles.map((_, index) => (
          <div
            key={index}
            className={`h-1 rounded-full transition-all ${
              index === current
                ? "w-8 bg-primary"
                : "w-1 bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default MobileSwipeView;

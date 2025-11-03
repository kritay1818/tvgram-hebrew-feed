import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

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

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!articles || articles.length === 0) return null;

  return (
    <div className="md:hidden fixed inset-0 top-16 bg-background">
      <Carousel
        setApi={setApi}
        orientation="vertical"
        className="h-full w-full"
        opts={{
          align: "start",
          loop: false,
          skipSnaps: false,
        }}
      >
        <CarouselContent className="h-full">
          {articles.map((article, index) => (
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
                <div className="flex-1 overflow-y-auto px-4 py-6">
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

                {/* Swipe Indicator */}
                {index < articles.length - 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-muted-foreground animate-bounce">
                    <ChevronDown className="h-6 w-6" />
                    <span className="text-xs">החלק למעלה</span>
                  </div>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Progress Indicator */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 flex gap-1 z-50">
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

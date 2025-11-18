import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CategorySectionGrid from "./CategorySectionGrid";
import CategorySectionSkeleton from "./skeletons/CategorySectionSkeleton";

interface LazyCategoryProps {
  category: any;
  index: number;
}

const LazyCategory = ({ category, index }: LazyCategoryProps) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "400px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const { data: articles, isLoading } = useQuery({
    queryKey: ["category-articles", category.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("articles")
        .select("*, videos(is_live)")
        .eq("primary_category_id", category.id)
        .eq("is_published", true)
        .order("homepage_rank", { ascending: true, nullsFirst: false })
        .order("published_at", { ascending: false })
        .limit(3);
      
      return data || [];
    },
    enabled: shouldLoad,
  });

  return (
    <div ref={ref}>
      {!shouldLoad || isLoading ? (
        <CategorySectionSkeleton />
      ) : (
        <CategorySectionGrid category={category} articles={articles || []} />
      )}
    </div>
  );
};

export default LazyCategory;

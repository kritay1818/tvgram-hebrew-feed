import { Link } from "react-router-dom";
import StandardArticleCard from "./StandardArticleCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface CategorySectionGridProps {
  category: any;
  articles: any[];
}

const CategorySectionGrid = ({ category, articles }: CategorySectionGridProps) => {
  const [showAll, setShowAll] = useState(false);

  if (!category || !articles || articles.length === 0) {
    return null;
  }

  const displayedArticles = showAll ? articles : articles.slice(0, 3);
  const hasMore = articles.length > 3;

  return (
    <section id={`category-${category.slug}`} className="mb-12 scroll-mt-20">
      <div className="mb-6 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="bg-news-live px-4 py-2 w-full md:w-auto flex justify-center md:justify-start">
          <h2 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white">
            {category.name}
          </h2>
        </div>
        <Link to={`/category/${category.slug}`}>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary">
            ראה עוד ←
          </Button>
        </Link>
      </div>
      
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {displayedArticles.map((article) => (
          <StandardArticleCard
            key={article.id}
            id={article.id}
            title={article.title}
            summary={article.summary || undefined}
            coverUrl={article.cover_url || undefined}
            slug={article.slug}
            isLive={article.videos?.is_live}
            publishedAt={article.published_at || undefined}
            author={article.author || undefined}
            likesCount={(article as any).likes_count || 0}
            commentsCount={(article as any).comments_count || 0}
            viewsCount={(article as any).views_count || 0}
          />
        ))}
      </div>

      {hasMore && !showAll && (
        <div className="mt-4 text-center">
          <Button
            variant="outline"
            onClick={() => setShowAll(true)}
            className="w-full sm:w-auto"
          >
            הצג עוד כתבות ב{category.name}
          </Button>
        </div>
      )}
    </section>
  );
};

export default CategorySectionGrid;

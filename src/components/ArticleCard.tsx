import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

interface ArticleCardProps {
  id: string;
  title: string;
  summary?: string;
  coverUrl?: string;
  slug: string;
  category?: string;
  isLive?: boolean;
}

const ArticleCard = ({ 
  id, 
  title, 
  summary, 
  coverUrl, 
  slug, 
  category,
  isLive 
}: ArticleCardProps) => {
  return (
    <Link to={`/article/${slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {coverUrl ? (
            <img
              src={`${coverUrl}${coverUrl.includes('?') ? '&' : '?'}width=400&height=300&resize=cover`}
              alt={title}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
              loading="lazy"
              width="400"
              height="300"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground">TVGRAM</span>
            </div>
          )}
          {isLive && (
            <div className="absolute top-2 right-2 bg-news-live px-3 py-1 text-xs font-bold text-white">
              LIVE
            </div>
          )}
          {category && (
            <div className="absolute bottom-2 right-2 bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
              {category}
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight group-hover:text-primary">
            {title}
          </h3>
          {summary && (
            <p className="line-clamp-3 text-sm text-muted-foreground">
              {summary}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ArticleCard;

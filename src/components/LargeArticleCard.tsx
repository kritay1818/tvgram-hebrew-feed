import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

interface LargeArticleCardProps {
  id: string;
  title: string;
  summary?: string;
  coverUrl?: string;
  slug: string;
  categoryName?: string;
  isLive?: boolean;
  publishedAt?: string;
  author?: string;
}

const LargeArticleCard = ({
  title,
  summary,
  coverUrl,
  slug,
  categoryName,
  isLive,
  publishedAt,
  author,
}: LargeArticleCardProps) => {
  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true, locale: he })
    : "";

  return (
    <Link to={`/article/${slug}`} className="group block">
      <article className="overflow-hidden rounded-lg bg-card transition-shadow hover:shadow-lg">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-4xl font-bold text-muted-foreground/20">TVGRAM</span>
            </div>
          )}
          {isLive && (
            <div className="absolute top-3 left-3 bg-news-live px-3 py-1 text-xs font-bold text-white">
              LIVE
            </div>
          )}
          {categoryName && !isLive && (
            <div className="absolute top-3 left-3 bg-primary/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
              {categoryName}
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="mb-2 line-clamp-2 text-xl font-bold leading-tight transition-colors group-hover:text-primary">
            {title}
          </h3>
          
          {summary && (
            <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
              {summary}
            </p>
          )}
          
          {(timeAgo || author) && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              {timeAgo && <span>{timeAgo}</span>}
              {timeAgo && author && <span>·</span>}
              {author && <span>{author}</span>}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default LargeArticleCard;

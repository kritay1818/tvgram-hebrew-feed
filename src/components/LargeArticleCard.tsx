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
    <Link to={`/news/${slug}`} className="group block">
      <article className="overflow-hidden rounded-lg border-2 border-border bg-card shadow-lg transition-all hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20">
        <div className="relative aspect-video overflow-hidden bg-muted">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 to-muted">
              <span className="text-4xl font-bold text-primary/30">TVGRAM</span>
            </div>
          )}
          {isLive && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-news-live px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white"></span>
              LIVE
            </div>
          )}
          {categoryName && !isLive && (
            <div className="absolute top-3 left-3 rounded-full bg-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-white shadow-md">
              {categoryName}
            </div>
          )}
        </div>
        
        <div className="p-4 bg-gradient-to-b from-card to-secondary/10">
          <h3 className="mb-2 line-clamp-2 text-xl font-bold leading-tight text-white transition-colors group-hover:text-primary">
            {title}
          </h3>
          
          {summary && (
            <p className="mb-3 line-clamp-2 text-sm text-foreground/70">
              {summary}
            </p>
          )}
          
          {(timeAgo || author) && (
            <div className="flex items-center gap-2 text-xs text-foreground/50">
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

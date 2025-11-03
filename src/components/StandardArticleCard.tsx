import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

interface StandardArticleCardProps {
  id: string;
  title: string;
  summary?: string;
  coverUrl?: string;
  slug: string;
  isLive?: boolean;
  publishedAt?: string;
  author?: string;
}

const StandardArticleCard = ({
  title,
  summary,
  coverUrl,
  slug,
  isLive,
  publishedAt,
  author,
}: StandardArticleCardProps) => {
  const timeAgo = publishedAt
    ? formatDistanceToNow(new Date(publishedAt), { addSuffix: true, locale: he })
    : "";

  return (
    <Link to={`/news/${slug}`} className="group block">
      <article className="overflow-hidden rounded-lg border-2 border-border bg-card shadow-lg transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/20">
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
              <span className="text-2xl font-bold text-primary/30">TVGRAM</span>
            </div>
          )}
          {isLive && (
            <div className="absolute top-2 left-2 flex items-center gap-1 bg-news-live px-2 py-1 text-xs font-bold text-white shadow-md">
              <span className="h-1 w-1 animate-pulse rounded-full bg-white"></span>
              LIVE
            </div>
          )}
        </div>
        
        <div className="p-3 bg-gradient-to-b from-card to-secondary/10">
          <h3 className="mb-1 line-clamp-2 text-base font-bold leading-tight text-white transition-colors group-hover:text-primary">
            {title}
          </h3>
          
          {summary && (
            <p className="mb-2 line-clamp-1 text-sm text-foreground/70">
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

export default StandardArticleCard;

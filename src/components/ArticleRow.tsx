import { Link } from "react-router-dom";

interface Article {
  id: string;
  title: string;
  summary?: string;
  cover_url?: string;
  slug: string;
}

interface ArticleRowProps {
  article: Article;
}

const ArticleRow = ({ article }: ArticleRowProps) => {
  return (
    <Link to={`/article/${article.slug}`} className="group flex gap-3 border-b pb-4 last:border-b-0">
      <div className="relative h-24 w-32 flex-shrink-0 overflow-hidden bg-muted">
        {article.cover_url ? (
          <img
            src={`${article.cover_url}${article.cover_url.includes('?') ? '&' : '?'}width=300&height=200&resize=cover`}
            alt={article.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
            width="300"
            height="200"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="text-xs font-bold text-muted-foreground">TVGRAM</span>
          </div>
        )}
      </div>
      
      <div className="flex-1">
        <h3 className="mb-1 line-clamp-2 text-base font-bold leading-tight group-hover:text-primary">
          {article.title}
        </h3>
        {article.summary && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {article.summary}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ArticleRow;

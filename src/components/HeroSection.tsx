import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

interface HeroSectionProps {
  article: any;
}

const HeroSection = ({ article: featuredArticle }: HeroSectionProps) => {
  if (!featuredArticle) return null;

  const timeAgo = featuredArticle.published_at
    ? formatDistanceToNow(new Date(featuredArticle.published_at), { addSuffix: true, locale: he })
    : "";

  return (
    <section className="mb-12">
      <Link to={`/news/${featuredArticle.slug}`} className="group">
        <div className="grid gap-0 overflow-hidden rounded-lg bg-card shadow-xl transition-all hover:shadow-2xl lg:grid-cols-2">
          {/* Image */}
          <div className="relative aspect-video lg:aspect-auto lg:min-h-[500px] overflow-hidden bg-muted lg:order-2">
            {featuredArticle.cover_url ? (
              <img
                src={featuredArticle.cover_url}
                alt={featuredArticle.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="eager"
                fetchPriority="high"
                width="800"
                height="500"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="text-6xl font-bold text-muted-foreground/20">TVGRAM</span>
              </div>
            )}
            {featuredArticle.videos?.is_live && (
              <div className="absolute top-4 left-4 bg-news-live px-3 py-1 text-sm font-bold text-white">
                LIVE
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-6 lg:order-1 lg:p-8">
            {featuredArticle.categories && (
              <div className="mb-3">
                <span className="text-sm font-semibold uppercase tracking-wide text-primary">
                  {featuredArticle.categories.name}
                </span>
              </div>
            )}
            
            <h1 className="mb-4 line-clamp-2 text-3xl font-bold leading-tight transition-colors group-hover:text-primary lg:text-5xl">
              {featuredArticle.title}
            </h1>
            
            {featuredArticle.summary && (
              <p className="mb-4 line-clamp-3 text-lg text-muted-foreground">
                {featuredArticle.summary}
              </p>
            )}
            
            <div className="flex items-center gap-4">
              {timeAgo && (
                <span className="text-sm text-muted-foreground">{timeAgo}</span>
              )}
              {featuredArticle.author && (
                <>
                  <span className="text-sm text-muted-foreground">·</span>
                  <span className="text-sm text-muted-foreground">{featuredArticle.author}</span>
                </>
              )}
            </div>
            
            <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
                {(featuredArticle as any).likes_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
                {(featuredArticle as any).comments_count || 0}
              </span>
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                {(featuredArticle as any).views_count || 0}
              </span>
            </div>
            
            <div className="mt-6">
              <span className="inline-flex items-center font-semibold text-primary group-hover:underline">
                לכתבה המלאה ←
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
};

export default HeroSection;

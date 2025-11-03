import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-primary">TVGRAM</span>
        </Link>
        
        <nav className="flex gap-6">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            ראשי
          </Link>
          <Link to="/live" className="text-sm font-medium transition-colors hover:text-accent">
            LIVE
          </Link>
          <Link to="/category/celebs" className="text-sm font-medium transition-colors hover:text-primary">
            סלבס
          </Link>
          <Link to="/category/crime" className="text-sm font-medium transition-colors hover:text-primary">
            פלילי
          </Link>
          <Link to="/vod" className="text-sm font-medium transition-colors hover:text-primary">
            VOD
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

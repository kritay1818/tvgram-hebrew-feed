import { Facebook, Instagram, Youtube } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t bg-card py-6">
      <div className="container text-center">
        <div className="mb-4 flex items-center justify-center gap-6">
          <a
            href="https://www.facebook.com/tvgram.co.il/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-[#1877f2] transition-colors"
            aria-label="Facebook"
          >
            <Facebook size={24} />
          </a>
          <a
            href="https://www.instagram.com/tvgram_live/?hl=en"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-[#e4405f] transition-colors"
            aria-label="Instagram"
          >
            <Instagram size={24} />
          </a>
          <a
            href="https://www.tiktok.com/@tvgram_"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="TikTok"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
            </svg>
          </a>
          <a
            href="https://www.youtube.com/@TvgramLive"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-[#ff0000] transition-colors"
            aria-label="YouTube"
          >
            <Youtube size={24} />
          </a>
        </div>
        <div className="mb-2 flex items-center justify-center gap-2">
          <span className="text-xl font-bold text-primary">TVGRAM</span>
          <span className="text-xl font-bold text-primary">TVGRAM</span>
          <span className="text-xl font-bold text-primary">TVGRAM</span>
        </div>
        <p className="text-xs text-muted-foreground">
          © 2025 כל הזכויות שמורות
        </p>
      </div>
    </footer>
  );
};

export default Footer;

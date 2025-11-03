interface AdBannerProps {
  size?: "leaderboard" | "rectangle";
  className?: string;
}

const AdBanner = ({ size = "leaderboard", className = "" }: AdBannerProps) => {
  const sizeClasses = {
    leaderboard: "min-h-[90px] lg:min-h-[250px]",
    rectangle: "min-h-[250px]",
  };

  return (
    <div className={`my-6 flex items-center justify-center bg-muted ${sizeClasses[size]} ${className}`}>
      <div className="text-center">
        <p className="text-sm font-semibold text-muted-foreground">באנר פרסומת</p>
        <p className="mt-1 text-4xl font-bold text-muted-foreground/20">TVGRAM</p>
      </div>
    </div>
  );
};

export default AdBanner;

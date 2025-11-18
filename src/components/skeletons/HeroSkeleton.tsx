import { Skeleton } from "@/components/ui/skeleton";

const HeroSkeleton = () => {
  return (
    <section className="mb-8">
      <div className="relative overflow-hidden bg-card">
        <Skeleton className="h-[400px] w-full" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-transparent p-6">
          <Skeleton className="mb-2 h-4 w-24" />
          <Skeleton className="mb-4 h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="mt-2 h-4 w-2/3" />
          <div className="mt-4 flex items-center gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSkeleton;

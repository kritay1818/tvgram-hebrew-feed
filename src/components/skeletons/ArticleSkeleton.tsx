import { Skeleton } from "@/components/ui/skeleton";

const ArticleSkeleton = () => {
  return (
    <section className="mb-8">
      <div className="overflow-hidden bg-card">
        <Skeleton className="h-[300px] w-full" />
        <div className="p-6">
          <Skeleton className="mb-2 h-4 w-32" />
          <Skeleton className="mb-4 h-7 w-full" />
          <Skeleton className="mb-2 h-4 w-full" />
          <Skeleton className="mb-4 h-4 w-5/6" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArticleSkeleton;

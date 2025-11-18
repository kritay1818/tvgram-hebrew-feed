import { Skeleton } from "@/components/ui/skeleton";

const PollSkeleton = () => {
  return (
    <section className="mb-8 bg-card p-6">
      <Skeleton className="mb-2 h-6 w-48" />
      <Skeleton className="mb-4 h-4 w-full" />
      <div className="space-y-3">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
      <Skeleton className="mt-4 h-10 w-full" />
    </section>
  );
};

export default PollSkeleton;

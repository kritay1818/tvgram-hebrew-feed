import { Skeleton } from "@/components/ui/skeleton";

const CategorySectionSkeleton = () => {
  return (
    <section id="category-skeleton" className="mb-8">
      <div className="mb-4 bg-primary px-4 py-2">
        <Skeleton className="h-6 w-32 bg-primary-foreground/20" />
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="overflow-hidden bg-card">
            <Skeleton className="h-48 w-full" />
            <div className="p-4">
              <Skeleton className="mb-2 h-5 w-full" />
              <Skeleton className="mb-2 h-4 w-5/6" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategorySectionSkeleton;

import { Link } from "react-router-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryNavProps {
  categories?: Category[];
}

const CategoryNav = ({ categories }: CategoryNavProps) => {
  if (!categories || categories.length === 0) return null;

  return (
    <div className="md:hidden mb-6 -mx-4">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 px-4 py-2">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.slug}`}
              className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              {category.name}
            </Link>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default CategoryNav;

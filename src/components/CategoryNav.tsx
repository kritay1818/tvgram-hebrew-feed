import { Link } from "react-router-dom";

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
    <div className="md:hidden mb-6">
      <div className="flex gap-2 overflow-x-auto pb-2 px-4" style={{ scrollbarWidth: 'thin' }}>
        <Link
          to="/"
          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-[11px] font-medium hover:bg-primary/90 transition-colors text-center whitespace-nowrap flex-shrink-0"
        >
          ראשי
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-[11px] font-medium hover:bg-primary/90 transition-colors text-center whitespace-nowrap flex-shrink-0"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;

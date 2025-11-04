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
    <div className="md:hidden mb-6 px-4">
      <div className="grid grid-cols-5 gap-2">
        <Link
          to="/"
          className="px-1.5 py-1.5 bg-primary text-primary-foreground rounded-md text-[11px] font-medium hover:bg-primary/90 transition-colors text-center"
        >
          ראשי
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className="px-1.5 py-1.5 bg-primary text-primary-foreground rounded-md text-[11px] font-medium hover:bg-primary/90 transition-colors text-center"
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;

import { Link, useLocation } from "react-router-dom";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryNavProps {
  categories?: Category[];
}

const CategoryNav = ({ categories }: CategoryNavProps) => {
  const location = useLocation();
  
  if (!categories || categories.length === 0) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden sticky top-16 z-[90] bg-background shadow-sm pb-4 pt-2 mb-2">
      <div className="flex gap-2 overflow-x-auto pb-2 px-4" style={{ scrollbarWidth: 'thin' }}>
        <Link
          to="/"
          className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors text-center whitespace-nowrap flex-shrink-0 ${
            isActive('/') 
              ? "bg-primary text-primary-foreground" 
              : "bg-muted text-foreground hover:bg-muted/80"
          }`}
        >
          ראשי
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.slug}`}
            className={`px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors text-center whitespace-nowrap flex-shrink-0 ${
              isActive(`/category/${category.slug}`) 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-foreground hover:bg-muted/80"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;

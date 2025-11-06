import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  
  if (!categories || categories.length === 0) return null;

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    
    if (isHomePage) {
      // On homepage, just scroll to section
      const element = document.getElementById(`category-${slug}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      // On other pages, navigate to homepage then scroll
      navigate('/', { state: { scrollTo: `category-${slug}` } });
    }
  };

  return (
    <div className="md:hidden sticky top-16 z-[90] bg-background shadow-sm pb-4 pt-2 mb-2">
      <div className="flex gap-2 overflow-x-auto pb-2 px-4" style={{ scrollbarWidth: 'thin' }}>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            if (isHomePage) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
              navigate('/');
            }
          }}
          className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-[11px] font-medium hover:bg-primary/90 transition-colors text-center whitespace-nowrap flex-shrink-0"
        >
          ראשי
        </a>
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#category-${category.slug}`}
            onClick={(e) => handleCategoryClick(e, category.slug)}
            className="px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-[11px] font-medium hover:bg-primary/90 transition-colors text-center whitespace-nowrap flex-shrink-0"
          >
            {category.name}
          </a>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;

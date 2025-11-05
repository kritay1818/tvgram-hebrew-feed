import React from "react";

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

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    const element = document.getElementById(`category-${slug}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="md:hidden sticky top-0 z-50 bg-background pb-4 pt-2 shadow-sm">
      <div className="flex gap-2 overflow-x-auto pb-2 px-4" style={{ scrollbarWidth: 'thin' }}>
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

import Link from "next/link";
import { forwardRef } from "react";
import { Category } from "@/modules/categories/types";

interface SubCategoryMenuProps {
  category: Category;
  isOpen: boolean;
  position: { top: number; left: number };
  onMouseEnter?: () => void;
  onMouseLeave?: (e: React.MouseEvent) => void;
}
export const SubCategoryMenu = forwardRef<HTMLDivElement, SubCategoryMenuProps>(
  ({ category, isOpen, position, onMouseEnter, onMouseLeave }, ref) => {
    if (!isOpen || category.subcategories.length === 0) return null;
    const backgroundColor = category.color || "#f5f5f5";
    return (
      <div
        ref={ref}
        className="fixed z-100"
        style={{ top: position.top, left: position.left }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {/* Invisble bridge to maintain hover state on the parent dropdown */}
        <div className="h-3 w-60" />
        <div
          className="w-60 text-black rounded-md overflow-hidden border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -transalte-x-[2px] -transalte-y-[2px]"
          style={{ backgroundColor }}
        >
          <div>
            {category.subcategories.map((subcategory: Category) => (
              <Link
                key={subcategory.slug}
                href={`/${category.slug}/${subcategory.slug}`}
                className="w-full text-left p-4 hover:bg-black hover:text-white
            flex justify-between items-center font-medium underline"
              >
                {subcategory.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }
);
SubCategoryMenu.displayName = "SubCategoryMenu";

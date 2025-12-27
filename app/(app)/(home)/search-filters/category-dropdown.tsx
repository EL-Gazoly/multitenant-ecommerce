"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { useDropdownPosition } from "./use-dropdown-postion";
import { SubCategoryMenu } from "./subcategory-menu";
import { CustomCategory } from "../types";
import Link from "next/link";
interface CategoryDropdownProps {
  category: CustomCategory;
  isActive?: boolean;
  isNavigationHovered?: boolean;
}
export const CategoryDropdown = ({
  category,
  isActive,
  isNavigationHovered,
}: CategoryDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const { getDrowdownPosition } = useDropdownPosition(dropdownRef);

  const onMouseEnter = () => {
    if (category.subcategories) {
      setIsOpen(true);
    }
  };

  const onMouseLeave = () => {
    setIsOpen(false);
  };
  const toggleDropdown = () => {
    if (category.subcategories?.docs?.length) {
      setIsOpen(!isOpen);
    }
  };

  const dropdownPosition = getDrowdownPosition();
  return (
    <div
      className="relative"
      ref={dropdownRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={toggleDropdown}
    >
      <Button
        variant={"elevated"}
        className={cn(
          "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
          isActive &&
            !isNavigationHovered &&
            "bg-white border-primary text-black",
          isOpen &&
            "bg-white border-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
        )}
        asChild
      >
        <Link href={category.slug === "all" ? "" : category.slug}>
          {category.name}
        </Link>
      </Button>
      {category.subcategories && category.subcategories.length > 0 && (
        <div
          className={cn(
            "absolute  -bottom-3 w-0 h-0 border-l-10 border-r-10 border-b-10 border-l-transparent border-r-transparent border-t-primary left-1/2 -translate-x-1/2 transition-opacity",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        />
      )}
      <SubCategoryMenu
        ref={menuRef}
        category={category}
        isOpen={isOpen}
        position={dropdownPosition}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </div>
  );
};

"use client";
import { CategoryDropdown } from "./category-dropdown";
import { CustomCategory } from "../types";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ListFilterIcon } from "lucide-react";
import { CategoriesSidebar } from "./categories-sidebar";

interface CategoriesProps {
  categories: CustomCategory[];
}
export const Categories = ({ categories }: CategoriesProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const viewAllRef = useRef<HTMLDivElement>(null);
  const [visisbleCount, setVisisbleCount] = useState<number>(categories.length);
  const [isAnyHovered, setIsAnyHovered] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const activeCategory = "all";
  const activeCategoryIndex = categories.findIndex(
    (category) => category.slug === activeCategory
  );
  const isActiveCategoryHidden =
    activeCategoryIndex > visisbleCount && activeCategoryIndex !== -1;

  useEffect(() => {
    const calcualteVisible = () => {
      if (!containerRef.current || !measureRef.current || !viewAllRef.current)
        return;

      // Wait for next frame to ensure layout is ready
      requestAnimationFrame(() => {
        if (!containerRef.current || !measureRef.current || !viewAllRef.current)
          return;

        const containerWidth = containerRef.current.offsetWidth;
        const viewAllWidth = viewAllRef.current.offsetWidth;

        // Set measurement container width to match actual container for accurate measurement
        measureRef.current.style.width = `${containerWidth}px`;

        const availableWidth = containerWidth - viewAllWidth;
        const items = Array.from(measureRef.current.children) as HTMLElement[];

        let totalWidth = 0;
        let visisble = 0;
        for (const item of items) {
          // Use offsetWidth for more accurate measurement
          const width = item.offsetWidth;
          if (totalWidth + width > availableWidth) break;
          totalWidth += width;
          visisble++;
        }
        setVisisbleCount(visisble);
      });
    };

    // Calculate on initial mount
    calcualteVisible();

    const resizeObserver = new ResizeObserver(calcualteVisible);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current!);
    }
    if (measureRef.current) {
      resizeObserver.observe(measureRef.current!);
    }
    if (viewAllRef.current) {
      resizeObserver.observe(viewAllRef.current!);
    }

    return () => resizeObserver.disconnect();
  }, [categories.length]);
  return (
    <div className="relative w-full">
      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        categories={categories}
      />
      {/* hidden div to measure all items width */}
      <div
        ref={measureRef}
        className="absolute opacity-0 pointer-events-none flex flex-nowrap items-center w-full"
        style={{ position: "fixed", top: -9999, left: -9999, width: "100%" }}
      >
        {categories.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
      {/* Visible categories */}
      <div
        className=" w-full flex flex-nowrap items-center"
        ref={containerRef}
        onMouseEnter={() => setIsAnyHovered(true)}
        onMouseLeave={() => setIsAnyHovered(false)}
      >
        {categories.slice(0, visisbleCount).map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={false}
              isNavigationHovered={isAnyHovered}
            />
          </div>
        ))}
        <div ref={viewAllRef} className=" shrink-0">
          <Button
            className={cn(
              "h-11 px-4 bg-transparent border-transparent rounded-full hover:bg-white hover:border-primary text-black",
              isActiveCategoryHidden &&
                !isAnyHovered &&
                "bg-white border-primary"
            )}
            onClick={() => setIsSidebarOpen(true)}
          >
            View All
            <ListFilterIcon className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Categories;

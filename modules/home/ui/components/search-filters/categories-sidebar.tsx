"use client";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { CategoriesGetManyOutput, Category } from "@/modules/categories/types";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/cliient";
import Link from "next/link";
interface CategoriesSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoriesGetManyOutput;
}
export const CategoriesSidebar = ({
  open,
  onOpenChange,
  categories,
}: CategoriesSidebarProps) => {
  const router = useRouter();
  const [parentCategories, setParentCategories] =
    useState<CategoriesGetManyOutput | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());
  const currentCategories = parentCategories ?? categories ?? [];
  const handleOpenChange = (open: boolean) => {
    setParentCategories(null);
    setSelectedCategory(null);
    onOpenChange(open);
  };
  const handleCategoryClick = (category: Category) => {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CategoriesGetManyOutput);
      setSelectedCategory(category);
    } else {
      // this is a leaf category no subcategories so we can navigate to the category page
      if (parentCategories && selectedCategory) {
        // this is a subcategory so we can navigate to the subcategory page
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        // this is the root category so we can navigate to the category page
        if (category.slug === "all") {
          router.push("/");
        } else {
          router.push(`/categories/${category.slug}`);
        }
      }
      handleOpenChange(false);
    }
  };
  const handleBackClick = () => {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  };
  const backgroundColor = selectedCategory?.color ?? "white";
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-colors"
        style={{ backgroundColor: backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className=" flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium"
              onClick={handleBackClick}
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          <button className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center text-base font-medium" onClick={() => handleCategoryClick({ slug: "all", name: "All", color: "white" })}>
            All
          </button>
          {currentCategories.map((category: Category) => (
            <button
              key={category.slug}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center justify-between text-base font-medium"
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4" />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

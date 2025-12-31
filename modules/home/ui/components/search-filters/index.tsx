"use client";

import { SearchInput } from "./search-input";
import { Categories } from "./categories";

import { useTRPC } from "@/trpc/cliient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { Category } from "@/modules/categories/types";
import { DEFAULT_BG_COLOR } from "@/modules/home/constants";
import { BreadcrumbNavigation } from "./breadcrumb-navigation";

export const SearchFilters = () => {
  const params = useParams();
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );
  const categoryParam = params.category as string | undefined;
  const activeCategory = categoryParam || "all";
  const activeCategoryData = categories.find(
    (category: Category) => category.slug === activeCategory
  );
  const activeCategoryBackgroundColor =
    activeCategoryData?.color || DEFAULT_BG_COLOR;
  const activeCategoryName = activeCategoryData?.name || null;

  const activeSubCategory = params.subcategory as string | undefined;
  const activeSubCategoryName =
    activeCategoryData?.subcategories.find(
      (subcategory: Category) => subcategory.slug === activeSubCategory
    )?.name || null;

  return (
    <div
      className=" px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full"
      style={{ backgroundColor: activeCategoryBackgroundColor }}
    >
      <SearchInput categories={categories} />
      <div className="hidden lg:block">
        <Categories categories={categories} />
      </div>
      <BreadcrumbNavigation
        activeCategory={activeCategory}
        activeCategoryName={activeCategoryName}
        activeSubCategory={activeSubCategory}
        activeSubCategoryName={activeSubCategoryName}
      />
    </div>
  );
};

export const SearchFiltersLoading = () => {
  return (
    <div className=" px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
      <SearchInput.isLoading />
      <div className="hidden lg:block">
        <Categories.isLoading />
      </div>
    </div>
  );
};

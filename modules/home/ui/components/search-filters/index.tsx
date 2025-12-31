"use client";

import { SearchInput } from "./search-input";
import { Categories } from "./categories";

import { useTRPC } from "@/trpc/cliient";
import { useSuspenseQuery } from "@tanstack/react-query";

export const SearchFilters = () => {
  const trpc = useTRPC();
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions()
  );
  return (
    <div className=" px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
      <SearchInput categories={categories} />
      <div className="hidden lg:block">
        <Categories categories={categories} />
      </div>
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

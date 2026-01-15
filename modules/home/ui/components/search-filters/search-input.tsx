"use client";
import { Input } from "@/components/ui/input";
import { BookmarkCheckIcon, ListFilterIcon, SearchIcon } from "lucide-react";
import { CategoriesGetManyOutput } from "@/modules/categories/types";
import { useState, useEffect } from "react";
import { CategoriesSidebar } from "./categories-sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/cliient";
import Link from "next/link";
interface SearchInputProps {
  disabled?: boolean;
  categories: CategoriesGetManyOutput;
}
export const SearchInput = ({ disabled, categories }: SearchInputProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const trpc = useTRPC();
  const session = useQuery(trpc.auth.session.queryOptions());

  useEffect(() => {
    Promise.resolve().then(() => setHasMounted(true));
  }, []);

  return (
    <div className=" flex items-center gap-2 w-full">
      <CategoriesSidebar
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        categories={categories}
      />
      <div className=" relative w-full">
        <SearchIcon className=" absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-500" />
        <Input
          disabled={disabled}
          placeholder="Search Products"
          className=" pl-8"
        />
      </div>
      <Button
        variant="elevated"
        className="size-12 shrink-0 lg:hidden"
        onClick={() => setIsSidebarOpen(true)}
      >
        <ListFilterIcon className="size-4" />
      </Button>
      {hasMounted && session.data && (
        <Button variant="elevated" asChild>
          <Link prefetch href="/library">
            <BookmarkCheckIcon className="size-4" />
          </Link>
        </Button>
      )}
    </div>
  );
};

SearchInput.isLoading = () => {
  return (
    <div className=" flex items-center gap-2 w-full">
      <Skeleton className="w-full h-12" />
      <Skeleton className="size-12 shrink-0 lg:hidden" />
    </div>
  );
};

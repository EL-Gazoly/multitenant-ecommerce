"use client";
import { Button } from "@/components/ui/button";
import { useProductFilter } from "../../hooks/use-product-filter";
import { cn } from "@/lib/utils";
export const ProductSort = () => {
  const [filters, setFilters] = useProductFilter();
  return (
    <div className=" flex items-center gap-2">
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "curated" &&
            "bg-transparent border-transparent hover:bg-transparent hover:border-border"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ ...filters, sort: "curated" })}
      >
        Curated
      </Button>
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "trending" &&
            "bg-transparent border-transparent hover:bg-transparent hover:border-border"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ ...filters, sort: "trending" })}
      >
        Trending
      </Button>
      <Button
        size={"sm"}
        className={cn(
          "rounded-full bg-white hover:bg-white",
          filters.sort !== "hot_and_new" &&
            "bg-transparent border-transparent hover:bg-transparent hover:border-border"
        )}
        variant={"secondary"}
        onClick={() => setFilters({ ...filters, sort: "hot_and_new" })}
      >
        Hot and New
      </Button>
    </div>
  );
};

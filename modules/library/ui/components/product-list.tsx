"use client";
import { useTRPC } from "@/trpc/cliient";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { ProductCard, ProductCardSkeleton } from "./product-card";
import { DEFAULT_LIMIT } from "@/app/constants";
import { Button } from "@/components/ui/button";
import { InboxIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const ProductList = () => {
  const trpc = useTRPC();
  const {
    data: products,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.library.getLibrary.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => {
          return lastPage.docs.length > 0 ? lastPage.nextPage : undefined;
        },
      }
    )
  );
  if (products?.pages.flatMap((page) => page.docs).length === 0) {
    return (
      <div className=" border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
        <InboxIcon className=" " />
        <p className=" text-base font-medium">No products found</p>
      </div>
    );
  }
  return (
    <>
      <div
        className={cn(
          " grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 gap-4"
        )}
      >
        {products?.pages
          .flatMap((page) => page.docs)
          .map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              imageUrl={product.image?.url}
              tenantSlug={product.tenant?.slug}
              tenantImageUrl={product.tenant?.image?.url ?? ""}
              reviewRating={product.reviewRating}
              reviewCount={product.reviewCount}
            />
          ))}
      </div>
      <div className=" flex justify-center pt-8">
        {hasNextPage && (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className=" font-medium disabled:opacity-50 text-base bg-white"
            variant={"elevated"}
          >
            {isFetchingNextPage ? "Loading more..." : "Load more"}
          </Button>
        )}
      </div>
    </>
  );
};

export const ProductListSkeleton = () => {
  return (
    <div
      className={cn(
        " grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 gap-4"
      )}
    >
      {Array.from({ length: DEFAULT_LIMIT }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

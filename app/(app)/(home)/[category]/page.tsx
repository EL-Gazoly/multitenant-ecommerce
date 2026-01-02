import { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductFilters } from "@/modules/products/ui/components/product-filters";
import { loadProductFilter } from "@/modules/products/hooks/search-params";
import { ProductSort } from "@/modules/products/ui/components/product-sort";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
  searchParams: Promise<SearchParams>;
}
export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { category } = await params;
  const filters = await loadProductFilter(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getProducts.queryOptions({
      category,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      tags: filters.tags,
      sort: filters.sort,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className=" px-4 lg:px-12 py-8 flex flex-col gap-4">
        <div className=" flex flex-col lg:flex-row lg:items-center gap-y-2 lg:gap-y-0 justify-between">
          <p className=" text-2xl font-medium">Curated for you</p>
          <ProductSort />
        </div>
        <div className=" grid grid-col-1 lg:grid-cols-6 xl:grid-cols-8 gap-y-6 gap-x-12">
          <div className="lg:col-span-2 xl:col-span-2">
            <ProductFilters />
          </div>
          <div className="lg:col-span-4 xl:col-span-6">
            <Suspense fallback={<ProductListSkeleton />}>
              <ProductList category={category} />
            </Suspense>
          </div>
        </div>
      </div>
    </HydrationBoundary>
  );
}

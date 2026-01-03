import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { SearchParams } from "nuqs/server";
import { loadProductFilter } from "@/modules/products/hooks/search-params";

interface SubCategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
  searchParams: Promise<SearchParams>;
}
export default async function SubCategoryPage({
  params,
  searchParams,
}: SubCategoryPageProps) {
  const { subcategory } = await params;
  const filters = await loadProductFilter(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getProducts.queryOptions({
      category: subcategory,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      tags: filters.tags,
      sort: filters.sort,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView category={subcategory} />
    </HydrationBoundary>
  );
}

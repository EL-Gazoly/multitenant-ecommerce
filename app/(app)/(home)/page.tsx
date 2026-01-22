import { SearchParams } from "nuqs/server";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { loadProductFilter } from "@/modules/products/hooks/search-params";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";
import { DEFAULT_LIMIT } from "@/app/constants";
export const dynamic = 'force-dynamic'
interface CategoryPageProps {
  searchParams: Promise<SearchParams>;
}
export default async function CategoryPage({
  searchParams,
}: CategoryPageProps) {
  const filters = await loadProductFilter(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.products.getProducts.infiniteQueryOptions({
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      tags: filters.tags,
      sort: filters.sort,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView />
    </HydrationBoundary>
  );
}

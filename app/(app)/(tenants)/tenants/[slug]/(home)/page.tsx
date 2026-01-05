import type { SearchParams } from "nuqs/server";
import { DEFAULT_LIMIT } from "@/app/constants";
import { loadProductFilter } from "@/modules/products/hooks/search-params";
import { trpc, getQueryClient } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { ProductListView } from "@/modules/products/ui/views/product-list-view";

interface TenantPageProps {
  searchParams: Promise<SearchParams>;
  params: Promise<{ slug: string }>;
}

const TenantPage = async ({ searchParams, params }: TenantPageProps) => {
  const { slug } = await params;
  const filters = await loadProductFilter(searchParams);
  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery(
    trpc.products.getProducts.infiniteQueryOptions({
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      tags: filters.tags,
      sort: filters.sort,
      tenantSlug: slug,
      limit: DEFAULT_LIMIT,
    })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductListView tenantSlug={slug} narrowView={true} />
    </HydrationBoundary>
  );
};

export default TenantPage;

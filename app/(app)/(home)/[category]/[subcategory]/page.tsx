import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary } from "@tanstack/react-query";
import { dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

interface SubCategoryPageProps {
  params: Promise<{
    category: string;
    subcategory: string;
  }>;
}
export default async function SubCategoryPage({
  params,
}: SubCategoryPageProps) {
  const { subcategory } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getProducts.queryOptions({
      category: subcategory,
    })
  );
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList category={subcategory} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}

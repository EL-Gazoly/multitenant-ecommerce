import { Suspense } from "react";
import {
  ProductList,
  ProductListSkeleton,
} from "@/modules/products/ui/components/product-list";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    trpc.products.getProducts.queryOptions({
      category,
    })
  );
  return (
    <div>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<ProductListSkeleton />}>
          <ProductList category={category} />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}

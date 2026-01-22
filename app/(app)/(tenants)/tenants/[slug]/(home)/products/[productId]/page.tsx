import { ProductView, ProductViewSkeleton } from "@/modules/products/ui/views/product-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
interface ProductPageProps {
  params: Promise<{ slug: string; productId: string }>;
}
export const dynamic = 'force-dynamic'
export const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug, productId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<ProductViewSkeleton />}>
      <ProductView productId={productId} tenantSlug={slug} />
      </Suspense>
    </HydrationBoundary>
  );
};

export default ProductPage;

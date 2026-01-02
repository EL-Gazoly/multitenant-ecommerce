"use client";
import { useTRPC } from "@/trpc/cliient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useProductFilter } from "@/modules/products/hooks/use-product-filter";

export const ProductList = ({ category }: { category: string }) => {
  const [filters] = useProductFilter();
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.products.getProducts.queryOptions({
      category,
      minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
      maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
      tags: filters.tags,
      sort: filters.sort,
    })
  );
  return (
    <div className=" grid grid-cols-1 sm:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 gap-4">
      {products?.docs.map((product) => (
        <div key={product.id} className="border rounded-md bg-white p-4">
          <h2 className="text-xl font-medium">{product.name}</h2>
          <p className="text-sm text-gray-500">${product.price}</p>
        </div>
      ))}
    </div>
  );
};

export const ProductListSkeleton = () => {
  return <div>Loading...</div>;
};

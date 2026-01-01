"use client";
import { useTRPC } from "@/trpc/cliient";
import { useSuspenseQuery } from "@tanstack/react-query";

export const ProductList = ({ category }: { category: string }) => {
  const trpc = useTRPC();
  const { data: products } = useSuspenseQuery(
    trpc.products.getProducts.queryOptions({
      category,
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

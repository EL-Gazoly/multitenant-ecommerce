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
  return <div>{JSON.stringify(products, null, 2)}</div>;
};

export const ProductListSkeleton = () => {
  return <div>Loading...</div>;
};

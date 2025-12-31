import { caller } from "@/trpc/server";

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}
export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const products = await caller.products.getProducts();
  console.log(products);
  return (
    <div>
      <h1>Category: {category}</h1>
      <div>{JSON.stringify(products, null, 2)}</div>
    </div>
  );
}

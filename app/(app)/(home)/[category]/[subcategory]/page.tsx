interface SubCategoryPageProps {
  params: {
    category: string;
    subCategory: string;
  };
}
export default async function SubCategoryPage({
  params,
}: SubCategoryPageProps) {
  const { subCategory } = await params;
  return <div>{subCategory}</div>;
}

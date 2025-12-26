import { Category } from "@/payload-types";
import { CategoryDropdown } from "./category-dropdown";

interface CategoriesProps {
  categories: Category[];
}
export const Categories = ({ categories }: CategoriesProps) => {
  return (
    <div className=" relative w-full">
      <div className=" flex flex-nowrap items-center">
        {categories.map((category) => (
          <div key={category.id}>
            <CategoryDropdown
              category={category}
              isActive={false}
              isNavigationHovered={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

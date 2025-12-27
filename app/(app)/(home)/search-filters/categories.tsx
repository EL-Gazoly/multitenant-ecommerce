import { CategoryDropdown } from "./category-dropdown";
import { CustomCategory } from "../types";

interface CategoriesProps {
  categories: CustomCategory[];
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

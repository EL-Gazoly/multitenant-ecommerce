import { SearchInput } from "./search-input";
import { Categories } from "./categories";
import { CustomCategory } from "../types";

interface SearchFiltersProps {
  categories: CustomCategory[];
}
export const SearchFilters = ({ categories }: SearchFiltersProps) => {
  return (
    <div className=" px-4 lg:px-12 py-8 border-b flex flex-col gap-4 w-full">
      <SearchInput categories={categories} />
      <div className="hidden lg:block">
        <Categories categories={categories} />
      </div>
    </div>
  );
};

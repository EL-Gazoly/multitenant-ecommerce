import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchFilters } from "./search-filters";
import { payload } from "@/lib/payload";
import { Category } from "@/payload-types";
interface LayoutProps {
  children: React.ReactNode;
}
const Layout = async ({ children }: LayoutProps) => {
  const categories = await payload.find({
    collection: "categories",
    where: {
      parent: {
        exists: false,
      },
    },
  });
  const formattedCategories = categories.docs.map((category) => ({
    ...category,
    subcategories: (category.subcategories?.docs ?? []).map((subcategory) => ({
      ...(subcategory as Category),
      subcategories: undefined,
    })),
  }));
  console.log(formattedCategories);
  return (
    <div className=" flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters categories={formattedCategories} />
      <main className=" flex-1 bg-[#f4f4f0]">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

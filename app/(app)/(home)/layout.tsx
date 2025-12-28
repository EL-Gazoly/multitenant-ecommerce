import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchFilters, SearchFiltersLoading } from "./search-filters";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
interface LayoutProps {
  children: React.ReactNode;
}
const Layout = async ({ children }: LayoutProps) => {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  return (
    <div className=" flex flex-col min-h-screen">
      <Navbar />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SearchFiltersLoading />}>
          <SearchFilters />
        </Suspense>
      </HydrationBoundary>
      <main className=" flex-1 bg-[#f4f4f0]">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;

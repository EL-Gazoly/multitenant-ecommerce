import { Navbar, NavbarSkeleton } from "@/modules/tenants/ui/components/navbar";
import { Footer } from "@/modules/tenants/ui/components/footer";
import { getQueryClient, trpc } from "@/trpc/server";
import { Suspense } from "react";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}
export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params;
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(trpc.tenants.getOne.queryOptions({ slug }));
  return (
    <div className=" min-h-screen bg-[#f4f4f0] flex flex-col">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<NavbarSkeleton />}>
          <Navbar slug={slug} />
          <main className=" flex-1">
            <div className=" max-w-(--breakpoint-xl) mx-auto ">{children}</div>
          </main>
          <Footer />
        </Suspense>
      </HydrationBoundary>
    </div>
  );
}

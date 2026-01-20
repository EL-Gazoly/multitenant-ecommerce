"use client";
import Link from "next/link";
import { ArrowLeftIcon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/trpc/cliient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReviewSidebar } from "../components/review-sidebar";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Suspense } from "react";
import { ReviewFormSkeleton } from "../components/review-form";
interface ProductViewProps {
  productId: string;
}
export const ProductView = ({ productId }: ProductViewProps) => {
  const trpc = useTRPC();
  const { data: product } = useSuspenseQuery(
    trpc.library.getOne.queryOptions({
      productId,
    })
  );
  return (
    <div className=" min-h-screen bg-white">
      <nav className=" p-4 bg-[#f4f4f0] w-full border-b">
        <Link prefetch href="/library" className=" flex items-center gap-2">
          <ArrowLeftIcon className=" size-4" />
          <span className=" text-sm font-medium">Back to library</span>
        </Link>
      </nav>
      <header className=" bg-[#f4f4f0] py-8 border-b">
        <div className=" max-w-(--breakpoint-xl) max-auto lg:px-12">
          <h1 className=" text-[40px] font-medium">{product?.name} </h1>
        </div>
      </header>
      <section className=" max-w-(--breakpoint-xl) max-auto lg:px-12 py-10">
        <div className=" grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-16">
          <div className=" lg:col-span-2">
            <div className=" p-4 bg-white rounded-md border gap-4 ">
              <Suspense fallback={<ReviewFormSkeleton />}>
              <ReviewSidebar productId={productId} />
              </Suspense>
            </div>
          </div>
          <div className=" lg:col-span-5">
            {product?.content ? (
                <RichText data={product.content} />
            ) : (
              <p className=" font-medium italic text-muted-foreground">
                No Special content
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export const ProductViewSkeleton = () => {
  return (
    <div className=" flex items-center justify-center h-screen">
      <Loader2Icon className=" size-4 animate-spin" />
    </div>
  );
};
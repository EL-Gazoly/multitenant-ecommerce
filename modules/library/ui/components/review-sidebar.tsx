"use client";
import { useTRPC } from "@/trpc/cliient";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ReviewForm } from "./review-form";
interface ReviewSidebarProps {
  productId: string;
}
export const ReviewSidebar = ({ productId }: ReviewSidebarProps) => {
  const trpc = useTRPC();
  const { data: review } = useSuspenseQuery(
    trpc.reviews.getOne.queryOptions({
      productId,
    })
  );

  return <ReviewForm productId={productId} initialData={review} />;
};

"use client";
import { StarRating } from "@/components/star-rating";
import { generateTenantUrl, formatCurrency } from "@/lib/utils";
import { useTRPC } from "@/trpc/cliient";
import { useSuspenseQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LinkIcon, StarIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import dynamic from "next/dynamic";

const CartButton = dynamic(
  () => import("../components/cart-button").then((mod) => mod.CartButton),
  {
    ssr: false,
    loading: () => (
      <Button disabled variant="elevated" className=" flex-1 bg-pink-400">
        Add to Cart
      </Button>
    ),
  }
);

interface ProductViewProps {
  productId: string;
  tenantSlug: string;
}
export const ProductView = ({ productId, tenantSlug }: ProductViewProps) => {
  const trpc = useTRPC();
  const { data: product } = useSuspenseQuery(
    trpc.products.getOne.queryOptions({ id: productId })
  );
  return (
    <div className=" px-4 lg:px-12 py-10">
      <div className=" border rounded-sm bg-white overflow-hidden">
        <div className=" relative aspect-[3.9] border-b">
          <Image
            src={product?.image?.url || "/placeholder.png"}
            alt={product?.name || ""}
            fill
            className=" object-cover"
          />
        </div>
        <div className=" grid grid-cols-1 lg:grid-cols-6 gap-6 p-6">
          <div className=" col-span-4">
            <div className="p-6">
              <h1 className=" text-4xl font-medium">{product?.name}</h1>
            </div>
            <div className=" border-y flex ">
              <div className=" px-6 py-4 flex items-center justify-center border-r">
                <div className=" relative px-2 py-1 border bg-pink-400 w-fit">
                  <p className=" text-base font-medium">
                    {formatCurrency(product?.price)}
                  </p>
                </div>
              </div>
              <div className=" px-6 py-4 flex items-center justify-center lg:border-r">
                <Link
                  href={`${generateTenantUrl(tenantSlug)}`}
                  className=" flex items-center gap-2"
                >
                  {product?.tenant?.image?.url && (
                    <Image
                      src={product?.tenant?.image?.url}
                      alt={product?.tenant?.name || ""}
                      width={20}
                      height={20}
                      className=" rounded-full border shrink-0 size-[20px]"
                    />
                  )}
                  <span className=" text-base underline font-medium">
                    {product?.tenant?.name}
                  </span>
                </Link>
              </div>
              <div className="hidden lg:flex px-6 py-4 justify-center items-center">
                <div className="flex items-center gap-1">
                  <StarRating rating={3} iconClassName="size-4" />
                </div>
              </div>
            </div>
            <div className="  block lg:hidden px-6 py-4 items-center justify-center border-b">
              <div className=" flex items-center gap-1">
                <StarRating rating={3} iconClassName="size-4" />
                <p className=" text-base font-medium">{5} ratings</p>
              </div>
            </div>
            <div className="p-6 ">
              {product?.description ? (
                <p className=" ">{product.description}</p>
              ) : (
                <p className="font-medium text-muted-foreground italic">
                  No description available
                </p>
              )}
            </div>
          </div>
          <div className=" col-span-2">
            <div className="border-t lg:border-t-0 lg:border-l h-full ">
              <div className=" flex flex-col gap-4 p-6 border-b">
                <div className=" flex flex-row items-center gap-2">
                  <CartButton tenantSlug={tenantSlug} productId={productId} />
                  <Button
                    variant="elevated"
                    className=" size-12 "
                    onClick={() => {}}
                    disabled={false}
                  >
                    <LinkIcon />
                  </Button>
                </div>
                <p className="  text-center font-medium">
                  {product.refundPolicy === "no-refund"
                    ? "No refund"
                    : `${product.refundPolicy} money back guarantee`}
                </p>
              </div>
              <div className="p-6">
                <div className=" flex items-center justify-between">
                  <h3 className=" text-xl font-medium">Ratings</h3>
                  <div className="flex items-center gap-x-1 font-medium">
                    <StarIcon className=" size-4 fill-black" />
                    <p>({5})</p>
                    <p className=" text-base">{3} ratings</p>
                  </div>
                </div>
                <div className=" flex flex-col gap-3 mt-4">
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <div key={rating} className=" flex items-center gap-x-2">
                      <div className=" font-medium flex items-center gap-x-1 w-14 shrink-0">
                        <p>{rating}</p> <p>{rating === 1 ? "star" : "stars"}</p>
                      </div>
                      <Progress value={0} className="h-lh flex-1" />
                      <div className=" font-medium w-6 shrink-0 text-right">
                        {0}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import Link from "next/link";
import Image from "next/image";
import { Media } from "@/payload-types";
import { StarIcon } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl?: Media["url"];
  authorUserName: string;
  authorImageUrl?: string;
  reviewRating: number;
  reviewCount: number;
}
export const ProductCard = ({
  id,
  name,
  price,
  imageUrl,
  authorUserName,
  authorImageUrl,
  reviewRating,
  reviewCount,
}: ProductCardProps) => {
  return (
    <Link href={`/products/${id}`}>
      <div className=" border rounded-md bg-white overflow-hidden h-full flex flex-col hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-shadow">
        <div className=" relative aspect-square">
          <Image
            src={imageUrl || "/placeholder.png"}
            alt={name}
            fill
            className=" object-cover"
          />
        </div>
        <div className="p-4 border-y flex flex-col gap-3 flex-1">
          <h2 className=" text-lg font-medium line-clamp-4">{name}</h2>
          <div className="flex items-center gap-2">
            {authorImageUrl && (
              <Image
                src={authorImageUrl}
                alt={authorUserName}
                width={16}
                height={16}
                className=" rounded-full border shrink-0 size-[16px]"
              />
            )}
            <span className=" text-sm underline font-medium">
              {authorUserName}
            </span>
          </div>
          {reviewCount > 0 && (
            <div className="flex items-center gap-1">
              <StarIcon className=" size-3.5 fill-black" />
              <p className=" text-sm font-medium">
                {reviewRating} ({reviewCount})
              </p>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="relative px-2 py-1 border bg-pink-400 w-fit">
            <p className=" text-sm font-medium">
              {new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(price)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export const ProductCardSkeleton = () => {
  return (
    <div className=" w-full aspect-3/4 bg-neutral-200 rounded-lg animate-pulse" />
  );
};

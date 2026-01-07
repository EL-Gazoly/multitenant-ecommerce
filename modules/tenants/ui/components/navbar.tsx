"use client";
import { useTRPC } from "@/trpc/cliient";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { generateTenantUrl } from "@/lib/utils";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { ShoppingCartIcon } from "lucide-react";
const CheckoutButton = dynamic(
  () =>
    import("@/modules/checkout/ui/components/checkout-button").then(
      (mod) => mod.CheckoutButton
    ),
  {
    ssr: false,

    loading: () => (
      <Button disabled variant="elevated" className="bg-white">
        <ShoppingCartIcon className="size-4 text-black" />
      </Button>
    ),
  }
);
interface NavbarProps {
  slug: string;
}
export const Navbar = ({ slug }: NavbarProps) => {
  const trpc = useTRPC();
  const { data: tenant } = useSuspenseQuery(
    trpc.tenants.getOne.queryOptions({ slug })
  );

  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className=" max-w-(--breakpoint-xl) mx-auto px-4 flex items-center justify-between h-full">
        <Link
          href={generateTenantUrl(slug)}
          className=" flex items-center gap-2"
        >
          {tenant.image?.url && (
            <Image
              src={tenant.image?.url}
              alt={slug}
              width={32}
              height={32}
              className=" rounded-full border shrink-0 size-[32px]"
            />
          )}
          <p className=" text-xl">{tenant.name}</p>
        </Link>
        <CheckoutButton tenantSlug={slug} />
      </div>
    </nav>
  );
};

export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className=" max-w-(--breakpoint-xl) mx-auto px-4 flex items-center justify-between h-full">
        <div />
        <Button disabled variant="elevated" className="bg-white">
          <ShoppingCartIcon className="size-4 text-black" />
        </Button>
      </div>
    </nav>
  );
};

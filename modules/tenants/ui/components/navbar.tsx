"use client";
import { useTRPC } from "@/trpc/cliient";
import { useSuspenseQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { generateTenantUrl } from "@/lib/utils";
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
      </div>
    </nav>
  );
};

export const NavbarSkeleton = () => {
  return (
    <nav className="h-20 border-b font-medium bg-white">
      <div className=" max-w-(--breakpoint-xl) mx-auto px-4 flex items-center justify-between h-full">
        <div />
      </div>
    </nav>
  );
};

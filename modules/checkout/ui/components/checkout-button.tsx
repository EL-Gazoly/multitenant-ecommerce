import { useCart } from "../../hooks/use-cart";
import { Button } from "@/components/ui/button";
import { cn, generateTenantUrl } from "@/lib/utils";
import { ShoppingCartIcon } from "lucide-react";
import Link from "next/link";
interface CheckoutButtonProps {
  className?: string;
  hideIfEmpty?: boolean;
  tenantSlug: string;
}
export const CheckoutButton = ({
  className,
  hideIfEmpty,
  tenantSlug,
}: CheckoutButtonProps) => {
  const { totalItems } = useCart(tenantSlug);
  if (hideIfEmpty && totalItems === 0) return null;

  return (
    <Button variant="elevated" className={cn(className, "bg-white")} asChild>
      <Link href={`${generateTenantUrl(tenantSlug)}/checkout`}>
        <ShoppingCartIcon className="size-4" />
        {totalItems > 0 ? totalItems : ""}
      </Link>
    </Button>
  );
};

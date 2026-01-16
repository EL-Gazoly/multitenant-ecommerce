"use client";
import { useTRPC } from "@/trpc/cliient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../hooks/use-cart";
import { useEffect } from "react";
import { toast } from "sonner";
import { generateTenantUrl } from "@/lib/utils";
import { CheckoutItem } from "../components/checkout-item";
import { CheckoutSidebar } from "../components/checkout-sidebar";
import { InboxIcon, Loader2Icon } from "lucide-react";
import { useCheckoutStates } from "../../hooks/use-checkout-states";
import { useRouter } from "next/navigation";
interface CheckoutViewProps {
  tenantSlug: string;
}
export const CheckoutView = ({ tenantSlug }: CheckoutViewProps) => {
  const router = useRouter();
  const [states, setStates] = useCheckoutStates();
  const { productIds, removeProductFromCart, clearCart } = useCart(tenantSlug);
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const {
    data: products,
    error,
    isLoading,
  } = useQuery(trpc.checkout.getProducts.queryOptions({ ids: productIds }));
  const purchase = useMutation(
    trpc.checkout.purchase.mutationOptions({
      onMutate: () => {
        setStates({ canceled: false, success: false });
      },
      onSuccess: (data) => {
        // Use a side effect-safe navigation method
        router.push(data.url);
      },
      onError: (error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          router.push("/sign-in");
        }
        toast.error(error.message);
      },
    })
  );
  useEffect(() => {
    if (states.success) {
      setStates({ canceled: false, success: false });
      clearCart();
      queryClient.invalidateQueries(
        trpc.library.getLibrary.infiniteQueryFilter()
      );
      router.push("/library");
    }
  }, [
    states.success,
    clearCart,
    router,
    setStates,
    queryClient,
    trpc.library.getLibrary,
  ]);
  useEffect(() => {
    if (error?.data?.code === "NOT_FOUND") {
      clearCart();
      toast.warning("Some products were not found, cart cleared");
    }
  }, [error, clearCart]);
  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className=" border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <Loader2Icon className=" text-muted-foreground animate-spin" />
        </div>
      </div>
    );
  }
  if (products?.docs.length === 0) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <div className=" border border-black border-dashed flex items-center justify-center p-8 flex-col gap-y-4 bg-white w-full rounded-lg">
          <InboxIcon />
          <p className=" text-base font-medium">No products found</p>
        </div>
      </div>
    );
  }
  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className=" grid grid-col-1 lg:grid-cols-7 gap-4 lg:gap-16">
        <div className=" lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {products?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                id={product.id}
                isLast={index === products?.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                price={product.price}
                productUrl={`${generateTenantUrl(tenantSlug)}/products/${product.id}`}
                tenantUrl={`${generateTenantUrl(tenantSlug)}`}
                tenantName={product.tenant?.name}
                onRemove={() => removeProductFromCart(product.id)}
              />
            ))}
          </div>
        </div>
        <div className=" lg:col-span-3">
          <CheckoutSidebar
            total={products?.totalPrice ?? 0}
            onPurchase={() => purchase.mutate({ productIds, tenantSlug })}
            isCanceled={states.canceled}
            disabled={purchase.isPending}
          />
        </div>
      </div>
    </div>
  );
};

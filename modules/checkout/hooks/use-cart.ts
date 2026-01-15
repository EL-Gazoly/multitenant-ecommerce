import { useCartStore } from "../store/use-cart-store";
import { useShallow } from "zustand/react/shallow";
import { useCallback } from "react";

export const useCart = (tenantSlug: string) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart);
  const removeProductFromCart = useCartStore(
    (state) => state.removeProductFromCart
  );
  const clearCart = useCartStore((state) => state.clearCart);
  const clearAllCarts = useCartStore((state) => state.clearAllCarts);

  const productIds = useCartStore(
    useShallow((state) => state.tenantCarts[tenantSlug]?.productIds || [])
  );

  const toggleProduct = useCallback(
    (productId: string) => {
      const ids = productIds;
      if (ids.includes(productId)) {
        removeProductFromCart(tenantSlug, productId);
      } else {
        addProductToCart(tenantSlug, productId);
      }
    },
    [tenantSlug, productIds, removeProductFromCart, addProductToCart]
  );

  const isProductInCart = useCallback(
    (productId: string) => {
      const ids = productIds;
      return ids.includes(productId);
    },
    [productIds]
  );
  const clearTenantCart = useCallback(() => {
    clearCart(tenantSlug);
  }, [tenantSlug, clearCart]);

  const handleAddProductToCart = useCallback(
    (productId: string) => {
      addProductToCart(tenantSlug, productId);
    },
    [tenantSlug, addProductToCart]
  );
  const handleRemoveProductFromCart = useCallback(
    (productId: string) => {
      removeProductFromCart(tenantSlug, productId);
    },
    [tenantSlug, removeProductFromCart]
  );

  return {
    productIds,
    addProductToCart: (productId: string) => handleAddProductToCart(productId),
    removeProductFromCart: (productId: string) =>
      handleRemoveProductFromCart(productId),
    clearCart: () => clearCart(tenantSlug),
    clearAllCarts: () => clearAllCarts(),
    toggleProduct,
    isProductInCart,
    clearTenantCart,
    totalItems: productIds.length,
  };
};

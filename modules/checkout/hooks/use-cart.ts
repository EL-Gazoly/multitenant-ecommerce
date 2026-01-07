import { useCartStore } from "../store/use-cart-store";

export const useCart = (tenantSlug: string) => {
  const {
    addProductToCart,
    removeProductFromCart,
    clearCart,
    clearAllCarts,
    getCartByTenant,
  } = useCartStore();

  const productIds = getCartByTenant(tenantSlug);

  const toggleProduct = (productId: string) => {
    if (productIds.includes(productId)) {
      removeProductFromCart(tenantSlug, productId);
    } else {
      addProductToCart(tenantSlug, productId);
    }
  };

  const isProductInCart = (productId: string) => {
    return productIds.includes(productId);
  };
  const clearTenantCart = () => {
    clearCart(tenantSlug);
  };
  return {
    productIds,
    addProductToCart: (productId: string) =>
      addProductToCart(tenantSlug, productId),
    removeProductFromCart: (productId: string) =>
      removeProductFromCart(tenantSlug, productId),
    clearCart: () => clearCart(tenantSlug),
    clearAllCarts: () => clearAllCarts(),
    toggleProduct,
    isProductInCart,
    clearTenantCart,
    totalItems: productIds.length,
  };
};

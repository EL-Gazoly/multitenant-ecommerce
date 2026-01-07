import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface TenantCart {
  productIds: string[];
}

interface CartState {
  tenantCarts: Record<string, TenantCart>;
  addProductToCart: (tenantSlug: string, productId: string) => void;
  removeProductFromCart: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantId: string) => void;
  clearAllCarts: () => void;
  getCartByTenant: (tenantSlug: string) => string[];
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      tenantCarts: {},
      addProductToCart: (tenantSlug: string, productId: string) => {
        set((state) => {
          const existingIds = state.tenantCarts[tenantSlug]?.productIds || [];
          if (existingIds.includes(productId)) {
            return state;
          }
          return {
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: {
                productIds: [...existingIds, productId],
              },
            },
          };
        });
      },
      removeProductFromCart: (tenantSlug: string, productId: string) => {
        set((state) => {
          const tenantCart = state.tenantCarts[tenantSlug];
          if (!tenantCart) return state;
          return {
            tenantCarts: {
              ...state.tenantCarts,
              [tenantSlug]: {
                productIds: tenantCart.productIds.filter(
                  (id) => id !== productId
                ),
              },
            },
          };
        });
      },
      clearCart: (tenantId: string) => {
        set((state) => {
          const newCarts = { ...state.tenantCarts };
          delete newCarts[tenantId];
          return { tenantCarts: newCarts };
        });
      },
      clearAllCarts: () => {
        set({ tenantCarts: {} });
      },
      getCartByTenant: (tenantSlug: string) => {
        const state = get();
        return state.tenantCarts[tenantSlug]?.productIds || [];
      },
    }),
    {
      name: "funroad-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

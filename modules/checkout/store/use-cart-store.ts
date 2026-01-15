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
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
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
    }),
    {
      name: "funroad-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

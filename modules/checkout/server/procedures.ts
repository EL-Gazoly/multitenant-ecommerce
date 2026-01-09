import { Media, Tenant } from "@/payload-types";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const checkoutRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
          id: {
            in: input.ids,
          },
        },
      });
      if (products.docs.length !== input.ids.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Some products were not found",
        });
      }
      const totalPrice = products.docs.reduce((acc, product) => {
        const price = Number(product.price);
        return acc + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        ...products,
        totalPrice,
        docs: products.docs.map((product) => ({
          ...product,
          image: product.image as Media | null,
          tenant: product.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});

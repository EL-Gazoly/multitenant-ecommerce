import { DEFAULT_LIMIT } from "@/app/constants";
import { Media, Tenant } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";

export const libraryRouter = createTRPCRouter({
  getLibrary: protectedProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const orders = await ctx.db.find({
        collection: "orders",
        depth: 0,
        page: cursor,
        limit,
        where: {
          user: {
            equals: ctx.session?.user?.id,
          },
        },
      });
      const productsIds = orders.docs.map((order) => order.products);
      const productsData = await ctx.db.find({
        collection: "products",
        pagination: false,
        where: {
          id: {
            in: productsIds,
          },
        },
      });
      return {
        ...productsData,
        docs: productsData.docs.map((product) => ({
          ...product,
          image: product.image as Media | null,
          tenant: product.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});

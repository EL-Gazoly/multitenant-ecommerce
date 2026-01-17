import { DEFAULT_LIMIT } from "@/app/constants";
import { Media, Tenant } from "@/payload-types";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import z from "zod";

export const libraryRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(z.object({ productId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { productId } = input;
      const orderData = await ctx.db.find({
        collection: "orders",
        depth: 0,
        limit: 1,
        pagination: false,
        where: {
          and: [
            {
              products: {
                equals: productId,
              },
            },
            {
              user: {
                equals: ctx.session?.user?.id,
              },
            },
          ],
        },
      });
      const order = orderData.docs[0];
      if (!order) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Order not found",
        });
      }
      const productData = await ctx.db.findByID({
        collection: "products",
        id: productId,
      });
      if (!productData) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      return productData;
    }),
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
      const dataWithSummarizedReviews = await Promise.all(productsData.docs.map(async (product) => {
        const reviews = await ctx.db.find({
          collection: "reviews",
          where: {
            product: {
              equals: product.id,
            },
          },
        });
        return {
          ...product,
         reviewCount: reviews.totalDocs,
         reviewRating: reviews.totalDocs > 0 ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) / reviews.totalDocs : 0,
        };
      }));
      return {
        ...productsData,
        docs: dataWithSummarizedReviews.map((product) => ({
          ...product,
          image: product.image as Media | null,
          tenant: product.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});

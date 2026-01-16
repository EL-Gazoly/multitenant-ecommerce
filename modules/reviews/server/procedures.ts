import z from "zod";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";

export const reviewsRouter = createTRPCRouter({
  getOne: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      const reviews = await ctx.db.find({
        collection: "reviews",
        limit: 1,
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session?.user?.id || undefined,
              },
            },
          ],
        },
      });
      const review = reviews.docs[0];
      if (!review) {
        return null;
      }
      return review;
    }),
  create: protectedProcedure
    .input(
      z.object({
        productId: z.string(),
        description: z.string().min(1, { message: "Description is required" }),
        rating: z.number().min(1, { message: "Rating must be at least 1" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be logged in to create a review",
        });
      }
      const product = await ctx.db.findByID({
        collection: "products",
        id: input.productId,
      });
      if (!product) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Product not found",
        });
      }
      const existingReviewsData = await ctx.db.find({
        collection: "reviews",
        where: {
          and: [
            {
              product: {
                equals: input.productId,
              },
            },
            {
              user: {
                equals: ctx.session.user.id,
              },
            },
          ],
        },
      });
      if (existingReviewsData.docs.length > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You have already reviewed this product",
        });
      }
      const review = await ctx.db.create({
        collection: "reviews",
        data: {
          product: input.productId,
          user: ctx.session.user.id,
          description: input.description,
          rating: input.rating,
        },
      });
      return review;
    }),
  update: protectedProcedure
    .input(
      z.object({
        reviewId: z.string(),
        description: z.string().min(1, { message: "Description is required" }),
        rating: z.number().min(1, { message: "Rating must be at least 1" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const review = await ctx.db.findByID({
        collection: "reviews",
        depth: 0,
        id: input.reviewId,
      });
      if (!review) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Review not found",
        });
      }
      if (review.user !== ctx.session?.user?.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to update this review",
        });
      }
      const updatedReview = await ctx.db.update({
        collection: "reviews",
        id: input.reviewId,
        data: {
          description: input.description,
          rating: input.rating,
        },
      });
      return updatedReview;
    }),
});

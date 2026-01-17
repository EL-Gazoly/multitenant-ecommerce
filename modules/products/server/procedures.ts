import { z } from "zod";
import { headers as getHeaders } from "next/headers";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import type { Sort, Where } from "payload";
import type { Category, Media, Product, Tenant } from "@/payload-types";
import { sortVAlues } from "../hooks/search-params";
import { DEFAULT_LIMIT } from "@/app/constants";
export const productsRouter = createTRPCRouter({
  getOne: baseProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const headers = await getHeaders();
      const session = await ctx.db.auth({ headers });
      const { id } = input;
      const product = await ctx.db.findByID({
        collection: "products",
        depth: 2, // to get the tenant and the image
        id,
      });
      let purchased = false;
      if (session.user) {
        const ordersData = await ctx.db.find({
          collection: "orders",
          depth: 1,
          pagination: false,
          limit: 1,
          where: {
            and: [
              {
                user: {
                  equals: session.user.id,
                },
              },
              {
                products: {
                  equals: id,
                },
              },
            ],
          },
        });
        purchased = !!ordersData.docs[0];
      }
      const isPurchased = purchased;
      const reviews = await ctx.db.find({
        collection: "reviews",
        pagination: false,
        where: {
          product: {
            equals: id,
          },
        },
      });
      const reviewRating = reviews.totalDocs > 0 ? reviews.docs.reduce((acc, review) => acc + review.rating, 0) / reviews.totalDocs : 0;
      const ratingDistribution : Record<number, number> = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0,
      };
      if (reviews.totalDocs > 0) {
        reviews.docs.forEach((review) => {
         const rating = review.rating;
         if (rating >= 1 && rating <= 5) {
          ratingDistribution[rating] = (ratingDistribution[rating] || 0) + 1;
         }
        });
        Object.keys(ratingDistribution).forEach((key) => {
         const rating = Number(key);
         const count = ratingDistribution[rating] || 0;
         ratingDistribution[rating] = Math.round((count / reviews.totalDocs) * 100);
        });
      }
      return {
        ...product,
        isPurchased,
        reviewRating,
        ratingDistribution,
        reviewCount: reviews.totalDocs,
      } as Product & {
        image: Media | null;
        tenant: Tenant & { image: Media | null };
        isPurchased: boolean;
        reviewRating: number;
        ratingDistribution: Record<number, number>;
        reviewCount: number;
      };
    }),
  getProducts: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.number().nullable().optional(),
        maxPrice: z.number().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortVAlues).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {
        price: {},
      };
      let sort: Sort = "-createdAt";
      if (input.sort === "trending") {
        sort = "name";
      } else if (input.sort === "hot_and_new") {
        sort = "-createdAt";
      } else if (input.sort === "curated") {
        sort = "+createdAt";
      }
      if (input.minPrice && input.maxPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
          less_than_equal: input.maxPrice,
        };
      } else if (input.minPrice) {
        where.price = {
          greater_than_equal: input.minPrice,
        };
      } else if (input.maxPrice) {
        where.price = {
          less_than_equal: input.maxPrice,
        };
      }
      if (input.tenantSlug) {
        where["tenant.slug"] = {
          equals: input.tenantSlug,
        };
      }

      if (input.category) {
        const categoriesData = await ctx.db.find({
          collection: "categories",
          limit: 1,
          depth: 1,
          pagination: false,
          where: {
            slug: {
              equals: input.category,
            },
          },
        });
        const formattedCategories = categoriesData.docs.map((category) => ({
          ...category,
          subcategories: (category.subcategories?.docs ?? []).map(
            (subcategory) => ({
              ...(subcategory as Category),
              subcategories: undefined,
            })
          ),
        }));
        const subcategories: string[] = [];
        const parentCategory = formattedCategories[0];
        if (parentCategory) {
          subcategories.push(
            ...parentCategory.subcategories.map(
              (subcategory) => subcategory.slug
            )
          );
          where["category.slug"] = {
            in: [parentCategory.slug, ...subcategories],
          };
        }
      }
      if (input.tags && input.tags.length > 0) {
        where["tags.name"] = {
          in: input.tags,
        };
      }
      const products = await ctx.db.find({
        collection: "products",
        depth: 2, // to get the tenant and the image
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });
      const dataWithSummarizedReviews = await Promise.all(products.docs.map(async (product) => {
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
        ...products,
        docs: dataWithSummarizedReviews.map((product) => ({
          ...product,
          image: product.image as Media | null,
          tenant: product.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});

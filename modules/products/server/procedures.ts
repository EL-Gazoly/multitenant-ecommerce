import { z } from "zod";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import type { Sort, Where } from "payload";
import type { Category, Media } from "@/payload-types";
import { sortVAlues } from "../hooks/search-params";
import { DEFAULT_LIMIT } from "@/app/constants";
export const productsRouter = createTRPCRouter({
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
        depth: 1,
        where,
        sort,
        page: input.cursor,
        limit: input.limit,
      });
      return {
        ...products,
        docs: products.docs.map((product) => ({
          ...product,
          image: product.images as unknown as Media[] | null,
        })),
      };
    }),
});

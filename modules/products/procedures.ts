import { z } from "zod";
import { createTRPCRouter, baseProcedure } from "@/trpc/init";
import type { Where } from "payload";
import type { Category } from "@/payload-types";
export const productsRouter = createTRPCRouter({
  getProducts: baseProcedure
    .input(
      z.object({
        category: z.string().nullable().optional(),
        minPrice: z.number().nullable().optional(),
        maxPrice: z.number().nullable().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: Where = {};
      if (input.minPrice) {
        where["price"] = {
          greater_than_equal: input.minPrice,
        };
      }
      if (input.maxPrice) {
        where["price"] = {
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

      const products = await ctx.db.find({
        collection: "products",
        depth: 1,
        where,
      });
      return products;
    }),
});

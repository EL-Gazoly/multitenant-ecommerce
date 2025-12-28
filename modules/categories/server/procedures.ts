import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

export const categoriesRouter = createTRPCRouter({
  getMany: baseProcedure.query(async ({ ctx }) => {
    const categories = await ctx.db.find({
      collection: "categories",
      where: {
        parent: {
          exists: false,
        },
      },
    });
    const formattedCategories = categories.docs.map((category) => ({
      ...category,
      subcategories: (category.subcategories?.docs ?? []).map(
        (subcategory) => ({
          ...(subcategory as Category),
          subcategories: undefined,
        })
      ),
    }));
    return formattedCategories;
  }),
});

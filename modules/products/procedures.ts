import { createTRPCRouter, baseProcedure } from "@/trpc/init";

export const productsRouter = createTRPCRouter({
  getProducts: baseProcedure.query(async ({ ctx }) => {
    const products = await ctx.db.find({
      collection: "products",
      depth: 1, // get the products with the categories and media
    });
    return products;
  }),
});

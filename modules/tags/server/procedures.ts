import { z } from "zod";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { DEFAULT_LIMIT } from "@/app/constants";

export const tagsRouter = createTRPCRouter({
  getAll: baseProcedure
    .input(
      z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_LIMIT),
      })
    )
    .query(async ({ ctx, input }) => {
      const { cursor, limit } = input;
      const tags = await ctx.db.find({
        collection: "tags",
        limit,
        page: cursor,
      });
      return tags;
    }),
});

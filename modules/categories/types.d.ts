import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/router";

export type CategoriesGetManyOutput =
  inferRouterOutputs<AppRouter>["categories"]["getMany"];
export type Category = CategoriesGetManyOutput[0];

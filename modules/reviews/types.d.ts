import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/router";

export type ReviewsGetOneOutput =
  inferRouterOutputs<AppRouter>["reviews"]["getOne"];
export type Review = ReviewsGetOneOutput;

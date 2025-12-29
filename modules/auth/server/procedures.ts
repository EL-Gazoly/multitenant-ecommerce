import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { z } from "zod";
import { AUTH_COOKIE_NAME } from "../constanst";
import { loginSchema, registerSchema } from "../schema";

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.db.auth({ headers });
    return session;
  }),
  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { username, email, password } = input;
      const existingData = await ctx.db.find({
        collection: "users",
        limit: 1,
        where: {
          username: {
            equals: username,
          },
        },
      });
      const existingUser = existingData.docs[0];
      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Username already exists",
        });
      }
      const newUser = await ctx.db.create({
        collection: "users",
        data: { username, email, password },
      });
      const user = await ctx.db.login({
        collection: "users",
        data: { email: newUser.email, password },
      });
      if (!newUser || !user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user",
        });
      }
      const cookies = await getCookies();
      cookies.set(AUTH_COOKIE_NAME, user.token || "", {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return user;
    }),
  login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;
    const user = await ctx.db.login({
      collection: "users",
      data: { email, password },
    });
    if (!user) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Invalid email or password",
      });
    }
    const cookies = await getCookies();
    cookies.set(AUTH_COOKIE_NAME, user.token || "", {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return user;
  }),
  logout: baseProcedure.mutation(async ({}) => {
    const cookies = await getCookies();
    cookies.delete(AUTH_COOKIE_NAME);
    return { success: true };
  }),
});

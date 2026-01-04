import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { headers as getHeaders, cookies as getCookies } from "next/headers";
import { loginSchema, registerSchema } from "../schema";
import { generateAuthCookie } from "../utils";

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
      const tenant = await ctx.db.create({
        collection: "tenants",
        data: {
          name: username,
          slug: username,
          " stripeAccountId": "mock",
        },
      });
      const newUser = await ctx.db.create({
        collection: "users",
        data: { username, email, password, tenants: [{ tenant: tenant }] },
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
      await generateAuthCookie({
        prefix: ctx.db.config.cookiePrefix,
        value: user.token || "",
      })();
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
    await generateAuthCookie({
      prefix: ctx.db.config.cookiePrefix,
      value: user.token || "",
    })();

    return user;
  }),
  logout: baseProcedure.mutation(async ({ ctx }) => {
    const cookies = await getCookies();
    cookies.delete(ctx.db.config.cookiePrefix + "-token");
    return { success: true };
  }),
});

import { Media, Tenant } from "@/payload-types";
import {
  createTRPCRouter,
  baseProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { z } from "zod";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { stripe } from "@/lib/stripe";

export const checkoutRouter = createTRPCRouter({
  purchase: protectedProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
        tenantSlug: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { productIds, tenantSlug } = input;
      const products = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
          and: [
            {
              id: {
                in: productIds,
              },
            },
            {
              "tenant.slug": {
                equals: tenantSlug,
              },
            },
          ],
        },
      });
      if (products.docs.length !== productIds.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Some products were not found",
        });
      }
      const tenantsData = await ctx.db.find({
        collection: "tenants",
        limit: 1,
        depth: 1,
        pagination: false,
        where: {
          slug: {
            equals: tenantSlug,
          },
        },
      });
      const tenant = tenantsData.docs[0];
      if (!tenant) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Tenant not found" });
      }
      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
        products.docs.map((product) => ({
          price_data: {
            unit_amount: product.price * 100, // stripe expects the price in cents
            currency: "usd",
            product_data: {
              name: product.name,
              metadata: {
                stripeAccountId: tenant.stripeAccountId,
                productId: product.id,
                name: product.name,
                price: product.price,
                currency: "usd",
              } as ProductMetadata,
            },
          },
          quantity: 1,
        }));
      const checkout = await stripe.checkout.sessions.create({
        customer_email: ctx?.session?.user?.email ?? "",
        success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}/checkout?success=true`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${tenantSlug}/checkout?cancel=true`,
        line_items: lineItems,
        mode: "payment",
        invoice_creation: {
          enabled: true,
        },
        metadata: {
          userId: ctx.session?.user?.id,
        } as CheckoutMetadata,
      });
      if (!checkout.url) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
      return { url: checkout.url };
    }),
  getProducts: baseProcedure
    .input(
      z.object({
        ids: z.array(z.string()),
      })
    )
    .query(async ({ ctx, input }) => {
      const products = await ctx.db.find({
        collection: "products",
        depth: 2,
        where: {
          id: {
            in: input.ids,
          },
        },
      });
      if (products.docs.length !== input.ids.length) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Some products were not found",
        });
      }
      const totalPrice = products.docs.reduce((acc, product) => {
        const price = Number(product.price);
        return acc + (isNaN(price) ? 0 : price);
      }, 0);

      return {
        ...products,
        totalPrice,
        docs: products.docs.map((product) => ({
          ...product,
          image: product.image as Media | null,
          tenant: product.tenant as Tenant & { image: Media | null },
        })),
      };
    }),
});

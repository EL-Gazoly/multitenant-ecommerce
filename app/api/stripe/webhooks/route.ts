import type { Stripe } from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { ExpandedLineItem } from "@/modules/checkout/types";

export async function POST(request: Request) {
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      await (await request.blob()).text(),
      request.headers.get("stripe-signature") as string,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    if (!(error instanceof Error)) {
      console.error(error);
    }
    return NextResponse.json(
      { error: `Webhook failed: ${errorMessage}` },
      { status: 400 }
    );
  }

  console.log("Successfully processed event", event.id);
  const permittedEvents: string[] = ["checkout.session.completed"];

  // Only process events that are in the permitted list
  if (permittedEvents.includes(event.type)) {
    const payload = await getPayload({ config });
    let data: Stripe.Checkout.Session | Stripe.PaymentIntent;
    try {
      switch (event.type) {
        case "checkout.session.completed":
          data = event.data.object as Stripe.Checkout.Session;
          if (!data.metadata?.userId) {
            throw new Error("User ID is required");
          }
          const user = await payload.findByID({
            collection: "users",
            id: data.metadata.userId,
          });
          if (!user) {
            throw new Error("User not found");
          }
          const expandedSession = await stripe.checkout.sessions.retrieve(
            data.id,
            {
              expand: ["line_items.data.price.product"],
            }
          );
          if (
            !expandedSession.line_items?.data ||
            !expandedSession.line_items.data.length
          ) {
            throw new Error("No line items found");
          }
          const lineItems = expandedSession.line_items
            .data as ExpandedLineItem[];
          for (const lineItem of lineItems) {
            await payload.create({
              collection: "orders",
              data: {
                stripeCheckoutSessionId: data.id,
                user: user.id,
                products: lineItem.price.product.metadata.productId,
                name: lineItem.price.product.name,
              },
            });
          }
          break;
        default:
          throw new Error(`Unsupported event type: ${event.type}`);
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: `Failed to process event: ${error instanceof Error ? error.message : "Unknown error"}`,
        },
        { status: 500 }
      );
    }
  }
  return NextResponse.json(
    { message: "Event processed successfully" },
    { status: 200 }
  );
}

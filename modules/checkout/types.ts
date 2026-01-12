import type Stripe from "stripe";
export type ProductMetadata = {
  stripeAccountId: string;
  productId: string;
  name: string;
  price: number;
  currency: string;
};

export type CheckoutMetadata = {
  userId: string;
};

export type ExpandedLineItem = Stripe.LineItem & {
  price: Stripe.Price & {
    product: Stripe.Product & {
      metadata: ProductMetadata;
    };
  };
};

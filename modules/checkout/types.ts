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

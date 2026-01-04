import type { CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  admin: {
    useAsTitle: "slug",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "Store Name",
      admin: {
        description: "The name of the store",
      },
    },
    {
      name: "slug",
      type: "text",
      index: true,
      unique: true,
      required: true,
      admin: {
        description:
          "The is the subdomain of the store (e.g. [slug].funroad.com).",
      },
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "The image of the store",
      },
    },
    {
      name: " stripeAccountId",
      type: "text",
      admin: {
        readOnly: true,
      },
    },
    {
      name: "stripeDetailsSubmitted",
      type: "checkbox",
      admin: {
        readOnly: true,
        description:
          "You cannot create products until the Stripe details are submitted",
      },
    },
  ],
};

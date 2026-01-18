import { isSuperAdmin } from "@/lib/access";
import type { User as UserType } from "@/payload-types";
import { ClientUser, CollectionConfig } from "payload";

export const Orders: CollectionConfig = {
  slug: "orders",
  access: {
    read : ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    create: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    update: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    delete: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
  },
  labels: {
    singular: "Order",
    plural: "Orders",
  },
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: false,
    },
    {
      name: "stripeCheckoutSessionId",
      type: "text",
      required: true,
      admin: {
        description: "The Stripe checkout session ID of the order",
      }
    },
  ],
};

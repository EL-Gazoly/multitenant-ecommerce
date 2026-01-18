import { isSuperAdmin } from "@/lib/access";
import type { User as UserType } from "@/payload-types";
import { ClientUser, CollectionConfig } from "payload";

export const Tenants: CollectionConfig = {
  slug: "tenants",
  access: {
    create: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    delete: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
  },
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
      access: {
        update: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
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
      name: "stripeAccountId",
      type: "text",
      access: {
        update: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
      },
      admin: {
        readOnly: true,
        description: "The Stripe account ID of the store",
      },
    },
    {
      name: "stripeDetailsSubmitted",
      type: "checkbox",
      admin: {
        description:
          "You cannot create products until the Stripe details are submitted",
      },
      access: {
        update: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
      },
    },
  ],
};

import { isSuperAdmin } from "@/lib/access";
import type { User as UserType } from "@/payload-types";
import { ClientUser, CollectionConfig } from "payload";
export const Reviews: CollectionConfig = {
  slug: "reviews",
  access: {
    read : ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    create: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    update: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    delete: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
  },
  labels: {
    singular: "Review",
    plural: "Reviews",
  },
  fields: [
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      hasMany: false,
      required: true,
    },
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      required: true,
    },
  ],
};

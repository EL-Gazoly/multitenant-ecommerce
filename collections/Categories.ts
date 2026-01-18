import { isSuperAdmin } from "@/lib/access";
import type { User as UserType } from "@/payload-types";
import { ClientUser, CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
  slug: "categories",
  access: {
    read: () => true,
    create: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    update: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    delete: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
  },
  admin: {
    useAsTitle: "name",
    hidden: ({user}) => !isSuperAdmin(user as UserType | ClientUser),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },

    {
      name: "slug",
      type: "text",
      required: true,
      index: true,
    },
    {
      name: "color",
      type: "text",
    },
    {
      name: "parent",
      type: "relationship",
      relationTo: "categories",
      hasMany: false,
    },
    {
      name: "subcategories",
      type: "join",
      collection: "categories",
      on: "parent",
      hasMany: true,
    },
  ],
};

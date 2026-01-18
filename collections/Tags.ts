import { isSuperAdmin } from "@/lib/access";
import type { User as UserType } from "@/payload-types";
import { ClientUser, CollectionConfig } from "payload";

export const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    useAsTitle: "name",
    hidden: ({user}) => !isSuperAdmin(user as UserType | ClientUser),
  },
  access: {
    read: () => true,
    create: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    update: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    delete: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "products",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
  ],
};

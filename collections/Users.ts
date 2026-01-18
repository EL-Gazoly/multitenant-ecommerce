import type { CollectionConfig } from "payload";
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";
import { isSuperAdmin } from "@/lib/access";
import type { User as UserType } from "@/payload-types";
import { ClientUser } from "payload";

const deafultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    update: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
  },
  tenantFieldAccess: {
    read: () => true,
    create: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    update: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
  },
});
export const Users: CollectionConfig = {
  slug: "users",
  access: {
    read: () => true,
    create: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
    update: ({req ,id}) => {
      if (id === req?.user?.id) return true;
      return isSuperAdmin(req?.user as UserType | ClientUser);
    },
    delete: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
  },
  admin: {
    useAsTitle: "email",
    hidden: ({user}) => !isSuperAdmin(user as UserType | ClientUser),
  },
  auth: true,
  fields: [
    {
      name: "username",
      type: "text",
      unique: true,
      required: true,
    },
    {
      name: "email",
      type: "email",
    },
    {
      name: "roles",
      type: "select",
      options: ["super-admin", "user"],
      defaultValue: ["user"],
      admin: {
        description: "The roles of the user",
        position: "sidebar",
      },
      hasMany: true,
      access: {
        read: () => true,
        create: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
        update: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
      },
    },
    {
      ...deafultTenantArrayField,
      admin: {
        ...(deafultTenantArrayField.admin || {}),
        position: "sidebar",
      },
    },
  ],
};

import type { CollectionConfig } from "payload";
import { tenantsArrayField } from "@payloadcms/plugin-multi-tenant/fields";

const deafultTenantArrayField = tenantsArrayField({
  tenantsArrayFieldName: "tenants",
  tenantsCollectionSlug: "tenants",
  tenantsArrayTenantFieldName: "tenant",
  arrayFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
  tenantFieldAccess: {
    read: () => true,
    create: () => true,
    update: () => true,
  },
});
export const Users: CollectionConfig = {
  slug: "users",
  admin: {
    useAsTitle: "email",
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

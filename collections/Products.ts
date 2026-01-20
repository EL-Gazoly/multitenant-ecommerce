import { isSuperAdmin } from "@/lib/access";
import type { User as UserType, Tenant } from "@/payload-types";
import { ClientUser, CollectionConfig } from "payload";
import { lexicalEditor, UploadFeature } from "@payloadcms/richtext-lexical";

export const Products: CollectionConfig = {
  slug: "products",
  access: {
    create: ({req}) => {
      if(isSuperAdmin(req?.user as UserType | ClientUser)) return true;
      const tenant = req.user?.tenants?.[0]?.tenant as Tenant;
      return Boolean(tenant?.stripeDetailsSubmitted)
    },
    delete: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser)
  },
  labels: {
    singular: "Product",
    plural: "Products",
  },
  admin: {
    useAsTitle: "name",
    description: "You must verify your Stripe account before creating products.",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "richText",
    },
    {
      name: "price",
      type: "number",
      required: true,
      admin: {
        description: "The price of the product in USD",
      },
    },
    {
      name: "category",
      type: "relationship",
      relationTo: "categories",
      hasMany: true,
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "refundPolicy",
      type: "select",
      options: ["30-days", "14-days", "7-days", "3-days", "1-day", "no-refund"],
      defaultValue: "30-days",
    },
    {
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name:"content",
      type: "richText",
      editor: lexicalEditor({
        features: ({defaultFeatures}) => [
          ...defaultFeatures,
          UploadFeature({
            collections: {
              media: {
                fields: [
                  {
                    name: "alt",
                    type: "text",
                  }
                ]
              }
            }
          })
        ]
      }),
      admin: {
        description:
         "Protected content only visible to customers after purchase. Add product documentation, downloadable files, getting started guides, and bouns materials. supports markdown formatting.",
      },
    },
    {
      name: "isArchived",
      label: "Archive",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "If Checked, this product will be hidden from the public and only visible to admins.",
      },
    },
    {
      name: "isPrivate",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "If Checked, this product will be hidden from the public storefront.",
      },
    }
  ],
};

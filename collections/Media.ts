import { isSuperAdmin } from '@/lib/access'
import type { User as UserType } from '@/payload-types'
import { ClientUser, CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    delete: ({req}) => isSuperAdmin(req?.user as UserType | ClientUser),
  },
  admin:{
    hidden: ({user}) => !isSuperAdmin(user as UserType | ClientUser),
    useAsTitle: "alt",
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}

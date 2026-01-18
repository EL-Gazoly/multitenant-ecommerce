import type { User } from "@/payload-types";
import { ClientUser } from "payload";

export const isSuperAdmin = (user: User | ClientUser) => {
  return Boolean((user as User)?.roles?.includes("super-admin"));
};

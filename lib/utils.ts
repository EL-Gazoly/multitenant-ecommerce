import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function generateTenantUrl(slug: string) {
  const isDevelopment = process.env.NODE_ENV === "development";
  const issubdomainRoutingEnabled = process.env.NEXT_PUBLIC_SUBDOMAIN_ROUTING_ENABLED === "true";
  if (isDevelopment && issubdomainRoutingEnabled) {
    return `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${slug}`;
  }
  let protocol = "https";
  if (process.env.NODE_ENV === "development") {
    protocol = "http";

  }
  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN!;
  return `${protocol}://${slug}.${domain}`;
}

export function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

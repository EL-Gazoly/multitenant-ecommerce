import { cookies as getCookies } from "next/headers";

interface props {
  prefix: string;
  value: string;
}

export const generateAuthCookie =
  ({ prefix, value }: props) =>
  async () => {
    const cookies = await getCookies();
    const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
    cookies.set(`${prefix}-token`, value, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      ...(process.env.NODE_ENV !== "development" && { sameSite: "none", secure: true, domain: rootDomain } ),
    });
    return cookies;
  };

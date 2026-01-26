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
    const isProduction = process.env.NODE_ENV === "production";
    cookies.set(`${prefix}-token`, value, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "none",
      // When sameSite is "none", secure must be true
      secure: true,
      // Only set domain if it's defined and in production
      ...(rootDomain && isProduction ? { domain: rootDomain } : {}),
    });
    return cookies;
  };

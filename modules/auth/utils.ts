import { cookies as getCookies } from "next/headers";

interface props {
  prefix: string;
  value: string;
}

export const generateAuthCookie =
  ({ prefix, value }: props) =>
  async () => {
    const cookies = await getCookies();
    cookies.set(`${prefix}-token`, value, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
      sameSite: "none",
      domain: process.env.NEXT_PUBLIC_ROOT_DOMAIN,
      secure: process.env.NODE_ENV === "production",
    });
    return cookies;
  };

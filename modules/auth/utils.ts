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
    });
    return cookies;
  };

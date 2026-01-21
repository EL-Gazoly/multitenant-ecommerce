import Link from "next/link";
import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
});

export const Footer = () => {
  return (
    <nav className=" border-t font-medium bg-white">
      <div className=" max-w-(--breakpoint-xl) mx-auto px-4 flex gap-2 items-center py-6  h-full">
        <p>Powered by</p>
        <Link href={process.env.NEXT_PUBLIC_APP_URL!}>
          <span className={cn(poppins.className, "text-2xl font-semibold")}>
            funroad
          </span>
        </Link>
      </div>
    </nav>
  );
};

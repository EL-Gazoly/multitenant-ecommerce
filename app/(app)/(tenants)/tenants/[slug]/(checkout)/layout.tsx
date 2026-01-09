import { Navbar } from "@/modules/checkout/ui/components/navbar";
import { Footer } from "@/modules/tenants/ui/components/footer";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}
export default async function Layout({ children, params }: LayoutProps) {
  const { slug } = await params;

  return (
    <div className=" min-h-screen bg-[#f4f4f0] flex flex-col">
      <Navbar slug={slug} />
      <main className=" flex-1">
        <div className=" max-w-(--breakpoint-xl) mx-auto ">{children}</div>
      </main>
      <Footer />
    </div>
  );
}

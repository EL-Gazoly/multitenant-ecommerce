import { CheckoutView } from "@/modules/checkout/ui/views/checkout-view";

interface CheckOutPageProps {
  params: Promise<{ slug: string }>;
}
const CheckOutPage = async ({ params }: CheckOutPageProps) => {
  const { slug } = await params;
  return <CheckoutView tenantSlug={slug} />;
};

export default CheckOutPage;

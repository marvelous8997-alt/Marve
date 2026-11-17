import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import ProductDetailsPage from "@/src/components/common/productdetails/ProductDetailsPage";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <ProductDetailsPage slug={slug} />
      </main>

      <Footer />
    </>
  );
}
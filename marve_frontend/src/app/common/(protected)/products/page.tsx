import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import ProductCategory from "@/src/components/common/product/ProductCategory";
import ProductHero from "@/src/components/common/product/ProductHero";
import ProductListing from "@/src/components/common/product/ProductListing";

export default function ShopPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="w-full bg-[#F8F5F0]">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
            <ProductHero />
            <ProductCategory />
          </div>
        </section>
        <ProductListing />
      </main>

      <Footer />
    </>
  );
}
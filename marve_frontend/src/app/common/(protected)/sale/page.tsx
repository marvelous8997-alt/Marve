import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import SaleHero from "@/src/components/common/sale/SaleHero";
import SaleCategory from "@/src/components/common/sale/SaleCategory";
import SaleListing from "@/src/components/common/sale/SaleListing";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export default function SalePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <section className="w-full bg-[#F8F5F0]">
          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
            <SaleHero />
            <SaleCategory />
          </div>
        </section>
        <SaleListing />
        <NewsletterSection />
      </main>

      <Footer />
    </>
  );
}
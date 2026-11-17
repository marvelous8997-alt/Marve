import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import BestSellersHero from "@/src/components/common/bestsellers/BestSellersHero";
import BestSellersIntro from "@/src/components/common/bestsellers/BestSellersIntro";
import BestSellersProductGrid from "@/src/components/common/bestsellers/BestSellersProductGrid";
import BestSellersPriceCategories from "@/src/components/common/bestsellers/BestSellersPriceCategories";
import BestSellersPromo from "@/src/components/common/bestsellers/BestSellersPromo";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export default function BestSellersPage() {
  return (
    <>
      <Navbar />
        <main className="min-h-screen">
            <BestSellersHero />
            <BestSellersIntro />
            <BestSellersProductGrid />
            <BestSellersPriceCategories />
            <BestSellersPromo />
            <NewsletterSection />
        </main>
      <Footer />
    </>
  );
}
import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import GiftHero from "@/src/components/common/gift/GiftHero";
import GiftIntro from "@/src/components/common/gift/GiftIntro";
import GiftOccasions from "@/src/components/common/gift/GiftOccasions";
import GiftCategories from "@/src/components/common/gift/GiftCategories";
import GiftPriceRanges from "@/src/components/common/gift/GiftPriceRanges";
import GiftProductGrid from "@/src/components/common/gift/GiftProductGrid";
import GiftPromo from "@/src/components/common/gift/GiftPromo";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export default function GiftPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <GiftHero />
        <GiftIntro />
        <GiftOccasions />
        <GiftCategories />
        <GiftPriceRanges />
        <GiftProductGrid />
        <GiftPromo />
        <NewsletterSection />
      </main>

      <Footer />
    </>
  );
}
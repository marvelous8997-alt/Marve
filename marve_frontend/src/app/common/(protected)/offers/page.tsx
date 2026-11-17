import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import OffersHero from "@/src/components/common/offers/OffersHero";
import OffersIntro from "@/src/components/common/offers/OffersIntro";
import OffersHighlights from "@/src/components/common/offers/OffersHighlights";
import OffersCategories from "@/src/components/common/offers/OffersCategories";
import OffersProductGrid from "@/src/components/common/offers/OffersProductGrid";
import OffersPromo from "@/src/components/common/offers/OffersPromo";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export default function OffersPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <OffersHero />
        <OffersIntro />
        <OffersHighlights />
        <OffersCategories />
        <OffersProductGrid />
        <OffersPromo />
        <NewsletterSection />
      </main>

      <Footer />
    </>
  );
}
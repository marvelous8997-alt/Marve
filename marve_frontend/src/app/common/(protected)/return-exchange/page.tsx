import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import ReturnExchangeHero from "@/src/components/common/return-exchange/ReturnExchangeHero";
import ReturnExchangeHighlights from "@/src/components/common/return-exchange/ReturnExchangeHighlights";
import ReturnExchangePolicy from "@/src/components/common/return-exchange/ReturnExchangePolicy";
import ReturnExchangeEligibility from "@/src/components/common/return-exchange/ReturnExchangeEligibility";
import ReturnExchangeProcess from "@/src/components/common/return-exchange/ReturnExchangeProcess";
import ReturnExchangeNonReturnable from "@/src/components/common/return-exchange/ReturnExchangeNonReturnable";
import ReturnExchangeRefund from "@/src/components/common/return-exchange/ReturnExchangeRefund";
import ReturnExchangeDamaged from "@/src/components/common/return-exchange/ReturnExchangeDamaged";
import ReturnExchangeFAQ from "@/src/components/common/return-exchange/ReturnExchangeFAQ";
import ReturnExchangeCTA from "@/src/components/common/return-exchange/ReturnExchangeCTA";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export default function ReturnExchangePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <ReturnExchangeHero />
        <ReturnExchangeHighlights />
        <ReturnExchangePolicy />
        <ReturnExchangeEligibility />
        <ReturnExchangeProcess />
        <ReturnExchangeNonReturnable />
        <ReturnExchangeRefund />
        <ReturnExchangeDamaged />
        <ReturnExchangeFAQ />
        <ReturnExchangeCTA />
        <NewsletterSection />
      </main>

      <Footer />
    </>
  );
}
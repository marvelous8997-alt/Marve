import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import StoreLocatorHero from "@/src/components/common/store-locator/StoreLocatorHero";
import StoreLocatorIntro from "@/src/components/common/store-locator/StoreLocatorIntro";
import StoreLocatorSearch from "@/src/components/common/store-locator/StoreLocatorSearch";
import StoreLocatorList from "@/src/components/common/store-locator/StoreLocatorList";
import StoreLocatorMap from "@/src/components/common/store-locator/StoreLocatorMap";
import StoreLocatorVisit from "@/src/components/common/store-locator/StoreLocatorVisit";
import StoreLocatorFAQ from "@/src/components/common/store-locator/StoreLocatorFAQ";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export default function StoreLocatorPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <StoreLocatorHero />
        <StoreLocatorIntro />
        <StoreLocatorSearch />
        <StoreLocatorList />
        <StoreLocatorMap />
        <StoreLocatorVisit />
        <StoreLocatorFAQ />
        <NewsletterSection />
      </main>

      <Footer />
    </>
  );
}
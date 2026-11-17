import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import KitchenEssentialsHero from "@/src/components/common/kitchen-essentials/KitchenEssentialsHero";
import KitchenEssentialsIntro from "@/src/components/common/kitchen-essentials/KitchenEssentialsIntro";
import KitchenEssentialsCategories from "@/src/components/common/kitchen-essentials/KitchenEssentialsCategories";
import KitchenEssentialsFeatured from "@/src/components/common/kitchen-essentials/KitchenEssentialsFeatured";
import KitchenEssentialsProductGrid from "@/src/components/common/kitchen-essentials/KitchenEssentialsProductGrid";
import KitchenEssentialsPromo from "@/src/components/common/kitchen-essentials/KitchenEssentialsPromo";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export default function KitchenEssentialsPage() {
  return (
    <>
      <Navbar />
        <main className="min-h-screen">
            <KitchenEssentialsHero />
            <KitchenEssentialsIntro />
            <KitchenEssentialsCategories />
            <KitchenEssentialsFeatured />
            <KitchenEssentialsProductGrid />
            <KitchenEssentialsPromo />
            <NewsletterSection />
        </main>
      <Footer />
    </>
  );
}
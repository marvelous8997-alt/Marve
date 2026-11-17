import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import HomeEssentialsHero from "@/src/components/common/home-essentials/HomeEssentialsHero";
import HomeEssentialsIntro from "@/src/components/common/home-essentials/HomeEssentialsIntro";
import HomeEssentialsCategories from "@/src/components/common/home-essentials/HomeEssentialsCategories";
import HomeEssentialsFeatured from "@/src/components/common/home-essentials/HomeEssentialsFeatured";
import HomeEssentialsProductGrid from "@/src/components/common/home-essentials/HomeEssentialsProductGrid";
import HomeEssentialsPromo from "@/src/components/common/home-essentials/HomeEssentialsPromo";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export default function HomeEssentialsPage() {
  return (
    <>
      <Navbar />
        <main className="min-h-screen">
            <HomeEssentialsHero />
            <HomeEssentialsIntro />
            <HomeEssentialsCategories />
            <HomeEssentialsFeatured />
            <HomeEssentialsProductGrid />
            <HomeEssentialsPromo />
            <NewsletterSection />
        </main>
      <Footer />
    </>
  );
}
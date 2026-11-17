import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import NewArrivalsHero from "@/src/components/common/new-arrivals/NewArrivalsHero";
import NewArrivalsIntro from "@/src/components/common/new-arrivals/NewArrivalsIntro";
import NewArrivalsProductGrid from "@/src/components/common/new-arrivals/NewArrivalsProductGrid";
import NewArrivalsCategories from "@/src/components/common/new-arrivals/NewArrivalsCategories";
import NewArrivalsPromo from "@/src/components/common/new-arrivals/NewArrivalsPromo";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export default function NewArrivalsPage() {
  return (
    <>
      <Navbar />
        <main className="min-h-screen">
            <NewArrivalsHero />
            <NewArrivalsIntro />
            <NewArrivalsProductGrid />
            <NewArrivalsCategories />
            <NewArrivalsPromo />
            <NewsletterSection />
        </main>
      <Footer />
    </>
  );
}
import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import AboutHero from "@/src/components/common/about/AboutHero";
import AboutIntro from "@/src/components/common/about/AboutIntro";
import AboutStory from "@/src/components/common/about/AboutStory";
import AboutValues from "@/src/components/common/about/AboutValues";
import AboutCategories from "@/src/components/common/about/AboutCategories";
import AboutWhyMarve from "@/src/components/common/about/AboutWhyMarve";
import AboutCTA from "@/src/components/common/about/AboutCTA";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <AboutHero />
        <AboutIntro />
        <AboutStory />
        <AboutValues />
        <AboutCategories />
        <AboutWhyMarve />
        <AboutCTA />
      </main>

      <Footer />
    </>
  );
}
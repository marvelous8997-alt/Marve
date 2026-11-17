import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import BlogHero from "@/src/components/common/blog/BlogHero";
import BlogIntro from "@/src/components/common/blog/BlogIntro";
import BlogFeatured from "@/src/components/common/blog/BlogFeatured";
import BlogCategories from "@/src/components/common/blog/BlogCategories";
import BlogArticleGrid from "@/src/components/common/blog/BlogArticleGrid";
import BlogTipsGuides from "@/src/components/common/blog/BlogTipsGuides";
import BlogCTA from "@/src/components/common/blog/BlogCTA";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export default function BlogPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <BlogHero />
        <BlogIntro />
        <BlogFeatured />
        <BlogCategories />
        <BlogArticleGrid />
        <BlogTipsGuides />
        <BlogCTA />
        <NewsletterSection />
      </main>

      <Footer />
    </>
  );
}
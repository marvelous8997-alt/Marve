import type { Metadata } from "next";

import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import TestimonialsHero from "@/src/components/common/testimonials/TestimonialsHero";
import TestimonialsIntro from "@/src/components/common/testimonials/TestimonialsIntro";
import TestimonialsStats from "@/src/components/common/testimonials/TestimonialsStats";
import TestimonialsGrid from "@/src/components/common/testimonials/TestimonialsGrid";
import TestimonialsCTA from "@/src/components/common/testimonials/TestimonialsCTA";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export const metadata: Metadata = {
  title: "Testimonials | MARVE",
  description:
    "Discover what MARVE customers have to say about their shopping experience and everyday products.",
};

export default function TestimonialsPage() {
  return (
    <main className="min-h-screen bg-[#F8F5F0]">
      <Navbar />

      <TestimonialsHero />
      <TestimonialsIntro />
      <TestimonialsStats />
      <TestimonialsGrid />
      <TestimonialsCTA />
      <NewsletterSection />

      <Footer />
    </main>
  );
}
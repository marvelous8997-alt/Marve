import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import CategorySection from "@/src/components/common/home/CategorySection";
import ImagePromoSection from "@/src/components/common/home/ImagePromoSection";
import TopCategoriesSection from "@/src/components/common/home/TopCategoriesSection";
import ReelsSection from "@/src/components/common/home/ReelsSection";
import NewArrivalsSection from "@/src/components/common/home/NewArrivalsSection";
import CouponOfferSection from "@/src/components/common/home/CouponOfferSection";
import BestsellersSection from "@/src/components/common/home/BestsellersSection";
import CustomerReviewsSection from "@/src/components/common/home/CustomerReviewsSection";
import NewsletterSection from "@/src/components/common/home/NewsletterSection";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <CategorySection />
        <ImagePromoSection />
        <TopCategoriesSection />
        <ReelsSection />
        <NewArrivalsSection />
        <CouponOfferSection />
        <BestsellersSection />
        <CustomerReviewsSection />
        <NewsletterSection />
      </main>

      <Footer />
    </>
  );
}
import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import TrackOrderHero from "@/src/components/common/track-order/TrackOrderHero";
import TrackOrderForm from "@/src/components/common/track-order/TrackOrderForm";

export default function TrackOrderPage() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen">
        <TrackOrderHero />
        <TrackOrderForm />
      </main>

      <Footer />
    </>
  );
}
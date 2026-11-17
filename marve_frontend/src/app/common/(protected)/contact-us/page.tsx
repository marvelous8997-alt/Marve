import Navbar from "@/src/components/common/Navbar";
import Footer from "@/src/components/common/Footer";
import ContactHero from "@/src/components/common/contact/ContactHero";
import ContactInfo from "@/src/components/common/contact/ContactInfo";
import ContactForm from "@/src/components/common/contact/ContactForm";
import ContactLocation from "@/src/components/common/contact/ContactLocation";
import ContactFAQ from "@/src/components/common/contact/ContactFAQ";

export default function ContactUsPage() {
  return (
    <>
      <Navbar />

        <main className="min-h-screen">
            <ContactHero />
            <ContactInfo />
            <ContactForm />
            <ContactLocation />
            <ContactFAQ />
        </main>

      <Footer />
    </>
  );
}
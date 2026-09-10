import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { Products } from "@/components/Products";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { FAQ } from "@/components/FAQ";
import { Booking } from "@/components/Booking";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="fixed left-3 top-3 z-[200] -translate-y-20 rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition-transform focus:translate-y-0"
      >
        Saltar al contenido principal
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <TrustBar />
        <Services />
        <Process />
        <Products />
        <Pricing />
        <Testimonials />
        <FAQ />
        <Booking />
      </main>
      <Footer />
      <CartDrawer />
    </>
  );
}

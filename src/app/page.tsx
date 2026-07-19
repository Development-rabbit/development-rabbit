import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import TrustedBy from "./sections/TrustedBy";
import Services from "./sections/Services";
import Process from "./sections/Process";
import Work from "./sections/Work";
import Testimonials from "./sections/Testimonials";
import CTA from "./sections/CTA";
import Footer from "./sections/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustedBy />
      <Services />
      <Work />
      <Process />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}

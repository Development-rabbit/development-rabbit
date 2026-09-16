import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import TrustedBy from "./sections/TrustedBy";
import About from "./sections/About";
import Services from "./sections/Services";
import Process from "./sections/Process";
import Work from "./sections/Work";
import Testimonials from "./sections/Testimonials";
import CTA from "./sections/CTA";
import Footer from "./sections/Footer";
import InstagramReel from "./components/InstagramReel";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background">
      <Navbar />
      <Hero />
      <TrustedBy />
      <About />
      <Work />
      <Services />
      <InstagramReel />
      <Process />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}

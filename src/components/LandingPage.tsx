import { ArrowRight, Store, MessageCircle } from 'lucide-react';
import { siteConfig } from '../config';
import About from '../sections/About';
import Beds from '../sections/Beds';
import Blog from '../sections/Blog';
import Contact from '../sections/Contact';
import FAQ from '../sections/FAQ';
import Features from '../sections/Features';
import Footer from '../sections/Footer';
import Hero from '../sections/Hero';
import Navigation from '../sections/Navigation';
import Products from '../sections/Products';
import SubHero from '../sections/SubHero';
import VideoSection from '../sections/VideoSection';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white" lang={siteConfig.language || undefined}>
      <Navigation
        showCart={false}
        storeHref="/store"
        storeLabel="Open Store"
      />

      <main id="main-content">
        <Hero />
        <SubHero />
        <VideoSection />
        <Products mode="showcase" storeHref="/store" />
        <Beds mode="showcase" storeHref="/store" />

        <section className="bg-[#5a1a2a] px-6 py-16 text-white md:px-12 lg:px-[170px]">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-white/70">
                Dedicated Store
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
                The Stankings website introduces the brand.
                The separate store handles deep browsing, cart and checkout.
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-white/80">
                Use the website to understand the collection, project fit and
                showroom story. Use the store when you are ready to compare products,
                place orders and move through payment.
              </p>
            </div>

            <a
              href="/store"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-white px-8 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#5a1a2a] transition-transform hover:-translate-y-0.5 lg:-translate-x-[35%]"
            >
              <Store size={18} />
              Go To Store
              <ArrowRight size={16} />
            </a>
          </div>
        </section>

        <Features />
        <Blog />
        <FAQ />
        <About />
        <Contact />
      </main>

      <Footer />

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/2348037155869?text=Hello%2C%20I%27m%20interested%20in%20your%20furniture%20and%20home%20appliances"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="fixed bottom-6 right-6 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <MessageCircle size={26} strokeWidth={2} />
      </a>
    </div>
  );
};

export default LandingPage;

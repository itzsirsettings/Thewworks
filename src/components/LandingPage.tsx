import { CtaCard } from '@/components/ui/cta-card';
import BrandLogo from '@/components/BrandLogo';
import LeafletMap from '@/components/ui/leaflet-map';
import Footer from '@/sections/Footer';
import Hero from '@/sections/Hero';
import { HeroWithGreeting } from './ui/hero-with-greeting';
import { HoverSliderDemo } from './ui/animated-slideshow-demo';
import { siteConfig } from '../config';
import { buildWhatsAppUrl } from '@/lib/whatsapp';
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Box,
  CheckCircle2,
  Clock3,
  FileCheck2,
  Layers3,
  MessageCircleMore,
  PackageCheck,
  Palette,
  Printer,
  Shirt,
  SwatchBook,
} from 'lucide-react';

const services = [
  {
    title: 'Business Essentials',
    detail: 'Business cards, letterheads, envelopes, forms, folders and presentation packs.',
    spec: 'Matte, gloss, textured, soft-touch',
    icon: FileCheck2,
  },
  {
    title: 'Marketing Prints',
    detail: 'Flyers, brochures, posters, catalogs, booklets and campaign materials.',
    spec: 'Short runs to bulk production',
    icon: SwatchBook,
  },
  {
    title: 'Large Format',
    detail: 'Pull-up banners, vinyl banners, wall graphics, signboards and event backdrops.',
    spec: 'Indoor and outdoor finishes',
    icon: Printer,
  },
  {
    title: 'Packaging & Labels',
    detail: 'Product boxes, sleeves, stickers, roll labels, paper bags and retail inserts.',
    spec: 'Foil, emboss, spot UV, die-cut',
    icon: Box,
  },
  {
    title: 'Books & Manuals',
    detail: 'Perfect-bound books, saddlestitch booklets, reports, training manuals and programs.',
    spec: 'Proofed, trimmed, bound',
    icon: BookOpen,
  },
  {
    title: 'Apparel Printing',
    detail: 'T-shirts, uniforms, tote bags and branded merch for teams and events.',
    spec: 'Screen, heat transfer, DTF',
    icon: Shirt,
  },
];

const processSteps = [
  ['01', 'Preflight', 'We check bleed, margins, resolution, color mode and file readiness before production.'],
  ['02', 'Proof', 'You receive a clear proof so layout, paper, size and finishing are confirmed.'],
  ['03', 'Produce', 'Our pressroom handles print, finishing, trimming, binding and quality control.'],
  ['04', 'Deliver', 'Orders are packed neatly for pickup, courier delivery or scheduled bulk dispatch.'],
];

const finishes = [
  'Foil stamping',
  'Embossing',
  'Spot UV',
  'Die cutting',
  'Lamination',
  'Perfect binding',
  'Rounded corners',
  'Waterproof labels',
];

const articles = [
  'Choosing paper stock that makes your brand feel premium',
  'How bleed, trim and safe zones prevent costly reprints',
  'CMYK, Pantone and color consistency in real production',
];

const faqs = [
  ['What file formats do you accept?', 'Print-ready PDF is best. We also accept AI, PSD, TIFF and high-resolution JPG files when supplied with fonts, links or outlined text.'],
  ['Can you help with design?', 'Yes. We can prepare new artwork, clean up existing layouts, adapt brand files and make production-ready corrections before proofing.'],
  ['How fast can you deliver?', 'Many standard jobs can move within 24 to 72 hours after proof approval. Complex packaging, books and specialty finishes need a confirmed production schedule.'],
  ['Do you handle bulk orders?', 'Yes. We support repeat business stationery, event campaigns, product launches, school materials, books, packaging and retail label runs.'],
];

const LandingPage = () => {
  const projectWhatsAppUrl = buildWhatsAppUrl(
    'Hello, I would like to start a printing project with Thewworks ICT & Prints.',
  );

  return (
    <div className="min-h-screen bg-[#f7f1e7] text-[#171717]" lang={siteConfig.language || undefined}>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[9999] focus:bg-[#171717] focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-[#151515]/82 text-white backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-[1480px] items-center justify-between px-5 md:px-10 lg:px-14">
          <a href="#hero" className="flex items-center gap-3 font-semibold">
            <BrandLogo
              markClassName="h-11 w-20"
              textClassName="text-lg"
              textTone="light"
            />
          </a>

          <nav className="hidden items-center gap-8 text-sm text-white/78 md:flex">
            <a href="#services" className="hover:text-white">Services</a>
            <a href="#process" className="hover:text-white">Process</a>
            <a href="#finishes" className="hover:text-white">Finishes</a>
            <a href="#faq" className="hover:text-white">FAQ</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </nav>

          <a
            href="/store"
            className="inline-flex items-center gap-2 bg-white px-4 py-2.5 text-sm font-semibold text-[#171717] hover:-translate-y-0.5"
          >
            Quote desk
            <ArrowRight size={16} />
          </a>
        </div>
      </header>

      <main id="main-content">
        <Hero />

        <HeroWithGreeting
          greeting="Welcome to Thewworks"
          title={
            <>
              Premium <span className="text-[#c9a87c]">Print Solutions</span> for Your Brand
            </>
          }
          subtitle={
            <span className="bg-[rgba(255,0,0,0.05)] px-1">
              From business cards to custom packaging, we deliver exceptional print quality that elevates your brand identity.
            </span>
          }
          stats={[
            { value: '15+', label: 'Years Experience' },
            { value: '2,500+', label: 'Projects Completed' },
            { value: '99%', label: 'Client Satisfaction' },
          ]}
          images={[
            '/images/Bags1.jpg',
            '/images/Branded Nylon.jpg',
            '/images/Blog.jpg',
            '/images/Birthday jotter design.jpg',
            '/images/Cash receipts prints.jpg',
            '/images/Bottle branding.jpg',
          ]}
        />

        <section id="services" className="bg-[#fffaf1] px-5 py-24 md:px-10 lg:px-14">
          <div className="mx-auto max-w-[1480px]">
            <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#f04f32]">Services</p>
                <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.04em] md:text-6xl">
                  Everything your brand needs in print.
                </h2>
                <p className="mt-6 max-w-lg text-lg leading-8 text-[#69645e]">
                  Build a launch kit, restock your stationery, package a product line or prepare a full event campaign from one production desk.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <article key={service.title} className="live-card border border-[#e1d4c2] bg-white p-6 shadow-[0_20px_50px_rgba(23,23,23,0.06)]">
                      <div className="mb-7 flex h-12 w-12 items-center justify-center bg-[#e9fbfd] text-[#087987]">
                        <Icon size={23} strokeWidth={1.8} />
                      </div>
                      <h3 className="text-2xl font-bold tracking-[-0.03em]">{service.title}</h3>
                      <p className="mt-3 leading-7 text-[#69645e]">{service.detail}</p>
                      <p className="mt-5 border-t border-[#eee2d2] pt-4 text-xs font-bold uppercase tracking-[0.16em] text-[#f04f32]">{service.spec}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <HoverSliderDemo />

        <section id="process" className="bg-[#171717] px-5 py-24 text-white md:px-10 lg:px-14">
          <div className="mx-auto max-w-[1480px]">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#18b7c8]">Production workflow</p>
                <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.04em] md:text-6xl">
                  From file prep to final finish.
                </h2>
              </div>
              <p className="max-w-2xl text-lg leading-8 text-white/68">
                We keep every job controlled and visible: technical checks, proof approval,
                press production, finishing, packaging and dispatch all move through one quality workflow.
              </p>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-4">
              {processSteps.map(([number, title, detail]) => (
                <article key={title} className="live-card live-card-dark border border-white/12 bg-white/[0.04] p-6">
                  <p className="text-sm font-bold text-[#f04f32]">{number}</p>
                  <h3 className="mt-8 text-2xl font-bold tracking-[-0.03em]">{title}</h3>
                  <p className="mt-4 leading-7 text-white/65">{detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="finishes" className="grid bg-[#fffaf1] lg:grid-cols-2">
          <div className="px-5 py-24 md:px-10 lg:px-14">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#f04f32]">Packaging and finishes</p>
            <h2 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight tracking-[-0.04em] md:text-6xl">
              Tactile details that make print feel valuable.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#69645e]">
              Choose the finish that matches the moment: premium cards, retail packaging, waterproof labels,
              product sleeves, launch boxes and presentation materials.
            </p>
            <div className="mt-10 grid gap-3 sm:grid-cols-2">
              {finishes.map((finish) => (
                <div key={finish} className="live-card flex items-center gap-3 border border-[#e1d4c2] bg-white px-4 py-3">
                  <CheckCircle2 size={18} className="text-[#087987]" />
                  <span className="font-semibold">{finish}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#18b7c8] px-5 py-24 text-[#101010] md:px-10 lg:px-14">
            <div className="mx-auto max-w-xl">
              <PackageCheck size={42} strokeWidth={1.6} />
              <h3 className="mt-8 text-4xl font-extrabold leading-tight tracking-[-0.04em]">
                Built for brand teams, schools, events, restaurants and product founders.
              </h3>
              <p className="mt-6 text-lg leading-8 text-[#10383c]">
                Bring a sketch, brand guideline, old sample or ready-to-print file. We will advise on paper,
                quantity, finish, durability and cost before production starts.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#f7f1e7] px-5 py-24 md:px-10 lg:px-14">
          <div className="mx-auto grid max-w-[1480px] gap-5 md:grid-cols-3">
            {[
              [Clock3, 'Fast turnaround', 'Rush and standard windows available after proof approval.'],
              [Palette, 'Color accuracy', 'CMYK-aware production and practical guidance for brand colors.'],
              [BadgeCheck, 'Quality control', 'Every job is checked for trimming, finishing and packing quality.'],
            ].map(([Icon, title, detail]) => {
              const BenefitIcon = Icon as typeof Clock3;
              return (
                <article key={title as string} className="live-card live-card-dark border border-white/10 bg-[#171717] p-7 text-white">
                  <BenefitIcon size={28} className="text-[#18b7c8]" />
                  <h3 className="mt-8 text-2xl font-bold tracking-[-0.03em]">{title as string}</h3>
                  <p className="mt-3 leading-7 text-white/66">{detail as string}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="faq" className="bg-[#fffaf1] px-5 py-24 md:px-10 lg:px-14">
          <div className="mx-auto grid max-w-[1480px] gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#f04f32]">Print intelligence</p>
              <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-[-0.04em] md:text-6xl">
                Better files. Better print.
              </h2>
              <div className="mt-8 space-y-4">
                {articles.map((article) => (
                  <p key={article} className="flex items-start gap-3 text-[#4f4c47]">
                    <Layers3 size={18} className="mt-1 text-[#087987]" />
                    <span>{article}</span>
                  </p>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {faqs.map(([question, answer]) => (
                <article key={question} className="live-card border border-[#e1d4c2] bg-white p-6">
                  <h3 className="text-xl font-bold tracking-[-0.02em]">{question}</h3>
                  <p className="mt-3 leading-7 text-[#69645e]">{answer}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="bg-[#171717] px-5 py-24 text-white md:px-10 lg:px-14">
          <div className="mx-auto max-w-[1480px]">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-[#18b7c8] mb-8">Start a project</p>
            <CtaCard
              title="Ready to print?"
              subtitle="Send your print brief. We will help shape the run."
              description="Tell us what you need, quantity, size, deadline and whether you already have artwork. We will respond with production guidance and a quote path."
              buttonText="Open the quote desk"
              secondaryButtonText="Chat on WhatsApp"
              secondaryButtonHref={projectWhatsAppUrl}
              imageSrc="/images/Mathias.png"
              imageAlt="Mathias"
              onButtonClick={() => window.location.href = '/store'}
              className="bg-white text-[#171717]"
            />
          </div>
        </section>
      </main>

      <LeafletMap />

      <Footer />

      <a
        href={projectWhatsAppUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Thewworks on WhatsApp"
        className="fixed bottom-6 right-6 z-[999] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
      >
        <MessageCircleMore size={26} strokeWidth={2} />
      </a>
    </div>
  );
};

export default LandingPage;

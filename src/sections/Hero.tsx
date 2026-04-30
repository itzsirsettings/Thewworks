import { useEffect, useRef, useState } from 'react';
import { ChevronDown, ArrowRight } from 'lucide-react';
import { heroConfig } from '../config';
import { FlipText } from '@/components/ui/flip-text';

const heroAssets = [
  '/images/thewworks-press-hero.png',
  '/images/3101.webp',
  '/images/3105.webp',
  '/Surreal.mp4'
];

const Hero = () => {
  const shouldRenderNothing = !heroConfig.title;
  const rotatingTitles = heroConfig.rotatingTitles?.length
    ? heroConfig.rotatingTitles
    : [heroConfig.title];

  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const backgroundIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const titleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    backgroundIntervalRef.current = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % heroAssets.length);
    }, 5000);

    if (rotatingTitles.length > 1) {
      titleIntervalRef.current = setInterval(() => {
        setCurrentTitleIndex((prev) => (prev + 1) % rotatingTitles.length);
      }, 3600);
    }

    return () => {
      window.cancelAnimationFrame(frame);
      if (backgroundIntervalRef.current) clearInterval(backgroundIntervalRef.current);
      if (titleIntervalRef.current) clearInterval(titleIntervalRef.current);
    };
  }, [rotatingTitles.length]);

  const scrollToNext = () => {
    const nextSection = document.querySelector('#subhero');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const goToSlide = (index: number) => {
    setCurrentBgIndex(index);
  };

  const titleLines = rotatingTitles[currentTitleIndex].split('\n');

  if (shouldRenderNothing) return null;

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Background Slides with Fade Effect */}
      {heroAssets.map((asset, index) => {
        const isActive = index === currentBgIndex;
        const isVideo = asset.endsWith('.mp4');
        
        const opacityClass = isActive ? 'opacity-100' : 'opacity-0';

        return (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${opacityClass}`}
          >
            {isVideo ? (
              <video
                src={asset}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover opacity-70"
              />
            ) : (
              <div 
                className="h-full w-full bg-cover bg-center opacity-70"
                style={{ backgroundImage: `url(${asset})` }}
              />
            )}
          </div>
        );
      })}

      {/* Clean White Overlay for Text Readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
        <div
          className={`transition-all duration-800 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <span className="inline-block mb-4 text-sm tracking-[0.25em] font-medium uppercase opacity-90">
            {heroConfig.tagline}
          </span>
        </div>

        <h1
          className={`font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-4xl leading-[0.98] tracking-tight font-bold transition-all duration-800 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          {titleLines.map((line, i) => (
            <span key={`${currentTitleIndex}-${i}`} className="block">
              <FlipText
                className="justify-center"
                duration={2.2}
                delay={i * 0.18}
              >
                {line}
              </FlipText>
            </span>
          ))}
        </h1>

        {/* Tagline Secondary */}
        <div
          className={`mt-5 max-w-2xl text-lg font-light leading-relaxed opacity-85 transition-all duration-800 ease-out md:text-xl ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '600ms' }}
        >
          {heroConfig.tagLineSecondary}
        </div>

        <div
          className={`mt-10 flex flex-col sm:flex-row gap-4 transition-all duration-800 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ transitionDelay: '800ms' }}
        >
          {heroConfig.ctaPrimaryText && (
            <a
              href={heroConfig.ctaPrimaryTarget}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(heroConfig.ctaPrimaryTarget)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="group px-8 py-4 bg-white text-black font-medium tracking-wide text-sm flex items-center gap-3 hover:bg-[var(--chevron-blue)] hover:text-white transition-all duration-300"
            >
              {heroConfig.ctaPrimaryText}
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </a>
          )}
          {heroConfig.ctaSecondaryText && (
            <a
              href={heroConfig.ctaSecondaryTarget}
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(heroConfig.ctaSecondaryTarget)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-4 border border-white text-white font-medium tracking-wide text-sm flex items-center gap-3 hover:bg-white hover:text-black transition-all duration-300"
            >
              {heroConfig.ctaSecondaryText}
            </a>
          )}
        </div>
      </div>

      {/* Slide Indicators - Chevron Style */}
      <div
        className={`absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 transition-all duration-800 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1000ms' }}
      >
        {heroAssets.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-1 rounded-full transition-all duration-500 focus:outline-none ${
              index === currentBgIndex 
                ? 'bg-white w-8' 
                : 'bg-white/40 hover:bg-white/70 w-4'
            }`}
          >
            <span className="sr-only">Slide {index + 1}</span>
          </button>
        ))}
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={scrollToNext}
        aria-label="Scroll to next section"
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-white transition-opacity duration-800 ${
          isVisible ? 'opacity-70' : 'opacity-0'
        }`}
        style={{ transitionDelay: '1200ms' }}
      >
        <ChevronDown size={28} strokeWidth={1.5} />
      </button>
    </section>
  );
};

export default Hero;

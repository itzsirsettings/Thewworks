import { useEffect, useState } from 'react';

import { heroConfig } from '../config';
import { mediaPath } from '../lib/brand';

const heroAssets = [
  { src: mediaPath('0067'), alt: 'Black entrance gate with gold decorative details', label: 'Metalwork and gates' },
  { src: '/media/wills/interiors/living-room.webp', alt: 'AI-generated living room interior design concept', label: 'Living room concept' },
  { src: mediaPath('0039'), alt: 'Black entrance door with a curved wood-tone panel and silver handle', label: 'Sculpted entrance door' },
  { src: '/media/wills/interiors/kitchen.webp', alt: 'AI-generated fitted kitchen interior design concept', label: 'Fitted kitchen concept' },
  { src: mediaPath('0044'), alt: 'Pair of wood-tone entrance doors with black metal frames', label: 'Double entrance doors' },
  { src: '/media/wills/interiors/bedroom.webp', alt: 'AI-generated bedroom interior design concept', label: 'Bedroom concept' },
  { src: mediaPath('0018'), alt: 'Polished gold-tone entrance door with decorative glazed lattice panel', label: 'Gold entrance door' },
];

const Hero = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const respectPreference = () => { if (preference.matches) setIsPaused(true); };
    const visibilityChanged = () => setIsVisible(!document.hidden);
    respectPreference();
    preference.addEventListener('change', respectPreference);
    document.addEventListener('visibilitychange', visibilityChanged);
    return () => {
      preference.removeEventListener('change', respectPreference);
      document.removeEventListener('visibilitychange', visibilityChanged);
    };
  }, []);

  useEffect(() => {
    if (isPaused || isInteracting || !isVisible) return;
    const timer = window.setTimeout(() => setCurrentBgIndex((index) => (index + 1) % heroAssets.length), 6000);
    return () => window.clearTimeout(timer);
  }, [currentBgIndex, isPaused, isInteracting, isVisible]);

  useEffect(() => {
    const nextImage = new Image();
    nextImage.src = heroAssets[(currentBgIndex + 1) % heroAssets.length].src;
  }, [currentBgIndex]);
  if (!heroConfig.title) return null;
  return (
    <section id="hero" className="wills-hero" aria-label="Featured doors, metalwork and interiors" aria-roledescription="carousel">
      <div className="hero-photo">
        <img key={heroAssets[currentBgIndex].src} src={heroAssets[currentBgIndex].src} alt={heroAssets[currentBgIndex].alt} fetchPriority="high" loading="eager" decoding="async" width="1440" height="1080" />
      </div>
      <div className="hero-shade" />
      <div className="wills-container hero-content">
        <h1>Strong entrances.<br /><em>Considered interiors.</em></h1>
        <p>Doors, gates and metalwork with presence.<br className="desktop-break" /> Interior projects shaped around the way you live.</p>
        <div className="hero-actions">
          <a className="wills-button button-primary" href={heroConfig.ctaPrimaryTarget}>{heroConfig.ctaPrimaryText}</a>
          <a className="hero-secondary" href={heroConfig.ctaSecondaryTarget}>{heroConfig.ctaSecondaryText}</a>
        </div>
      </div>
      <div className="wills-container hero-bottom">
        <a href="#subhero" className="hero-scroll">Discover Wills Group</a>
        <div className="hero-gallery-navigation">
        <p className="hero-slide-caption">{heroAssets[currentBgIndex].label}{heroAssets[currentBgIndex].src.includes('/interiors/') && ' · AI-generated design concept'}</p>
        <div className="hero-controls" aria-label="Choose featured image" onMouseEnter={() => setIsInteracting(true)} onMouseLeave={(event) => setIsInteracting(event.currentTarget.contains(document.activeElement))} onFocus={() => setIsInteracting(true)} onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsInteracting(event.currentTarget.matches(':hover')); }}>
          <button type="button" className="hero-playback" onClick={() => setIsPaused(!isPaused)} aria-label={isPaused ? 'Play hero slideshow' : 'Pause hero slideshow'}>{isPaused ? 'Play' : 'Pause'}</button>
          {heroAssets.map((asset, index) => <button type="button" key={asset.src} onClick={() => setCurrentBgIndex(index)} aria-label={`${String(index + 1).padStart(2, '0')}: ${asset.label}`} aria-pressed={index === currentBgIndex}>{String(index + 1).padStart(2, '0')}</button>)}
        </div>
        </div>
      </div>
    </section>
  );
};
export default Hero;

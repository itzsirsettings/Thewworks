import { heroConfig } from '../config';
import { mediaPath } from '../lib/brand';

export default function Hero() {
  if (!heroConfig.title) return null;
  return (
    <section id="hero" className="wills-hero" aria-label="Featured doors, metalwork and interiors">
      <div className="hero-photo">
        <img src={mediaPath('0067')} alt="Black entrance gate with gold decorative details" fetchPriority="high" loading="eager" decoding="async" width="1440" height="1080" />
      </div>
      <div className="hero-shade" />
      <div className="wills-container hero-content">
        <h1>Strong entrances.<br /><em>Considered interiors.</em></h1>
        <p>Doors, gates and metalwork with presence.<br className="desktop-break" /> Interior projects shaped around the way you live.</p>
      </div>
    </section>
  );
}

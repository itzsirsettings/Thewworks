import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from '../components/BrandLogo';
import { openCookieSettings } from '../components/CookieConsentBanner';
import { contactConfig, footerConfig } from '../config';
import { openMailto } from '../lib/browser-actions';

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Instagram,
  Facebook,
  Twitter,
};

const Footer = () => {
  const shouldRenderNothing = !footerConfig.brandName;

  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const footerWordmark = footerConfig.brandName.split(' ')[0] || footerConfig.brandName;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();

    if (email) {
      openMailto(contactConfig.email, {
        subject: 'Newsletter subscription request',
        body: [
          `Please add this email to the ${footerConfig.brandName} newsletter list:`,
          '',
          email,
        ].join('\n'),
      });

      setIsSubscribed(true);
      setEmail('');
      window.setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const scrollToSection = (href: string) => {
    if (href === '#cookies') {
      openCookieSettings();
      return;
    }

    if (href === '#') return;
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (shouldRenderNothing) return null;

  return (
    <footer className="bg-white pt-16 md:pt-20">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-[var(--chevron-border)]">
          {/* Brand Info */}
          <div className="lg:col-span-1">
            <BrandLogo
              className="mb-4"
              markClassName="h-12 w-[86px]"
              textClassName="text-2xl font-heading"
            />
            {footerConfig.brandTagline && (
              <p className="text-sm text-[var(--chevron-blue)] font-medium mb-3">
                {footerConfig.brandTagline}
              </p>
            )}
            <p className="text-[var(--chevron-muted)] text-sm leading-relaxed mb-6">
              {footerConfig.brandDescription}
            </p>
            <div className="flex items-center gap-4">
              {footerConfig.socialLinks.map((social) => {
                const IconComponent = iconMap[social.icon];
                if (!IconComponent) return null;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    className="text-[var(--chevron-muted)] hover:text-black transition-colors"
                    aria-label={social.label}
                  >
                    <IconComponent size={20} strokeWidth={1.5} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Groups */}
          {footerConfig.linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wider mb-5">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="text-[var(--chevron-muted)] text-sm hover:text-black transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          {footerConfig.newsletterHeading && (
            <div className="lg:col-span-1">
              <h4 className="font-heading text-sm font-semibold uppercase tracking-wider mb-3">{footerConfig.newsletterHeading}</h4>
              <p className="text-[var(--chevron-muted)] text-sm mb-4">
                {footerConfig.newsletterDescription}
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    placeholder={footerConfig.newsletterPlaceholder}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-[var(--chevron-border)] text-sm focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-5 py-3 bg-[var(--chevron-blue)] text-white text-sm font-medium transition-all hover:opacity-90"
                >
                  {isSubscribed ? (
                    <span>{footerConfig.newsletterSuccessText}</span>
                  ) : (
                    <>
                      <span>{footerConfig.newsletterButtonText}</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[var(--chevron-muted)] font-medium">
              {footerConfig.copyrightText}
            </p>
            <div className="flex items-center gap-6">
              {footerConfig.legalLinks.map((link) => (
                link.href.startsWith('/') ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="text-xs text-[var(--chevron-muted)] hover:text-black transition-colors"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => {
                      if (link.href === '#cookies') {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }
                    }}
                    className="text-xs text-[var(--chevron-muted)] hover:text-black transition-colors"
                  >
                    {link.label}
                  </a>
                )
              ))}
            </div>
          </div>
        </div>

        {/* Wordmark */}
        <div className="py-4 overflow-hidden">
          <p className="text-left font-heading text-[clamp(3rem,12vw,10rem)] leading-none tracking-tighter text-[var(--chevron-subtle)] opacity-30">
            {footerWordmark}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { useState } from 'react';
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
    if (href === '#') return;
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (shouldRenderNothing) return null;

  return (
    <footer className="bg-white pt-16 md:pt-24">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="font-serif text-2xl mb-6">{footerConfig.brandName}</h3>
            <p className="text-[#696969] font-light text-sm leading-relaxed mb-6">
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
                    className="text-[#696969] hover:text-[#5a1a2a] transition-all duration-300 hover:scale-90"
                    aria-label={social.label}
                  >
                    <IconComponent size={20} strokeWidth={5} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Link Groups */}
          {footerConfig.linkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="font-sans text-sm font-medium uppercase tracking-wider mb-6">{group.title}</h4>
              <ul className="space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        scrollToSection(link.href);
                      }}
                      className="text-[#696969] text-base font-light link-hover inline-block"
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
              <h4 className="font-sans text-sm font-medium uppercase tracking-wider mb-6">{footerConfig.newsletterHeading}</h4>
              <p className="text-[#696969] text-sm font-light mb-4">
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
                    className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#5a1a2a] transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#5a1a2a] text-white text-sm font-light tracking-wider btn-hover"
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
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-[#333] text-xs uppercase tracking-wider font-medium">
              {footerConfig.copyrightText}
            </p>
            <div className="flex items-center gap-6">
              {footerConfig.legalLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#696969] text-xs hover:text-black transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 overflow-hidden border-t border-[#5a1a2a]/10 pt-6">
          <p className="translate-y-[-18%] pl-[0] text-left font-serif text-[clamp(4.5rem,18vw,12rem)] leading-none tracking-[-0.12em] text-[#5a1a2a]/12">
            {footerWordmark}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

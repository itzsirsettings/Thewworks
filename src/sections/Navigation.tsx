import { useEffect, useRef, useState } from 'react';
import {
  ShoppingBag,
  X,
  Search,
  Instagram,
  Facebook,
  Twitter,
  Store,
} from 'lucide-react';
import { navigationConfig } from '../config';
import { formatCurrency } from '../lib/currency';
import type { CartItem } from '../lib/checkout';

interface NavigationProps {
  cartItems?: CartItem[];
  onRemoveFromCart?: (id: number) => void;
  onUpdateQuantity?: (id: number, quantity: number) => void;
  onCheckoutRequested?: () => void;
  showCart?: boolean;
  storeHref?: string;
  storeLabel?: string;
}

const iconMap: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  Instagram,
  Facebook,
  Twitter,
};

const Navigation = ({
  cartItems = [],
  onRemoveFromCart = () => {},
  onUpdateQuantity = () => {},
  onCheckoutRequested = () => {},
  showCart = true,
  storeHref = '/store',
  storeLabel = 'Open Store',
}: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const cartButtonRef = useRef<HTMLButtonElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const scrollToSection = (href: string) => {
    setIsMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!navigationConfig.brandName) return null;

  const closeMenu = () => {
    setIsMenuOpen(false);
    menuButtonRef.current?.focus();
  };

  const closeCart = () => {
    setIsCartOpen(false);
    cartButtonRef.current?.focus();
  };

  return (
    <>
      {/* Skip Navigation */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[99999] focus:rounded focus:bg-[#5a1a2a] focus:px-4 focus:py-2 focus:text-white focus:outline-none"
      >
        Skip to main content
      </a>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="flex items-center justify-between h-[70px] px-6 md:px-12 lg:px-[170px]">
          <a
            href="#hero"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#hero');
            }}
            className="font-serif text-2xl tracking-wide"
            style={{ color: isScrolled ? '#000' : '#fff' }}
          >
            {navigationConfig.brandName}
          </a>

          <div className="flex items-center gap-6">
            {showCart ? (
              <button
                ref={cartButtonRef}
                onClick={() => setIsCartOpen(true)}
                className="relative btn-hover"
                style={{ color: isScrolled ? '#5a1a2a' : '#fff' }}
              >
                <ShoppingBag size={22} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs text-white bg-[#5a1a2a] rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            ) : (
              <a
                href={storeHref}
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  color: isScrolled ? '#5a1a2a' : '#fff',
                  borderColor: isScrolled ? 'rgba(90,26,42,0.22)' : 'rgba(255,255,255,0.35)',
                  backgroundColor: isScrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.08)',
                }}
              >
                <Store size={18} strokeWidth={1.75} />
                <span className="hidden sm:inline">{storeLabel}</span>
              </a>
            )}

            <button
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(true)}
              className="flex flex-col gap-1.5 w-7 btn-hover"
              aria-label="Open navigation menu"
            >
              <span
                className={`h-[2px] w-full transition-all duration-300 ${
                  isScrolled ? 'bg-black' : 'bg-white'
                }`}
              />
              <span
                className={`h-[2px] w-full transition-all duration-300 ${
                  isScrolled ? 'bg-black' : 'bg-white'
                }`}
              />
            </button>
          </div>
        </div>
      </nav>

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-0 z-[9999] transition-all duration-700 ${
          isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="absolute inset-0 bg-white" />
        <div className="relative h-full flex">
          <div className="flex-1 flex flex-col justify-center items-center px-8 lg:px-20">
            <button
              onClick={closeMenu}
              className="absolute top-6 right-6 lg:right-20 p-2 hover:opacity-60 transition-opacity"
              aria-label="Close navigation menu"
            >
              <X size={28} strokeWidth={1.5} />
            </button>

            <div className="w-full max-w-md mb-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder={navigationConfig.searchPlaceholder}
                  className="w-full py-3 border-b-2 border-[#5a1a2a] bg-transparent focus:outline-none font-light text-lg"
                />
                <Search className="absolute right-0 top-1/2 -translate-y-1/2 text-[#5a1a2a]" size={20} />
              </div>
            </div>

            <nav className="flex flex-col items-center gap-6">
              {navigationConfig.menuLinks.map((link, index) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => {
                    e.preventDefault();
                    closeMenu();
                    const element = document.querySelector(link.href);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="font-serif text-3xl lg:text-[45px] text-black hover:text-[#5a1a2a] transition-colors duration-300"
                  style={{
                    opacity: isMenuOpen ? 1 : 0,
                    transform: isMenuOpen ? 'translateY(0)' : 'translateY(20px)',
                    transition: `all 0.5s ease ${index * 0.1}s`,
                  }}
                >
                  {link.label}
                </a>
              ))}
            </nav>

             <div className="flex items-center gap-6 mt-12">
               {navigationConfig.socialLinks.map((social) => {
                 const IconComponent = iconMap[social.icon];
                 if (!IconComponent) return null;
                 return (
                   <a
                     key={social.label}
                     href={social.href}
                     className="text-[#696969] hover:text-[#5a1a2a] transition-colors"
                     aria-label={social.label}
                   >
                     <IconComponent size={20} strokeWidth={1.5} />
                   </a>
                 );
               })}
             </div>
          </div>

          {navigationConfig.menuBackgroundImage && (
            <div
              className="hidden lg:block w-[40%] bg-cover bg-center"
              style={{
                backgroundImage: `url(${navigationConfig.menuBackgroundImage})`,
                opacity: isMenuOpen ? 1 : 0,
                transform: isMenuOpen ? 'translateX(0)' : 'translateX(100%)',
                transition: 'all 0.7s ease 0.2s',
              }}
            />
          )}
        </div>
      </div>

      {showCart && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
          className={`fixed inset-0 z-[9999] transition-opacity duration-300 ${
            isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeCart}
          />
          <div
            className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-xl transition-transform duration-500 ${
              isCartOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="font-serif text-2xl">{navigationConfig.brandName}</h3>
                <button
                  onClick={closeCart}
                  className="p-2 hover:opacity-60 transition-opacity"
                  aria-label="Close cart"
                >
                  <X size={24} strokeWidth={1.5} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                {cartItems.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag size={48} className="text-gray-300 mb-4" strokeWidth={1} />
                    <p className="text-[#696969] text-lg">{navigationConfig.cartEmptyText}</p>
                    <button
                      onClick={closeCart}
                      className="mt-6 px-8 py-3 bg-[#5a1a2a] text-white font-light tracking-wide btn-hover"
                    >
                      {navigationConfig.continueShoppingText}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4 pb-6 border-b border-gray-100">
                        <div className="w-24 h-24 bg-[#fafafa] overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-serif text-lg">{item.name}</h4>
                          <p className="text-[#aea4a4] mt-1">{formatCurrency(item.price)}</p>
                          <div className="flex items-center gap-3 mt-3">
                            <button
                              onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-[#5a1a2a] transition-colors"
                              aria-label={`Decrease quantity of ${item.name}`}
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center border border-gray-200 hover:border-[#5a1a2a] transition-colors"
                              aria-label={`Increase quantity of ${item.name}`}
                            >
                              +
                            </button>
                          </div>
                        </div>
                        <button
                          onClick={() => onRemoveFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={`Remove ${item.name} from cart`}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="p-6 border-t bg-[#fafafa]">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-lg">Subtotal</span>
                    <span className="font-serif text-xl">{formatCurrency(totalPrice)}</span>
                  </div>
                  <button
                    onClick={() => {
                      closeCart();
                      onCheckoutRequested();
                    }}
                    className="w-full py-4 bg-[#5a1a2a] text-white font-light tracking-widest btn-hover"
                  >
                    {navigationConfig.cartCheckoutText}
                  </button>
                  <p className="mt-3 text-center text-xs uppercase tracking-[0.2em] text-[#696969]">
                    Secure verified checkout
                  </p>
                  <button
                    onClick={closeCart}
                    className="w-full py-3 mt-3 text-[#696969] font-light tracking-wide hover:text-black transition-colors"
                  >
                    {navigationConfig.continueShoppingText}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;

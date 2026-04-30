import { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Check } from 'lucide-react';
import { bedsConfig } from '../config';
import type { Product } from '../config';
import { formatCurrency } from '../lib/currency';

interface BedsProps {
  onAddToCart?: (product: Product) => void;
  mode?: 'store' | 'showcase';
  storeHref?: string;
}

const Beds = ({
  onAddToCart,
  mode = 'store',
  storeHref = '/store',
}: BedsProps) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [addedProducts, setAddedProducts] = useState<number[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const isShowcase = mode === 'showcase';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredProducts = activeCategory === 'All'
    ? bedsConfig.products
    : bedsConfig.products.filter(product => product.category === activeCategory);

  const handleAddToCart = (product: typeof bedsConfig.products[0]) => {
    if (!onAddToCart) return;
    onAddToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
    });
    
    setAddedProducts(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedProducts(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  return (
    <section
      id="beds"
      ref={sectionRef}
      className="w-full bg-white py-20 md:py-28"
    >
      <div className="relative h-[45vh] md:h-[55vh] w-full mb-14 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${bedsConfig.heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
          <span className="inline-block mb-4 text-sm font-medium tracking-widest uppercase opacity-90">
            {bedsConfig.tag}
          </span>
          <h2 className="font-heading text-3xl md:text-5xl max-w-3xl leading-tight">
            {bedsConfig.heading}
          </h2>
          <p className="mt-5 max-w-xl text-lg font-light opacity-90">
            {bedsConfig.description}
          </p>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {bedsConfig.categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[var(--chevron-blue)] text-white'
                  : 'bg-[var(--chevron-bg-alt)] text-[var(--chevron-muted)] hover:text-black'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`live-card group bg-white border border-[var(--chevron-border)] transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 text-xs font-medium tracking-wider uppercase ${
                    product.category === 'Luxury'
                      ? 'bg-[var(--chevron-blue)] text-white'
                      : 'bg-black text-white'
                  }`}>
                    {product.category}
                  </span>
                </div>
                {isShowcase ? (
                  <a
                    href={storeHref}
                    className="absolute bottom-4 right-4 inline-flex items-center justify-center rounded-full bg-white p-3 text-black transition-all duration-300 hover:bg-[var(--chevron-blue)] hover:text-white"
                  >
                    <ShoppingCart size={18} />
                  </a>
                ) : (
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center transition-all duration-300 ${
                      addedProducts.includes(product.id)
                        ? 'bg-green-600 text-white'
                        : 'bg-white text-black hover:bg-[#5a1a2a] hover:text-white'
                    }`}
                  >
                    {addedProducts.includes(product.id) ? (
                      <Check size={18} />
                    ) : (
                      <ShoppingCart size={18} />
                    )}
                  </button>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-serif text-lg mb-2 group-hover:text-[#5a1a2a] transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                  {product.description}
                </p>
                <p className="text-lg font-light text-[#5a1a2a]">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 grid md:grid-cols-2 gap-12">
          <div className={`transition-all duration-700 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-12 bg-amber-600 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9"/><path d="M3 9V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v2"/><path d="M3 9h18"/><path d="M7 9v13"/></svg>
              </span>
              <h3 className="font-serif text-2xl">Standard Packaging</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our standard packaging options cover printed boxes, sleeves, bags and inserts
              for everyday retail needs, with practical materials and dependable production timing.
            </p>
          </div>

          <div className={`transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-12 bg-[#5a1a2a] flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </span>
              <h3 className="font-serif text-2xl">Premium Finishes</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our premium finish collection includes foil stamping, embossing, spot UV,
              textured stocks and specialty trims for packaging and stationery that need presence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beds;

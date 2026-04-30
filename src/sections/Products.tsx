import { useEffect, useRef, useState } from 'react';
import { ShoppingBag, Check, ArrowRight } from 'lucide-react';
import { productsConfig } from '../config';
import type { Product } from '../config';
import { formatCurrency } from '../lib/currency';

interface ProductsProps {
  onAddToCart?: (product: Product) => void;
  mode?: 'store' | 'showcase';
  storeHref?: string;
}

const Products = ({
  onAddToCart,
  mode = 'store',
  storeHref = '/store',
}: ProductsProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState(productsConfig.categories[0] || 'All');
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const isShowcase = mode === 'showcase';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const filteredProducts = activeCategory === productsConfig.categories[0]
    ? productsConfig.products
    : productsConfig.products.filter(p => p.category === activeCategory);

  const handleAddToCart = (product: Product) => {
    if (!onAddToCart) return;
    onAddToCart(product);
    setAddedItems(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedItems(prev => prev.filter(id => id !== product.id));
    }, 2000);
  };

  const handleViewAllProducts = () => {
    setActiveCategory(productsConfig.categories[0] || 'All');
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!productsConfig.heading && productsConfig.products.length === 0) return null;

  return (
    <section
      id="products"
      ref={sectionRef}
      className="py-20 md:py-28 bg-white"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className={`inline-block mb-4 text-sm font-medium tracking-widest uppercase text-[var(--chevron-blue)] transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {productsConfig.tag}
          </span>
          <h2
            className={`font-heading text-3xl md:text-4xl lg:text-5xl text-black mb-6 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '150ms' }}
          >
            {productsConfig.heading}
          </h2>
          <p
            className={`max-w-2xl mx-auto text-[var(--chevron-muted)] text-lg transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            {productsConfig.description}
          </p>
        </div>

        {/* Category Filter */}
        {productsConfig.categories.length > 0 && (
          <div
            className={`flex flex-wrap justify-center gap-3 mb-12 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '450ms' }}
          >
            {productsConfig.categories.map((category) => (
              <button
                key={category}
                type="button"
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
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`live-card group bg-white border border-[var(--chevron-border)] transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${600 + index * 80}ms` }}
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Product Info */}
              <div className="p-5">
                <span className="text-xs text-[var(--chevron-subtle)] tracking-wider uppercase">{product.category}</span>
                <h3 className="font-heading text-lg text-black mt-1 mb-2">{product.name}</h3>
                <p className="text-[var(--chevron-muted)] font-medium">{formatCurrency(product.price)}</p>
                
                {/* Quick Add Button */}
                {isShowcase ? (
                  <a
                    href={storeHref}
                    className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-[var(--chevron-blue)] px-4 py-2 text-sm text-white transition-all opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
                  >
                    <ShoppingBag size={14} />
                    View in Store
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className={`mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm transition-all ${
                      addedItems.includes(product.id)
                        ? 'bg-green-600 text-white opacity-100'
                        : 'bg-[var(--chevron-blue)] text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
                    }`}
                  >
                    {addedItems.includes(product.id) ? (
                      <>
                        <Check size={14} />
                        {productsConfig.addedToCartText}
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} />
                        {productsConfig.addToCartText}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        {productsConfig.viewAllText && (
          <div
            className={`text-center mt-12 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: '1000ms' }}
          >
            {isShowcase ? (
              <a
                href={storeHref}
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[var(--chevron-blue)] text-[var(--chevron-blue)] font-medium transition-all hover:bg-[var(--chevron-blue)] hover:text-white"
              >
                Browse Store Catalog
                <ArrowRight size={16} />
              </a>
            ) : (
              <button
                type="button"
                onClick={handleViewAllProducts}
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-[var(--chevron-blue)] text-[var(--chevron-blue)] font-medium transition-all hover:bg-[var(--chevron-blue)] hover:text-white"
              >
                {productsConfig.viewAllText}
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Products;

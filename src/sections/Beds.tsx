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
      className="w-full bg-white py-20 md:py-32"
    >
      <div className="relative h-[50vh] md:h-[60vh] w-full mb-16 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{ backgroundImage: `url(${bedsConfig.heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center text-white px-6">
          <span className="inline-block mb-4 text-sm tracking-[0.3em] font-light uppercase">
            {bedsConfig.tag}
          </span>
          <h2 className="font-serif text-4xl md:text-6xl max-w-4xl leading-tight">
            {bedsConfig.heading}
          </h2>
          <p className="mt-6 max-w-2xl text-lg font-light text-white/90">
            {bedsConfig.description}
          </p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {bedsConfig.categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-3 text-sm tracking-wider transition-all duration-300 ${
                activeCategory === category
                  ? 'bg-[#5a1a2a] text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`group bg-white border border-gray-100 overflow-hidden card-hover transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs tracking-wider uppercase ${
                    product.category === 'Premium'
                      ? 'bg-[#5a1a2a] text-white'
                      : 'bg-amber-600 text-white'
                  }`}>
                    {product.category}
                  </span>
                </div>
                {isShowcase ? (
                  <a
                    href={storeHref}
                    className="absolute bottom-4 right-4 inline-flex items-center justify-center rounded-full bg-white p-3 text-black transition-all duration-300 hover:bg-[#5a1a2a] hover:text-white"
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
              <h3 className="font-serif text-2xl">Local Beds</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our locally crafted beds are made with quality Nigerian wood and materials. 
              Supporting local artisans, these beds offer durability and traditional craftsmanship 
              at affordable prices. Perfect for those who appreciate authentic Nigerian furniture.
            </p>
          </div>

          <div className={`transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-12 h-12 bg-[#5a1a2a] flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              </span>
              <h3 className="font-serif text-2xl">Premium Beds</h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              Our premium collection features imported and high-end bed frames with luxurious 
              upholstery, ornate designs, and superior comfort. These beds bring hotel-quality 
              elegance to your bedroom with velvet, leather, and gold-accented finishes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Beds;

import {
  startTransition,
  useEffect,
  useDeferredValue,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ArrowRight,
  Camera,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Search,
  ShoppingCart,
  X,
} from 'lucide-react';
import { formatCurrency } from '../../lib/currency';
import {
  heroSignals,
  supplierHighlights,
  type StoreProduct,
} from '../../lib/marketplace-data';
import { useCatalog } from '../../hooks/useCatalog';
import { useStore } from '../../lib/store';

interface MarketplaceReferenceProps {
  onCheckoutRequested: () => void;
}

const topLinks = ['AI Mode', 'Products', 'Manufacturers', 'Worldwide'];
const categoryRail = [
  'Categories for you',
  'Apparel & Accessories',
  'Consumer Electronics',
  'Sports & Entertainment',
  'Beauty',
  'Luggage, Bags & Cases',
];
const tailoredTags = [
  'High barrier limited runs',
  'Versatile tableware',
  'Family care sets',
];

const cardSurface = 'rounded-[20px] bg-white shadow-airbnb-card';
const nestedCardSurface = 'rounded-[14px] bg-white shadow-airbnb-card';
const interactiveCardSurface =
  'cursor-pointer transition-shadow duration-200 hover:shadow-airbnb-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#222222]/25 focus-visible:ring-offset-2';

const normaliseCategory = (category: string) =>
  category === 'All' ? 'All' : category.toLowerCase();

const matchesCategory = (product: StoreProduct, category: string) => {
  if (category === 'All') return true;

  if (category === 'Projects') {
    return ['Living Room', 'Bedroom', 'Appliances', 'Office', 'Decor'].includes(
      product.category,
    );
  }

  return product.category === category;
};

const MarketplaceReference = ({
  onCheckoutRequested,
}: MarketplaceReferenceProps) => {
  const { cartItems, isDenseLayout, addToCart, removeFromCart, updateQuantity, toggleDenseLayout } = useStore();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<StoreProduct | null>(
    null,
  );
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const productGridRef = useRef<HTMLElement>(null);
  const suppliersRef = useRef<HTMLElement>(null);
  const checkoutRef = useRef<HTMLElement>(null);

  const { products: marketplaceProducts, categories: marketplaceCategories, loading: catalogLoading } = useCatalog();

  const filteredProducts = useMemo(() => {
    if (!marketplaceProducts || marketplaceProducts.length === 0) return [];
    const query = deferredSearchQuery.trim().toLowerCase();

    return marketplaceProducts.filter((product) => {
      const queryMatch =
        !query ||
        product.name.toLowerCase().includes(query) ||
        product.supplier.toLowerCase().includes(query) ||
        product.summary.toLowerCase().includes(query) ||
        product.tags.some((tag) => tag.toLowerCase().includes(query));

      return matchesCategory(product, activeCategory) && queryMatch;
    });
  }, [activeCategory, deferredSearchQuery, marketplaceProducts]);

  const hasActiveSearch = deferredSearchQuery.trim().length > 0;
  const noSearchResults = hasActiveSearch && filteredProducts.length === 0;

  const productPool =
    filteredProducts.length > 0 ? filteredProducts : marketplaceProducts;
  const hotSearchItems = productPool.slice(0, 2);
  const fastCustomizationItems = productPool.slice(0, 4);
  const topDeals = productPool.slice(0, 6);
  const topRanking = [...productPool]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const newArrivals = [...marketplaceProducts]
    .reverse()
    .filter((product) => matchesCategory(product, activeCategory))
    .slice(0, 4);
  const tailoredSelections = productPool.slice(2, 5);
  const gridShowcase = [...productPool, ...marketplaceProducts].slice(0, 18);

  const bannerProduct = productPool[2] ?? marketplaceProducts[2];
  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const previewSlides = selectedProduct?.gallery?.length 
    ? selectedProduct.gallery 
    : selectedProduct 
      ? [{
          id: -1,
          image: selectedProduct.image,
          title: 'Main View',
          caption: 'Product primary perspective',
          objectPosition: 'center center',
          imageTransform: 'scale(1)',
        }]
      : [];
      
  const previewSlide =
    previewSlides[activeSlideIndex] ?? previewSlides[0] ?? null;

  useEffect(() => {
    if (!isCartOpen && !selectedProduct) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isCartOpen, selectedProduct]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (selectedProduct) {
          setSelectedProduct(null);
          return;
        }

        if (isCartOpen) {
          setIsCartOpen(false);
        }
      }

      if (!selectedProduct || previewSlides.length < 2) {
        return;
      }

      if (event.key === 'ArrowRight') {
        setActiveSlideIndex((currentIndex) =>
          (currentIndex + 1) % previewSlides.length,
        );
      }

      if (event.key === 'ArrowLeft') {
        setActiveSlideIndex((currentIndex) =>
          (currentIndex - 1 + previewSlides.length) % previewSlides.length,
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCartOpen, previewSlides.length, selectedProduct]);

  const setCategory = (category: string) => {
    startTransition(() => setActiveCategory(category));
  };

  const openProductPreview = (product: StoreProduct) => {
    setSelectedProduct(product);
    setActiveSlideIndex(0);
  };

  const closeProductPreview = () => {
    setSelectedProduct(null);
    setActiveSlideIndex(0);
  };

  const showNextSlide = () => {
    if (!selectedProduct || previewSlides.length === 0) {
      return;
    }

    setActiveSlideIndex(
      (currentIndex) => (currentIndex + 1) % previewSlides.length,
    );
  };

  const showPreviousSlide = () => {
    if (!selectedProduct || previewSlides.length === 0) {
      return;
    }

    setActiveSlideIndex(
      (currentIndex) =>
        (currentIndex - 1 + previewSlides.length) % previewSlides.length,
    );
  };

  const handleCardKeyDown = (
    event: React.KeyboardEvent<HTMLElement>,
    product: StoreProduct,
  ) => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    openProductPreview(product);
  };

  const handlePreviewAddToCart = () => {
    if (!selectedProduct) {
      return;
    }

    addToCart(selectedProduct);
    setIsCartOpen(true);
    closeProductPreview();
  };

  const scrollToElement = (element: HTMLElement | null) => {
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSearchSubmit = () => {
    if (!searchQuery.trim()) {
      searchInputRef.current?.focus();
      return;
    }

    scrollToElement(productGridRef.current);
  };

  const handleImageSearch = () => {
    imageInputRef.current?.click();
  };

  const handleImageSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const derivedQuery = selectedFile.name
      .replace(/\.[^.]+$/, '')
      .replace(/[-_]+/g, ' ')
      .trim();

    setSearchQuery(derivedQuery || 'Custom inspiration');
    scrollToElement(productGridRef.current);
    event.target.value = '';
  };

  const handleTopLinkClick = (link: string) => {
    switch (link) {
      case 'AI Mode':
        setCategory('Projects');
        setSearchQuery(heroSignals[0] || '');
        searchInputRef.current?.focus();
        scrollToElement(productGridRef.current);
        break;
      case 'Products':
        setCategory('All');
        setSearchQuery('');
        scrollToElement(productGridRef.current);
        break;
      case 'Manufacturers':
        scrollToElement(suppliersRef.current);
        break;
      case 'Worldwide':
        scrollToElement(checkoutRef.current);
        break;
      default:
        break;
    }
  };

  const handleSourceNow = () => {
    addToCart(bannerProduct);
    setIsCartOpen(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setCategory('All');
    searchInputRef.current?.focus();
  };

  const gridClasses = isDenseLayout
    ? 'grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
    : 'grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5';

  return (
    <div className="font-store min-h-screen bg-white pb-20">
      <header className="sticky top-0 z-40 border-b border-[#ebebeb] bg-white shadow-airbnb-card">
        <div className="mx-auto w-full max-w-[1440px] px-4 pb-2 pt-3">
          <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap lg:gap-5">
            <div className="flex min-w-0 flex-1 items-center justify-between gap-3 lg:w-auto lg:flex-none lg:justify-start">
              <span className="shrink-0 text-[1.375rem] font-semibold tracking-[-0.03em] text-[#ff385c]">
                Stankings
              </span>
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f2f2f2] text-[#222222] transition hover:shadow-airbnb-hover lg:hidden"
                aria-label={`Open cart, ${cartCount} items`}
              >
                <ShoppingCart size={20} />
                {cartCount > 0 ? (
                  <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ff385c] px-1 text-[10px] font-semibold text-white">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                ) : null}
              </button>
            </div>

            <div className="order-last flex w-full flex-[1_1_100%] justify-center lg:order-none lg:flex-[1_1_auto] lg:max-w-2xl">
              <div className="flex w-full items-center gap-2 rounded-[32px] bg-white px-4 py-2 shadow-airbnb-card">
                <Search size={18} className="shrink-0 text-[#6a6a6a]" aria-hidden />
                <input
                  ref={searchInputRef}
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleSearchSubmit();
                    }
                  }}
                  placeholder="What are you looking for?"
                  className="min-w-0 flex-1 bg-transparent py-2 text-sm font-normal text-[#222222] outline-none placeholder:text-[#6a6a6a]"
                />
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ff385c] text-white transition hover:opacity-90"
                  aria-label="Search"
                >
                  <ArrowRight size={18} strokeWidth={2.25} />
                </button>
              </div>
            </div>

            <div className="hidden items-center gap-1 lg:flex">
              {topLinks.map((link) => (
                <button
                  key={link}
                  type="button"
                  onClick={() => handleTopLinkClick(link)}
                  className={`border-b-2 border-transparent px-2 pb-1 text-sm font-semibold transition ${
                    link === 'Products'
                      ? 'border-[#222222] text-[#222222]'
                      : 'text-[#6a6a6a] hover:text-[#222222]'
                  }`}
                >
                  {link}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className="ml-2 inline-flex items-center gap-2 rounded-lg bg-[#222222] px-5 py-2.5 text-base font-medium text-white transition hover:bg-[#ff385c]"
              >
                <ShoppingCart size={18} />
                <span>Cart</span>
                <span className="rounded bg-white/15 px-2 py-0.5 text-xs font-semibold tabular-nums">
                  {cartCount}
                </span>
              </button>
            </div>
          </div>

          <nav
            className="scrollbar-hide mt-3 flex gap-4 overflow-x-auto border-t border-[#f2f2f2] pb-2 pt-3"
            aria-label="Categories"
          >
            {catalogLoading ? (
              <div className="flex items-center px-1 text-sm text-[#6a6a6a]">
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-[#c1c1c1] border-t-[#222222]" />
                Loading categories…
              </div>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setCategory('All')}
                  className={`shrink-0 whitespace-nowrap border-b-2 px-0.5 pb-2 text-sm font-semibold transition ${
                    activeCategory === 'All'
                      ? 'border-[#222222] text-[#222222]'
                      : 'border-transparent text-[#6a6a6a] hover:text-[#222222]'
                  }`}
                >
                  All
                </button>
                {categoryRail.map((item, index) => {
                  const mappedCategory =
                    marketplaceCategories && marketplaceCategories[index]
                      ? marketplaceCategories[index].name
                      : 'All';
                  const isActive =
                    normaliseCategory(activeCategory) ===
                    normaliseCategory(mappedCategory);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(mappedCategory)}
                      className={`shrink-0 whitespace-nowrap border-b-2 px-0.5 pb-2 text-sm font-semibold transition ${
                        isActive
                          ? 'border-[#222222] text-[#222222]'
                          : 'border-transparent text-[#6a6a6a] hover:text-[#222222]'
                      }`}
                    >
                      {item}
                    </button>
                  );
                })}
              </>
            )}
          </nav>

          <nav
            className="scrollbar-hide flex gap-4 overflow-x-auto border-t border-[#f2f2f2] py-2 lg:hidden"
            aria-label="Quick links"
          >
            {topLinks.map((link) => (
              <button
                key={link}
                type="button"
                onClick={() => handleTopLinkClick(link)}
                className={`shrink-0 whitespace-nowrap border-b-2 px-0.5 pb-1 text-sm font-semibold ${
                  link === 'Products'
                    ? 'border-[#222222] text-[#222222]'
                    : 'border-transparent text-[#6a6a6a]'
                }`}
              >
                {link}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1440px] px-4 pt-6">
        <section className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleImageSearch}
              className="inline-flex items-center gap-2 rounded-lg border border-[#c1c1c1] bg-[#f2f2f2] px-4 py-2.5 text-sm font-medium text-[#222222] transition hover:shadow-airbnb-hover"
            >
              <Camera size={16} />
              Image search
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              id="image-search-input"
              onChange={handleImageSelection}
              className="hidden"
              aria-label="Upload image for visual search"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {heroSignals.map((signal) => (
              <button
                key={signal}
                type="button"
                onClick={() => setSearchQuery(signal)}
                className="rounded-full bg-[#f2f2f2] px-3 py-1.5 text-xs font-medium text-[#222222] transition hover:shadow-airbnb-hover"
              >
                {signal}
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[repeat(2,minmax(0,1fr))_minmax(0,1.15fr)]">
          {hotSearchItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => openProductPreview(item)}
              className={`${cardSurface} ${interactiveCardSurface} overflow-hidden p-0 text-left`}
            >
              <div className="aspect-[16/10] w-full overflow-hidden bg-[#f2f2f2]">
                <img
                  loading="lazy"
                  decoding="async"
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-4">
                <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
                  Frequently searched
                </p>
                <h3 className="mt-1 text-[22px] font-semibold leading-[1.18] tracking-[-0.44px] text-[#222222]">
                  {item.name}
                </h3>
              </div>
            </button>
          ))}

          <article
            className={`${cardSurface} relative flex flex-col justify-end overflow-hidden p-6 ${interactiveCardSurface}`}
          >
            <div
              className="pointer-events-none absolute left-0 top-0 h-1 w-full bg-[#460479]/25"
              aria-hidden
            />
            <div className="relative z-[1]">
              <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
                Featured
              </p>
              <h3 className="mt-2 text-[22px] font-semibold leading-[1.18] tracking-[-0.44px] text-[#222222]">
                MatchExpo picks
              </h3>
              <p className="mt-2 max-w-[260px] text-sm leading-normal text-[#6a6a6a]">
                Fast-moving Stankings products ranked for buyers who browse like a
                travel gallery.
              </p>
              <button
                type="button"
                onClick={handleSourceNow}
                className="mt-4 rounded-lg bg-[#222222] px-6 py-2.5 text-base font-medium text-white transition hover:bg-[#ff385c]"
              >
                Source now
              </button>
            </div>
            {bannerProduct ? (
              <img
                loading="lazy"
                decoding="async"
                src={bannerProduct.image}
                alt=""
                className="pointer-events-none absolute bottom-0 right-0 h-[55%] max-h-[200px] w-1/2 object-cover opacity-35"
              />
            ) : null}
          </article>
        </section>

        <section className="mt-6 rounded-[20px] bg-[#f2f2f2] p-4 shadow-airbnb-card">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,240px)_repeat(4,minmax(0,1fr))]">
            <div className={`${nestedCardSurface} flex flex-col justify-center p-4`}>
              <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
                Fast customization
              </p>
              <h3 className="mt-2 text-xl font-bold leading-tight tracking-[-0.02em] text-[#222222]">
                Build tailored packages faster
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-[#6a6a6a]">
                <li>Low MOQ supply-ready bundles</li>
                <li>Design options for room packages</li>
                <li>Order protections and payment flow</li>
              </ul>
            </div>

            {fastCustomizationItems.map((item) => (
              <article
                key={`fast-${item.id}`}
                className={`${nestedCardSurface} overflow-hidden p-0 text-[#222222] ${interactiveCardSurface}`}
                onClick={() => openProductPreview(item)}
                onKeyDown={(event) => handleCardKeyDown(event, item)}
                tabIndex={0}
                aria-label={`View details for ${item.name}`}
              >
                <div className="aspect-[16/10] w-full bg-white">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-base font-semibold leading-tight tracking-[-0.02em]">
                    {item.name}
                  </p>
                  <p className="mt-2 text-xs text-[#6a6a6a]">{item.moq}</p>
                  <p className="mt-2 text-xs font-semibold text-[#222222]">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className={`${cardSurface} mt-6 p-4`}>
          <div className="flex items-center justify-between">
            <h2 className="text-[1.75rem] font-bold leading-snug text-[#222222]">
              Top deals
            </h2>
            <span className="text-sm text-[#6a6a6a]">View more</span>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {topDeals.map((item) => (
              <article
                key={`deal-${item.id}`}
                className={`${nestedCardSurface} overflow-hidden p-0 ${interactiveCardSurface}`}
                onClick={() => openProductPreview(item)}
                onKeyDown={(event) => handleCardKeyDown(event, item)}
                tabIndex={0}
                aria-label={`View deal for ${item.name}`}
              >
                <div className="aspect-[16/10] bg-[#f2f2f2]">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-xs font-medium leading-snug text-[#222222]">
                    {item.name}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-[#222222]">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-2">
          <article className={`${cardSurface} p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[1.25rem] font-semibold leading-tight text-[#222222]">
                Top ranking
              </h2>
              <span className="text-sm text-[#6a6a6a]">View more</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {topRanking.map((item) => (
                <div
                  key={`rank-${item.id}`}
                  className={`${nestedCardSurface} overflow-hidden p-0 ${interactiveCardSurface}`}
                  onClick={() => openProductPreview(item)}
                  onKeyDown={(event) => handleCardKeyDown(event, item)}
                  tabIndex={0}
                  aria-label={`View details for ${item.name}`}
                >
                  <div className="aspect-[16/10] bg-[#f2f2f2]">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-base font-semibold leading-tight text-[#222222]">
                      {item.name}
                    </p>
                    <p className="mt-2 text-xs text-[#6a6a6a]">{item.orders}</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className={`${cardSurface} p-4`}>
            <div className="flex items-center justify-between">
              <h2 className="text-[1.25rem] font-semibold leading-tight text-[#222222]">
                New arrivals
              </h2>
              <span className="text-sm text-[#6a6a6a]">View more</span>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {newArrivals.map((item) => (
                <div
                  key={`arrival-${item.id}`}
                  className={`${nestedCardSurface} group overflow-hidden p-0 ${interactiveCardSurface}`}
                  onClick={() => openProductPreview(item)}
                  onKeyDown={(event) => handleCardKeyDown(event, item)}
                  tabIndex={0}
                  aria-label={`View ${item.name}`}
                >
                  <div className="aspect-[16/10] overflow-hidden bg-[#f2f2f2]">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-2 text-base font-semibold leading-tight text-[#222222]">
                      {item.name}
                    </p>
                    <p className="mt-2 text-xs font-semibold text-[#92174d]">
                      {item.leadTime}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className={`${cardSurface} mt-6 p-4`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <h2 className="text-[1.25rem] font-semibold leading-tight text-[#222222]">
              Tailored selections
            </h2>
            <div className="flex flex-wrap gap-2">
              {tailoredTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[14px] bg-[#f2f2f2] px-3 py-1.5 text-[11px] font-semibold leading-tight text-[#222222]"
                  style={{ fontFeatureSettings: '"salt" 1' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {tailoredSelections.map((item) => (
              <article
                key={`tailored-${item.id}`}
                className={`${nestedCardSurface} group overflow-hidden p-0 ${interactiveCardSurface}`}
                onClick={() => openProductPreview(item)}
                onKeyDown={(event) => handleCardKeyDown(event, item)}
                tabIndex={0}
                aria-label={`View details for ${item.name}`}
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#f2f2f2]">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-base font-semibold leading-tight text-[#222222]">
                    {item.name}
                  </p>
                  <p className="mt-2 text-sm text-[#6a6a6a]">{item.supplier}</p>
                  <p className="mt-2 text-xs font-semibold text-[#222222]">
                    {formatCurrency(item.price)}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section ref={productGridRef} className="mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-[1.75rem] font-bold leading-snug text-[#222222]">
              Curated marketplace grid
            </h2>
            <button
              type="button"
              onClick={toggleDenseLayout}
              aria-pressed={isDenseLayout ? 'true' : 'false'}
              className="inline-flex items-center gap-2 rounded-lg border border-[#c1c1c1] bg-[#f2f2f2] px-4 py-2 text-sm font-medium text-[#222222] transition hover:shadow-airbnb-hover"
            >
              <LayoutGrid size={16} />
              {isDenseLayout ? 'Relaxed layout' : 'Dense layout'}
            </button>
          </div>

          {noSearchResults && (
            <div className="mb-4 flex flex-col gap-3 rounded-[20px] border border-[#c1c1c1] bg-[#f2f2f2] px-4 py-4 text-sm text-[#222222] shadow-airbnb-card md:flex-row md:items-center md:justify-between">
              <p>
                No exact matches for &ldquo;{searchQuery}&rdquo; yet. Showing the closest
                Stankings picks instead.
              </p>
              <button
                type="button"
                onClick={handleClearSearch}
                className="inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#222222] shadow-airbnb-card transition hover:shadow-airbnb-hover"
              >
                Clear search
              </button>
            </div>
          )}

          <div className={gridClasses}>
            {gridShowcase.map((item, index) => (
              <article
                key={`grid-${item.id}-${index}`}
                className={`${cardSurface} ${interactiveCardSurface} group overflow-hidden p-0`}
                onClick={() => openProductPreview(item)}
                onKeyDown={(event) => handleCardKeyDown(event, item)}
                tabIndex={0}
                aria-label={`View details for ${item.name}`}
              >
                <div
                  className={`w-full overflow-hidden bg-[#f2f2f2] ${
                    isDenseLayout ? 'aspect-[16/10]' : 'aspect-[16/10] min-h-[168px]'
                  }`}
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-base font-semibold leading-tight text-[#222222]">
                    {item.name}
                  </p>
                  <p className="mt-2 text-sm text-[#6a6a6a]">{item.moq}</p>
                  <p className="mt-2 text-xs font-semibold text-[#222222]">
                    {formatCurrency(item.price)}
                  </p>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      addToCart(item);
                    }}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#222222] px-3 py-2.5 text-base font-medium text-white transition hover:bg-[#ff385c]"
                  >
                    Add
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <article ref={suppliersRef} className={`${cardSurface} p-4`}>
            <h2 className="text-[1.25rem] font-semibold leading-tight text-[#222222]">
              Supplier credibility
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {supplierHighlights.map((supplier) => (
                <div key={supplier.name} className={`${nestedCardSurface} p-3`}>
                  <p className="text-base font-semibold text-[#222222]">{supplier.name}</p>
                  <p className="mt-2 text-sm leading-snug text-[#6a6a6a]">
                    {supplier.specialty}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-[#460479]">
                    {supplier.score}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article
            ref={checkoutRef}
            className={`${cardSurface} border-l-4 border-l-[#ff385c] p-6`}
          >
            <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
              Protected checkout
            </p>
            <h2 className="mt-3 text-[1.31rem] font-bold leading-snug text-[#222222]">
              Marketplace layout on top, secure Stankings payment flow underneath.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#6a6a6a]">
              Customers can place orders, pay, and receive confirmation email and SMS once
              their payment is processed and confirmed.
            </p>
          </article>
        </section>

      </main>

      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${
          selectedProduct ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
        aria-hidden={selectedProduct ? 'false' : 'true'}
      >
        <div
          className="absolute inset-0 bg-[#222222]/45 backdrop-blur-[2px]"
          onClick={closeProductPreview}
        />
        <div className="relative mx-auto flex h-full w-full max-w-[1440px] items-center justify-center px-3 py-4 sm:px-5">
          <section
            role="dialog"
            aria-modal="true"
            aria-label={selectedProduct ? `${selectedProduct.name} preview` : 'Product preview'}
            className={`relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-y-auto overflow-x-hidden rounded-[24px] bg-white shadow-airbnb-card transition-transform duration-300 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)] lg:overflow-hidden ${
              selectedProduct ? 'translate-y-0 scale-100' : 'translate-y-4 scale-[0.98]'
            }`}
          >
            {selectedProduct && (
              <>
                <div className="relative overflow-visible bg-white p-3 sm:p-5 lg:overflow-y-auto">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
                        Click-to-preview catalog
                      </p>
                      <p className="mt-1 text-xs text-[#6a6a6a]">
                        Three viewpoints generated from the product image for a faster visual
                        review.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={closeProductPreview}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f2f2] text-[#222222] transition hover:shadow-airbnb-hover"
                      title="Close preview"
                      aria-label="Close product preview"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="relative mt-3 overflow-hidden rounded-[16px] bg-white p-2 shadow-airbnb-card sm:p-2">
                    <div className="relative aspect-[4/3] w-full lg:aspect-[16/11] overflow-hidden rounded-[10px] bg-[#f2f2f2]">
                      {previewSlide && (
                        <img
                          loading="lazy"
                          decoding="async"
                          src={previewSlide.image}
                          alt={`${selectedProduct.name} ${previewSlide.title}`}
                          className="h-full w-full object-cover transition-transform duration-500"
                          style={{
                            objectPosition: previewSlide.objectPosition,
                            transform: previewSlide.imageTransform,
                          }}
                        />
                      )}

                      {previewSlides.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={showPreviousSlide}
                            className="absolute left-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f2f2f2] text-[#222222] transition hover:shadow-airbnb-hover"
                            title="Previous image"
                            aria-label="Previous product image"
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            type="button"
                            onClick={showNextSlide}
                            className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#f2f2f2] text-[#222222] transition hover:shadow-airbnb-hover"
                            title="Next image"
                            aria-label="Next product image"
                          >
                            <ChevronRight size={16} />
                          </button>
                        </>
                      )}

                      <div className="absolute bottom-3 left-3 rounded-full bg-[#222222]/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
                        View {activeSlideIndex + 1} of {previewSlides.length}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-3">
                    {previewSlides.map((slide, index) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setActiveSlideIndex(index)}
                        className={`overflow-hidden rounded-[10px] p-1.5 text-left transition ${
                          index === activeSlideIndex
                            ? 'bg-white shadow-airbnb-card ring-1 ring-[#222222]'
                            : 'bg-[#f2f2f2]/60 hover:shadow-airbnb-hover'
                        }`}
                      >
                        <div className="overflow-hidden rounded-[6px] bg-[#f2f2f2]">
                          <img
                            loading="lazy"
                            decoding="async"
                            src={slide.image}
                            alt={`${selectedProduct.name} ${slide.title}`}
                            className="aspect-[16/9] w-full object-cover sm:h-12 lg:h-14"
                            style={{
                              objectPosition: slide.objectPosition,
                              transform: slide.imageTransform,
                            }}
                          />
                        </div>
                        <p className="mt-1.5 truncate text-[11px] font-semibold text-[#222222]">{slide.title}</p>
                        <p className="mt-0.5 truncate text-[10px] text-[#6a6a6a]">{slide.caption}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col overflow-y-auto border-t border-[#ebebeb] bg-white lg:border-l lg:border-t-0">
                  <div className="border-b border-[#ebebeb] px-4 py-4 sm:px-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="rounded-[10px] bg-[#f2f2f2] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#222222]"
                        style={{ fontFeatureSettings: '"salt" 1' }}
                      >
                        {selectedProduct.badge}
                      </span>
                      <span className="rounded-[10px] bg-[#f2f2f2] px-2 py-0.5 text-[10px] font-medium text-[#6a6a6a]">
                        {selectedProduct.category}
                      </span>
                    </div>
                    <h3 className="mt-2 text-[1.4rem] font-bold leading-tight tracking-[-0.02em] text-[#222222]">
                      {selectedProduct.name}
                    </h3>
                  </div>

                  <div className="space-y-4 px-4 py-4 sm:px-5">
                    <div className="rounded-[14px] bg-[#f2f2f2] p-4 shadow-airbnb-card">
                      <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
                        Marketplace offer
                      </p>
                      <div className="mt-2 flex items-end justify-between gap-3">
                        <div>
                          <p className="text-2xl font-semibold tracking-[-0.03em] text-[#222222]">
                            {formatCurrency(selectedProduct.price)}
                          </p>
                          <p className="mt-1 text-xs text-[#6a6a6a]">MOQ {selectedProduct.moq}</p>
                        </div>
                        <div className="text-right text-xs text-[#6a6a6a]">
                          <p>{selectedProduct.rating.toFixed(1)} rating</p>
                          <p className="mt-0.5">{selectedProduct.orders}</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                      {(
                        [
                          ['Supplier', selectedProduct.supplier],
                          ['Origin', selectedProduct.origin],
                          ['Lead time', selectedProduct.leadTime],
                          ['Current view', previewSlide?.title ?? '—'],
                        ] as const
                      ).map(([label, value]) => (
                        <div
                          key={label}
                          className="rounded-[10px] border border-[#ebebeb] bg-white p-2.5 shadow-airbnb-card"
                        >
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6a6a6a]">
                            {label}
                          </p>
                          <p className="mt-1 truncate text-xs font-semibold text-[#222222]">{value}</p>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-[14px] border border-[#ebebeb] bg-white p-3 shadow-airbnb-card">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#6a6a6a]">
                        Angle notes
                      </p>
                      <p className="mt-1.5 text-xs text-[#6a6a6a]">
                        {previewSlide?.caption}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {selectedProduct.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-[10px] bg-[#f2f2f2] px-2.5 py-1 text-[10px] font-medium text-[#222222]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row pb-2">
                      <button
                        type="button"
                        onClick={handlePreviewAddToCart}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#222222] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#ff385c]"
                      >
                        Add to buyer shortlist
                        <ShoppingCart size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={closeProductPreview}
                        className="inline-flex items-center justify-center rounded-lg border border-[#c1c1c1] bg-white px-4 py-2.5 text-sm font-medium text-[#222222] transition hover:shadow-airbnb-hover"
                      >
                        Keep browsing
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isCartOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        <div
          className="absolute inset-0 bg-[#222222]/40"
          onClick={() => setIsCartOpen(false)}
        />
        <aside
          className={`absolute right-0 top-0 h-full w-full max-w-md border-l border-[#ebebeb] bg-white shadow-airbnb-card transition-transform duration-500 ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-[#ebebeb] px-6 py-5">
              <div>
                <p className="text-[8px] font-bold uppercase tracking-[0.32px] text-[#6a6a6a]">
                  Cart overview
                </p>
                <h3 className="mt-2 text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-[#222222]">
                  Buyer shortlist
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#f2f2f2] text-[#222222] transition hover:shadow-airbnb-hover"
                title="Close cart"
                aria-label="Close shopping cart"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#f2f2f2] text-[#222222] shadow-airbnb-card">
                    <ShoppingCart size={24} />
                  </div>
                  <h4 className="mt-5 text-[1.5rem] font-semibold leading-tight text-[#222222]">
                    No products shortlisted yet
                  </h4>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#6a6a6a]">
                    Add items from the marketplace grid and continue to checkout.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[20px] bg-white p-4 shadow-airbnb-card"
                    >
                      <div className="flex gap-4">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={item.image}
                          alt={item.name}
                          className="h-20 w-20 rounded-[14px] object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold text-[#222222]">{item.name}</p>
                              <p className="mt-1 text-sm text-[#6a6a6a]">
                                {formatCurrency(item.price)}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.id)}
                              className="shrink-0 text-sm text-[#6a6a6a] transition-colors hover:text-[#c13515]"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="mt-4 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.id, Math.max(0, item.quantity - 1))
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f2f2] text-sm font-semibold text-[#222222] transition hover:shadow-airbnb-hover"
                            >
                              -
                            </button>
                            <span className="min-w-8 text-center text-sm font-semibold text-[#222222]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#f2f2f2] text-sm font-semibold text-[#222222] transition hover:shadow-airbnb-hover"
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-[#ebebeb] bg-white px-6 py-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium uppercase tracking-wide text-[#6a6a6a]">
                    Cart value
                  </span>
                  <span className="text-2xl font-semibold tracking-[-0.02em] text-[#222222]">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCartOpen(false);
                    onCheckoutRequested();
                  }}
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#222222] px-5 py-3.5 text-base font-medium text-white transition hover:bg-[#ff385c]"
                >
                  Continue to checkout
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MarketplaceReference;

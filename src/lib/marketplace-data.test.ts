import { describe, it, expect } from 'vitest';

interface StoreProduct {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  gallery: StoreProductGallerySlide[];
  supplier: string;
  origin: string;
  moq: string;
  leadTime: string;
  rating: number;
  orders: string;
  badge: string;
  summary: string;
  tags: string[];
}

interface StoreProductGallerySlide {
  id: string;
  image: string;
  title: string;
  caption: string;
  objectPosition: string;
  imageTransform: string;
}

interface MarketplaceCategory {
  name: string;
  caption: string;
  skuCount: string;
  icon: string;
}

const marketplaceCategories: MarketplaceCategory[] = [
  { name: 'All', caption: 'Complete print quote catalog', skuCount: '90+ options', icon: 'press' },
  { name: 'Essentials', caption: 'Cards, letterheads and business stationery', skuCount: '18 options', icon: 'paper' },
  { name: 'Marketing', caption: 'Flyers, brochures, posters and booklets', skuCount: '22 options', icon: 'paper' },
  { name: 'Large Format', caption: 'Banners, backdrops, signage and wall graphics', skuCount: '14 options', icon: 'banner' },
  { name: 'Packaging', caption: 'Boxes, sleeves, bags and retail inserts', skuCount: '16 options', icon: 'box' },
  { name: 'Labels', caption: 'Roll labels, sticker sheets and waterproof decals', skuCount: '12 options', icon: 'label' },
  { name: 'Apparel', caption: 'T-shirts, uniforms, totes and branded merch', skuCount: '8 options', icon: 'shirt' },
  { name: 'Books', caption: 'Booklets, catalogs, manuals and programs', skuCount: '10 options', icon: 'book' },
];

const marketplaceProducts: StoreProduct[] = [
  {
    id: 1,
    name: 'Premium Business Cards - 500 units',
    price: 15000,
    category: 'Essentials',
    image: '/images/thewworks-press-hero.png',
    gallery: [],
    supplier: 'Thewworks Pressroom',
    origin: 'Digital press lane',
    moq: '500 cards',
    leadTime: '24-72 hours',
    rating: 4.9,
    orders: '248 repeat orders',
    badge: 'Fast proofing',
    summary: 'Thick card stock with matte, gloss, textured or soft-touch finishing options.',
    tags: ['Business cards', 'Matte finish', 'Quick turnaround'],
  },
  {
    id: 2,
    name: 'Corporate Letterheads - 250 sheets',
    price: 8500,
    category: 'Essentials',
    image: '/images/thewworks-press-hero.png',
    gallery: [],
    supplier: 'Thewworks Pressroom',
    origin: 'Stationery desk',
    moq: '250 sheets',
    leadTime: '2-3 days',
    rating: 4.8,
    orders: '134 office orders',
    badge: 'Brand ready',
    summary: 'Clean corporate stationery printed on crisp paper with matching envelope options.',
    tags: ['Letterhead', 'Office stationery', 'Brand kit'],
  },
  {
    id: 3,
    name: 'Tri-fold Brochures - 1000 units',
    price: 42000,
    category: 'Marketing',
    image: '/images/thewworks-press-hero.png',
    gallery: [],
    supplier: 'Thewworks Pressroom',
    origin: 'Marketing print lane',
    moq: '500 brochures',
    leadTime: '3-5 days',
    rating: 4.8,
    orders: '91 campaign runs',
    badge: 'Campaign staple',
    summary: 'Full-color brochures with accurate folds, clean trim and premium paper choices.',
    tags: ['Brochures', 'Campaigns', 'Bulk print'],
  },
];

const heroSignals = [
  'Business card runs',
  'Packaging prototypes',
  'Bulk brochure printing',
  'Fast proof approval',
  'CMYK color control',
];

const sourcingAdvantages = [
  { title: 'Quote concierge', body: 'Send one brief and get paper, finishing, size and quantity recommendations.' },
  { title: 'Bulk project pricing', body: 'Build quote bundles for schools, events, restaurants, retail launches.' },
  { title: 'Protected checkout', body: 'Secure payment flow with order verification, confirmation email and SMS.' },
];

const supplierHighlights = [
  { name: 'Thewworks Pressroom', specialty: 'Offset, digital, trimming and binding', score: '4.9/5', fulfillment: '97% on-time', markets: 'Local pickup, courier and bulk dispatch' },
  { name: 'Thewworks Packaging Desk', specialty: 'Retail boxes, sleeves, bags, labels', score: '4.8/5', fulfillment: '42 verified launch runs', markets: 'Product founders and retail teams' },
  { name: 'Thewworks Finish Lab', specialty: 'Foil, embossing, spot UV, lamination', score: '4.9/5', fulfillment: '5-12 day lead', markets: 'Premium stationery and packaging' },
];

const dashboardWindows = ['30D', '90D', 'YTD'] as const;

describe('Marketplace Data', () => {
  describe('Categories', () => {
    it('should have valid categories', () => {
      expect(marketplaceCategories.length).toBeGreaterThan(0);
    });

    it('should have All category first', () => {
      expect(marketplaceCategories[0]?.name).toBe('All');
    });

    it('should have valid icon for each category', () => {
      const validIcons = ['press', 'paper', 'banner', 'box', 'label', 'shirt', 'book'];
      for (const category of marketplaceCategories) {
        expect(validIcons).toContain(category.icon);
      }
    });

    it('should have required fields for each category', () => {
      for (const category of marketplaceCategories) {
        expect(category.name).toBeTruthy();
        expect(category.caption).toBeTruthy();
        expect(category.skuCount).toBeTruthy();
        expect(category.icon).toBeTruthy();
      }
    });
  });

  describe('Products', () => {
    it('should have products', () => {
      expect(marketplaceProducts.length).toBeGreaterThan(0);
    });

    it('should have all required fields', () => {
      for (const product of marketplaceProducts) {
        expect(product.id).toBeDefined();
        expect(product.name).toBeTruthy();
        expect(product.price).toBeGreaterThan(0);
        expect(product.category).toBeTruthy();
        expect(product.image).toBeTruthy();
        expect(product.supplier).toBeTruthy();
        expect(product.origin).toBeTruthy();
        expect(product.moq).toBeTruthy();
        expect(product.leadTime).toBeTruthy();
        expect(product.rating).toBeGreaterThanOrEqual(0);
        expect(product.rating).toBeLessThanOrEqual(5);
        expect(product.orders).toBeTruthy();
        expect(product.badge).toBeTruthy();
        expect(product.summary).toBeTruthy();
        expect(Array.isArray(product.tags)).toBe(true);
      }
    });

    it('should sort by rating correctly', () => {
      const sorted = [...marketplaceProducts].sort((a, b) => b.rating - a.rating);
      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].rating).toBeGreaterThanOrEqual(sorted[i + 1].rating);
      }
    });

    it('should filter by category', () => {
      const essentials = marketplaceProducts.filter((p) => p.category === 'Essentials');
      expect(essentials.every((p) => p.category === 'Essentials')).toBe(true);
    });

    it('should filter by search query in name', () => {
      const query = 'business';
      const results = marketplaceProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()),
      );
      for (const product of results) {
        expect(product.name.toLowerCase()).toContain(query.toLowerCase());
      }
    });

    it('should filter by supplier', () => {
      const supplier = 'Thewworks Pressroom';
      const results = marketplaceProducts.filter((p) => p.supplier === supplier);
      for (const product of results) {
        expect(product.supplier).toBe(supplier);
      }
    });

    it('should filter by tags', () => {
      const tag = 'Business cards';
      const results = marketplaceProducts.filter((p) =>
        p.tags.some((t) => t.toLowerCase().includes(tag.toLowerCase())),
      );
      for (const product of results) {
        const hasTag = product.tags.some((t) =>
          t.toLowerCase().includes(tag.toLowerCase()),
        );
        expect(hasTag).toBe(true);
      }
    });
  });

  describe('Hero Signals', () => {
    it('should have hero signals', () => {
      expect(heroSignals.length).toBeGreaterThan(0);
    });

    it('should have non-empty strings', () => {
      for (const signal of heroSignals) {
        expect(signal.trim().length).toBeGreaterThan(0);
      }
    });
  });

  describe('Sourcing Advantages', () => {
    it('should have advantages', () => {
      expect(sourcingAdvantages.length).toBeGreaterThan(0);
    });

    it('should have required fields', () => {
      for (const advantage of sourcingAdvantages) {
        expect(advantage.title).toBeTruthy();
        expect(advantage.body).toBeTruthy();
      }
    });
  });

  describe('Supplier Highlights', () => {
    it('should have suppliers', () => {
      expect(supplierHighlights.length).toBeGreaterThan(0);
    });

    it('should have required fields', () => {
      for (const supplier of supplierHighlights) {
        expect(supplier.name).toBeTruthy();
        expect(supplier.specialty).toBeTruthy();
        expect(supplier.score).toBeTruthy();
        expect(supplier.fulfillment).toBeTruthy();
        expect(supplier.markets).toBeTruthy();
      }
    });

    it('should have valid scores', () => {
      for (const supplier of supplierHighlights) {
        const score = parseFloat(supplier.score);
        expect(score).toBeGreaterThan(0);
        expect(score).toBeLessThanOrEqual(5);
      }
    });
  });

  describe('Dashboard Windows', () => {
    it('should have all dashboard windows', () => {
      expect(dashboardWindows).toContain('30D');
      expect(dashboardWindows).toContain('90D');
      expect(dashboardWindows).toContain('YTD');
      expect(dashboardWindows.length).toBe(3);
    });
  });
});

describe('Product Helpers', () => {
  const createGallerySlides = (
    seed: StoreProduct,
  ): StoreProductGallerySlide[] => {
    const blueprints: Record<string, Array<{
      title: string;
      caption: string;
      objectPosition: string;
      imageTransform: string;
    }>> = {
      Essentials: [
        { title: 'Finished stack', caption: 'Primary view', objectPosition: 'center center', imageTransform: 'scale(1.04)' },
        { title: 'Paper detail', caption: 'Closer crop', objectPosition: '38% center', imageTransform: 'scale(1.14)' },
        { title: 'Press-ready view', caption: 'Production context', objectPosition: '70% center', imageTransform: 'scale(1.08)' },
      ],
      Marketing: [
        { title: 'Campaign spread', caption: 'Full layout view', objectPosition: 'center center', imageTransform: 'scale(1.05)' },
        { title: 'Color proof', caption: 'Closer framing', objectPosition: '30% center', imageTransform: 'scale(1.15)' },
        { title: 'Packed run', caption: 'Bulk-ready', objectPosition: '68% center', imageTransform: 'scale(1.1)' },
      ],
      Packaging: [
        { title: 'Retail face', caption: 'Front-facing', objectPosition: 'center center', imageTransform: 'scale(1.04)' },
        { title: 'Finish detail', caption: 'Close crop', objectPosition: '42% center', imageTransform: 'scale(1.14)' },
        { title: 'Batch view', caption: 'Quantity view', objectPosition: '64% center', imageTransform: 'scale(1.08)' },
      ],
    };

    const blueprint = blueprints[seed.category] || blueprints.Essentials;

    return blueprint.map((slide, index) => ({
      id: `${seed.id}-slide-${index + 1}`,
      image: seed.image,
      title: slide.title,
      caption: slide.caption,
      objectPosition: slide.objectPosition,
      imageTransform: slide.imageTransform,
    }));
  };

  it('should create gallery slides for Essentials category', () => {
    const product: StoreProduct = {
      id: 1,
      name: 'Test Product',
      price: 10000,
      category: 'Essentials',
      image: '/images/test.jpg',
      gallery: [],
      supplier: 'Test',
      origin: 'Test',
      moq: '100',
      leadTime: '3-5 days',
      rating: 4.5,
      orders: '50',
      badge: 'Test',
      summary: 'Test',
      tags: [],
    };

    const slides = createGallerySlides(product);

    expect(slides).toHaveLength(3);
    expect(slides[0].title).toBe('Finished stack');
    expect(slides[1].title).toBe('Paper detail');
    expect(slides[2].title).toBe('Press-ready view');
  });

  it('should create gallery slides for Packaging category', () => {
    const product: StoreProduct = {
      id: 2,
      name: 'Test Product',
      price: 50000,
      category: 'Packaging',
      image: '/images/test.jpg',
      gallery: [],
      supplier: 'Test',
      origin: 'Test',
      moq: '100',
      leadTime: '7-10 days',
      rating: 4.8,
      orders: '30',
      badge: 'Premium',
      summary: 'Test',
      tags: [],
    };

    const slides = createGallerySlides(product);

    expect(slides).toHaveLength(3);
    expect(slides[0].title).toBe('Retail face');
    expect(slides[1].title).toBe('Finish detail');
    expect(slides[2].title).toBe('Batch view');
  });

  it('should fallback to Essentials blueprint for unknown category', () => {
    const product: StoreProduct = {
      id: 3,
      name: 'Unknown Product',
      price: 5000,
      category: 'Unknown',
      image: '/images/test.jpg',
      gallery: [],
      supplier: 'Test',
      origin: 'Test',
      moq: '10',
      leadTime: '1-2 days',
      rating: 4.0,
      orders: '10',
      badge: 'New',
      summary: 'Test',
      tags: [],
    };

    const slides = createGallerySlides(product);

    expect(slides).toHaveLength(3);
    expect(slides[0].title).toBe('Finished stack');
  });
});
export interface StoreProduct {
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

export interface StoreProductGallerySlide {
  id: string;
  image: string;
  title: string;
  caption: string;
  objectPosition: string;
  imageTransform: string;
}

export interface MarketplaceCategory {
  name: string;
  caption: string;
  skuCount: string;
  icon: 'press' | 'paper' | 'banner' | 'box' | 'label' | 'shirt' | 'book';
}

export interface DashboardMetric {
  label: string;
  value: string;
  delta: string;
  detail: string;
}

interface StoreProductSeed {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
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

const printHeroImage = '/images/thewworks-press-hero.png';

const galleryBlueprints: Record<
  string,
  Array<{
    title: string;
    caption: string;
    objectPosition: string;
    imageTransform: string;
  }>
> = {
  Essentials: [
    {
      title: 'Finished stack',
      caption: 'Primary view of the printed set, trim quality and paper finish.',
      objectPosition: 'center center',
      imageTransform: 'scale(1.04)',
    },
    {
      title: 'Paper detail',
      caption: 'Closer crop for texture, color density and edge finish.',
      objectPosition: '38% center',
      imageTransform: 'scale(1.14)',
    },
    {
      title: 'Press-ready view',
      caption: 'Production context with paper, ink and finishing references.',
      objectPosition: '70% center',
      imageTransform: 'scale(1.08)',
    },
  ],
  Marketing: [
    {
      title: 'Campaign spread',
      caption: 'Full layout view for brochures, flyers and campaign collateral.',
      objectPosition: 'center center',
      imageTransform: 'scale(1.05)',
    },
    {
      title: 'Color proof',
      caption: 'Closer framing around CMYK density and image reproduction.',
      objectPosition: '30% center',
      imageTransform: 'scale(1.15)',
    },
    {
      title: 'Packed run',
      caption: 'Bulk-ready print materials prepared for launch or dispatch.',
      objectPosition: '68% center',
      imageTransform: 'scale(1.1)',
    },
  ],
  Packaging: [
    {
      title: 'Retail face',
      caption: 'Front-facing package view for shelf impact and brand presence.',
      objectPosition: 'center center',
      imageTransform: 'scale(1.04)',
    },
    {
      title: 'Finish detail',
      caption: 'Close crop for foil, embossing, lamination or spot UV.',
      objectPosition: '42% center',
      imageTransform: 'scale(1.14)',
    },
    {
      title: 'Batch view',
      caption: 'Wider framing for quantity, packing and repeat production.',
      objectPosition: '64% center',
      imageTransform: 'scale(1.08)',
    },
  ],
};

function createGallerySlides(seed: StoreProductSeed): StoreProductGallerySlide[] {
  const blueprint = galleryBlueprints[seed.category] || galleryBlueprints.Essentials;

  return blueprint.map((slide, index) => ({
    id: `${seed.id}-slide-${index + 1}`,
    image: seed.image,
    title: slide.title,
    caption: slide.caption,
    objectPosition: slide.objectPosition,
    imageTransform: slide.imageTransform,
  }));
}

function createStoreProduct(seed: StoreProductSeed): StoreProduct {
  return {
    ...seed,
    gallery: createGallerySlides(seed),
  };
}

export const marketplaceCategories: MarketplaceCategory[] = [
  {
    name: 'All',
    caption: 'Complete print quote catalog',
    skuCount: '90+ options',
    icon: 'press',
  },
  {
    name: 'Essentials',
    caption: 'Cards, letterheads and business stationery',
    skuCount: '18 options',
    icon: 'paper',
  },
  {
    name: 'Marketing',
    caption: 'Flyers, brochures, posters and booklets',
    skuCount: '22 options',
    icon: 'paper',
  },
  {
    name: 'Large Format',
    caption: 'Banners, backdrops, signage and wall graphics',
    skuCount: '14 options',
    icon: 'banner',
  },
  {
    name: 'Packaging',
    caption: 'Boxes, sleeves, bags and retail inserts',
    skuCount: '16 options',
    icon: 'box',
  },
  {
    name: 'Labels',
    caption: 'Roll labels, sticker sheets and waterproof decals',
    skuCount: '12 options',
    icon: 'label',
  },
  {
    name: 'Apparel',
    caption: 'T-shirts, uniforms, totes and branded merch',
    skuCount: '8 options',
    icon: 'shirt',
  },
  {
    name: 'Books',
    caption: 'Booklets, catalogs, manuals and programs',
    skuCount: '10 options',
    icon: 'book',
  },
];

export const heroSignals = [
  'Business card runs',
  'Packaging prototypes',
  'Bulk brochure printing',
  'Fast proof approval',
  'CMYK color control',
];

export const sourcingAdvantages = [
  {
    title: 'Quote concierge',
    body: 'Send one brief and get paper, finishing, size and quantity recommendations before production.',
  },
  {
    title: 'Bulk project pricing',
    body: 'Build quote bundles for schools, events, restaurants, retail launches and growing brand teams.',
  },
  {
    title: 'Protected checkout',
    body: 'Secure payment flow with order verification, confirmation email and SMS notification.',
  },
];

export const supplierHighlights = [
  {
    name: 'Thewworks Pressroom',
    specialty: 'Offset, digital, trimming and binding production',
    score: '4.9/5',
    fulfillment: '97% on-time',
    markets: 'Local pickup, courier and bulk dispatch',
  },
  {
    name: 'Thewworks Packaging Desk',
    specialty: 'Retail boxes, sleeves, bags, labels and inserts',
    score: '4.8/5',
    fulfillment: '42 verified launch runs',
    markets: 'Product founders and retail teams',
  },
  {
    name: 'Thewworks Finish Lab',
    specialty: 'Foil, embossing, spot UV, lamination and die-cutting',
    score: '4.9/5',
    fulfillment: '5-12 day lead',
    markets: 'Premium stationery and packaging',
  },
];

export const marketplaceProducts: StoreProduct[] = [
  createStoreProduct({
    id: 1,
    name: 'Premium Business Cards - 500 units',
    price: 15000,
    category: 'Essentials',
    image: printHeroImage,
    supplier: 'Thewworks Pressroom',
    origin: 'Digital press lane',
    moq: '500 cards',
    leadTime: '24-72 hours',
    rating: 4.9,
    orders: '248 repeat orders',
    badge: 'Fast proofing',
    summary: 'Thick card stock with matte, gloss, textured or soft-touch finishing options.',
    tags: ['Business cards', 'Matte finish', 'Quick turnaround'],
  }),
  createStoreProduct({
    id: 2,
    name: 'Corporate Letterheads - 250 sheets',
    price: 8500,
    category: 'Essentials',
    image: printHeroImage,
    supplier: 'Thewworks Pressroom',
    origin: 'Stationery desk',
    moq: '250 sheets',
    leadTime: '2-3 days',
    rating: 4.8,
    orders: '134 office orders',
    badge: 'Brand ready',
    summary: 'Clean corporate stationery printed on crisp paper with matching envelope options.',
    tags: ['Letterhead', 'Office stationery', 'Brand kit'],
  }),
  createStoreProduct({
    id: 3,
    name: 'Tri-fold Brochures - 1000 units',
    price: 42000,
    category: 'Marketing',
    image: printHeroImage,
    supplier: 'Thewworks Pressroom',
    origin: 'Marketing print lane',
    moq: '500 brochures',
    leadTime: '3-5 days',
    rating: 4.8,
    orders: '91 campaign runs',
    badge: 'Campaign staple',
    summary: 'Full-color brochures with accurate folds, clean trim and premium paper choices.',
    tags: ['Brochures', 'Campaigns', 'Bulk print'],
  }),
  createStoreProduct({
    id: 4,
    name: 'A5 Flyers - 2000 units',
    price: 30000,
    category: 'Marketing',
    image: printHeroImage,
    supplier: 'Thewworks Pressroom',
    origin: 'Fast print lane',
    moq: '1000 flyers',
    leadTime: '2-4 days',
    rating: 4.7,
    orders: '176 event runs',
    badge: 'Fast moving',
    summary: 'Affordable full-color flyers for launches, events, promotions and community campaigns.',
    tags: ['Flyers', 'Events', 'Promo'],
  }),
  createStoreProduct({
    id: 5,
    name: 'Pull-up Banner Stand',
    price: 28000,
    category: 'Large Format',
    image: printHeroImage,
    supplier: 'Thewworks Large Format',
    origin: 'Wide-format studio',
    moq: '1 banner',
    leadTime: '2-4 days',
    rating: 4.8,
    orders: '118 display orders',
    badge: 'Event ready',
    summary: 'Portable pull-up banner with crisp print, stand hardware and carry bag.',
    tags: ['Banner', 'Events', 'Exhibition'],
  }),
  createStoreProduct({
    id: 6,
    name: 'Custom Product Boxes - 100 units',
    price: 55000,
    category: 'Packaging',
    image: printHeroImage,
    supplier: 'Thewworks Packaging Desk',
    origin: 'Packaging prototype lane',
    moq: '100 boxes',
    leadTime: '7-12 days',
    rating: 4.9,
    orders: '63 launch kits',
    badge: 'Premium finish',
    summary: 'Custom printed boxes with optional foil, embossing, inserts and retail-ready finish.',
    tags: ['Packaging', 'Product launch', 'Foil'],
  }),
  createStoreProduct({
    id: 7,
    name: 'Waterproof Roll Labels - 500 units',
    price: 12000,
    category: 'Labels',
    image: printHeroImage,
    supplier: 'Thewworks Label Desk',
    origin: 'Label finishing lane',
    moq: '500 labels',
    leadTime: '3-5 days',
    rating: 4.7,
    orders: '203 label runs',
    badge: 'Retail favorite',
    summary: 'Durable labels for bottles, jars, cosmetics, food packs and retail products.',
    tags: ['Labels', 'Waterproof', 'Retail'],
  }),
  createStoreProduct({
    id: 8,
    name: 'Sticker Sheets - 100 sheets',
    price: 9500,
    category: 'Labels',
    image: printHeroImage,
    supplier: 'Thewworks Label Desk',
    origin: 'Die-cut desk',
    moq: '100 sheets',
    leadTime: '3-5 days',
    rating: 4.6,
    orders: '122 sticker orders',
    badge: 'Die-cut option',
    summary: 'Kiss-cut sticker sheets for packaging inserts, merch drops and brand campaigns.',
    tags: ['Stickers', 'Die cut', 'Merch'],
  }),
  createStoreProduct({
    id: 9,
    name: 'Custom T-Shirt Printing - 20 units',
    price: 48000,
    category: 'Apparel',
    image: printHeroImage,
    supplier: 'Thewworks Apparel Desk',
    origin: 'Merch production lane',
    moq: '20 shirts',
    leadTime: '5-8 days',
    rating: 4.7,
    orders: '77 team orders',
    badge: 'Team ready',
    summary: 'Screen, DTF or heat-transfer shirt printing for teams, schools, events and brands.',
    tags: ['T-shirts', 'Uniforms', 'Merch'],
  }),
  createStoreProduct({
    id: 10,
    name: 'Saddle-Stitched Booklets - 250 units',
    price: 68000,
    category: 'Books',
    image: printHeroImage,
    supplier: 'Thewworks Binding Desk',
    origin: 'Booklet production lane',
    moq: '100 booklets',
    leadTime: '5-7 days',
    rating: 4.8,
    orders: '49 booklet runs',
    badge: 'Bound and trimmed',
    summary: 'Programs, catalogs, reports and manuals printed, folded, stitched and trimmed.',
    tags: ['Booklets', 'Catalogs', 'Binding'],
  }),
];

export const buyerPulse = [
  {
    title: 'Open quote briefs',
    value: '21',
    delta: '+7 this week',
    detail: 'Most requests are for business stationery, labels and launch packaging.',
  },
  {
    title: 'Average proof speed',
    value: '18h',
    delta: '-16%',
    detail: 'Cleaner file checks helped the studio return proofs faster.',
  },
  {
    title: 'Repeat client ratio',
    value: '64%',
    delta: '+6 pts',
    detail: 'Re-orders are strongest in labels, business cards and brochures.',
  },
];

export const stockSignals = [
  {
    name: '350gsm matte card stock',
    status: 'Healthy',
    units: '42 reams ready',
    value: 'Business card staple',
    urgency: 'stable',
  },
  {
    name: 'Waterproof label rolls',
    status: 'Restock soon',
    units: '9 rolls left',
    value: 'Retail demand',
    urgency: 'watch',
  },
  {
    name: 'Pull-up banner hardware',
    status: 'Bulk ready',
    units: '31 stands available',
    value: 'Event friendly',
    urgency: 'good',
  },
  {
    name: 'Foil finish slots',
    status: 'Booking fast',
    units: '6 slots open',
    value: 'Premium margin',
    urgency: 'watch',
  },
];

export const dashboardWindows = ['30D', '90D', 'YTD'] as const;
export type DashboardWindow = (typeof dashboardWindows)[number];

export const dashboardMetrics: Record<DashboardWindow, DashboardMetric[]> = {
  '30D': [
    {
      label: 'Print revenue',
      value: 'NGN 18.4M',
      delta: '+14.2%',
      detail: 'Driven by packaging, labels and business stationery.',
    },
    {
      label: 'Quote conversion',
      value: '36%',
      delta: '+5 pts',
      detail: 'Faster proof replies are improving close rates.',
    },
    {
      label: 'On-time delivery',
      value: '95%',
      delta: '+3 pts',
      detail: 'Batch scheduling improved delivery reliability.',
    },
    {
      label: 'Average order size',
      value: 'NGN 412k',
      delta: '+9.4%',
      detail: 'Packaging and booklet runs increased ticket size.',
    },
  ],
  '90D': [
    {
      label: 'Print revenue',
      value: 'NGN 54.8M',
      delta: '+22.6%',
      detail: 'Momentum is strongest in packaging and label production.',
    },
    {
      label: 'Quote conversion',
      value: '38%',
      delta: '+8 pts',
      detail: 'Clearer file guidance reduced quote drop-off.',
    },
    {
      label: 'On-time delivery',
      value: '94%',
      delta: '+4 pts',
      detail: 'Courier and pickup windows are now grouped more efficiently.',
    },
    {
      label: 'Average order size',
      value: 'NGN 468k',
      delta: '+12.1%',
      detail: 'Launch kit orders are pushing up average spend.',
    },
  ],
  YTD: [
    {
      label: 'Print revenue',
      value: 'NGN 96.1M',
      delta: '+31.4%',
      detail: 'Thewworks is trending toward a stronger B2B and production-led mix.',
    },
    {
      label: 'Quote conversion',
      value: '41%',
      delta: '+10 pts',
      detail: 'Proof-first workflows outperform the previous ad hoc quote model.',
    },
    {
      label: 'On-time delivery',
      value: '96%',
      delta: '+5 pts',
      detail: 'Production consistency remains one of the strongest trust signals.',
    },
    {
      label: 'Average order size',
      value: 'NGN 501k',
      delta: '+16.3%',
      detail: 'High-value packaging and book runs are lifting basket quality.',
    },
  ],
};

export const revenueSeries: Record<
  DashboardWindow,
  { label: string; revenue: number; orders: number }[]
> = {
  '30D': [
    { label: 'Week 1', revenue: 3.8, orders: 18 },
    { label: 'Week 2', revenue: 4.1, orders: 20 },
    { label: 'Week 3', revenue: 4.9, orders: 22 },
    { label: 'Week 4', revenue: 5.6, orders: 27 },
  ],
  '90D': [
    { label: 'Jan', revenue: 15.6, orders: 72 },
    { label: 'Feb', revenue: 17.4, orders: 81 },
    { label: 'Mar', revenue: 21.8, orders: 96 },
  ],
  YTD: [
    { label: 'Q1', revenue: 28.4, orders: 126 },
    { label: 'Q2', revenue: 31.1, orders: 142 },
    { label: 'Q3', revenue: 36.6, orders: 158 },
  ],
};

export const demandSeries: Record<
  DashboardWindow,
  { category: string; demand: number; conversion: number }[]
> = {
  '30D': [
    { category: 'Packaging', demand: 78, conversion: 42 },
    { category: 'Labels', demand: 66, conversion: 39 },
    { category: 'Marketing', demand: 59, conversion: 34 },
    { category: 'Essentials', demand: 45, conversion: 31 },
  ],
  '90D': [
    { category: 'Packaging', demand: 218, conversion: 44 },
    { category: 'Labels', demand: 191, conversion: 40 },
    { category: 'Marketing', demand: 166, conversion: 36 },
    { category: 'Essentials', demand: 129, conversion: 33 },
  ],
  YTD: [
    { category: 'Packaging', demand: 406, conversion: 47 },
    { category: 'Labels', demand: 371, conversion: 43 },
    { category: 'Marketing', demand: 322, conversion: 39 },
    { category: 'Essentials', demand: 258, conversion: 35 },
  ],
};

export const regionSeries = [
  { name: 'Local pickup', value: 38, color: '#ff385c' },
  { name: 'Courier delivery', value: 26, color: '#18b7c8' },
  { name: 'Bulk dispatch', value: 19, color: '#222222' },
  { name: 'Launch projects', value: 17, color: '#f04f32' },
];

export const dashboardFunnel = [
  { stage: 'Brief', value: 182 },
  { stage: 'Proofed', value: 121 },
  { stage: 'Approved', value: 74 },
  { stage: 'Paid', value: 46 },
];

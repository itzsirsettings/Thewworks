export interface CatalogItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const catalogItems: CatalogItem[] = [
  {
    id: 1,
    name: 'Premium Business Cards - 500 units',
    price: 15000,
    image: '/images/printworks-press-hero.png',
  },
  {
    id: 2,
    name: 'Corporate Letterheads - 250 sheets',
    price: 8500,
    image: '/images/printworks-press-hero.png',
  },
  {
    id: 3,
    name: 'Tri-fold Brochures - 1000 units',
    price: 42000,
    image: '/images/printworks-press-hero.png',
  },
  {
    id: 4,
    name: 'A5 Flyers - 2000 units',
    price: 30000,
    image: '/images/printworks-press-hero.png',
  },
  {
    id: 5,
    name: 'Pull-up Banner Stand',
    price: 28000,
    image: '/images/printworks-press-hero.png',
  },
  {
    id: 6,
    name: 'Custom Product Boxes - 100 units',
    price: 55000,
    image: '/images/printworks-press-hero.png',
  },
  {
    id: 7,
    name: 'Waterproof Roll Labels - 500 units',
    price: 12000,
    image: '/images/printworks-press-hero.png',
  },
  {
    id: 8,
    name: 'Sticker Sheets - 100 sheets',
    price: 9500,
    image: '/images/printworks-press-hero.png',
  },
  {
    id: 9,
    name: 'Custom T-Shirt Printing - 20 units',
    price: 48000,
    image: '/images/printworks-press-hero.png',
  },
  {
    id: 10,
    name: 'Saddle-Stitched Booklets - 250 units',
    price: 68000,
    image: '/images/printworks-press-hero.png',
  },
];

export const catalogById = new Map<number, CatalogItem>(
  catalogItems.map((item) => [item.id, item]),
);

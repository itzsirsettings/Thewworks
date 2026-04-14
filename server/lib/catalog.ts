export interface CatalogItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

export const catalogItems: CatalogItem[] = [
  {
    "id": 1,
    "name": "Turkish Presidential Sofa Suite",
    "price": 450000,
    "image": "/images/product-1.jpg"
  },
  {
    "id": 2,
    "name": "Modern Platform Bed Frame",
    "price": 280000,
    "image": "/images/product-2.jpg"
  },
  {
    "id": 3,
    "name": "Executive Task Chair",
    "price": 85000,
    "image": "/images/product-3.jpg"
  },
  {
    "id": 4,
    "name": "Cloud L-Shape Lounge Sofa",
    "price": 380000,
    "image": "/images/product-4.jpg"
  },
  {
    "id": 5,
    "name": "Samsung Smart TV 55\"",
    "price": 320000,
    "image": "/images/product-5.jpg"
  },
  {
    "id": 6,
    "name": "Persian Heritage Rug",
    "price": 65000,
    "image": "/images/product-6.jpg"
  },
  {
    "id": 7,
    "name": "Glass Dining Collection",
    "price": 195000,
    "image": "/images/product-7.jpg"
  },
  {
    "id": 8,
    "name": "Hisense Inverter Refrigerator",
    "price": 245000,
    "image": "/images/product-8.jpg"
  },
  {
    "id": 101,
    "name": "Royal Velvet Hospitality Bed",
    "price": 580000,
    "image": "/images/bed-premium-1.jpg"
  },
  {
    "id": 102,
    "name": "Modern Leather Headboard Bed",
    "price": 420000,
    "image": "/images/bed-premium-2.jpg"
  },
  {
    "id": 201,
    "name": "Solid Mahogany Bed Base",
    "price": 185000,
    "image": "/images/bed-local-1.jpg"
  },
  {
    "id": 202,
    "name": "Rattan Accent Headboard Bed",
    "price": 145000,
    "image": "/images/bed-local-2.jpg"
  }
];

export const catalogById = new Map<number, CatalogItem>(
  catalogItems.map((item) => [item.id, item]),
);

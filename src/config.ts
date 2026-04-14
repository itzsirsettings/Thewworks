// ─── Site ────────────────────────────────────────────────────────────────────

export interface SiteConfig {
  title: string;
  description: string;
  language: string;
}

export const siteConfig: SiteConfig = {
  title: "Stankings Home Value | Quality Furniture & Home Appliances",
  description: "Your one-stop destination for quality, comfort and style. Turkish sofas, modern bed frames, contemporary furniture, electronics, home appliances, rugs, interior decoration, mirrors, and office furniture in Asaba, Delta State.",
  language: "en",
};

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface MenuLink {
  label: string;
  href: string;
}

export interface SocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface NavigationConfig {
  brandName: string;
  menuLinks: MenuLink[];
  socialLinks: SocialLink[];
  searchPlaceholder: string;
  cartEmptyText: string;
  cartCheckoutText: string;
  continueShoppingText: string;
  menuBackgroundImage: string;
}

export const navigationConfig: NavigationConfig = {
  brandName: "Stankings Home Value",
  menuLinks: [
    { label: "Home", href: "#hero" },
    { label: "Products", href: "#products" },
    { label: "Beds", href: "#beds" },
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { icon: "Instagram", label: "Instagram", href: "https://instagram.com" },
    { icon: "Facebook", label: "Facebook", href: "https://facebook.com" },
    { icon: "Twitter", label: "Twitter", href: "https://twitter.com" },
  ],
  searchPlaceholder: "Search furniture, appliances...",
  cartEmptyText: "Your cart is empty",
  cartCheckoutText: "Proceed to Checkout",
  continueShoppingText: "Continue Shopping",
  menuBackgroundImage: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/menu-bg.jpg",
};

// ─── Hero ────────────────────────────────────────────────────────────────────

export interface HeroConfig {
  tagline: string;
  title: string;
  ctaPrimaryText: string;
  ctaPrimaryTarget: string;
  ctaSecondaryText: string;
  ctaSecondaryTarget: string;
  backgroundImage: string;
}

export const heroConfig: HeroConfig = {
  tagline: "Quality, Comfort & Style",
  title: "Your Home,\nYour Style,\nOur Priority",
  ctaPrimaryText: "Shop Now",
  ctaPrimaryTarget: "#products",
  ctaSecondaryText: "Visit Our Store",
  ctaSecondaryTarget: "#contact",
  backgroundImage: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/hero-bg.jpg",
};

// ─── SubHero ─────────────────────────────────────────────────────────────────

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export interface SubHeroConfig {
  tag: string;
  heading: string;
  bodyParagraphs: string[];
  linkText: string;
  linkTarget: string;
  image1: string;
  image2: string;
  stats: Stat[];
}

export const subHeroConfig: SubHeroConfig = {
  tag: "About Us",
  heading: "Quality Furniture & Home Appliances in Asaba",
  bodyParagraphs: [
    "Stankings Home Value is your trusted destination for premium furniture and home appliances in Delta State. We bring you the finest Turkish sofas, modern bed frames, and contemporary furniture that combines quality, comfort, and style.",
    "From elegant living room sets to functional office furniture, electronics, home appliances, rugs, mirrors, and interior decoration items - we have everything you need to transform your space into a home.",
  ],
  linkText: "Learn more about us",
  linkTarget: "#about",
  image1: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/subhero-1.jpg",
  image2: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/subhero-2.jpg",
  stats: [
    { value: 10, suffix: "+", label: "Years Experience" },
    { value: 5000, suffix: "+", label: "Happy Customers" },
    { value: 100, suffix: "%", label: "Quality Guaranteed" },
  ],
};

// ─── Video Section ───────────────────────────────────────────────────────────

export interface VideoSectionConfig {
  tag: string;
  heading: string;
  bodyParagraphs: string[];
  ctaText: string;
  ctaTarget: string;
  backgroundImage: string;
}

export const videoSectionConfig: VideoSectionConfig = {
  tag: "Our Collection",
  heading: "Transform Your Space\nWith Premium Furniture",
  bodyParagraphs: [
    "Discover our extensive collection of Turkish sofas, modern bed frames, and contemporary furniture designed to elevate your living space.",
    "We also stock a wide range of electronics, home appliances, beautiful rugs, elegant mirrors, and professional office furniture to meet all your needs.",
  ],
  ctaText: "Explore Products",
  ctaTarget: "#products",
  backgroundImage: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/video-section-bg.jpg",
};

// ─── Products ────────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
}

export interface ProductsConfig {
  tag: string;
  heading: string;
  description: string;
  viewAllText: string;
  addToCartText: string;
  addedToCartText: string;
  categories: string[];
  products: Product[];
}

export const productsConfig: ProductsConfig = {
  tag: "Our Products",
  heading: "Premium Furniture & Appliances",
  description: "Browse our wide selection of quality furniture, home appliances, and interior decoration items. Everything you need for your home and office in one place.",
  viewAllText: "View All Products",
  addToCartText: "Add to Cart",
  addedToCartText: "Added!",
  categories: ["All", "Sofas", "Bed Frames", "Office Furniture", "Appliances", "Decor"],
  products: [
    { id: 1, name: "Turkish Royal Sofa Set", price: 450000, category: "Sofas", image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/product-1.jpg" },
    { id: 2, name: "Modern King Size Bed Frame", price: 280000, category: "Bed Frames", image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/product-2.jpg" },
    { id: 3, name: "Executive Office Chair", price: 85000, category: "Office Furniture", image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/product-3.jpg" },
    { id: 4, name: "Contemporary L-Shape Sofa", price: 380000, category: "Sofas", image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/product-4.jpg" },
    { id: 5, name: "Samsung Smart TV 55\"", price: 320000, category: "Appliances", image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/product-5.jpg" },
    { id: 6, name: "Persian Style Area Rug", price: 65000, category: "Decor", image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/product-6.jpg" },
    { id: 7, name: "Glass Top Dining Table Set", price: 195000, category: "Decor", image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/product-7.jpg" },
    { id: 8, name: "Hisense Refrigerator", price: 245000, category: "Appliances", image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/product-8.jpg" },
  ],
};

// ─── Features ────────────────────────────────────────────────────────────────

export interface Feature {
  icon: "Truck" | "ShieldCheck" | "Leaf" | "Heart";
  title: string;
  description: string;
}

export interface FeaturesConfig {
  features: Feature[];
}

export const featuresConfig: FeaturesConfig = {
  features: [
    {
      icon: "Truck",
      title: "Free Delivery",
      description: "Complimentary delivery within Asaba and surrounding areas. We ensure your furniture arrives safely.",
    },
    {
      icon: "ShieldCheck",
      title: "Quality Guarantee",
      description: "All our products come with a warranty. We stand behind the quality of every item we sell.",
    },
    {
      icon: "Leaf",
      title: "Best Prices",
      description: "Competitive pricing on all furniture and appliances. Get the best value for your money.",
    },
    {
      icon: "Heart",
      title: "Customer Service",
      description: "Our friendly team is always ready to help you find the perfect furniture for your home.",
    },
  ],
};

// ─── Blog ────────────────────────────────────────────────────────────────────

export interface BlogPost {
  id: number;
  title: string;
  date: string;
  image: string;
  excerpt: string;
}

export interface BlogConfig {
  tag: string;
  heading: string;
  viewAllText: string;
  readMoreText: string;
  posts: BlogPost[];
}

export const blogConfig: BlogConfig = {
  tag: "Tips & Ideas",
  heading: "Home Improvement Insights",
  viewAllText: "View All Articles",
  readMoreText: "Read More",
  posts: [
    {
      id: 1,
      title: "How to Choose the Perfect Sofa for Your Living Room",
      date: "March 15, 2024",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/blog-1.jpg",
      excerpt: "Tips on selecting the right size, style, and material for your living room sofa.",
    },
    {
      id: 2,
      title: "Creating a Modern Bedroom with the Right Bed Frame",
      date: "February 28, 2024",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/blog-2.jpg",
      excerpt: "Discover how the right bed frame can transform your bedroom into a luxurious retreat.",
    },
    {
      id: 3,
      title: "Office Furniture: Building a Productive Workspace",
      date: "February 10, 2024",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/blog-3.jpg",
      excerpt: "Essential furniture pieces for creating a comfortable and efficient office environment.",
    },
  ],
};

// ─── FAQ ─────────────────────────────────────────────────────────────────────

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

export interface FaqConfig {
  tag: string;
  heading: string;
  ctaText: string;
  ctaTarget: string;
  faqs: FaqItem[];
}

export const faqConfig: FaqConfig = {
  tag: "FAQ",
  heading: "Frequently Asked Questions",
  ctaText: "Still have questions? Contact us",
  ctaTarget: "#contact",
  faqs: [
    {
      id: 1,
      question: "Do you offer delivery services?",
      answer: "Yes! We offer free delivery within Asaba and surrounding areas in Delta State. For locations outside this area, delivery charges may apply.",
    },
    {
      id: 2,
      question: "What is your return policy?",
      answer: "We accept returns within 7 days for items in their original condition. Please bring your receipt for any returns or exchanges.",
    },
    {
      id: 3,
      question: "Do you offer installment payment?",
      answer: "Yes, we offer flexible payment plans for purchases above N200,000. Contact us for more details on our installment options.",
    },
    {
      id: 4,
      question: "How long does delivery take?",
      answer: "Delivery within Asaba is typically same-day or next-day. For other locations in Delta State, delivery takes 2-3 business days.",
    },
    {
      id: 5,
      question: "Do you assemble furniture?",
      answer: "Yes, our delivery team can assemble furniture for you at a small additional cost. Please request this service when placing your order.",
    },
  ],
};

// ─── About ───────────────────────────────────────────────────────────────────

export interface AboutSection {
  tag: string;
  heading: string;
  paragraphs: string[];
  quote: string;
  attribution: string;
  image: string;
  backgroundColor: string;
  textColor: string;
}

export interface AboutConfig {
  sections: AboutSection[];
}

export const aboutConfig: AboutConfig = {
  sections: [
    {
      tag: "Our Story",
      heading: "Your Trusted Furniture Partner in Asaba",
      paragraphs: [
        "Stankings Home Value has been serving the Asaba community and beyond for over 10 years. Located at 244 Nnebisi Road, opposite Wema Bank by Konwea Plaza, we have become the go-to destination for quality furniture and home appliances.",
        "We pride ourselves on offering a wide range of products including Turkish sofas, modern bed frames, contemporary furniture, electronics, home appliances, rugs, mirrors, and office furniture - all at competitive prices.",
      ],
      quote: "",
      attribution: "",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/about-1.jpg",
      backgroundColor: "#5a1a2a",
      textColor: "#ffffff",
    },
    {
      tag: "Our Promise",
      heading: "Quality, Comfort & Style",
      paragraphs: [],
      quote: "At Stankings Home Value, we believe everyone deserves a beautiful home. That's why we bring you the best furniture and appliances at prices you can afford.",
      attribution: "-- The Stankings Team",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/about-2.jpg",
      backgroundColor: "#f5f5f5",
      textColor: "#333333",
    },
  ],
};

// ─── Contact ─────────────────────────────────────────────────────────────────

export interface FormFields {
  nameLabel: string;
  namePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  messageLabel: string;
  messagePlaceholder: string;
}

export interface ContactConfig {
  heading: string;
  description: string;
  locationLabel: string;
  location: string;
  emailLabel: string;
  email: string;
  phoneLabel: string;
  phone: string;
  formFields: FormFields;
  submitText: string;
  submittingText: string;
  submittedText: string;
  successMessage: string;
  backgroundImage: string;
}

export const contactConfig: ContactConfig = {
  heading: "Visit Our Store",
  description: "Come visit us at our showroom in Asaba. Our friendly staff will help you find the perfect furniture and appliances for your home or office.",
  locationLabel: "Address",
  location: "244 Nnebisi Road, Opp. Wema Bank\nby Konwea Plaza, Asaba, Delta State",
  emailLabel: "Email",
  email: "stankingshomevalue@gmail.com",
  phoneLabel: "Phone",
  phone: "08037155869, 09066365653",
  formFields: {
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    messageLabel: "Message",
    messagePlaceholder: "How can we help you?",
  },
  submitText: "Send Message",
  submittingText: "Sending...",
  submittedText: "Sent",
  successMessage: "Thank you for reaching out. We'll get back to you shortly.",
  backgroundImage: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/contact-bg.jpg",
};

// ─── Beds ────────────────────────────────────────────────────────────────────

export interface BedProduct {
  id: number;
  name: string;
  price: number;
  category: "Local" | "Premium";
  image: string;
  description: string;
}

export interface BedsConfig {
  tag: string;
  heading: string;
  description: string;
  heroImage: string;
  categories: string[];
  products: BedProduct[];
  addToCartText: string;
  addedToCartText: string;
}

export const bedsConfig: BedsConfig = {
  tag: "Our Bed Collection",
  heading: "Quality Beds for Every Home",
  description: "Discover our extensive range of beds - from locally crafted wooden frames to premium luxury designs. Find the perfect bed for your comfort and style.",
  heroImage: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/assets/beds-hero.jpg",
  categories: ["All", "Local", "Premium"],
  products: [
    {
      id: 101,
      name: "Royal Velvet Bed",
      price: 580000,
      category: "Premium",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/bed-premium-1.jpg",
      description: "Luxurious king size bed with tufted velvet headboard and gold trim",
    },
    {
      id: 102,
      name: "Modern Platform Bed",
      price: 420000,
      category: "Premium",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/bed-premium-2.jpg",
      description: "Contemporary platform bed with leather headboard",
    },
    {
      id: 103,
      name: "Gold Canopy Bed",
      price: 850000,
      category: "Premium",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/bed-premium-3.jpg",
      description: "Ornate canopy bed with gold metal frame and royal drapery",
    },
    {
      id: 104,
      name: "Navy Tufted Bed",
      price: 495000,
      category: "Premium",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/bed-premium-4.jpg",
      description: "Elegant upholstered bed with diamond tufted headboard",
    },
    {
      id: 201,
      name: "Solid Mahogany Bed",
      price: 185000,
      category: "Local",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/bed-local-1.jpg",
      description: "Nigerian made solid wood bed frame, durable and elegant",
    },
    {
      id: 202,
      name: "Rattan Headboard Bed",
      price: 145000,
      category: "Local",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/bed-local-2.jpg",
      description: "Beautiful woven rattan headboard with natural materials",
    },
    {
      id: 203,
      name: "Classic Metal Bed",
      price: 95000,
      category: "Local",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/bed-local-3.jpg",
      description: "Durable wrought iron bed frame, simple and affordable",
    },
    {
      id: 204,
      name: "Carved Wooden Bed",
      price: 220000,
      category: "Local",
      image: "https://wwlzqndknqoizremunus.supabase.co/storage/v1/object/public/products/bed-local-4.jpg",
      description: "Traditional African woodwork with carved headboard details",
    },
  ],
  addToCartText: "Add to Cart",
  addedToCartText: "Added!",
};

// ─── Footer ──────────────────────────────────────────────────────────────────

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

export interface FooterSocialLink {
  icon: string;
  label: string;
  href: string;
}

export interface FooterConfig {
  brandName: string;
  brandDescription: string;
  newsletterHeading: string;
  newsletterDescription: string;
  newsletterPlaceholder: string;
  newsletterButtonText: string;
  newsletterSuccessText: string;
  linkGroups: FooterLinkGroup[];
  legalLinks: FooterLink[];
  copyrightText: string;
  socialLinks: FooterSocialLink[];
}

export const footerConfig: FooterConfig = {
  brandName: "Stankings Home Value",
  brandDescription: "Your one-stop destination for quality furniture, home appliances, and interior decoration in Asaba, Delta State.",
  newsletterHeading: "Stay Updated",
  newsletterDescription: "Subscribe to receive updates on new arrivals, special offers, and promotions.",
  newsletterPlaceholder: "Enter your email",
  newsletterButtonText: "Subscribe",
  newsletterSuccessText: "Thank you for subscribing!",
  linkGroups: [
    {
      title: "Products",
      links: [
        { label: "Turkish Sofas", href: "#products" },
        { label: "Bed Frames", href: "#products" },
        { label: "Office Furniture", href: "#products" },
        { label: "Appliances", href: "#products" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Our Store", href: "#contact" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQ", href: "#faq" },
        { label: "Delivery", href: "#faq" },
        { label: "Returns", href: "#faq" },
      ],
    },
  ],
  legalLinks: [
    { label: "Privacy Policy", href: `mailto:${contactConfig.email}?subject=Privacy%20Policy%20Request` },
    { label: "Terms of Service", href: `mailto:${contactConfig.email}?subject=Terms%20of%20Service%20Request` },
  ],
  copyrightText: `© ${new Date().getFullYear()} Stankings Home Value. All rights reserved.`,
  socialLinks: [
    { icon: "Instagram", label: "Instagram", href: "https://instagram.com" },
    { icon: "Facebook", label: "Facebook", href: "https://facebook.com" },
    { icon: "Twitter", label: "Twitter", href: "https://twitter.com" },
  ],
};

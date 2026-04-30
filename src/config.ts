// ─── Site ────────────────────────────────────────────────────────────────────

export interface SiteConfig {
  title: string;
  description: string;
  language: string;
}

export const siteConfig: SiteConfig = {
  title: "Thewworks | Thewworks ICT & Prints in Asaba, Delta State",
  description: "Thewworks, also known as Thewworks ICT & Prints, offers business cards, brochures, packaging, labels, banners, books, apparel printing, and branded design services in Asaba, Delta State, Nigeria.",
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
  brandFullName?: string;
  menuLinks: MenuLink[];
  socialLinks: SocialLink[];
  searchPlaceholder: string;
  cartEmptyText: string;
  cartCheckoutText: string;
  continueShoppingText: string;
  menuBackgroundImage: string;
}

export const navigationConfig: NavigationConfig = {
  brandName: "Thewworks",
  brandFullName: "Thewworks",
  menuLinks: [
    { label: "Who We Are", href: "#about" },
    { label: "What We Do", href: "#products" },
    { label: "Packaging", href: "#beds" },
    { label: "Latest Updates", href: "#blog" },
    { label: "Contact", href: "#contact" },
  ],
  socialLinks: [
    { icon: "Instagram", label: "Instagram", href: "https://instagram.com" },
    { icon: "Facebook", label: "Facebook", href: "https://facebook.com" },
    { icon: "Twitter", label: "Twitter", href: "https://twitter.com" },
  ],
  searchPlaceholder: "Search services...",
  cartEmptyText: "Your cart is empty",
  cartCheckoutText: "Proceed to Checkout",
  continueShoppingText: "Continue Shopping",
  menuBackgroundImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
};

// ─── Hero ────────────────────────────────────────────────────────────────────

export interface HeroConfig {
  tagline: string;
  title: string;
  rotatingTitles?: string[];
  tagLineSecondary?: string;
  ctaPrimaryText: string;
  ctaPrimaryTarget: string;
  ctaSecondaryText: string;
  ctaSecondaryTarget: string;
  backgroundImage: string;
}

export const heroConfig: HeroConfig = {
  tagline: "Premium Printing & Design",
  title: "Creative Excellence\nin Every Print",
  rotatingTitles: [
    "Making Every Print Count",
    "From Concept to Quality Print",
    "Sharp Designs. Clean Prints.",
    "Your Trusted Print Partner",
    "Creating Impressions That Last",
    "Every Detail, Perfectly Printed",
    "Prints Made with Excellence",
    "High-Quality Printing, Delivered Right",
    "Transforming Ideas into Beautiful Prints",
    "Print Smart. Brand Better.",
    "Reliable Prints for Growing Brands",
    "Excellence on Every Page",
    "Crafted Prints, Powerful Results",
    "Your Message, Professionally Printed",
  ],
  tagLineSecondary: "Your Trusted Printing Partner",
  ctaPrimaryText: "Explore Services",
  ctaPrimaryTarget: "#services",
  ctaSecondaryText: "Get a Quote",
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
  tag: "Who We Are",
  heading: "Your Trusted Printing Partner",
  bodyParagraphs: [
    "Thewworks has been a leader in premium printing and design services for over 15 years. We specialize in creating stunning visual communications for businesses, events, and creative projects.",
    "From digital design to final print, we handle every detail with precision and care. Our experienced team combines cutting-edge technology with artistic expertise to bring your ideas to life.",
  ],
  linkText: "Learn more about us",
  linkTarget: "#about",
  image1: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80",
  image2: "https://images.unsplash.com/photo-1542298089-abc8b8c77650?w=600&q=80",
  stats: [
    { value: 15, suffix: "+", label: "Years Experience" },
    { value: 2500, suffix: "+", label: "Projects Completed" },
    { value: 99, suffix: "%", label: "Client Satisfaction" },
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
  tag: "Our Services",
  heading: "Full-Spectrum Printing\nSolutions for Your Brand",
  bodyParagraphs: [
    "From concept to completion, we offer comprehensive printing services that bring your brand to life. Our state-of-the-art equipment and skilled craftsmen ensure every project meets the highest standards.",
    "We specialize in marketing materials, packaging design, digital printing, large format printing, and custom merchandise. Let us help you make a lasting impression.",
  ],
  ctaText: "Explore Services",
  ctaTarget: "#products",
  backgroundImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
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
  tag: "What We Do",
  heading: "Printing & Design Services",
  description: "Comprehensive printing solutions for businesses and creative projects. From business cards to large-format printing, we deliver quality.",
  viewAllText: "View All Services",
  addToCartText: "Request Quote",
  addedToCartText: "Added!",
  categories: ["All", "Business", "Marketing", "Packaging"],
  products: [
    { id: 1, name: "Business Cards (500 units)", price: 15000, category: "Business", image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=500&q=80" },
    { id: 2, name: "Letterheads (250 sheets)", price: 8500, category: "Business", image: "https://images.unsplash.com/photo-1608085026456-02f50f55e141?w=500&q=80" },
    { id: 3, name: "Brochures (Tri-fold 1000 units)", price: 42000, category: "Marketing", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&q=80" },
    { id: 4, name: "Posters (A2 size, 25 units)", price: 18000, category: "Large Format", image: "https://images.unsplash.com/photo-1578392670900-d6f1eae3fccb?w=500&q=80" },
    { id: 5, name: "Custom T-Shirt Printing (10 units)", price: 35000, category: "Merchandise", image: "https://images.unsplash.com/photo-1605777927121-8bc2e65f718e?w=500&q=80" },
    { id: 6, name: "Vinyl Labels (Roll of 500)", price: 12000, category: "Packaging", image: "https://images.unsplash.com/photo-1599923353285-e33018f92f98?w=500&q=80" },
    { id: 7, name: "Custom Packaging Boxes (100 units)", price: 55000, category: "Packaging", image: "https://images.unsplash.com/photo-1578762694712-10c49d9d5c3e?w=500&q=80" },
    { id: 8, name: "Banners (3x1m vinyl)", price: 22000, category: "Large Format", image: "https://images.unsplash.com/photo-1608086657464-eef74c0cc34e?w=500&q=80" },
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
      title: "Fast Turnaround",
      description: "Quick printing and delivery. Most orders completed within 3-5 business days without compromising quality.",
    },
    {
      icon: "ShieldCheck",
      title: "Premium Quality",
      description: "State-of-the-art equipment and expert craftsmen ensure every print meets the highest standards.",
    },
    {
      icon: "Leaf",
      title: "Eco-Friendly Inks",
      description: "We use environmentally responsible printing materials and sustainable practices.",
    },
    {
      icon: "Heart",
      title: "Custom Design",
      description: "Our creative team works with you to design and execute your vision perfectly.",
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
  tag: "Latest at Thewworks",
  heading: "News & Insights",
  viewAllText: "View All Articles",
  readMoreText: "read article",
  posts: [
    {
      id: 1,
      title: "Choosing the Right Paper Stock for Your Brand",
      date: "March 15, 2024",
      image: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=600&q=80",
      excerpt: "Learn how to select the perfect paper type, weight, and finish to elevate your printed materials and brand perception.",
    },
    {
      id: 2,
      title: "Design Tips for High-Impact Marketing Materials",
      date: "February 28, 2024",
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80",
      excerpt: "Discover essential design principles that make your brochures, flyers, and banners stand out from the competition.",
    },
    {
      id: 3,
      title: "Color Management: Getting Print-Ready Files Right",
      date: "February 10, 2024",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80",
      excerpt: "Understanding RGB vs CMYK, color profiles, and how to prepare your designs for perfect color reproduction.",
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
      question: "What file formats do you accept for printing?",
      answer: "We accept PDF, AI, PSD, TIFF, and high-resolution JPG files. PDF is our preferred format for best results. Minimum resolution should be 300 DPI for quality prints.",
    },
    {
      id: 2,
      question: "How long does printing take?",
      answer: "Most orders are completed within 3-5 business days. Rush orders are available for an additional fee. Delivery times vary based on your location.",
    },
    {
      id: 3,
      question: "Do you offer design services?",
      answer: "Yes! Our experienced design team can create custom designs from scratch or modify your existing artwork. Design consultation is available upon request.",
    },
    {
      id: 4,
      question: "What is your refund policy?",
      answer: "We stand behind the quality of our work. If you're not satisfied with your prints, we'll reprint them at no cost or provide a full refund.",
    },
    {
      id: 5,
      question: "Can you handle bulk orders?",
      answer: "Absolutely! We specialize in bulk printing projects. Contact us for volume discounts and bulk pricing on large orders.",
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
      heading: "Your Trusted Printing Partner",
      paragraphs: [
        "Thewworks has been serving businesses and creative professionals for over 15 years. Located in the heart of the city, we've established ourselves as a premier destination for high-quality printing and design services.",
        "From small businesses to large enterprises, we've helped our clients make a lasting impression through innovative printing solutions. We combine state-of-the-art technology with artistic excellence to deliver outstanding results.",
      ],
      quote: "",
      attribution: "",
      image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
      backgroundColor: "#5a1a2a",
      textColor: "#ffffff",
    },
    {
      tag: "Our Promise",
      heading: "Quality Meets Creativity",
      paragraphs: [],
      quote: "At Thewworks, we believe that great design and impeccable printing can transform your brand. That's why we're committed to delivering exceptional quality on every project, no matter how big or small.",
      attribution: "-- The Thewworks Team",
      image: "https://images.unsplash.com/photo-1542298089-abc8b8c77650?w=800&q=80",
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
  heading: "Get in Touch",
  description: "Contact Thewworks for printing quotes, design consultations, or to learn more about our services. We'd love to hear about your project.",
  locationLabel: "Address",
  location: "No. 5, Okelue Street, Opposite Wema Bank, by Nnebisi Road, Asaba, Delta State, Nigeria",
  emailLabel: "Email",
  email: "info@thewworks.com",
  phoneLabel: "Phone",
  phone: "08123986155, 07065577800",
  formFields: {
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "your@email.com",
    messageLabel: "Message",
    messagePlaceholder: "Tell us about your printing project...",
  },
  submitText: "Send Message",
  submittingText: "Sending...",
  submittedText: "Sent",
  successMessage: "Thank you for reaching out. We'll get back to you shortly with a quote.",
  backgroundImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&q=80",
};

// ─── Beds ────────────────────────────────────────────────────────────────────

export interface BedProduct {
  id: number;
  name: string;
  price: number;
  category: "Luxury" | "Standard";
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
  tag: "Packaging Solutions",
  heading: "Custom Packaging & Labels",
  description: "Discover our complete range of custom packaging solutions. From elegant product boxes to branded labels and tags, we create packaging that protects your products and elevates your brand.",
  heroImage: "https://images.unsplash.com/photo-1578762694712-10c49d9d5c3e?w=1200&q=80",
  categories: ["All", "Luxury", "Standard"],
  products: [
    {
      id: 101,
      name: "Premium Custom Boxes",
      price: 85000,
      category: "Luxury",
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80",
      description: "Luxurious custom printed boxes with foil stamping and premium finishes",
    },
    {
      id: 102,
      name: "Branded Tissue Paper",
      price: 12000,
      category: "Luxury",
      image: "https://images.unsplash.com/photo-1599923353285-e33018f92f98?w=500&q=80",
      description: "Custom printed tissue paper for premium product packaging",
    },
    {
      id: 103,
      name: "Holographic Label Sheets",
      price: 28000,
      category: "Luxury",
      image: "https://images.unsplash.com/photo-1562349619-3d35d84fb0a8?w=500&q=80",
      description: "Eye-catching holographic labels that make your products stand out",
    },
    {
      id: 104,
      name: "Custom Gift Boxes",
      price: 65000,
      category: "Luxury",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=500&q=80",
      description: "Elegant gift boxes with custom inserts and ribbon ties",
    },
    {
      id: 201,
      name: "Standard Shipping Boxes",
      price: 28000,
      category: "Standard",
      image: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500&q=80",
      description: "Durable corrugated boxes for shipping and storage",
    },
    {
      id: 202,
      name: "Product Labels (Roll)",
      price: 8500,
      category: "Standard",
      image: "https://images.unsplash.com/photo-1599923353285-e33018f92f98?w=500&q=80",
      description: "Custom printed product labels on rolls for easy application",
    },
    {
      id: 203,
      name: "Kraft Paper Bags",
      price: 15000,
      category: "Standard",
      image: "https://images.unsplash.com/photo-1595869192324-40ed7fc00fe5?w=500&q=80",
      description: "Eco-friendly kraft bags with custom branding",
    },
    {
      id: 204,
      name: "Sticker Sheets",
      price: 6500,
      category: "Standard",
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&q=80",
      description: "Durable custom printed vinyl stickers for any purpose",
    },
  ],
  addToCartText: "Request Quote",
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
  brandTagline?: string;
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
  brandName: "Thewworks",
  brandTagline: "Creative Excellence in Every Print",
  brandDescription: "Thewworks ICT & Prints, often searched as Thewworks, is a printing and branding business in Asaba, Delta State. From business essentials to custom packaging, we deliver premium quality and creative solutions.",
  newsletterHeading: "Stay Updated",
  newsletterDescription: "Subscribe to receive updates on new printing services, design trends, and special offers.",
  newsletterPlaceholder: "Enter your email",
  newsletterButtonText: "Subscribe",
  newsletterSuccessText: "Thank you for subscribing!",
  linkGroups: [
    {
      title: "What We Do",
      links: [
        { label: "Business Printing", href: "#products" },
        { label: "Marketing Materials", href: "#products" },
        { label: "Large Format", href: "#products" },
        { label: "Packaging Solutions", href: "#beds" },
      ],
    },
    {
      title: "Who We Are",
      links: [
        { label: "About Us", href: "#about" },
        { label: "Our Studio", href: "#contact" },
        { label: "Contact", href: "#contact" },
        { label: "Careers", href: "#contact" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "FAQ", href: "#faq" },
        { label: "File Guidelines", href: "#faq" },
        { label: "Turnaround Times", href: "#faq" },
        { label: "Track Order", href: "#contact" },
      ],
    },
  ],
  legalLinks: [
    { label: "Admin Entrance", href: "/admin" },
    { label: "Privacy Policy", href: `mailto:${contactConfig.email}?subject=Privacy%20Policy%20Request` },
    { label: "Terms of Service", href: `mailto:${contactConfig.email}?subject=Terms%20of%20Service%20Request` },
    { label: "Cookie Settings", href: "#cookies" },
  ],
  copyrightText: `© ${new Date().getFullYear()} Thewworks. All rights reserved.`,
  socialLinks: [
    { icon: "Instagram", label: "Instagram", href: "https://instagram.com" },
    { icon: "Facebook", label: "Facebook", href: "https://facebook.com" },
    { icon: "Twitter", label: "Twitter", href: "https://twitter.com" },
  ],
};

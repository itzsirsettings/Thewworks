# Shibumi Template

A premium artisan handcrafted home goods e-commerce template with elegant animations, parallax effects, and a full shopping cart system. Features 11 configurable sections driven entirely by a single `config.ts` file.

## Features

- Full-screen parallax hero with fade-in animations and dual CTA buttons
- SubHero section with dual parallax images, clip-path reveals, 3D tilt effects, and animated stat counters
- Split-screen video/content section with staggered text reveals
- Product grid with category filtering, hover zoom, and add-to-cart with confirmation feedback
- Features section with icon-mapped cards in a 4-column grid
- Blog journal with full-bleed image cards, dark overlays, and hover reveal animations
- Accordion FAQ with animated plus/cross toggle
- Multi-panel About section with full-width parallax images and alternating layouts
- Contact section with background image, contact info, and form with submission states
- Footer with link groups, social icons, and newsletter subscription
- Slide-out shopping cart sidebar with quantity controls
- Full-screen navigation menu with search, links, social icons, and background image
- Each section has a null check and renders nothing when config is empty

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS 3
- Lucide React (icons)

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

The checkout flow now uses a small Node API alongside the Vite frontend:

- `npm run dev` starts both the API server and the Vite client.
- `npm run build` builds the frontend and compiles the backend into `server-dist/`.
- `npm run start` serves the API and the built frontend from the same Node process.

## Payment And Notifications

The storefront now supports:

- Secure Paystack checkout initialization from the backend
- Paystack payment verification on return and via webhook using a per-order `HttpOnly` receipt token
- Postgres-backed order persistence when `DATABASE_URL` is set, with SQLite fallback for local/dev and encrypted customer fields at rest
- Automatic confirmation email delivery through Resend
- Automatic SMS delivery through Twilio
- Redis-backed rate limiting with local fallback for development
- Optional Cloudflare Turnstile checkout CAPTCHA
- Optional outbound security alert webhooks for high-signal events
- Hardened security headers on checkout routes

Create a `.env` file with the values from `.env.example` before testing real payments.

### Required Environment Variables

```bash
SERVER_PORT=3002
PUBLIC_SITE_URL=http://localhost:5173
PAYSTACK_SECRET_KEY=sk_test_your_paystack_secret_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/stankings
DATABASE_SSL_MODE=disable
DATABASE_POOL_MAX=10
ORDER_DATABASE_PATH=server/data/orders.sqlite
ORDER_STORE_ENCRYPTION_KEY=replace_with_a_long_random_secret
ORDER_TOKEN_SECRET=replace_with_another_long_random_secret
```

If `DATABASE_URL` is present, the app uses Postgres automatically. If it is absent, the app falls back to the local SQLite store at `ORDER_DATABASE_PATH`.
For `npm run dev`, point `PUBLIC_SITE_URL` to the Vite origin, usually `http://localhost:5173`. For `npm run start`, set it to the deployed site origin or to `http://localhost:3002` when the Node server is serving the built frontend directly.
The checkout callback is generated server-side from `PUBLIC_SITE_URL` and always returns to `/store`.
The secure payment confirmation now expects the customer to complete checkout in the same browser session that started it.

### Admin Google Auth

Admin access is restricted by Google sign-in plus an email allowlist.

Add the allowed admin emails to your `.env`:

```bash
VITE_ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com
```

Important:

- In Google Cloud, the OAuth consent screen must be `External` if you want to sign in with regular Gmail accounts.
- If you want only two people to access the admin dashboard, keep the OAuth app in `Testing` mode and add exactly those two emails as `Test users`.
- In Supabase Auth, enable the Google provider and use the matching Google OAuth client credentials.
- Make sure the redirect URL includes your site origin and returns to `/admin`.

### Optional Abuse-Defense Variables

```bash
VITE_TURNSTILE_SITE_KEY=1x00000000000000000000AA
TURNSTILE_SECRET_KEY=1x0000000000000000000000000000000AA
REDIS_URL=redis://localhost:6379/0
```

If Turnstile is configured, checkout requires a challenge token before payment can start. If `REDIS_URL` is configured, rate limiting uses Redis; otherwise it falls back to in-process memory for local development.

### Optional Security Alert Variables

```bash
SECURITY_ALERT_WEBHOOK_URL=https://example.com/security-alerts
SECURITY_ALERT_BEARER_TOKEN=replace_with_a_shared_secret
SECURITY_ALERT_MIN_SEVERITY=warning
SECURITY_ALERT_COOLDOWN_MS=300000
```

If a security alert webhook is configured, high-signal blocked or failed security events are POSTed outward as structured JSON so you can feed Slack, SIEM, incident tooling, or an internal webhook worker.

### Optional Email Variables

```bash
RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=orders@yourdomain.com
```

### Optional SMS Variables

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890
```

### Optional Store Branding Variables

```bash
STORE_NAME=Stankings Home Value
STORE_SUPPORT_EMAIL=stankingshomevalue@gmail.com
STORE_SUPPORT_PHONE=+2348037155869
```

### Paystack Webhook

Configure your Paystack webhook URL to point to:

```bash
https://your-domain.com/api/payments/paystack/webhook
```

For local testing, expose the API server with a tunnel and use that public URL in the Paystack dashboard.

## Configuration

All content is in `src/config.ts`. Each section has a typed config object with empty placeholder values.

### siteConfig

```ts
{
  title: "",          // Browser tab title
  description: "",    // Meta description
  language: "",       // HTML lang attribute (e.g. "en", "zh", "ja")
}
```

### navigationConfig

```ts
{
  brandName: "",              // Brand name shown in nav bar and cart header
  menuLinks: [],              // Array of { label: string, href: string }
  socialLinks: [],            // Array of { icon: "Instagram"|"Facebook"|"Twitter", label: string, href: string }
  searchPlaceholder: "",      // Placeholder text for search input
  cartEmptyText: "",          // Text shown when cart is empty
  cartCheckoutText: "",       // Checkout button text
  continueShoppingText: "",   // Continue shopping button text
  menuBackgroundImage: "",    // Image path for the menu background panel
}
```

### heroConfig

```ts
{
  tagline: "",            // Small uppercase text above the title
  title: "",              // Main heading (use \n for line breaks)
  ctaPrimaryText: "",     // Primary CTA button text
  ctaPrimaryTarget: "",   // Primary CTA scroll target (e.g. "#products")
  ctaSecondaryText: "",   // Secondary CTA button text
  ctaSecondaryTarget: "", // Secondary CTA scroll target (e.g. "#about")
  backgroundImage: "",    // Path to hero background image
}
```

### subHeroConfig

```ts
{
  tag: "",              // Small uppercase label (e.g. "Our Philosophy")
  heading: "",          // Section heading
  bodyParagraphs: [],   // Array of paragraph strings
  linkText: "",         // Link text below paragraphs
  linkTarget: "",       // Link scroll target (e.g. "#about")
  image1: "",           // Main image path (top-right, larger)
  image2: "",           // Secondary image path (bottom-left, smaller)
  stats: [],            // Array of { value: number, suffix: string, label: string }
                        // suffix examples: "+", "%", "" (empty for plain number)
}
```

### videoSectionConfig

```ts
{
  tag: "",              // Small uppercase label
  heading: "",          // Section heading
  bodyParagraphs: [],   // Array of paragraph strings
  ctaText: "",          // CTA button text
  ctaTarget: "",        // CTA scroll target
  backgroundImage: "",  // Left-side background image path
}
```

### productsConfig

```ts
{
  tag: "",              // Small uppercase label (e.g. "Our Collection")
  heading: "",          // Section heading
  description: "",      // Description paragraph
  viewAllText: "",      // View all button text
  addToCartText: "",    // Add to cart button text
  addedToCartText: "",  // Confirmation text after adding
  categories: [],       // Array of category strings (first is "All" equivalent)
  products: [],         // Array of { id: number, name: string, price: number, category: string, image: string }
}
```

### featuresConfig

```ts
{
  features: [],   // Array of { icon: "Truck"|"ShieldCheck"|"Leaf"|"Heart", title: string, description: string }
}
```

### blogConfig

```ts
{
  tag: "",            // Small uppercase label (e.g. "Journal")
  heading: "",        // Section heading
  viewAllText: "",    // View all link text
  readMoreText: "",   // Read more text on each card
  posts: [],          // Array of { id: number, title: string, date: string, image: string, excerpt: string }
}
```

### faqConfig

```ts
{
  tag: "",          // Small uppercase label (e.g. "Support")
  heading: "",      // Section heading
  ctaText: "",      // CTA link text below FAQs
  ctaTarget: "",    // CTA scroll target (e.g. "#contact")
  faqs: [],         // Array of { id: number, question: string, answer: string }
}
```

### aboutConfig

```ts
{
  sections: [],   // Array of about section objects:
                  // {
                  //   tag: string,             // Small uppercase label
                  //   heading: string,          // Section heading
                  //   paragraphs: string[],     // Array of paragraph strings (used when no quote)
                  //   quote: string,            // Quote text (if present, paragraphs are ignored)
                  //   attribution: string,      // Quote attribution (e.g. "-- Name, Title")
                  //   image: string,            // Background image path
                  //   backgroundColor: string,  // CSS color for content area (e.g. "#423d3f")
                  //   textColor: string,         // CSS color for text (e.g. "#ffffff")
                  // }
                  // Sections alternate layout: odd indices are reversed
}
```

### contactConfig

```ts
{
  heading: "",            // Large heading text
  description: "",        // Description paragraph
  locationLabel: "",      // Label for location
  location: "",           // Location text
  emailLabel: "",         // Label for email
  email: "",              // Email address
  phoneLabel: "",         // Label for phone
  phone: "",              // Phone number
  formFields: {
    nameLabel: "",        // Name field label
    namePlaceholder: "",  // Name field placeholder
    emailLabel: "",       // Email field label
    emailPlaceholder: "", // Email field placeholder
    messageLabel: "",     // Message field label
    messagePlaceholder: "", // Message field placeholder
  },
  submitText: "",         // Submit button text
  submittingText: "",     // Text while submitting
  submittedText: "",      // Text after submission
  successMessage: "",     // Success message below form
  backgroundImage: "",    // Background image path
}
```

### footerConfig

```ts
{
  brandName: "",              // Brand name in footer
  brandDescription: "",       // Short brand description
  newsletterHeading: "",      // Newsletter section heading
  newsletterDescription: "",  // Newsletter description text
  newsletterPlaceholder: "",  // Email input placeholder
  newsletterButtonText: "",   // Subscribe button text
  newsletterSuccessText: "",  // Success message after subscribing
  linkGroups: [],             // Array of { title: string, links: { label: string, href: string }[] }
  legalLinks: [],             // Array of { label: string, href: string }
  copyrightText: "",          // Copyright text
  socialLinks: [],            // Array of { icon: "Instagram"|"Facebook"|"Twitter", label: string, href: string }
}
```

## Required Images

Place in `public/images/` directory:

- **Hero**: 1 background image (landscape, full-screen)
- **SubHero**: 2 images (1 large top-right, 1 smaller bottom-left)
- **Video Section**: 1 background image (left panel)
- **Products**: 1 image per product (portrait or square)
- **Blog**: 1 image per blog post (portrait, used as full-bleed card background)
- **About**: 1 image per about section (landscape, used as parallax background)
- **Contact**: 1 background image (landscape, full-screen)
- **Navigation**: 1 background image for the menu panel (optional)

## Design

- **Theme**: Clean white with warm brown (#8b6d4b) accent color
- **Typography**: DM Serif Display (headings), Libre Franklin (body text)
- **Animations**: CSS transitions with intersection observer triggers, parallax scrolling, clip-path reveals, count-up numbers
- **Layout**: Full-width sections with max-width containers, alternating backgrounds
- **Colors**: Primary brown (#8b6d4b), dark gray (#696969), light backgrounds (#fafafa, #f7f7f7)

## Notes

- Edit ONLY `src/config.ts` to change content
- All animations are preserved unchanged
- Images go in `public/images/`
- Sections return null when config is empty
- Feature icons use `icon` field mapped to Lucide components: `Truck`, `ShieldCheck`, `Leaf`, `Heart`
- Footer and navigation social icons use `icon` field mapped to: `Instagram`, `Facebook`, `Twitter`
- Hero title supports multi-line via `\n` in the string
- About sections alternate layout automatically (odd indices are reversed)
- Shopping cart functionality is built into App.tsx

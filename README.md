# Thewworks - Print Services Marketplace

A full-stack e-commerce application for print services marketplace with React frontend and Express backend.

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Radix UI, Zustand
- **Backend**: Express.js, TypeScript, Supabase (Database, Auth, Storage)
- **Payments**: Paystack
- **Testing**: Vitest, Playwright
- **Database**: PostgreSQL via Supabase

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase account (for database & auth)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase (Required)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Optional legacy direct Postgres access
# Leave unset unless you are intentionally using the legacy postgres-store tooling.
DATABASE_URL=postgresql://user:pass@host:5432/database
DATABASE_SSL_MODE=require

# Paystack (Required for payments)
PAYSTACK_SECRET_KEY=sk_live_xxx
PAYSTACK_PUBLIC_KEY=pk_live_xxx

# Server
SERVER_PORT=3001
PUBLIC_SITE_URL=https://thewworksict.com
CORS_ALLOWED_ORIGINS=https://thewworksict.com

# Admin (Optional)
ADMIN_EMAILS=admin@example.com,another@example.com
VITE_ADMIN_EMAILS=admin@example.com,another@example.com

# Security
CSRF_SECRET=replace-with-openssl-rand-hex-32
ORDER_TOKEN_SECRET=replace-with-openssl-rand-base64-32
ORDER_STORE_ENCRYPTION_KEY=replace-with-openssl-rand-base64-32
```

Generate fresh production secrets with:

```bash
npm run security:keys
```

### Development

```bash
# Start both frontend and backend
npm run dev

# Start only frontend
npm run dev:client

# Start only backend
npm run dev:server
```

- Frontend: http://localhost:3001
- Backend API: http://localhost:3001/api

### Build

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Project Structure

```
src/
├── components/          # React components
│   ├── admin/          # Admin dashboard components
│   ├── store/         # Marketplace components
│   └── ui/            # Reusable UI components (Radix)
├── hooks/             # Custom React hooks
├── lib/               # Core business logic
│   ├── store.ts       # Cart state (Zustand)
│   ├── checkout.ts   # Checkout utilities
│   ├── supabase.ts   # Supabase client
│   └── ...
├── sections/          # Page sections
├── test/              # Test utilities
└── App.tsx           # Main app component

server/
├── index.ts          # Express server
├── lib/              # Server utilities
└── test/             # API integration tests

e2e/                  # E2E tests (Playwright)
```

## Features

### Customer Features
- Browse print services catalog
- Search and filter products
- Add to cart
- Secure checkout with Paystack
- Order verification via payment reference
- Email/SMS notifications

### Admin Features
- Protected admin dashboard
- Analytics with metrics
- Product management (CRUD)
- Order tracking
- Inventory management

## Testing

```bash
# Run all unit tests
npm run test

# Run unit tests once
npm run test:run

# Run unit tests with coverage
npm run test:coverage

# Run API integration tests
npm run test:api

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## API Endpoints

### Health
- `GET /api/health` - Health check

### Checkout
- `GET /api/security/csrf-token` - Issue signed CSRF token for browser mutations
- `POST /api/checkout/initialize` - Initialize checkout
- `GET /api/checkout/verify/:reference` - Verify payment

### Admin
- `GET /api/admin/me` - Get current admin
- `GET /api/admin/stats` - Get dashboard stats
- `GET /api/admin/products` - List products
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

### Webhooks
- `POST /api/payments/paystack/webhook` - Paystack webhook

## Database Schema

### Tables
- `categories` - Product categories
- `products` - Product catalog
- `product_galleries` - Product image galleries
- `product_tags` - Product tags
- `suppliers` - Supplier information
- `orders` - Customer orders
- `order_items` - Order line items

## Deployment

### Build for Production

```bash
npm run lint
npm run test:run
npm run security:audit
npm run security:env:check:production
npm run security:supabase:check
npm run build
npm run start
```

### Environment Setup

1. Set up Supabase project
2. Run all database migrations in timestamp order
3. Configure production environment variables, including `NODE_ENV=production`, `PUBLIC_SITE_URL`, `CSRF_SECRET`, `ORDER_TOKEN_SECRET`, `ORDER_STORE_ENCRYPTION_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`
4. Configure Paystack webhook URL as `https://thewworksict.com/api/payments/paystack/webhook`; Paystack signs webhook payloads with the live secret key in `PAYSTACK_SECRET_KEY`
5. Deploy to hosting provider (Vercel, Railway, etc.)

See `docs/deployment.md` for detailed deployment instructions.

## Google Discovery

For branded discovery on Google Search and Google Maps, keep these live after deployment:

1. Verify `https://thewworksict.com/` in Google Search Console and submit `https://thewworksict.com/sitemap.xml`
2. Maintain a Google Business Profile for `Thewworks ICT & Prints` with the same address and phone number used on the website
3. Keep the brand naming consistent across the site and listings:
   - `Thewworks`
   - `Thewworks ICT & Prints`
4. Keep the location details consistent everywhere:
   - `No. 5, Okelue Street, Opposite Wema Bank, by Nnebisi Road, Asaba, Delta State, Nigeria`
   - `08123986155`

## License

MIT

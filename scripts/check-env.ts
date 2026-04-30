import 'dotenv/config';
import { lookup } from 'node:dns/promises';
import { z } from 'zod';
import pino from 'pino';

if (process.argv.includes('--production')) {
  process.env.NODE_ENV = 'production';
}

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

const envSchema = z.object({
  // Server
  SERVER_PORT: z.string().transform(Number).default('3001'),
  PUBLIC_SITE_URL: z.string().url(),
  CORS_ALLOWED_ORIGINS: z.string().optional(),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Databases
  DATABASE_URL: z.string().url().optional(),
  DATABASE_SSL_MODE: z.enum(['disable', 'require', 'verify-full']).default('disable'),
  REDIS_URL: z.string().url().optional(),
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Payment
  PAYSTACK_SECRET_KEY: z.string().min(1).refine(val => !val.includes('your_'), {
    message: 'PAYSTACK_SECRET_KEY must be a real key, not a placeholder'
  }),

  // Security
  ORDER_STORE_ENCRYPTION_KEY: z.string().min(32),
  ORDER_TOKEN_SECRET: z.string().min(32),
  CSRF_SECRET: z.string().min(32),
  ADMIN_EMAILS: z.string().min(1),

  // Captcha
  VITE_TURNSTILE_SITE_KEY: z.string().optional(),
  TURNSTILE_SECRET_KEY: z.string().optional(),

  // Services
  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional(),
});

function parseOrigin(value: string) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function isLocalhost(hostname: string) {
  return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1';
}

function isPlaceholder(value: string) {
  return value.toLowerCase().includes('your_') || value.toLowerCase().includes('placeholder');
}

async function canResolveHostname(hostname: string) {
  try {
    await lookup(hostname);
    return true;
  } catch {
    return false;
  }
}

async function checkEnv() {
  logger.info('Validating environment configuration...');

  const isProduction = process.env.NODE_ENV === 'production';
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    logger.error('Environment validation failed:');
    result.error.issues.forEach(issue => {
      logger.error(`   - ${issue.path.join('.')}: ${issue.message}`);
    });
    process.exit(1);
  }

  const config = result.data;
  const productionErrors: string[] = [];
  const productionWarnings: string[] = [];

  // Additional Production-only checks
  if (isProduction) {
    const databaseUrl = config.DATABASE_URL ? parseOrigin(config.DATABASE_URL) : null;

    if (config.DATABASE_URL) {
      if (config.DATABASE_SSL_MODE === 'disable') {
        productionWarnings.push('DATABASE_SSL_MODE should be require or verify-full when DATABASE_URL is configured for legacy direct Postgres access.');
      }

      if (databaseUrl && isLocalhost(databaseUrl.hostname)) {
        productionWarnings.push('DATABASE_URL points to localhost. That is fine only if you are intentionally running legacy direct Postgres access locally.');
      }

      if (databaseUrl && !isLocalhost(databaseUrl.hostname)) {
        const databaseHostResolves = await canResolveHostname(databaseUrl.hostname);

        if (!databaseHostResolves) {
          productionWarnings.push(`DATABASE_URL host does not resolve: ${databaseUrl.hostname}. This does not block the current Supabase-backed app, but it will break legacy direct Postgres tooling.`);
        }
      }
    }

    const publicSiteUrl = parseOrigin(config.PUBLIC_SITE_URL);

    if (!publicSiteUrl) {
      productionErrors.push('PUBLIC_SITE_URL must be a valid URL.');
    } else if (publicSiteUrl.protocol !== 'https:') {
      productionErrors.push('PUBLIC_SITE_URL must use HTTPS in production.');
    }

    if (publicSiteUrl && isLocalhost(publicSiteUrl.hostname)) {
      productionErrors.push('PUBLIC_SITE_URL must not point to localhost in production.');
    }

    const corsOrigins = (config.CORS_ALLOWED_ORIGINS || '')
      .split(',')
      .map(origin => origin.trim())
      .filter(Boolean);

    if (corsOrigins.length === 0) {
      productionErrors.push('CORS_ALLOWED_ORIGINS must include the production origin.');
    }

    if (!corsOrigins.includes(config.PUBLIC_SITE_URL)) {
      productionErrors.push('CORS_ALLOWED_ORIGINS must include PUBLIC_SITE_URL.');
    }

    for (const origin of corsOrigins) {
      const parsedOrigin = parseOrigin(origin);

      if (!parsedOrigin) {
        productionErrors.push(`CORS origin ${origin} must be a valid URL.`);
        continue;
      }

      if (parsedOrigin.protocol !== 'https:') {
        productionErrors.push(`CORS origin ${origin} must use HTTPS in production.`);
      }

      if (isLocalhost(parsedOrigin.hostname)) {
        productionErrors.push(`CORS origin ${origin} must not point to localhost in production.`);
      }
    }

    const secrets = [
      'ORDER_STORE_ENCRYPTION_KEY',
      'ORDER_TOKEN_SECRET',
      'CSRF_SECRET'
    ];

    secrets.forEach(key => {
      const val = process.env[key] || '';
      if (isPlaceholder(val) || val.length < 44) {
        productionErrors.push(`${key} must be a real high-entropy secret of at least 44 characters.`);
      }
    });

    if (!config.PAYSTACK_SECRET_KEY.startsWith('sk_live_')) {
      productionErrors.push('PAYSTACK_SECRET_KEY must be a live Paystack secret key in production.');
    }

    if (isPlaceholder(config.VITE_SUPABASE_ANON_KEY)) {
      productionErrors.push('VITE_SUPABASE_ANON_KEY must not be a placeholder.');
    }

    if (isPlaceholder(config.SUPABASE_SERVICE_ROLE_KEY)) {
      productionErrors.push('SUPABASE_SERVICE_ROLE_KEY must not be a placeholder.');
    }
  }

  if (productionErrors.length > 0) {
    logger.error('Production environment validation failed:');
    productionErrors.forEach(issue => {
      logger.error(`   - ${issue}`);
    });
    process.exit(1);
  }

  productionWarnings.forEach((issue) => {
    logger.warn(issue);
  });

  // Captcha consistency check
  if ((config.VITE_TURNSTILE_SITE_KEY && !config.TURNSTILE_SECRET_KEY) || 
      (!config.VITE_TURNSTILE_SITE_KEY && config.TURNSTILE_SECRET_KEY)) {
    logger.error('Inconsistent Captcha config: Both VITE_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY must be set.');
    process.exit(1);
  }

  logger.info('Environment configuration is valid.');
}

await checkEnv();

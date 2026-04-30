import 'dotenv/config';

import { randomBytes, randomInt } from 'node:crypto';
import express from 'express';
import cookieParser from 'cookie-parser';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { sendOrderNotifications } from './lib/notifications.js';
import {
  getApexRedirectUrl,
  injectRouteSeo,
  shouldNoIndexRequest,
} from './lib/seo.js';
import { getAdminDashboardStats } from './lib/stats.js';
import { supabaseAdmin } from './lib/supabase-admin.js';
import {
  CaptchaValidationError,
  verifyCheckoutCaptcha,
} from './lib/captcha.js';
import {
  createDemoPaystackTransaction,
  initializePaystackTransaction,
  isPaystackDemoMode,
  isValidPaystackSignature,
  verifyPaystackTransaction,
} from './lib/paystack.js';
import {
  applySecurityHeaders,
  clearReceiptTokenCookie,
  corsMiddleware,
  createRateLimiter,
  createReceiptToken,
  csrfProtectionMiddleware,
  generateCsrfToken,
  getCheckoutReturnUrl,
  getClientIp,
  getReceiptTokenFromRequest,
  hashReceiptToken,
  logSecurityEvent,
  receiptTokenMatches,
  setReceiptTokenCookie,
} from './lib/security.js';
import {
  claimPaidOrder,
  createOrder,
  findOrderByReference,
  updateNotificationStatus,
  getProductsByIds,
} from './lib/store.js';
import type { OrderItemRecord, OrderRecord, PaystackTransactionData } from './lib/types.js';

const approvedAdminEmails = new Set(
  (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

interface AuthenticatedAdmin {
  user: User;
  email: string;
  role: string;
}

function hasAdminAccess(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }

  const role = user.app_metadata?.role;
  const email = user.email?.trim().toLowerCase() || '';

  return role === 'admin' || approvedAdminEmails.has(email);
}
interface RequestWithRawBody extends express.Request {
  rawBody?: Buffer;
}

class CheckoutValidationError extends Error {}
class AdminValidationError extends Error {}

const customerSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is required.').max(120),
    email: z.string().trim().email('Enter a valid email address.').max(254),
    phone: z.string().trim().min(7, 'Phone number is required.').max(24),
    address: z.string().trim().min(5, 'Delivery address is required.').max(240),
    city: z.string().trim().min(2, 'City is required.').max(80),
    state: z.string().trim().min(2, 'State is required.').max(80),
    notes: z.string().trim().max(500).optional().default(''),
  })
  .strict();

const checkoutRequestSchema = z
  .object({
    customer: customerSchema,
    items: z
      .array(
        z
          .object({
            id: z.number().int().positive(),
            quantity: z.number().int().min(1).max(20),
          })
          .strict(),
      )
      .min(1, 'Your cart is empty.')
      .max(20, 'Too many items were submitted.'),
    captchaToken: z.string().trim().max(4096).optional(),
  })
  .strict();

const safeImageUrlSchema = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => value.startsWith('/') || /^https:\/\/[^\s]+$/i.test(value),
    'Image URL must be a local path or HTTPS URL.',
  );

const optionalImageUrlSchema = z.preprocess(
  (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
  safeImageUrlSchema.optional(),
);

const optionalTextField = (maxLength: number) =>
  z.string().trim().max(maxLength).optional();

const requiredTextField = (name: string, maxLength: number) =>
  z.string().trim().min(1, `${name} is required.`).max(maxLength);

const productUpdateSchema = z
  .object({
    imageBase64: z.string().max(5 * 1024 * 1024).optional(),
    image: optionalImageUrlSchema,
    name: requiredTextField('Name', 140).optional(),
    price: z.number().finite().positive().max(100_000_000).optional(),
    category: requiredTextField('Category', 80).optional(),
    supplier: requiredTextField('Supplier', 120).optional(),
    origin: optionalTextField(120),
    moq: optionalTextField(80),
    lead_time: optionalTextField(80),
    rating: z.number().finite().min(0).max(5).optional(),
    orders: optionalTextField(80),
    badge: optionalTextField(80),
    summary: optionalTextField(500),
  })
  .strict();

const productCreateSchema = productUpdateSchema
  .extend({
    name: requiredTextField('Name', 140),
    price: z.number().finite().positive().max(100_000_000),
    category: requiredTextField('Category', 80),
    supplier: requiredTextField('Supplier', 120),
  })
  .strict();

export const app = express();
const serverPort = Number(process.env.SERVER_PORT || 3001);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..');
const distDirectory = path.resolve(projectRoot, 'dist');

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use((request, response, next) => {
  const redirectUrl = getApexRedirectUrl(request.header('host'), request.originalUrl);

  if (redirectUrl) {
    response.redirect(301, redirectUrl);
    return;
  }

  next();
});

app.use((request, response, next) => {
  if (shouldNoIndexRequest(request.originalUrl)) {
    response.setHeader('X-Robots-Tag', 'noindex, nofollow');
  }

  next();
});

function createOrderReference() {
  return `STK-${Date.now()}-${randomBytes(10).toString('hex').toUpperCase()}`;
}

function createProductId() {
  return Date.now() * 1000 + randomInt(0, 1000);
}

function isValidOrderReference(reference: string) {
  return /^STK-[A-Za-z0-9-]{8,80}$/.test(reference);
}

function normalizePhoneNumber(phoneNumber: string) {
  const compactPhoneNumber = phoneNumber.replace(/[^\d+]/g, '');

  if (compactPhoneNumber.startsWith('+')) {
    return compactPhoneNumber;
  }

  if (compactPhoneNumber.startsWith('234')) {
    return `+${compactPhoneNumber}`;
  }

  if (compactPhoneNumber.startsWith('0') && compactPhoneNumber.length === 11) {
    return `+234${compactPhoneNumber.slice(1)}`;
  }

  return compactPhoneNumber;
}

function serializeOrder(order: OrderRecord) {
  return {
    reference: order.reference,
    status: order.status,
    amount: order.amount,
    currency: order.currency,
    paidAt: order.paidAt,
    paymentChannel: order.paymentChannel,
    deliveryMessage: order.deliveryMessage,
    customer: order.customer,
    items: order.items,
    notifications: order.notificationStatus,
  };
}

function getSingleRouteParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

async function buildOrderItems(
  rawItems: Array<{ id: number; quantity: number }>,
): Promise<OrderItemRecord[]> {
  const quantitiesById = new Map<number, number>();
  let totalQuantity = 0;

  for (const item of rawItems) {
    totalQuantity += item.quantity;

    if (totalQuantity > 50) {
      throw new CheckoutValidationError('Order quantity is too large.');
    }

    quantitiesById.set(item.id, (quantitiesById.get(item.id) || 0) + item.quantity);
  }

  const ids = Array.from(quantitiesById.keys());
  const catalogList = await getProductsByIds(ids);
  const catalogMap = new Map((catalogList || []).map(p => [p.id, p]));

  return [...quantitiesById.entries()].map(([id, quantity]) => {
    const catalogItem = catalogMap.get(id);

    if (!catalogItem) {
      throw new CheckoutValidationError('One or more cart items are invalid.');
    }

    return {
      id: catalogItem.id,
      name: catalogItem.name,
      price: catalogItem.price,
      quantity,
      image: catalogItem.image,
    };
  });
}

async function finalizeSuccessfulPayment(
  reference: string,
  payment: PaystackTransactionData,
) {
  const claimedOrder = await claimPaidOrder(reference, payment);

  if (!claimedOrder.order) {
    throw new Error(`No order found for reference ${reference}.`);
  }

  let finalOrder = claimedOrder.order;

  if (claimedOrder.claimed.email || claimedOrder.claimed.sms) {
    const notificationStatuses = await sendOrderNotifications(
      claimedOrder.order,
      claimedOrder.claimed,
    );

    const updatedOrder = await updateNotificationStatus(reference, notificationStatuses);

    if (updatedOrder) {
      finalOrder = updatedOrder;
    }
  }

  return finalOrder;
}

app.use(corsMiddleware);
app.use(cookieParser());
app.use(applySecurityHeaders);
app.use(csrfProtectionMiddleware);

const MAX_BODY_SIZE = process.env.MAX_BODY_SIZE || '5mb';

app.use(
  express.json({
    limit: MAX_BODY_SIZE,
    verify: (request, _response, buffer) => {
      (request as RequestWithRawBody).rawBody = Buffer.from(buffer);
    },
  }),
);

const initializeRateLimiter = createRateLimiter({
  name: 'checkout_initialize',
  max: 10,
  windowMs: 10 * 60 * 1000,
});

const verifyRateLimiter = createRateLimiter({
  name: 'checkout_verify',
  max: 30,
  windowMs: 10 * 60 * 1000,
  keyResolver: (request) => `${getClientIp(request)}:${request.params.reference || 'unknown'}`,
});

const adminRateLimiter = createRateLimiter({
  name: 'admin_api',
  max: 100,
  windowMs: 15 * 60 * 1000,
  keyResolver: (request) => `admin_api:${getClientIp(request)}`,
});

app.use('/api/admin', adminRateLimiter, (_request, response, next) => {
  response.setHeader('Cache-Control', 'no-store, max-age=0');
  response.setHeader('Pragma', 'no-cache');
  next();
});

app.get('/api/admin/me', async (request: express.Request, response: express.Response) => {
  const admin = await requireAdminToken(request, response);

  if (!admin) {
    return;
  }

  response.json({
    user: {
      id: admin.user.id,
      email: admin.email,
      role: admin.role,
    },
  });
});

app.get(
  '/api/admin/stats',
  async (request: express.Request, response: express.Response) => {
    if (!await requireAdminToken(request, response)) return;

    try {
      const stats = await getAdminDashboardStats();
      response.json(stats);
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
      response.status(500).json({ message: 'Failed to fetch dashboard statistics.' });
    }
  },
);

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/api/security/csrf-token', (request, response) => {
  const token = generateCsrfToken();
  response.cookie('XSRF-TOKEN', token, {
    httpOnly: false, // Must be accessible by client JS to send back in header
    secure: request.secure || request.header('x-forwarded-proto') === 'https',
    sameSite: 'lax',
    path: '/',
  });
  response.json({ token });
});

// ─── Admin Product Management ───────────────────────────────────────────

function getAdminRole(user: User) {
  const role = user.app_metadata?.role;
  return typeof role === 'string' && role.trim() ? role.trim() : 'admin';
}

async function requireAdminToken(
  request: express.Request,
  response: express.Response,
): Promise<AuthenticatedAdmin | null> {
  const authHeader = request.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  
  if (!token) {
    response.status(401).json({ message: 'Unauthorized admin session.' });
    return null;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  const user = data?.user;
  
  if (error || !user) {
    response.status(401).json({ message: 'Invalid or expired admin session.' });
    return null;
  }

  if (!hasAdminAccess(user)) {
    response.status(403).json({ message: 'Admin privileges are required.' });
    return null;
  }

  return {
    user,
    email: user.email?.trim().toLowerCase() || '',
    role: getAdminRole(user),
  };
}

const MAX_PRODUCT_IMAGE_BYTES = 2 * 1024 * 1024;
const PRODUCT_IMAGE_CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

function hasJpegSignature(buffer: Buffer) {
  return buffer.length > 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

function hasPngSignature(buffer: Buffer) {
  return (
    buffer.length > 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  );
}

function hasWebpSignature(buffer: Buffer) {
  return (
    buffer.length > 12 &&
    buffer.toString('ascii', 0, 4) === 'RIFF' &&
    buffer.toString('ascii', 8, 12) === 'WEBP'
  );
}

function validateProductImageBuffer(buffer: Buffer, extension: string) {
  if (buffer.length === 0) {
    throw new AdminValidationError('Uploaded image is empty.');
  }

  if (buffer.length > MAX_PRODUCT_IMAGE_BYTES) {
    throw new AdminValidationError('Image must be 2MB or smaller.');
  }

  const isExpectedType =
    (extension === 'jpg' && hasJpegSignature(buffer)) ||
    (extension === 'png' && hasPngSignature(buffer)) ||
    (extension === 'webp' && hasWebpSignature(buffer));

  if (!isExpectedType) {
    throw new AdminValidationError('Image content does not match the declared file type.');
  }
}

async function processImageUpload(base64Data: unknown): Promise<string | undefined> {
  if (typeof base64Data !== 'string' || !base64Data.startsWith('data:image/')) return undefined;
  
  const matches = base64Data.match(/^data:image\/(png|jpe?g|webp);base64,([A-Za-z0-9+/]+={0,2})$/i);
  if (!matches) {
    throw new AdminValidationError('Only PNG, JPEG, and WebP images are allowed.');
  }
  
  const extension = matches[1].toLowerCase().replace('jpeg', 'jpg');
  const buffer = Buffer.from(matches[2], 'base64');
  validateProductImageBuffer(buffer, extension);
  
  const filename = `product-${Date.now()}-${randomBytes(2).toString('hex')}.${extension}`;
  
  const { error } = await supabaseAdmin.storage
    .from('products')
    .upload(filename, buffer, {
      contentType: PRODUCT_IMAGE_CONTENT_TYPES[extension],
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Supabase Storage Error:', error.message);
    return undefined;
  }

  const { data: urlData } = supabaseAdmin.storage
    .from('products')
    .getPublicUrl(filename);

  return urlData.publicUrl;
}

app.get(
  '/api/admin/products',
  async (request: express.Request, response: express.Response) => {
    if (!await requireAdminToken(request, response)) return;

    try {
      const { data, error } = await supabaseAdmin
        .from('products')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      response.json(data || []);
    } catch (error) {
      console.error('Failed to fetch admin products:', error);
      response.status(500).json({ message: 'Failed to fetch products.' });
    }
  },
);

app.put(
  '/api/admin/products/:id',
  async (request: express.Request, response: express.Response) => {
    if (!await requireAdminToken(request, response)) return;

    const productId = Number(request.params.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      response.status(400).json({ message: 'Invalid product ID.' });
      return;
    }

    try {
      const body = productUpdateSchema.parse(request.body);
      const updates: Record<string, unknown> = {};
      const newImageUrl = await processImageUpload(body.imageBase64);
      if (newImageUrl) {
        updates.image = newImageUrl;
      } else if (body.image) {
        updates.image = body.image;
      }

      if (body.name !== undefined) updates.name = body.name;
      if (body.price !== undefined) updates.price = body.price;
      if (body.category !== undefined) updates.category = body.category;
      if (body.supplier !== undefined) updates.supplier = body.supplier;
      if (body.origin !== undefined) updates.origin = body.origin;
      if (body.moq !== undefined) updates.moq = body.moq;
      if (body.lead_time !== undefined) updates.lead_time = body.lead_time;
      if (body.rating !== undefined) updates.rating = body.rating;
      if (body.orders !== undefined) updates.orders = body.orders;
      if (body.badge !== undefined) updates.badge = body.badge;
      if (body.summary !== undefined) updates.summary = body.summary;

      if (Object.keys(updates).length === 0) {
        response.status(400).json({ message: 'No valid fields to update.' });
        return;
      }
      const { data, error } = await supabaseAdmin
        .from('products')
        .update(updates)
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      response.json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        response.status(400).json({
          message: error.issues[0]?.message || 'Product update is invalid.',
        });
        return;
      }

      if (error instanceof AdminValidationError) {
        response.status(400).json({ message: error.message });
        return;
      }

      console.error(`Failed to update product ${productId}:`, error);
      response.status(500).json({ message: 'Failed to update product.' });
    }
  },
);

app.post(
  '/api/admin/products',
  async (request: express.Request, response: express.Response) => {
    if (!await requireAdminToken(request, response)) return;

    try {
      const body = productCreateSchema.parse(request.body);
      const newImageUrl = await processImageUpload(body.imageBase64);
      let finalImage = newImageUrl || body.image || '';
      if (!finalImage) finalImage = '/images/product-1.jpg'; // fallback

      const { data, error } = await supabaseAdmin
        .from('products')
        .insert({
          id: createProductId(),
          name: body.name,
          price: body.price,
          image: finalImage,
          category: body.category,
          supplier: body.supplier,
          origin: body.origin || 'Local stock',
          moq: body.moq || '1 unit',
          lead_time: body.lead_time || '3-5 days',
          rating: body.rating ?? 4.5,
          orders: body.orders || '0 orders',
          badge: body.badge || 'New',
          summary: body.summary || '',
        })
        .select()
        .single();

      if (error) throw error;
      response.status(201).json(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        response.status(400).json({
          message: error.issues[0]?.message || 'Product details are invalid.',
        });
        return;
      }

      if (error instanceof AdminValidationError) {
        response.status(400).json({ message: error.message });
        return;
      }

      console.error('Failed to create product:', error);
      response.status(500).json({ message: 'Failed to create product.' });
    }
  },
);

app.delete(
  '/api/admin/products/:id',
  async (request: express.Request, response: express.Response) => {
    if (!await requireAdminToken(request, response)) return;

    const productId = Number(request.params.id);
    if (!Number.isInteger(productId) || productId <= 0) {
      response.status(400).json({ message: 'Invalid product ID.' });
      return;
    }

    try {
      const { error } = await supabaseAdmin
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;
      response.status(204).send();
    } catch (error) {
      console.error(`Failed to delete product ${productId}:`, error);
      response.status(500).json({ message: 'Failed to delete product.' });
    }
  },
);

app.post('/api/checkout/initialize', initializeRateLimiter, async (request, response) => {
  try {
    const parsedRequest = checkoutRequestSchema.parse(request.body);
    await verifyCheckoutCaptcha(parsedRequest.captchaToken, getClientIp(request));
    const orderItems = await buildOrderItems(parsedRequest.items);
    const amount = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const reference = createOrderReference();
    const receiptToken = createReceiptToken();
    const amountInKobo = Math.round(amount * 100);
    const customer = {
      ...parsedRequest.customer,
      phone: normalizePhoneNumber(parsedRequest.customer.phone),
      notes: parsedRequest.customer.notes || '',
    };

    const initializedTransaction = await initializePaystackTransaction({
      amountInKobo,
      email: customer.email,
      reference,
      callbackUrl: getCheckoutReturnUrl(),
      metadata: {
        reference,
        amount,
        currency: 'NGN',
        items: orderItems.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      },
    });

    const now = new Date().toISOString();
    const order: OrderRecord = {
      reference: initializedTransaction.reference,
      receiptTokenHash: hashReceiptToken(receiptToken),
      amount,
      amountInKobo,
      currency: 'NGN',
      status: 'pending',
      customer,
      items: orderItems,
      createdAt: now,
      updatedAt: now,
      deliveryMessage:
        'Your payment has been processed. Your goods will be delivered to you now that your payment has been confirmed.',
      notificationStatus: {
        email: 'pending',
        sms: 'pending',
      },
    };

    await createOrder(order);
    setReceiptTokenCookie(request, response, order.reference, receiptToken);

    logSecurityEvent({
      event: 'checkout_initialized',
      ip: getClientIp(request),
      method: request.method,
      path: request.path,
      reference: order.reference,
      outcome: 'succeeded',
      statusCode: 201,
    });

    response.status(201).json({
      authorizationUrl: initializedTransaction.authorization_url,
      reference: initializedTransaction.reference,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      response.status(400).json({
        message: error.issues[0]?.message || 'The checkout details are invalid.',
      });
      return;
    }

    if (error instanceof CheckoutValidationError) {
      response.status(400).json({ message: error.message });
      return;
    }

    if (error instanceof CaptchaValidationError) {
      response.status(400).json({ message: error.message });
      return;
    }

    logSecurityEvent({
      event: 'checkout_initialize_failed',
      ip: getClientIp(request),
      method: request.method,
      path: request.path,
      outcome: 'failed',
      statusCode: 500,
    });

    response.status(500).json({ message: 'Unable to start checkout right now.' });
  }
});

app.get('/api/checkout/verify/:reference', verifyRateLimiter, async (request, response) => {
  try {
    const reference = getSingleRouteParam(request.params.reference);

    if (!reference) {
      response.status(400).json({ message: 'The order reference is invalid.' });
      return;
    }

    if (!isValidOrderReference(reference)) {
      response.status(400).json({ message: 'The order reference is invalid.' });
      return;
    }

    const existingOrder = await findOrderByReference(reference);
    const receiptToken = getReceiptTokenFromRequest(request, reference);

    if (!existingOrder || !receiptTokenMatches(receiptToken, existingOrder.receiptTokenHash)) {
      clearReceiptTokenCookie(request, response, reference);
      response.status(404).json({ message: 'We could not find that order.' });
      return;
    }

    const verifiedTransaction = isPaystackDemoMode()
      ? createDemoPaystackTransaction({
          amountInKobo: existingOrder.amountInKobo,
          currency: existingOrder.currency,
          reference,
        })
      : await verifyPaystackTransaction(reference);

    if (verifiedTransaction.status !== 'success') {
      response.status(409).json({
        message:
          'Your payment has not been confirmed yet. Please wait a moment and try again.',
      });
      return;
    }

    if (
      verifiedTransaction.currency !== existingOrder.currency ||
      verifiedTransaction.amount !== existingOrder.amountInKobo
    ) {
      response.status(400).json({
        message: 'The verified payment amount does not match this order.',
      });
      return;
    }

    const paidOrder = await finalizeSuccessfulPayment(reference, verifiedTransaction);

    logSecurityEvent({
      event: 'checkout_verified',
      ip: getClientIp(request),
      method: request.method,
      path: request.path,
      reference,
      outcome: 'succeeded',
      statusCode: 200,
    });

    clearReceiptTokenCookie(request, response, reference);
    response.json({
      order: serializeOrder(paidOrder),
    });
  } catch {
    logSecurityEvent({
      event: 'checkout_verify_failed',
      ip: getClientIp(request),
      method: request.method,
      path: request.path,
      reference: getSingleRouteParam(request.params.reference),
      outcome: 'failed',
      statusCode: 500,
    });

    response.status(500).json({ message: 'We could not verify your payment.' });
  }
});

// ─── Global Error Handler ──────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: Error & { status?: number; statusCode?: number }, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
  const statusCode = error.status || error.statusCode || 500;
  const message = statusCode === 500 ? 'An unexpected error occurred. Please try again later.' : error.message;

  logSecurityEvent({
    event: 'unhandled_error',
    outcome: 'failed',
    reason: error.message,
    statusCode,
  });

  const isDevOrTest = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test';
  
  response.status(statusCode).json({ 
    message,
    ...(isDevOrTest ? { stack: error.stack, detail: error.message } : {})
  });
});

app.post(
  '/api/payments/paystack/webhook',
  async (request: RequestWithRawBody, response) => {
    try {
      const signatureHeader = request.header('x-paystack-signature');

      if (!request.rawBody || !isValidPaystackSignature(request.rawBody, signatureHeader)) {
        logSecurityEvent({
          event: 'paystack_webhook_rejected',
          ip: getClientIp(request),
          method: request.method,
          path: request.path,
          outcome: 'blocked',
          statusCode: 401,
        });
        response.status(401).json({ message: 'Invalid Paystack signature.' });
        return;
      }

      const event = request.body as {
        event?: string;
        data?: PaystackTransactionData;
      };

      if (event.event === 'charge.success' && event.data?.reference) {
        await finalizeSuccessfulPayment(event.data.reference, event.data);
      }

      response.status(200).json({ received: true });
    } catch {
      logSecurityEvent({
        event: 'paystack_webhook_failed',
        ip: getClientIp(request),
        method: request.method,
        path: request.path,
        outcome: 'failed',
        statusCode: 500,
      });
      response.status(500).json({ message: 'Webhook processing failed.' });
    }
  },
);

app.use('/api', (_request, response) => {
  response.status(404).json({ message: 'API endpoint not found.' });
});

app.use(express.static(distDirectory, { index: false }));

app.get(/^(?!\/api).*/, async (request, response) => {
  try {
    const indexHtml = await fs.readFile(path.join(distDirectory, 'index.html'), 'utf8');
    response.type('html').send(injectRouteSeo(indexHtml, request.originalUrl));
  } catch {
    response.status(404).json({
      message: 'Frontend build not found. Run "npm run build" before "npm run start".',
    });
  }
});

export function startServer(port = serverPort) {
  return app.listen(port, () => {
    console.log(`Checkout API running on http://localhost:${port}`);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startServer();
}

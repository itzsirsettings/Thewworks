import 'dotenv/config';

import { randomBytes } from 'node:crypto';
import express from 'express';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { User } from '@supabase/supabase-js';
import { z } from 'zod';
import { sendOrderNotifications } from './lib/notifications.js';
import { getAdminDashboardStats } from './lib/stats.js';
import { supabaseAdmin } from './lib/supabase-admin.js';
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
  createRateLimiter,
  createReceiptToken,
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
  (process.env.VITE_ADMIN_EMAILS || '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
);

function hasAdminAccess(user: User | null | undefined): boolean {
  if (!user) {
    return false;
  }

  const role = user.app_metadata?.role ?? user.user_metadata?.role;
  const email = user.email?.trim().toLowerCase() || '';

  return role === 'admin' || approvedAdminEmails.has(email);
}
interface RequestWithRawBody extends express.Request {
  rawBody?: Buffer;
}

class CheckoutValidationError extends Error {}

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
  })
  .strict();

const app = express();
const serverPort = Number(process.env.SERVER_PORT || 3001);
const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(currentDirectory, '..');
const distDirectory = path.resolve(projectRoot, 'dist');

app.disable('x-powered-by');
app.set('trust proxy', 1);

function createOrderReference() {
  return `STK-${Date.now()}-${randomBytes(10).toString('hex').toUpperCase()}`;
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

app.use(applySecurityHeaders);
app.use(
  express.json({
    limit: '5mb',
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

app.get(
  '/api/admin/stats',
  adminRateLimiter,
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

// ─── Admin Product Management ───────────────────────────────────────────

async function requireAdminToken(request: express.Request, response: express.Response): Promise<boolean> {
  const authHeader = request.header('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : '';
  
  if (!token) {
    response.status(401).json({ message: 'Unauthorized admin session.' });
    return false;
  }

  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
  
  if (error || !user) {
    response.status(401).json({ message: 'Invalid or expired admin session.' });
    return false;
  }

  if (!hasAdminAccess(user)) {
    response.status(403).json({ message: 'Admin privileges are required.' });
    return false;
  }

  return true;
}

// Helper to save base64 image strings to the local public folder
async function processImageUpload(base64Data: unknown): Promise<string | undefined> {
  if (typeof base64Data !== 'string' || !base64Data.startsWith('data:image/')) return undefined;
  
  const matches = base64Data.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
  if (!matches) return undefined;
  
  const extension = matches[1] === 'jpeg' ? 'jpg' : matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  
  const filename = `product-${Date.now()}-${randomBytes(2).toString('hex')}.${extension}`;
  
  const { error } = await supabaseAdmin.storage
    .from('products')
    .upload(filename, buffer, {
      contentType: `image/${extension}`,
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
    if (!Number.isFinite(productId)) {
      response.status(400).json({ message: 'Invalid product ID.' });
      return;
    }

    const body = request.body as Record<string, unknown>;
    const updates: Record<string, unknown> = {};

    try {
      const newImageUrl = await processImageUpload(body.imageBase64);
      if (newImageUrl) {
        updates.image = newImageUrl;
      } else if (typeof body.image === 'string' && body.image.trim()) {
        updates.image = body.image.trim();
      }

      if (typeof body.name === 'string') updates.name = body.name.trim();
      if (typeof body.price === 'number' && body.price > 0) updates.price = body.price;
      if (typeof body.category === 'string') updates.category = body.category.trim();
      if (typeof body.supplier === 'string') updates.supplier = body.supplier.trim();
      if (typeof body.origin === 'string') updates.origin = body.origin.trim();
      if (typeof body.moq === 'string') updates.moq = body.moq.trim();
      if (typeof body.lead_time === 'string') updates.lead_time = body.lead_time.trim();
      if (typeof body.rating === 'number') updates.rating = body.rating;
      if (typeof body.orders === 'string') updates.orders = body.orders.trim();
      if (typeof body.badge === 'string') updates.badge = body.badge.trim();
      if (typeof body.summary === 'string') updates.summary = body.summary.trim();

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
      console.error(`Failed to update product ${productId}:`, error);
      response.status(500).json({ message: 'Failed to update product.' });
    }
  },
);

app.post(
  '/api/admin/products',
  async (request: express.Request, response: express.Response) => {
    if (!await requireAdminToken(request, response)) return;

    const body = request.body as Record<string, unknown>;

    const name = typeof body.name === 'string' ? body.name.trim() : '';
    const price = typeof body.price === 'number' ? body.price : 0;
    const category = typeof body.category === 'string' ? body.category.trim() : '';
    const supplier = typeof body.supplier === 'string' ? body.supplier.trim() : '';

    if (!name || price <= 0 || !category || !supplier) {
      response.status(400).json({ message: 'Name, price, category, and supplier are required.' });
      return;
    }

    try {
      const newImageUrl = await processImageUpload(body.imageBase64);
      let finalImage = newImageUrl || (typeof body.image === 'string' ? body.image.trim() : '');
      if (!finalImage) finalImage = '/images/product-1.jpg'; // fallback

      const { data, error } = await supabaseAdmin
        .from('products')
        .insert({
          id: Date.now(),
          name,
          price,
          image: finalImage,
          category,
          supplier,
          origin: typeof body.origin === 'string' ? body.origin.trim() : 'Local stock',
          moq: typeof body.moq === 'string' ? body.moq.trim() : '1 unit',
          lead_time: typeof body.lead_time === 'string' ? body.lead_time.trim() : '3-5 days',
          rating: typeof body.rating === 'number' ? body.rating : 4.5,
          orders: typeof body.orders === 'string' ? body.orders.trim() : '0 orders',
          badge: typeof body.badge === 'string' ? body.badge.trim() : 'New',
          summary: typeof body.summary === 'string' ? body.summary.trim() : '',
        })
        .select()
        .single();

      if (error) throw error;
      response.status(201).json(data);
    } catch (error) {
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
    if (!Number.isFinite(productId)) {
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

app.use(express.static(distDirectory));

app.get(/^(?!\/api).*/, async (_request, response) => {
  try {
    await fs.access(path.join(distDirectory, 'index.html'));
    response.sendFile(path.join(distDirectory, 'index.html'));
  } catch {
    response.status(404).json({
      message: 'Frontend build not found. Run "npm run build" before "npm run start".',
    });
  }
});

app.listen(serverPort, () => {
  console.log(`Checkout API running on http://localhost:${serverPort}`);
});

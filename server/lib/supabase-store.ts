import { supabaseAdmin } from './supabase-admin.js';
import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';
import { getOrderStoreEncryptionKey } from './security.js';
import type {
  OrderRecord,
  PaystackTransactionData,
  NotificationStatus,
  NotificationState
} from './types.js';

const ENCRYPTED_VALUE_PREFIX = 'enc:v1:';

// CLONE UTILITY (removed because unused)

// ENCRYPTION/DECRYPTION (Keeping existing logic for data consistency)
function encryptSensitiveValue(value: string) {
  if (!value) return '';
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', getOrderStoreEncryptionKey(), iv);
  const ciphertext = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${ENCRYPTED_VALUE_PREFIX}${iv.toString('base64url')}.${tag.toString('base64url')}.${ciphertext.toString('base64url')}`;
}

function decryptSensitiveValue(value: string) {
  if (!value || !value.startsWith(ENCRYPTED_VALUE_PREFIX)) return value;
  const payload = value.slice(ENCRYPTED_VALUE_PREFIX.length);
  const [iv, tag, ciphertext] = payload.split('.');
  if (!iv || !tag || !ciphertext) throw new Error('Encrypted field is malformed.');
  const decipher = createDecipheriv('aes-256-gcm', getOrderStoreEncryptionKey(), Buffer.from(iv, 'base64url'));
  decipher.setAuthTag(Buffer.from(tag, 'base64url'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64url')), decipher.final()]);
  return decrypted.toString('utf8');
}

const shouldClaimNotification = (status: NotificationStatus) =>
  status === 'pending' || status === 'failed' || status === 'not_configured';

// DATABASE OPERATIONS
export async function getProducts() {
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      gallery:product_galleries(*),
      tags:product_tags(tag)
    `);

  if (error) throw error;
  
  return (products || []).map(p => ({
    ...p,
    gallery: p.gallery.map((g: Record<string, unknown>) => ({
      id: g.id,
      image: g.image,
      title: g.title,
      caption: g.caption,
      objectPosition: g.object_position,
      imageTransform: g.image_transform
    })),
    tags: p.tags.map((t: Record<string, unknown>) => t.tag),
    leadTime: p.lead_time
  }));
}

export async function getProductsByIds(ids: number[]) {
  if (ids.length === 0) return [];
  const { data: products, error } = await supabaseAdmin
    .from('products')
    .select(`
      *,
      gallery:product_galleries(*),
      tags:product_tags(tag)
    `)
    .in('id', ids);

  if (error) throw error;
  
  return (products || []).map(p => ({
    ...p,
    gallery: p.gallery.map((g: Record<string, unknown>) => ({
      id: g.id,
      image: g.image,
      title: g.title,
      caption: g.caption,
      objectPosition: g.object_position,
      imageTransform: g.image_transform
    })),
    tags: p.tags.map((t: Record<string, unknown>) => t.tag),
    leadTime: p.lead_time
  }));
}

export async function getCategories() {
  const { data, error } = await supabaseAdmin.from('categories').select('*');
  if (error) throw error;
  return data.map(c => ({
    name: c.name,
    caption: c.caption,
    skuCount: c.sku_count,
    icon: c.icon
  }));
}

export async function getSuppliers() {
  const { data, error } = await supabaseAdmin.from('suppliers').select('*');
  if (error) throw error;
  return data;
}

export async function findOrderByReference(reference: string): Promise<OrderRecord | null> {
  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .select('*')
    .eq('reference', reference)
    .single();

  if (orderError) return null;

  const { data: items, error: itemsError } = await supabaseAdmin
    .from('order_items')
    .select('*')
    .eq('order_reference', reference);

  if (itemsError) throw itemsError;

  return {
    reference: order.reference,
    receiptTokenHash: order.receipt_token_hash,
    amount: order.amount,
    amountInKobo: order.amount_in_kobo,
    currency: order.currency,
    status: order.status,
    customer: {
      fullName: decryptSensitiveValue(order.customer_full_name),
      email: decryptSensitiveValue(order.customer_email),
      phone: decryptSensitiveValue(order.customer_phone),
      address: decryptSensitiveValue(order.customer_address),
      city: decryptSensitiveValue(order.customer_city),
      state: decryptSensitiveValue(order.customer_state),
      notes: decryptSensitiveValue(order.customer_notes),
    },
    items: items.map(item => ({
      id: item.item_id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
    })),
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    paidAt: order.paid_at,
    paymentChannel: order.payment_channel,
    paystackTransactionId: order.paystack_transaction_id,
    deliveryMessage: order.delivery_message,
    notificationStatus: {
      email: order.notification_email_status as NotificationStatus,
      sms: order.notification_sms_status as NotificationStatus,
    },
  };
}

export async function createOrder(order: OrderRecord) {
  const { error: orderError } = await supabaseAdmin.from('orders').insert({
    reference: order.reference,
    receipt_token_hash: order.receiptTokenHash,
    amount: order.amount,
    amount_in_kobo: order.amountInKobo,
    currency: order.currency,
    status: order.status,
    customer_full_name: encryptSensitiveValue(order.customer.fullName),
    customer_email: encryptSensitiveValue(order.customer.email),
    customer_phone: encryptSensitiveValue(order.customer.phone),
    customer_address: encryptSensitiveValue(order.customer.address),
    customer_city: encryptSensitiveValue(order.customer.city),
    customer_state: encryptSensitiveValue(order.customer.state),
    customer_notes: encryptSensitiveValue(order.customer.notes),
    delivery_message: order.deliveryMessage,
    notification_email_status: order.notificationStatus.email,
    notification_sms_status: order.notificationStatus.sms,
  });

  if (orderError) throw orderError;

  const { error: itemsError } = await supabaseAdmin.from('order_items').insert(
    order.items.map(item => ({
      order_reference: order.reference,
      item_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }))
  );

  if (itemsError) {
    await supabaseAdmin.from('orders').delete().eq('reference', order.reference);
    throw itemsError;
  }

  return order;
}

export async function claimPaidOrder(reference: string, payment: PaystackTransactionData) {
  const order = await findOrderByReference(reference);
  if (!order) return { order: null, claimed: { email: false, sms: false } };

  const claimed = {
    email: shouldClaimNotification(order.notificationStatus.email),
    sms: shouldClaimNotification(order.notificationStatus.sms),
  };

  const updates: Record<string, unknown> = {
    status: 'paid',
    paid_at: payment.paid_at || new Date().toISOString(),
    payment_channel: payment.channel,
    paystack_transaction_id: String(payment.id),
    updated_at: new Date().toISOString()
  };

  if (claimed.email) updates.notification_email_status = 'processing';
  if (claimed.sms) updates.notification_sms_status = 'processing';

  const { error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('reference', reference);

  if (error) throw error;

  const updatedOrder = await findOrderByReference(reference);
  return { order: updatedOrder, claimed };
}

export async function updateNotificationStatus(reference: string, statuses: Partial<NotificationState>) {
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (statuses.email) updates.notification_email_status = statuses.email;
  if (statuses.sms) updates.notification_sms_status = statuses.sms;

  const { error } = await supabaseAdmin
    .from('orders')
    .update(updates)
    .eq('reference', reference);

  if (error) throw error;
  return findOrderByReference(reference);
}

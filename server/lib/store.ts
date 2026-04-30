import {
  claimPaidOrder as claimPaidOrderSupabase,
  createOrder as createOrderSupabase,
  findOrderByReference as findOrderByReferenceSupabase,
  updateNotificationStatus as updateNotificationStatusSupabase,
  getProducts as getProductsSupabase,
  getProductsByIds as getProductsByIdsSupabase,
  getCategories as getCategoriesSupabase,
  getSuppliers as getSuppliersSupabase
} from './supabase-store.js';
import type {
  NotificationState,
  OrderRecord,
  PaystackTransactionData,
} from './types.js';
import { catalogById, catalogItems } from './catalog.js';

// We are now fully committed to Supabase for the entire app.
// The SQLite and local JSON logic is preserved in history but removed from active duty.

const legacyCatalogTerms = [
  'sofa',
  'bed',
  'refrigerator',
  'rug',
  'dining',
  'appliance',
  'living room',
  'bedroom',
];

function isLegacyCatalogItem(product: { name?: unknown; category?: unknown; summary?: unknown }) {
  const searchable = `${String(product.name ?? '')} ${String(product.category ?? '')} ${String(product.summary ?? '')}`.toLowerCase();
  return legacyCatalogTerms.some((term) => searchable.includes(term));
}

export async function findOrderByReference(reference: string) {
  return findOrderByReferenceSupabase(reference);
}

export async function createOrder(order: OrderRecord) {
  return createOrderSupabase(order);
}

export async function claimPaidOrder(
  reference: string,
  payment: PaystackTransactionData,
) {
  return claimPaidOrderSupabase(reference, payment);
}

export async function updateNotificationStatus(
  reference: string,
  statuses: Partial<NotificationState>,
) {
  return updateNotificationStatusSupabase(reference, statuses);
}

export async function getProducts() {
  const products = await getProductsSupabase();

  if (!products || products.length === 0 || products.some((product) => isLegacyCatalogItem(product))) {
    return catalogItems;
  }

  return products;
}

export async function getProductsByIds(ids: number[]) {
  const products = await getProductsByIdsSupabase(ids);

  if (!products || products.length !== ids.length || products.some((product) => isLegacyCatalogItem(product))) {
    return ids
      .map((id) => catalogById.get(id))
      .filter((product): product is NonNullable<typeof product> => Boolean(product));
  }

  return products;
}

export async function getCategories() {
  return getCategoriesSupabase();
}

export async function getSuppliers() {
  return getSuppliersSupabase();
}

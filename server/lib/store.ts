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

// We are now fully committed to Supabase for the entire app.
// The SQLite and local JSON logic is preserved in history but removed from active duty.

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
  return getProductsSupabase();
}

export async function getProductsByIds(ids: number[]) {
  return getProductsByIdsSupabase(ids);
}

export async function getCategories() {
  return getCategoriesSupabase();
}

export async function getSuppliers() {
  return getSuppliersSupabase();
}

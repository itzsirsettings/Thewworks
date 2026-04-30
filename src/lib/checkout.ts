export type NotificationStatus =
  | 'pending'
  | 'processing'
  | 'sent'
  | 'failed'
  | 'not_configured';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CheckoutFormValues {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  notes: string;
}

export interface VerifiedOrder {
  reference: string;
  status: 'pending' | 'paid' | 'failed';
  amount: number;
  currency: 'NGN';
  paidAt?: string;
  paymentChannel?: string;
  deliveryMessage: string;
  customer: CheckoutFormValues;
  items: CartItem[];
  notifications: {
    email: NotificationStatus;
    sms: NotificationStatus;
  };
}

const PAYSTACK_REDIRECT_HOSTS = new Set(['checkout.paystack.com', 'paystack.com']);

export const CART_STORAGE_KEY = 'thewworksict-cart';
export const PENDING_REFERENCE_STORAGE_KEY = 'thewworksict-pending-reference';

export const defaultCheckoutFormValues: CheckoutFormValues = {
  fullName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  notes: '',
};

function getSessionStorage() {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

export function setPendingReference(reference: string) {
  getSessionStorage()?.setItem(PENDING_REFERENCE_STORAGE_KEY, reference);
}

export function getPendingReference() {
  return getSessionStorage()?.getItem(PENDING_REFERENCE_STORAGE_KEY) || null;
}

export function clearPendingReference() {
  getSessionStorage()?.removeItem(PENDING_REFERENCE_STORAGE_KEY);
}

export function isTrustedPaymentRedirect(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (PAYSTACK_REDIRECT_HOSTS.has(parsedUrl.hostname)) {
      return true;
    }

    if (typeof window === 'undefined') {
      return false;
    }

    return (
      parsedUrl.origin === window.location.origin &&
      parsedUrl.pathname.startsWith('/store')
    );
  } catch {
    return false;
  }
}

function describeChannel(label: string, status: NotificationStatus) {
  switch (status) {
    case 'sent':
      return `${label} sent`;
    case 'processing':
      return `${label} is being prepared`;
    case 'failed':
      return `${label} needs a retry`;
    case 'not_configured':
      return `${label} is waiting for setup`;
    default:
      return `${label} queued`;
  }
}

export function getNotificationSummary(order: VerifiedOrder) {
  return [
    describeChannel('Email confirmation', order.notifications.email),
    describeChannel('SMS confirmation', order.notifications.sms),
  ].join(' | ');
}

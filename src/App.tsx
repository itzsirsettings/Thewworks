import { Suspense, lazy, useCallback, useEffect, useMemo, useState } from 'react';
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import {
  clearPendingReference,
  getPendingReference,
  type VerifiedOrder,
} from './lib/checkout';
import { useStore } from './lib/store';
import BrandLogo from './components/BrandLogo';
import CookieConsentBanner from './components/CookieConsentBanner';
import SEO from './components/SEO';

const AdminDashboardPage = lazy(() => import('./components/admin/AdminDashboardPage'));
const CheckoutModal = lazy(() => import('./components/CheckoutModal'));
const LandingPage = lazy(() => import('./components/LandingPage'));
const PaymentStatusDialog = lazy(() => import('./components/PaymentStatusDialog'));
const ThewworksICTMarketplace = lazy(() => import('./components/ThewworksICTMarketplace'));

const AppLoadingState = ({ message }: { message: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--market-sand)] px-6">
    <div className="rounded-[1.5rem] border border-[var(--market-stroke)] bg-[var(--market-ivory)] px-6 py-5 text-center shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
      <BrandLogo className="justify-center" markClassName="h-9 w-16" textTone="brand" />
      <p className="mt-3 text-sm font-medium text-[var(--market-muted)]">{message}</p>
    </div>
  </div>
);

function AppShell() {
  const { pathname } = useLocation();
  const isStoreRoute = useMemo(() => pathname.startsWith('/store'), [pathname]);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isVerifyingPayment, setIsVerifyingPayment] = useState(false);
  const [paymentErrorMessage, setPaymentErrorMessage] = useState('');
  const [verifiedOrder, setVerifiedOrder] = useState<VerifiedOrder | null>(null);


  const verifyPaymentReference = useCallback(async (reference: string) => {
    try {
      setIsPaymentDialogOpen(true);
      setIsCheckoutOpen(false);
      setIsVerifyingPayment(true);
      setVerifiedOrder(null);
      setPaymentErrorMessage('');

      const response = await fetch(
        `/api/checkout/verify/${encodeURIComponent(reference)}`,
        {
          credentials: 'same-origin',
        },
      );
      const payload = (await response.json()) as {
        order?: VerifiedOrder;
        message?: string;
      };

      if (!response.ok || !payload.order) {
        throw new Error(payload.message || 'We could not verify your payment.');
      }

      setVerifiedOrder(payload.order);
      useStore.getState().clearCart();
      clearPendingReference();
    } catch (error) {
      setPaymentErrorMessage(
        error instanceof Error
          ? error.message
          : 'We could not verify your payment.',
      );
    } finally {
      setIsVerifyingPayment(false);
    }
  }, []);

  useEffect(() => {
    if (!isStoreRoute) {
      return;
    }

    const currentUrl = new URL(window.location.href);
    const reference =
      currentUrl.searchParams.get('reference') || currentUrl.searchParams.get('trxref');

    if (!reference) {
      return;
    }

    void verifyPaymentReference(reference);

    currentUrl.searchParams.delete('reference');
    currentUrl.searchParams.delete('trxref');
    window.history.replaceState({}, document.title, currentUrl.toString());
  }, [isStoreRoute, verifyPaymentReference]);

  return (
    <>
      <Routes>
        <Route
          path="/admin"
          element={(
            <Suspense fallback={<AppLoadingState message="Loading admin dashboard..." />}>
              <SEO title="Admin Dashboard" description="Thewworks Admin Management System" />
              <AdminDashboardPage />
            </Suspense>
          )}
        />
        <Route
          path="/"
          element={(
            <Suspense fallback={<AppLoadingState message="Loading landing page..." />}>
              <LandingPage />
            </Suspense>
          )}
        />
        <Route
          path="/store"
          element={(
            <Suspense fallback={<AppLoadingState message="Loading storefront..." />}>
              <SEO title="Store & Quoting" description="Request a quote for business cards, packaging, and custom prints." />
              <ThewworksICTMarketplace onCheckoutRequested={() => setIsCheckoutOpen(true)} />
            </Suspense>
          )}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {isCheckoutOpen ? (
        <Suspense fallback={null}>
          <CheckoutModal
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            onCheckoutStarted={() => setIsCheckoutOpen(false)}
          />
        </Suspense>
      ) : null}
      {isPaymentDialogOpen ? (
        <Suspense fallback={null}>
          <PaymentStatusDialog
            isOpen={isPaymentDialogOpen}
            isLoading={isVerifyingPayment}
            order={verifiedOrder}
            errorMessage={paymentErrorMessage}
            onClose={() => {
              setIsPaymentDialogOpen(false);
              setVerifiedOrder(null);
              setPaymentErrorMessage('');
            }}
            onRetry={() => {
              const pendingReference = getPendingReference();

              if (pendingReference) {
                void verifyPaymentReference(pendingReference);
              }
            }}
          />
        </Suspense>
      ) : null}
      <CookieConsentBanner />
    </>
  );
}

function App() {
  return (
    <Router>
      <AppShell />
      <Analytics />
    </Router>
  );
}

export default App;

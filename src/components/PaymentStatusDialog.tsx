import { CheckCircle2, LoaderCircle, RefreshCcw, XCircle } from 'lucide-react';
import { formatCurrency } from '../lib/currency';
import { getNotificationSummary, type VerifiedOrder } from '../lib/checkout';

interface PaymentStatusDialogProps {
  isOpen: boolean;
  isLoading: boolean;
  order: VerifiedOrder | null;
  errorMessage: string;
  onClose: () => void;
  onRetry: () => void;
}

const PaymentStatusDialog = ({
  isOpen,
  isLoading,
  order,
  errorMessage,
  onClose,
  onRetry,
}: PaymentStatusDialogProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[10000] bg-[#222222]/50 px-4 py-8 font-store">
      <div className="mx-auto max-w-2xl rounded-[20px] bg-white p-8 shadow-airbnb-card md:p-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <LoaderCircle size={40} className="animate-spin text-[#222222]" />
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.02em] text-[#222222]">
              Verifying payment
            </h2>
            <p className="mt-3 max-w-lg text-[#6a6a6a]">
              We&apos;re confirming your transaction and preparing your order notifications.
            </p>
          </div>
        ) : order ? (
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 text-emerald-700">
                  <CheckCircle2 size={28} />
                  <span className="text-sm font-medium uppercase tracking-wide">
                    Payment confirmed
                  </span>
                </div>
                <h2 className="mt-4 text-4xl font-semibold tracking-[-0.02em] text-[#222222]">
                  Order {order.reference}
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#c1c1c1] px-4 py-2 text-sm text-[#6a6a6a] transition-colors hover:border-[#222222] hover:text-[#222222]"
              >
                Close
              </button>
            </div>

            <p className="mt-6 text-lg text-[#6a6a6a]">{order.deliveryMessage}</p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-[14px] bg-[#f2f2f2] p-5 shadow-airbnb-card">
                <p className="text-xs font-medium uppercase tracking-wide text-[#6a6a6a]">
                  Amount paid
                </p>
                <p className="mt-3 text-3xl font-semibold text-[#222222]">
                  {formatCurrency(order.amount)}
                </p>
                <p className="mt-3 text-sm text-[#6a6a6a]">
                  {order.paymentChannel || 'Secure checkout'}
                </p>
              </div>

              <div className="rounded-[14px] bg-[#f2f2f2] p-5 shadow-airbnb-card">
                <p className="text-xs font-medium uppercase tracking-wide text-[#6a6a6a]">
                  Notifications
                </p>
                <p className="mt-3 text-sm leading-relaxed text-[#6a6a6a]">
                  {getNotificationSummary(order)}
                </p>
              </div>
            </div>

            <div className="mt-8 border-t border-[#ebebeb] pt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-[#6a6a6a]">
                Delivery address
              </p>
              <p className="mt-3 text-base leading-relaxed text-[#6a6a6a]">
                {order.customer.address}, {order.customer.city}, {order.customer.state}
              </p>
            </div>

            <div className="mt-8 border-t border-[#ebebeb] pt-6">
              <p className="text-xs font-medium uppercase tracking-wide text-[#6a6a6a]">
                Items
              </p>
              <div className="mt-4 space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-[#f2f2f2] pb-4"
                  >
                    <div>
                      <p className="text-xl font-semibold text-[#222222]">{item.name}</p>
                      <p className="mt-1 text-sm text-[#6a6a6a]">Qty {item.quantity}</p>
                    </div>
                    <p className="text-sm font-medium text-[#222222]">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-10 text-center">
            <div className="flex items-center justify-center gap-3 text-[#c13515]">
              <XCircle size={30} />
              <span className="text-sm font-medium uppercase tracking-wide">Payment pending</span>
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-[-0.02em] text-[#222222]">
              We couldn&apos;t verify this payment yet
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#6a6a6a]">
              {errorMessage ||
                'Please wait a moment and try verification again. If your payment already went through, the webhook will still update the order once confirmation arrives.'}
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#222222] px-6 py-3 text-base font-medium text-white transition-colors hover:bg-[#ff385c]"
              >
                <RefreshCcw size={16} />
                Retry verification
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#c1c1c1] px-6 py-3 text-base font-medium text-[#222222] transition-colors hover:shadow-airbnb-hover"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentStatusDialog;

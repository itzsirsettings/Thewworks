import { useMemo, useState } from 'react';
import { LoaderCircle, ShieldCheck, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { formatCurrency } from '../lib/currency';
import { useStore } from '../lib/store';
import {
  isTrustedPaymentRedirect,
  setPendingReference,
  type CheckoutFormValues,
} from '../lib/checkout';

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  city: z.string().min(2, 'City is required'),
  address: z.string().min(5, 'Delivery address is required'),
  state: z.string().min(2, 'State is required'),
  notes: z.string(),
});

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckoutStarted?: () => void;
}

const CheckoutModal = ({
  isOpen,
  onClose,
  onCheckoutStarted,
}: CheckoutModalProps) => {
  const cartItems = useStore((state) => state.cartItems);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      notes: '',
    },
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems],
  );

  const onSubmit = async (formValues: CheckoutFormValues) => {
    if (cartItems.length === 0) {
      setErrorMessage('Add at least one item to your cart before checking out.');
      return;
    }


    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const response = await fetch('/api/checkout/initialize', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: formValues,
          items: cartItems.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const payload = (await response.json()) as {
        authorizationUrl?: string;
        reference?: string;
        message?: string;
      };

      if (!response.ok || !payload.authorizationUrl || !payload.reference) {
        throw new Error(payload.message || 'Unable to start payment right now.');
      }

      if (!isTrustedPaymentRedirect(payload.authorizationUrl)) {
        throw new Error('Unexpected payment redirect target.');
      }

      setPendingReference(payload.reference);
      onCheckoutStarted?.();
      window.location.href = payload.authorizationUrl;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to start payment right now.',
      );
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto bg-[#222222]/50 px-4 py-8 font-store">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl flex-col overflow-hidden rounded-[20px] bg-white shadow-airbnb-card lg:h-[calc(100vh-4rem)] lg:flex-row">
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#ebebeb] bg-white px-6 py-5 lg:hidden">
          <h2 className="text-2xl font-semibold text-[#222222]">Secure checkout</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-[#c1c1c1] p-2 text-[#6a6a6a] transition-colors hover:border-[#222222] hover:text-[#222222]"
            aria-label="Close checkout"
          >
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 md:px-10 md:py-10">
          <div className="hidden items-center justify-between bg-white pb-4 lg:sticky lg:top-0 lg:z-10 lg:flex">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-[#6a6a6a]">
                Secure checkout
              </p>
              <h2 className="mt-3 text-4xl font-semibold tracking-[-0.02em] text-[#222222]">
                Complete your order
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#c1c1c1] p-3 text-[#6a6a6a] transition-colors hover:border-[#222222] hover:text-[#222222]"
              aria-label="Close checkout"
            >
              <X size={18} />
            </button>
          </div>

          <p className="mt-4 max-w-2xl text-base text-[#6a6a6a]">
            You will be redirected to complete payment securely.
            After confirmation, the customer receives an email and SMS update and
            delivery can begin.
          </p>

          <form onSubmit={handleSubmit((data) => onSubmit(data))} className="mt-8 grid gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#222222]">
                Full name
              </label>
              <input
                type="text"
                {...register('fullName')}
                className={`w-full rounded-lg border px-4 py-3 text-[#222222] outline-none transition-colors ${
                  errors.fullName
                    ? 'border-[#c13515] focus:border-[#c13515] focus:ring-2 focus:ring-[#c13515]/20'
                    : 'border-[#c1c1c1] focus:border-[#222222] focus:ring-2 focus:ring-[#222222]/15'
                }`}
                placeholder="Customer full name"
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-[#c13515]">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#222222]">
                Email address
              </label>
              <input
                type="email"
                {...register('email')}
                className={`w-full rounded-lg border px-4 py-3 text-[#222222] outline-none transition-colors ${
                  errors.email
                    ? 'border-[#c13515] focus:border-[#c13515] focus:ring-2 focus:ring-[#c13515]/20'
                    : 'border-[#c1c1c1] focus:border-[#222222] focus:ring-2 focus:ring-[#222222]/15'
                }`}
                placeholder="customer@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-[#c13515]">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#222222]">
                Phone number
              </label>
              <input
                type="tel"
                {...register('phone')}
                className={`w-full rounded-lg border px-4 py-3 text-[#222222] outline-none transition-colors ${
                  errors.phone
                    ? 'border-[#c13515] focus:border-[#c13515] focus:ring-2 focus:ring-[#c13515]/20'
                    : 'border-[#c1c1c1] focus:border-[#222222] focus:ring-2 focus:ring-[#222222]/15'
                }`}
                placeholder="+2348012345678"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-[#c13515]">{errors.phone.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#222222]">
                City
              </label>
              <input
                type="text"
                {...register('city')}
                className={`w-full rounded-lg border px-4 py-3 text-[#222222] outline-none transition-colors ${
                  errors.city
                    ? 'border-[#c13515] focus:border-[#c13515] focus:ring-2 focus:ring-[#c13515]/20'
                    : 'border-[#c1c1c1] focus:border-[#222222] focus:ring-2 focus:ring-[#222222]/15'
                }`}
                placeholder="Asaba"
              />
              {errors.city && (
                <p className="mt-1 text-sm text-[#c13515]">{errors.city.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#222222]">
                Delivery address
              </label>
              <input
                type="text"
                {...register('address')}
                className={`w-full rounded-lg border px-4 py-3 text-[#222222] outline-none transition-colors ${
                  errors.address
                    ? 'border-[#c13515] focus:border-[#c13515] focus:ring-2 focus:ring-[#c13515]/20'
                    : 'border-[#c1c1c1] focus:border-[#222222] focus:ring-2 focus:ring-[#222222]/15'
                }`}
                placeholder="House number, street, landmark"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-[#c13515]">{errors.address.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#222222]">
                State
              </label>
              <input
                type="text"
                {...register('state')}
                className={`w-full rounded-lg border px-4 py-3 text-[#222222] outline-none transition-colors ${
                  errors.state
                    ? 'border-[#c13515] focus:border-[#c13515] focus:ring-2 focus:ring-[#c13515]/20'
                    : 'border-[#c1c1c1] focus:border-[#222222] focus:ring-2 focus:ring-[#222222]/15'
                }`}
                placeholder="Delta State"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-[#c13515]">{errors.state.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-[#222222]">
                Delivery notes
              </label>
              <textarea
                {...register('notes')}
                rows={4}
                className={`w-full rounded-lg border px-4 py-3 text-[#222222] outline-none transition-colors ${
                  errors.notes
                    ? 'border-[#c13515] focus:border-[#c13515] focus:ring-2 focus:ring-[#c13515]/20'
                    : 'border-[#c1c1c1] focus:border-[#222222] focus:ring-2 focus:ring-[#222222]/15'
                }`}
                placeholder="Gate code, landmark, preferred delivery note"
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-[#c13515]">{errors.notes.message}</p>
              )}
            </div>

            {errorMessage && (
              <div className="md:col-span-2 rounded-lg border border-[#c13515]/30 bg-[#fff5f3] px-4 py-3 text-sm text-[#c13515]">
                {errorMessage}
              </div>
            )}

            <div className="md:col-span-2 flex items-center gap-3 rounded-lg bg-[#f2f2f2] px-4 py-4 text-sm text-[#222222]">
              <ShieldCheck size={18} />
              <span>
                Payment is verified on the server before confirmations are sent.
              </span>
            </div>


            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 rounded-lg bg-[#222222] px-6 py-4 text-base font-medium text-white transition-colors hover:bg-[#ff385c] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Redirecting to secure payment
                  </>
                ) : (
                  'Proceed to payment'
                )}
              </button>
            </div>
          </form>
        </div>

        <aside className="flex w-full min-h-0 flex-col border-t border-[#ebebeb] bg-[#f2f2f2] px-6 py-6 lg:w-[420px] lg:border-l lg:border-t-0 lg:px-8 lg:py-10">
          <h3 className="text-2xl font-semibold text-[#222222]">Order summary</h3>
          <div className="mt-6 flex-1 space-y-4 overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-[14px] bg-white shadow-airbnb-card">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-lg font-semibold text-[#222222]">{item.name}</p>
                  <p className="mt-1 text-sm text-[#6a6a6a]">
                    Qty {item.quantity} • {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="text-sm font-medium text-[#222222]">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 border-t border-[#c1c1c1] pt-6">
            <div className="flex items-center justify-between text-sm text-[#6a6a6a]">
              <span>Items</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-2xl font-semibold text-[#222222]">
              <span>Total</span>
              <span>{formatCurrency(totalAmount)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutModal;

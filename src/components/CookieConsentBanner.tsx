import { useEffect, useState } from 'react';
import { Cookie, ShieldCheck } from 'lucide-react';
import { Button } from './ui/button';

const CONSENT_COOKIE_NAME = 'thewworks_cookie_consent';
const CONSENT_STORAGE_KEY = 'thewworks:cookie-consent';
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const COOKIE_SETTINGS_EVENT = 'thewworks:open-cookie-settings';

const hasAcceptedCookies = () => {
  if (typeof document === 'undefined') {
    return true;
  }

  const cookieAccepted = document.cookie
    .split('; ')
    .some((cookie) => cookie === `${CONSENT_COOKIE_NAME}=accepted`);

  if (cookieAccepted) {
    return true;
  }

  try {
    return window.localStorage.getItem(CONSENT_STORAGE_KEY) === 'accepted';
  } catch {
    return false;
  }
};

const rememberCookieConsent = () => {
  document.cookie = [
    `${CONSENT_COOKIE_NAME}=accepted`,
    'path=/',
    `max-age=${COOKIE_MAX_AGE_SECONDS}`,
    'SameSite=Lax',
  ].join('; ');

  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');
  } catch {
    // Consent is still persisted in the browser cookie.
  }
};

export const openCookieSettings = () => {
  window.dispatchEvent(new Event(COOKIE_SETTINGS_EVENT));
};

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(!hasAcceptedCookies());

    const handleOpenSettings = () => {
      setIsVisible(true);
    };

    window.addEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);

    return () => {
      window.removeEventListener(COOKIE_SETTINGS_EVENT, handleOpenSettings);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[80] px-4 pb-4 sm:px-6 sm:pb-6"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-4 rounded-lg border border-[rgba(234,220,198,0.95)] bg-[rgba(255,253,248,0.96)] p-4 shadow-[0_24px_80px_rgba(17,24,39,0.18)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[rgba(249,115,22,0.12)] text-[var(--market-orange)]">
            <Cookie size={22} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--market-ink)]">
              Accept cookies to get the most out of Thewworks.
            </p>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-[var(--market-muted)]">
              We use cookies to remember your preferences, keep ordering smooth,
              and understand which printing services visitors find useful.
            </p>
            <p className="mt-2 flex items-center gap-2 text-xs font-medium text-[var(--market-muted)]">
              <ShieldCheck size={14} aria-hidden="true" />
              Your choice is saved for 180 days.
            </p>
          </div>
        </div>

        <Button
          type="button"
          className="h-11 shrink-0 rounded-md bg-[var(--market-orange)] px-5 text-sm font-semibold text-white hover:bg-[var(--market-burgundy)]"
          onClick={() => {
            rememberCookieConsent();
            setIsVisible(false);
          }}
        >
          Accept cookies
        </Button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;

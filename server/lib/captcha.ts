import { getTrustedSiteUrl } from './security.js';

interface TurnstileVerificationResult {
  success: boolean;
  hostname?: string;
  'error-codes'?: string[];
}

export class CaptchaValidationError extends Error {}

function getCaptchaConfig() {
  const siteKey = process.env.VITE_TURNSTILE_SITE_KEY?.trim();
  const secretKey = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!siteKey && !secretKey) {
    return null;
  }

  if (!siteKey || !secretKey) {
    throw new Error(
      'Turnstile is partially configured. Set both VITE_TURNSTILE_SITE_KEY and TURNSTILE_SECRET_KEY.',
    );
  }

  return {
    siteKey,
    secretKey,
  };
}

export function getCaptchaSiteKey() {
  return getCaptchaConfig()?.siteKey || null;
}

export function isCaptchaProtectionEnabled() {
  return Boolean(getCaptchaConfig());
}

export async function verifyCheckoutCaptcha(
  token: string | undefined,
  remoteIp?: string,
) {
  const config = getCaptchaConfig();

  if (!config) {
    return;
  }

  if (!token) {
    throw new CaptchaValidationError('Complete the security check before starting payment.');
  }

  const requestBody = new URLSearchParams({
    secret: config.secretKey,
    response: token,
  });

  if (remoteIp) {
    requestBody.set('remoteip', remoteIp);
  }

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: requestBody.toString(),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    },
  );

  if (!response.ok) {
    throw new Error('Captcha verification is unavailable right now.');
  }

  const payload = (await response.json()) as TurnstileVerificationResult;

  if (!payload.success) {
    throw new CaptchaValidationError('Security check failed. Please try again.');
  }

  const expectedHostname = getTrustedSiteUrl().hostname;

  if (payload.hostname && payload.hostname !== expectedHostname) {
    throw new CaptchaValidationError('Security check was issued for the wrong hostname.');
  }
}

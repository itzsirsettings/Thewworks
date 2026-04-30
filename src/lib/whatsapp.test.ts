import { describe, expect, it } from 'vitest';
import { buildWhatsAppUrl, DEFAULT_WHATSAPP_MESSAGE, WHATSAPP_DISPLAY_NUMBER } from './whatsapp';

describe('whatsapp helpers', () => {
  it('builds the default WhatsApp URL with the canonical number', () => {
    expect(WHATSAPP_DISPLAY_NUMBER).toBe('08123986155');
    expect(buildWhatsAppUrl()).toBe(
      `https://wa.me/2348123986155?text=${encodeURIComponent(DEFAULT_WHATSAPP_MESSAGE)}`,
    );
  });

  it('encodes custom messages safely', () => {
    expect(buildWhatsAppUrl('Hello & welcome')).toBe(
      'https://wa.me/2348123986155?text=Hello%20%26%20welcome',
    );
  });
});

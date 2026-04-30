const WHATSAPP_E164_NUMBER = '2348123986155';

export const WHATSAPP_DISPLAY_NUMBER = '08123986155';

export const DEFAULT_WHATSAPP_MESSAGE =
  'Hello, I would like to get a quote for a printing project from Thewworks ICT & Prints.';

export function buildWhatsAppUrl(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_E164_NUMBER}?text=${encodeURIComponent(message)}`;
}

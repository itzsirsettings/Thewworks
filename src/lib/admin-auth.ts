export function buildAdminRedirectUrl(origin: string) {
  return new URL('/admin', `${origin.replace(/\/$/, '')}/`).toString();
}

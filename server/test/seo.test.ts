// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  getApexRedirectUrl,
  getRouteSeo,
  injectRouteSeo,
  shouldNoIndexRequest,
} from '../lib/seo.js';

const htmlShell = `
<!doctype html>
<html lang="en">
  <head>
    <title>Old title</title>
    <meta name="description" content="Old description" />
    <meta name="keywords" content="old" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://thewworksict.com/" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Old title" />
    <meta property="og:description" content="Old description" />
    <meta property="og:url" content="https://thewworksict.com/" />
    <meta property="og:image" content="https://thewworksict.com/old.png" />
    <meta property="og:image:alt" content="Old image" />
    <meta name="twitter:site" content="@old" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Old title" />
    <meta name="twitter:description" content="Old description" />
    <meta name="twitter:image" content="https://thewworksict.com/old.png" />
    <meta name="twitter:image:alt" content="Old image" />
    <script type="application/ld+json">{"old":true}</script>
  </head>
  <body></body>
</html>`;

describe('server SEO helpers', () => {
  it('injects route-aware store metadata into the initial HTML shell', () => {
    const html = injectRouteSeo(htmlShell, '/store?reference=STK-test');

    expect(html).toContain('<title>Thewworks Store &amp; Quote Desk | Printing Services in Asaba</title>');
    expect(html).toContain('<link rel="canonical" href="https://thewworksict.com/store" />');
    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />');
    expect(html).not.toContain('name="twitter:site"');
    expect(html).toContain('"@type": "WebPage"');
  });

  it('keeps public routes indexable and private routes noindex', () => {
    expect(getRouteSeo('/').robots).toContain('index, follow');
    expect(getRouteSeo('/store').robots).toContain('index, follow');
    expect(shouldNoIndexRequest('/admin')).toBe(true);
    expect(shouldNoIndexRequest('/checkout/success')).toBe(true);
    expect(shouldNoIndexRequest('/store?trxref=abc')).toBe(true);
    expect(shouldNoIndexRequest('/sitemap.xml')).toBe(false);
    expect(shouldNoIndexRequest('/images/thewworks-logo.png')).toBe(false);
  });

  it('redirects www traffic to the canonical apex domain', () => {
    expect(getApexRedirectUrl('www.thewworksict.com', '/store')).toBe(
      'https://thewworksict.com/store',
    );
    expect(getApexRedirectUrl('thewworksict.com', '/store')).toBe('');
  });
});

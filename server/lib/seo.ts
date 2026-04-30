const SITE_ORIGIN = 'https://thewworksict.com';
const SITE_HOST = 'thewworksict.com';
const PUBLIC_ROBOTS =
  'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
const PRIVATE_ROBOTS = 'noindex, nofollow';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/images/thewworks-press-hero.png`;
const DEFAULT_IMAGE_ALT = 'Thewworks ICT & Prints production and branding showcase';

interface RouteSeo {
  title: string;
  description: string;
  keywords: string;
  canonicalPath: '/' | '/store' | string;
  ogType: 'website';
  image: string;
  imageAlt: string;
  robots: string;
}

const homeSeo = {
  title: 'Thewworks | ICT & Prints in Asaba, Delta State',
  description:
    'Thewworks ICT & Prints is a printing and branding studio in Asaba, Delta State. Order business cards, packaging, labels, banners, books, apparel prints, and brand design from Thewworks.',
  keywords:
    'thewworks, Thewworks ICT & Prints, Thewworks Asaba, printing press Asaba, print shop Delta State, business cards Asaba, custom packaging Nigeria, branded apparel Delta State, large format printing Asaba',
  canonicalPath: '/',
  ogType: 'website',
  image: DEFAULT_IMAGE,
  imageAlt: DEFAULT_IMAGE_ALT,
} satisfies Omit<RouteSeo, 'robots'>;

const storeSeo = {
  title: 'Thewworks Store & Quote Desk | Printing Services in Asaba',
  description:
    'Request a Thewworks print quote for business cards, packaging, labels, banners, books, apparel printing, and custom branded materials in Asaba.',
  keywords:
    'thewworks store, Thewworks quote desk, printing quote Asaba, business card quote Delta State, packaging quote Nigeria, custom print quote',
  canonicalPath: '/store',
  ogType: 'website',
  image: DEFAULT_IMAGE,
  imageAlt: DEFAULT_IMAGE_ALT,
} satisfies Omit<RouteSeo, 'robots'>;

function normalizePathname(pathname: string) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  const normalized = pathname.replace(/\/+$/, '');
  return normalized || '/';
}

function parseRequestUrl(originalUrl: string) {
  return new URL(originalUrl || '/', SITE_ORIGIN);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function jsonLdForRoute(seo: RouteSeo) {
  const canonicalUrl = `${SITE_ORIGIN}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: 'Thewworks ICT & Prints',
        url: `${SITE_ORIGIN}/`,
        logo: {
          '@type': 'ImageObject',
          '@id': `${SITE_ORIGIN}/#logo`,
          url: `${SITE_ORIGIN}/images/thewworks-logo.png`,
          contentUrl: `${SITE_ORIGIN}/images/thewworks-logo.png`,
          caption: 'Thewworks ICT & Prints Logo',
          inLanguage: 'en-NG',
          width: 1024,
          height: 1024,
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+2348123986155',
            contactType: 'customer service',
            areaServed: 'NG',
            availableLanguage: 'English',
          },
        ],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No. 5, Okelue Street, Opposite Wema Bank, by Nnebisi Road',
          addressLocality: 'Asaba',
          addressRegion: 'Delta State',
          addressCountry: 'NG',
          postalCode: '320211',
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        url: `${SITE_ORIGIN}/`,
        name: 'Thewworks ICT & Prints',
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        alternateName: ['Thewworks', 'Thewworks ICT', 'Thewworks Prints'],
        description:
          "Asaba's printing and branding studio for business cards, packaging, labels, banners, books, apparel printing, and brand design.",
        inLanguage: 'en-NG',
      },
      {
        '@type': ['LocalBusiness', 'ProfessionalService'],
        '@id': `${SITE_ORIGIN}/#business`,
        name: 'Thewworks ICT & Prints',
        alternateName: 'Thewworks',
        url: `${SITE_ORIGIN}/`,
        mainEntityOfPage: { '@id': `${SITE_ORIGIN}/#website` },
        image: [DEFAULT_IMAGE, `${SITE_ORIGIN}/images/thewworks-logo.png`],
        logo: { '@id': `${SITE_ORIGIN}/#logo` },
        description:
          'Thewworks ICT & Prints is a printing press and branding studio in Asaba, Delta State, Nigeria. The team produces business cards, brochures, custom packaging, labels, banners, books, apparel prints, corporate gifts, and brand design.',
        telephone: '+2348123986155',
        email: 'info@thewworks.com',
        priceRange: '$$$',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'No. 5, Okelue Street, Opposite Wema Bank, by Nnebisi Road',
          addressLocality: 'Asaba',
          addressRegion: 'Delta State',
          addressCountry: 'NG',
          postalCode: '320211',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 6.209122,
          longitude: 6.715226,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            opens: '08:00',
            closes: '18:00',
          },
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: 'Saturday',
            opens: '09:00',
            closes: '16:00',
          },
        ],
        hasMap:
          'https://www.google.com/maps/search/?api=1&query=Thewworks%20ICT%20%26%20Prints%2C%20No.%205%2C%20Okelue%20Street%2C%20Opposite%20Wema%20Bank%2C%20by%20Nnebisi%20Road%2C%20Asaba%2C%20Delta%20State%2C%20Nigeria',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+2348123986155',
          contactType: 'sales',
          areaServed: 'NG',
          availableLanguage: ['English'],
        },
        knowsAbout: [
          'Business Card Printing',
          'Digital Printing',
          'Offset Printing',
          'Product Packaging Design',
          'Custom Labels',
          'Large Format Banners',
          'Book Binding',
          'Corporate Apparel Printing',
          'Brand Identity Design',
        ],
        areaServed: [
          { '@type': 'City', name: 'Asaba' },
          { '@type': 'State', name: 'Delta State' },
          { '@type': 'Country', name: 'Nigeria' },
        ],
        makesOffer: {
          '@type': 'OfferCatalog',
          name: 'Thewworks print and branding services',
          itemListElement: [
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Business cards and stationery printing',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Custom packaging and label printing',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Large format banners and signage',
              },
            },
            {
              '@type': 'Offer',
              itemOffered: {
                '@type': 'Service',
                name: 'Apparel printing and branded merchandise',
              },
            },
          ],
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: seo.title,
        description: seo.description,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': `${SITE_ORIGIN}/#business` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: seo.image,
        },
        inLanguage: 'en-NG',
      },
    ],
  };
}

function replaceOrInsertHeadTag(html: string, pattern: RegExp, replacement: string) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html.replace(/<\/head>/i, `    ${replacement}\n  </head>`);
}

function removeHeadTag(html: string, pattern: RegExp) {
  return html.replace(pattern, '');
}

export function shouldNoIndexRequest(originalUrl: string) {
  const url = parseRequestUrl(originalUrl);
  const pathname = normalizePathname(url.pathname);

  if (
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.svg' ||
    pathname === '/browserconfig.xml' ||
    pathname.startsWith('/images/') ||
    pathname.startsWith('/assets/') ||
    pathname.endsWith('.mp4')
  ) {
    return false;
  }

  return (
    pathname.startsWith('/api') ||
    pathname === '/admin' ||
    pathname.startsWith('/admin/') ||
    pathname === '/checkout/success' ||
    pathname === '/checkout/cancel' ||
    url.searchParams.has('reference') ||
    url.searchParams.has('trxref') ||
    (pathname !== '/' && pathname !== '/store')
  );
}

export function getRouteSeo(originalUrl: string): RouteSeo {
  const url = parseRequestUrl(originalUrl);
  const pathname = normalizePathname(url.pathname);
  const routeSeo = pathname === '/store' ? storeSeo : homeSeo;

  return {
    ...routeSeo,
    robots: shouldNoIndexRequest(originalUrl) ? PRIVATE_ROBOTS : PUBLIC_ROBOTS,
  };
}

export function getApexRedirectUrl(hostHeader: string | undefined, originalUrl: string) {
  const host = (hostHeader || '').split(':')[0].toLowerCase();

  if (host !== `www.${SITE_HOST}`) {
    return '';
  }

  return `${SITE_ORIGIN}${originalUrl || '/'}`;
}

export function injectRouteSeo(html: string, originalUrl: string) {
  const seo = getRouteSeo(originalUrl);
  const canonicalUrl = `${SITE_ORIGIN}${seo.canonicalPath === '/' ? '/' : seo.canonicalPath}`;
  const jsonLd = JSON.stringify(jsonLdForRoute(seo), null, 2).replace(/</g, '\\u003c');

  let output = html;
  output = replaceOrInsertHeadTag(output, /<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(seo.title)}</title>`);
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+name=["']description["'][^>]*>/i,
    `<meta name="description" content="${escapeHtml(seo.description)}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+name=["']keywords["'][^>]*>/i,
    `<meta name="keywords" content="${escapeHtml(seo.keywords)}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+name=["']robots["'][^>]*>/i,
    `<meta name="robots" content="${escapeHtml(seo.robots)}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<link\s+rel=["']canonical["'][^>]*>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+property=["']og:type["'][^>]*>/i,
    `<meta property="og:type" content="${seo.ogType}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+property=["']og:title["'][^>]*>/i,
    `<meta property="og:title" content="${escapeHtml(seo.title)}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+property=["']og:description["'][^>]*>/i,
    `<meta property="og:description" content="${escapeHtml(seo.description)}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+property=["']og:url["'][^>]*>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+property=["']og:image["'][^>]*>/i,
    `<meta property="og:image" content="${seo.image}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+property=["']og:image:alt["'][^>]*>/i,
    `<meta property="og:image:alt" content="${escapeHtml(seo.imageAlt)}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+name=["']twitter:card["'][^>]*>/i,
    '<meta name="twitter:card" content="summary_large_image" />',
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+name=["']twitter:title["'][^>]*>/i,
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+name=["']twitter:description["'][^>]*>/i,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+name=["']twitter:image["'][^>]*>/i,
    `<meta name="twitter:image" content="${seo.image}" />`,
  );
  output = replaceOrInsertHeadTag(
    output,
    /<meta\s+name=["']twitter:image:alt["'][^>]*>/i,
    `<meta name="twitter:image:alt" content="${escapeHtml(seo.imageAlt)}" />`,
  );
  output = removeHeadTag(output, /\s*<meta\s+name=["']twitter:site["'][^>]*>\s*/i);
  output = replaceOrInsertHeadTag(
    output,
    /<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i,
    `<script type="application/ld+json">\n${jsonLd}\n    </script>`,
  );

  return output;
}

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = process.cwd();
const siteOrigin = 'https://thewworksict.com';

const readProjectFile = (...segments: string[]) =>
  readFileSync(path.join(projectRoot, ...segments), 'utf8');

const parseHtml = () =>
  new DOMParser().parseFromString(readProjectFile('index.html'), 'text/html');

const getMetaContent = (document: Document, selector: string) =>
  document.querySelector(selector)?.getAttribute('content');

describe('static SEO shell', () => {
  it('ships an indexable branded homepage shell', () => {
    const document = parseHtml();

    expect(document.title.toLowerCase()).toContain('thewworks');
    expect(getMetaContent(document, 'meta[name="description"]')?.toLowerCase()).toContain(
      'thewworks',
    );
    expect(getMetaContent(document, 'meta[name="robots"]')).toContain('index');
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute('href')).toBe(
      `${siteOrigin}/`,
    );
    expect(document.querySelector('link[rel="sitemap"]')?.getAttribute('href')).toBe(
      '/sitemap.xml',
    );
    expect(getMetaContent(document, 'meta[property="og:image:alt"]')).toContain('Thewworks');
    expect(getMetaContent(document, 'meta[name="twitter:image:alt"]')).toContain('Thewworks');
    expect(document.querySelector('meta[name="twitter:site"]')).toBeNull();
  });

  it('contains parseable JSON-LD with organization, website, local business, and webpage nodes', () => {
    const document = parseHtml();
    const scripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]'));

    expect(scripts.length).toBeGreaterThan(0);

    const graph = scripts.flatMap((script) => {
      const parsed = JSON.parse(script.textContent || '{}') as { '@graph'?: unknown[] };
      return parsed['@graph'] || [];
    }) as Array<Record<string, unknown>>;

    const graphText = JSON.stringify(graph).toLowerCase();
    const business = graph.find((node) => {
      const type = node['@type'];
      return Array.isArray(type) && type.includes('LocalBusiness');
    });

    expect(graph.some((node) => node['@type'] === 'Organization')).toBe(true);
    expect(graph.some((node) => node['@type'] === 'WebSite')).toBe(true);
    expect(graph.some((node) => node['@type'] === 'WebPage')).toBe(true);
    expect(business).toBeTruthy();
    expect(graphText).toContain('thewworks');
    expect(graphText).toContain('asaba');
    expect(graphText).toContain('printing');
    expect(graphText).not.toContain('sameas');
  });

  it('keeps robots.txt and sitemap.xml aligned with public pages', () => {
    const robots = readProjectFile('public', 'robots.txt');
    const sitemap = new DOMParser().parseFromString(
      readProjectFile('public', 'sitemap.xml'),
      'application/xml',
    );
    const publicPageUrls = Array.from(sitemap.getElementsByTagName('url')).map(
      (url) => url.getElementsByTagName('loc')[0]?.textContent,
    );

    expect(robots).toContain('Allow: /');
    expect(robots).toContain('Disallow: /admin');
    expect(robots).toContain('Disallow: /admin/');
    expect(robots).toContain(`Sitemap: ${siteOrigin}/sitemap.xml`);
    expect(publicPageUrls).toContain(`${siteOrigin}/`);
    expect(publicPageUrls).toContain(`${siteOrigin}/store`);
  });
});

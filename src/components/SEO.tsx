import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../config';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterHandle?: string;
  keywords?: string;
}

const SEO = ({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = 'website',
  twitterHandle = '@thewworks',
  keywords,
}: SEOProps) => {
  const location = useLocation();
  const currentUrl = `https://thewworksict.com${location.pathname}${location.search}`;

  useEffect(() => {
    // Title
    const finalTitle = title ? `${title} | Thewworks` : siteConfig.title;
    document.title = finalTitle;

    // Description
    const finalDescription = description || siteConfig.description;
    updateMetaTag('name', 'description', finalDescription);
    updateMetaTag('property', 'og:description', ogDescription || finalDescription);
    updateMetaTag('name', 'twitter:description', ogDescription || finalDescription);

    // Keywords
    if (keywords) {
      updateMetaTag('name', 'keywords', keywords);
    }

    // Canonical
    const finalCanonical = canonical || currentUrl;
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (linkCanonical) {
      linkCanonical.setAttribute('href', finalCanonical);
    } else {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      linkCanonical.setAttribute('href', finalCanonical);
      document.head.appendChild(linkCanonical);
    }

    // Open Graph
    updateMetaTag('property', 'og:title', ogTitle || finalTitle);
    updateMetaTag('property', 'og:url', finalCanonical);
    updateMetaTag('property', 'og:type', ogType);
    if (ogImage) {
      updateMetaTag('property', 'og:image', ogImage);
    }

    // Twitter
    updateMetaTag('name', 'twitter:title', ogTitle || finalTitle);
    updateMetaTag('name', 'twitter:site', twitterHandle);
    if (ogImage) {
      updateMetaTag('name', 'twitter:image', ogImage);
    }

  }, [
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterHandle,
    keywords,
    location,
    currentUrl,
  ]);

  return null;
};

function updateMetaTag(attr: 'name' | 'property', key: string, content: string) {
  if (!content) return;
  let element = document.querySelector(`meta[${attr}="${key}"]`);
  if (element) {
    element.setAttribute('content', content);
  } else {
    element = document.createElement('meta');
    element.setAttribute(attr, key);
    element.setAttribute('content', content);
    document.head.appendChild(element);
  }
}

export default SEO;

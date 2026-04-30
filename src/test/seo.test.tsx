import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SEO from '../components/SEO';

describe('SEO Component', () => {
  beforeEach(() => {
    // Clear head tags before each test
    document.head.innerHTML = '';
    document.title = '';
  });

  it('updates document title correctly', () => {
    render(
      <MemoryRouter>
        <SEO title="Test Page" />
      </MemoryRouter>
    );
    expect(document.title).toBe('Test Page | Thewworks');
  });

  it('updates meta description correctly', () => {
    render(
      <MemoryRouter>
        <SEO description="Custom description for testing" />
      </MemoryRouter>
    );
    const meta = document.querySelector('meta[name="description"]');
    expect(meta?.getAttribute('content')).toBe('Custom description for testing');
  });

  it('sets canonical URL correctly', () => {
    render(
      <MemoryRouter initialEntries={['/store']}>
        <SEO />
      </MemoryRouter>
    );
    const link = document.querySelector('link[rel="canonical"]');
    expect(link?.getAttribute('href')).toContain('https://thewworksict.com/store');
  });

  it('handles keywords correctly', () => {
    render(
      <MemoryRouter>
        <SEO keywords="print, asaba, thewworks" />
      </MemoryRouter>
    );
    const meta = document.querySelector('meta[name="keywords"]');
    expect(meta?.getAttribute('content')).toBe('print, asaba, thewworks');
  });
});

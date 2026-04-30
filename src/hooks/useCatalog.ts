import { useState, useEffect } from 'react';
import {
  marketplaceCategories,
  marketplaceProducts,
  type MarketplaceCategory,
  type StoreProduct,
} from '../lib/marketplace-data';
import { supabase } from '../lib/supabase';

const legacyCatalogTerms = [
  'sofa',
  'bed',
  'refrigerator',
  'rug',
  'dining',
  'appliance',
  'living room',
  'bedroom',
];

const shouldUseThewworksCatalog = (products: StoreProduct[]) => {
  if (products.length === 0) {
    return true;
  }

  return products.some((product) => {
    const searchable = `${product.name} ${product.category} ${product.summary}`.toLowerCase();
    return legacyCatalogTerms.some((term) => searchable.includes(term));
  });
};

export function useCatalog() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [categories, setCategories] = useState<MarketplaceCategory[]>([]);
  const [suppliers, setSuppliers] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [
          { data: productsData, error: productsError },
          { data: categoriesData, error: categoriesError },
          { data: suppliersData, error: suppliersError }
        ] = await Promise.all([
          supabase
            .from('products')
            .select(`
              *,
              gallery:product_galleries(*),
              tags:product_tags(tag)
            `),
          supabase.from('categories').select('*'),
          supabase.from('suppliers').select('*')
        ]);

        if (productsError) throw productsError;
        if (categoriesError) throw categoriesError;
        if (suppliersError) throw suppliersError;

        if (active) {
          const formattedProducts = (productsData || []).map((p: Record<string, unknown>) => ({
            ...p,
            gallery: ((p.gallery as Record<string, unknown>[] | null) || []).map((g: Record<string, unknown>) => ({
              id: g.id,
              image: g.image,
              title: g.title,
              caption: g.caption,
              objectPosition: g.object_position,
              imageTransform: g.image_transform
            })),
            tags: ((p.tags as Record<string, unknown>[] | null) || []).map((t: Record<string, unknown>) => t.tag),
            leadTime: p.lead_time
          })) as StoreProduct[];

          if (shouldUseThewworksCatalog(formattedProducts)) {
            setProducts(marketplaceProducts);
            setCategories(marketplaceCategories);
            setSuppliers([]);
            setError(null);
            return;
          }

          setProducts(formattedProducts);
          setCategories(categoriesData as MarketplaceCategory[]);
          setSuppliers(suppliersData || []);
          setError(null);
        }
      } catch (err: unknown) {
        console.error('Supabase fetch error:', err);
        if (active) {
          const errorMessage = err instanceof Error ? err.message : String(err);
          setProducts(marketplaceProducts);
          setCategories(marketplaceCategories);
          setSuppliers([]);
          setError(errorMessage || 'An error occurred loading the catalog');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    const channel = supabase
      .channel('catalog-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        () => {
          if (active) load();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'product_galleries' },
        () => {
          if (active) load();
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, categories, suppliers, loading, error };
}

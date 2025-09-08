import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  slug: string;
}

export interface Product {
  id: string;
  title: string;
  description: string | null;
  images: string[] | null;
  pdfs: string[] | null;
  category_id: string;
  slug: string;
  category?: Category;
}

export interface Variant {
  id: string;
  product_id: string;
  type: string | null;
  size: string | null;
  specifications: any;
  drawing_url: string | null;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: () => window.location.reload() };
}

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let query = supabase
          .from('products')
          .select(`
            *,
            category:categories(*)
          `)
          .order('title');

        if (categorySlug) {
          query = query.eq('categories.slug', categorySlug);
        }

        const { data, error } = await query;

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug]);

  return { products, loading, error, refetch: () => window.location.reload() };
}

export function useProduct(productSlug: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(*)
          `)
          .eq('slug', productSlug)
          .single();

        if (productError) throw productError;

        const { data: variantsData, error: variantsError } = await supabase
          .from('variants')
          .select('*')
          .eq('product_id', productData.id)
          .order('type, size');

        if (variantsError) throw variantsError;

        setProduct(productData);
        setVariants(variantsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productSlug]);

  return { product, variants, loading, error };
}
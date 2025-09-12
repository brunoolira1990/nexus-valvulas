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
  category_id: string;
  slug: string;
  category?: Category;
  images?: { url: string; position: number }[];
  pdfs?: { url: string; position: number }[];
}

export interface Variant {
  id: string;
  product_id: string;
  type: string;
  size: string;
  specifications?: any;
  drawing_url?: string | null;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
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

  useEffect(() => {
    fetchCategories();
  }, []);

  return { categories, loading, error, refetch: fetchCategories };
}

export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          images:product_images(url, position),
          pdfs:product_pdfs(url, position)
        `)
        .order('title');

      if (categorySlug) {
        query = query.eq('categories.slug', categorySlug);
      }

      const { data, error } = await query;

      if (error) throw error;
      const normalized = (data || []).map((p: any) => ({
        ...p,
        images: (p.images || []).sort((a: any, b: any) => a.position - b.position),
        pdfs: (p.pdfs || []).sort((a: any, b: any) => a.position - b.position),
      }));
      setProducts(normalized);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [categorySlug]);

  return { products, loading, error, refetch: fetchProducts };
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
            category:categories(*),
            images:product_images(url, position),
            pdfs:product_pdfs(url, position)
          `)
          .eq('slug', productSlug)
          .single();

        if (productError) throw productError;

        const { data: variantsData, error: variantsError } = await supabase
          .from('variants')
          .select(`*`)
          .eq('product_id', productData.id)
          .order('type')
          .order('size');

        if (variantsError) throw variantsError;

        const normalizedProduct = {
          ...productData,
          images: (productData.images || []).sort((a: any, b: any) => a.position - b.position),
          pdfs: (productData.pdfs || []).sort((a: any, b: any) => a.position - b.position),
        } as Product;
        const normalizedVariants = (variantsData || []).map((v: any) => ({
          id: v.id,
          product_id: v.product_id,
          type: v.type,
          size: v.size,
          specifications: v.specifications || null,
          drawing_url: v.drawing_url || null,
        }));
        
        setProduct(normalizedProduct);
        setVariants(normalizedVariants);
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
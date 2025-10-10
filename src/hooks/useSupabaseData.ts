import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export interface Category {
  id: string;
  name: string;
  description: string | null;
  image?: string | null;
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
  position: number;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error('Erro ao buscar categorias');
  const data = await res.json();
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

// Mantemos a função de produtos baseada no backend por ora.
export function useProducts(categorySlug?: string) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/products${categorySlug ? `?category=${categorySlug}` : ''}`);
      if (!res.ok) throw new Error('Erro ao buscar produtos');
      const data = await res.json();
      setProducts(data || []);
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
        const res = await fetch(`${API_BASE}/products/${productSlug}`);
        if (!res.ok) throw new Error('Erro ao buscar produto');
        const data = await res.json();
        setProduct(data.product || null);
        setVariants(data.variants || []);
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
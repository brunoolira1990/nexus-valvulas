import { useMemo, useState, useEffect } from "react";
import type { ProductType, ProductVariant, ProductSize } from "@/mocks/products";

interface UseProductVariantsReturn {
  /** Tipo selecionado (variant) */
  selectedType: string | null;
  /** Tamanho selecionado */
  selectedSize: string | null;
  /** Imagens disponíveis para a seleção atual */
  availableImages: string[];
  /** Opções de tipos disponíveis */
  typeOptions: Array<{ value: string; label: string; description?: string }>;
  /** Opções de tamanhos disponíveis */
  sizeOptions: Array<{ value: string; label: string; description?: string }>;
  /** Variant selecionado */
  selectedVariant: ProductVariant | null;
  /** Size selecionado */
  selectedSizeData: ProductSize | null;
  /** Função para alterar tipo */
  setSelectedType: (type: string) => void;
  /** Função para alterar tamanho */
  setSelectedSize: (size: string) => void;
  /** Se o produto tem variações */
  hasVariants: boolean;
  /** Se o produto tem apenas tamanhos (sem variants) */
  hasSizesOnly: boolean;
  /** Se o produto é simples (sem variants nem sizes) */
  isSimple: boolean;
}

/**
 * Hook para gerenciar variações de produtos
 * 
 * Gerencia a lógica de seleção de tipos e tamanhos,
 * retornando as imagens corretas conforme a seleção.
 */
export function useProductVariants(product: ProductType): UseProductVariantsReturn {
  // Estado inicial: primeiro tipo e primeiro tamanho disponível
  const getInitialType = (): string | null => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].type;
    }
    return null;
  };

  const getInitialSize = (): string | null => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].sizes[0]?.size || null;
    }
    if (product.sizes && product.sizes.length > 0) {
      return product.sizes[0].size;
    }
    return null;
  };

  const [selectedType, setSelectedTypeState] = useState<string | null>(() => getInitialType());
  const [selectedSize, setSelectedSizeState] = useState<string | null>(() => getInitialSize());

  // Reset quando produto muda
  useEffect(() => {
    const newType = getInitialType();
    const newSize = getInitialSize();
    setSelectedTypeState(newType);
    setSelectedSizeState(newSize);
  }, [product.id, product.variants, product.sizes]);

  // Opções de tipos
  const typeOptions = useMemo(() => {
    if (!product.variants) return [];
    return product.variants.map((v) => ({
      value: v.type,
      label: v.type,
      description: v.description,
    }));
  }, [product.variants]);

  // Opções de tamanhos baseado no tipo selecionado
  const sizeOptions = useMemo(() => {
    if (product.variants && selectedType) {
      const variant = product.variants.find((v) => v.type === selectedType);
      return (
        variant?.sizes.map((s) => ({
          value: s.size,
          label: s.size,
          description: s.description,
        })) || []
      );
    }
    if (product.sizes) {
      return product.sizes.map((s) => ({
        value: s.size,
        label: s.size,
        description: s.description,
      }));
    }
    return [];
  }, [product, selectedType]);

  // Variant selecionado
  const selectedVariant = useMemo(() => {
    if (product.variants && selectedType) {
      return product.variants.find((v) => v.type === selectedType) || null;
    }
    return null;
  }, [product.variants, selectedType]);

  // Size selecionado
  const selectedSizeData = useMemo(() => {
    if (selectedVariant && selectedSize) {
      return selectedVariant.sizes.find((s) => s.size === selectedSize) || null;
    }
    if (product.sizes && selectedSize) {
      return product.sizes.find((s) => s.size === selectedSize) || null;
    }
    return null;
  }, [selectedVariant, product.sizes, selectedSize]);

  // Imagens disponíveis
  const availableImages = useMemo(() => {
    const images: string[] = [];

    // Se tem variants e tipo selecionado
    if (product.variants && selectedType && selectedSize) {
      const variant = product.variants.find((v) => v.type === selectedType);
      const size = variant?.sizes.find((s) => s.size === selectedSize);
      if (size?.image) {
        images.push(size.image);
      }
    }
    // Se tem apenas sizes
    else if (product.sizes && selectedSize) {
      const size = product.sizes.find((s) => s.size === selectedSize);
      if (size?.image) {
        images.push(size.image);
      }
    }
    // Imagem padrão do produto
    else if (product.image) {
      images.push(product.image);
    }

    return images;
  }, [product, selectedType, selectedSize]);

  // Função para alterar tipo (reseta tamanho)
  const setSelectedType = (type: string) => {
    setSelectedTypeState(type);
    const variant = product.variants?.find((v) => v.type === type);
    setSelectedSizeState(variant?.sizes[0]?.size || null);
  };

  // Função para alterar tamanho
  const setSelectedSize = (size: string) => {
    setSelectedSizeState(size);
  };

  const hasVariants = Boolean(product.variants && product.variants.length > 0);
  const hasSizesOnly = Boolean(!product.variants && product.sizes && product.sizes.length > 0);
  const isSimple = Boolean(!product.variants && !product.sizes);

  return {
    selectedType,
    selectedSize,
    availableImages,
    typeOptions,
    sizeOptions,
    selectedVariant,
    selectedSizeData,
    setSelectedType,
    setSelectedSize,
    hasVariants,
    hasSizesOnly,
    isSimple,
  };
}


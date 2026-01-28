import { useState, useMemo, useEffect } from "react";
import type { Product, ProductVariant } from "@/data/products";
import { 
  getProductImage, 
  getAvailableSizes, 
  getVariantById,
  isComplexProduct,
  isIntermediateProduct,
  isSimpleProduct
} from "@/data/products";
import { sortSizes } from "@/lib/sizeUtils";

interface UseProductSelectionReturn {
  // Estado atual
  selectedVariantId: string | null;
  selectedSize: string | null;
  currentImage: string | undefined;
  
  // Informações do produto
  productType: "complex" | "intermediate" | "simple";
  availableVariants: ProductVariant[];
  availableSizes: string[];
  
  // Funções de controle
  setSelectedVariant: (variantId: string) => void;
  setSelectedSize: (size: string) => void;
  
  // Dados selecionados
  selectedVariant: ProductVariant | null;
  
  // Flags
  hasVariants: boolean;
  hasSizes: boolean;
  isSimple: boolean;
}

/**
 * Hook unificado para gerenciar seleção de produtos
 * Suporta os 3 cenários: Complexo, Intermediário e Simples
 */
export function useProductSelection(product: Product): UseProductSelectionReturn {
  // Determinar tipo de produto (cálculo simples, sem hook)
  let productType: "complex" | "intermediate" | "simple";
  if (isComplexProduct(product)) productType = "complex";
  else if (isIntermediateProduct(product)) productType = "intermediate";
  else if (isSimpleProduct(product)) productType = "simple";
  else productType = "simple"; // fallback

  // Estado inicial baseado no tipo
  const getInitialVariant = (): string | null => {
    return null;
  };

  const getInitialSize = (): string | null => {
    if (productType === "complex") {
      // Em produtos complexos, o usuário deve escolher a variante antes de ver tamanhos
      return null;
    }
    if (productType === "intermediate" && product.sizes) {
      const sorted = sortSizes(Object.keys(product.sizes));
      return sorted[0] || null;
    }
    return null;
  };

  const [selectedVariantId, setSelectedVariantIdState] = useState<string | null>(getInitialVariant);
  const [selectedSize, setSelectedSizeState] = useState<string | null>(getInitialSize);

  // Reset quando produto muda
  useEffect(() => {
    setSelectedVariantIdState(getInitialVariant());
    setSelectedSizeState(getInitialSize());
  }, [product.id]);

  // Variantes disponíveis (apenas para produtos complexos)
  const availableVariants = useMemo(() => {
    return product.variants || [];
  }, [product.variants]);

  // Tamanhos disponíveis
  const availableSizes = useMemo(() => {
    return getAvailableSizes(product, selectedVariantId || undefined);
  }, [product, selectedVariantId]);

  // Variante selecionada
  const selectedVariant = useMemo(() => {
    if (selectedVariantId && product.variants) {
      return getVariantById(product, selectedVariantId) || null;
    }
    return null;
  }, [product, selectedVariantId]);

  // Imagem atual
  const currentImage = useMemo(() => {
    return getProductImage(
      product,
      selectedVariantId || undefined,
      selectedSize || undefined
    );
  }, [product, selectedVariantId, selectedSize]);

  // Função para alterar variante (reseta tamanho)
  const setSelectedVariant = (variantId: string) => {
    setSelectedVariantIdState(variantId);
    const variant = getVariantById(product, variantId);
    if (variant?.sizes) {
      const sorted = sortSizes(Object.keys(variant.sizes));
      setSelectedSizeState(sorted[0] || null);
    } else {
      setSelectedSizeState(null);
    }
  };

  // Função para alterar tamanho
  const setSelectedSize = (size: string) => {
    setSelectedSizeState(size);
  };

  return {
    selectedVariantId,
    selectedSize,
    currentImage,
    productType,
    availableVariants,
    availableSizes,
    setSelectedVariant,
    setSelectedSize,
    selectedVariant,
    hasVariants: productType === "complex",
    hasSizes: productType === "complex" || productType === "intermediate",
    isSimple: productType === "simple",
  };
}


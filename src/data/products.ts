/**
 * Estrutura de dados flexível para produtos
 * 
 * Suporta 3 cenários:
 * 1. COMPLEXO: Tipo → Tamanho → Imagem (ex: Válvula Esfera)
 * 2. INTERMEDIÁRIO: Tamanho → Imagem (ex: Válvula Gaveta)
 * 3. SIMPLES: Imagem fixa (ex: Acessórios/Filtros)
 */

import { sortSizes } from "@/lib/sizeUtils";

/**
 * Variante de produto (Tipo)
 * Usado no cenário COMPLEXO
 */
export type ProductVariant = {
  id: string;
  name: string; // Ex: "Tripartida 300# Passagem Reduzida"
  description?: string;
  /** Tamanhos disponíveis para este tipo (chave = tamanho, valor = URL da imagem) */
  sizes?: Record<string, string>;
  /** Imagem única para variantes que não têm tamanhos */
  singleImage?: string;
};

/**
 * Produto principal
 * Suporta os 3 cenários através de campos opcionais
 */
export type Product = {
  id: string;
  title: string; // Ex: "Válvula de Esfera"
  description: string;
  slug: string; // URL amigável
  
  /** 
   * CASO 3 (SIMPLES): Imagem fixa quando não há variants nem sizes
   * Também usado como imagem padrão/fallback
   */
  image?: string;
  
  /** 
   * CASO 1 (COMPLEXO): Array de tipos/variantes
   * Cada variante pode ter seus próprios tamanhos
   */
  variants?: ProductVariant[];
  
  /** 
   * CASO 2 (INTERMEDIÁRIO): Tamanhos diretos quando não há variants
   * Chave = Tamanho, Valor = URL da Imagem
   */
  sizes?: Record<string, string>;
  
  /** Especificações técnicas adicionais */
  specifications?: Record<string, string>;
  
  /** Aplicações recomendadas */
  applications?: string[];
  
  /** Normas técnicas aplicáveis */
  standards?: string[];
};

/**
 * Categoria de produtos
 */
export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  products: Product[]; // Produtos da categoria
};

/**
 * Dados das categorias e produtos
 */
export const categories: ProductCategory[] = [
  {
    id: '1',
    name: 'Válvulas Industriais',
    slug: 'valvulas-industriais',
    description: 'Linha completa de válvulas para aplicações industriais de alta performance.',
    image: '/imagens/valvulas.png',
    products: [
      {
        id: 'valvula-esfera',
        title: 'Válvula de Esfera',
        slug: 'valvula-esfera',
        description: 'Válvulas de esfera para controle de fluxo em sistemas industriais. Alta durabilidade e confiabilidade. Ideal para aplicações que exigem controle preciso e vedação hermética.',
        image: '/imagens/valvulas-industriais/valvula_esfera.png',
        specifications: {
          'Pressão Máxima': '150 PSI',
          'Temperatura de Operação': '-20°C a 200°C',
          'Tipo de Conexão': 'Rosqueada / Flangeada',
          'Vedação': 'Teflon (PTFE)',
        },
        applications: [
          'Refinarias de petróleo',
          'Indústria química',
          'Siderúrgicas',
          'Sistemas de água e esgoto',
          'Indústria alimentícia',
        ],
        standards: ['ASME B16.34', 'API 600', 'ISO 5211'],
        variants: [
          {
            id: 'aco-carbono',
            name: 'Aço Carbono',
            description: 'Ideal para aplicações gerais com boa relação custo-benefício.',
            sizes: {
              '1/2"': '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1-2.jpg',
              '1"': '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1.jpg',
              '2"': '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-2.jpg',
            }
          },
          {
            id: 'inox',
            name: 'Inox',
            description: 'Resistente à corrosão, ideal para ambientes agressivos.',
            sizes: {
              '1/2"': '/imagens/valvulas-industriais/valvula-esfera-inox-1-2.jpg',
              '1"': '/imagens/valvulas-industriais/valvula-esfera-inox-1.jpg',
              '2"': '/imagens/valvulas-industriais/valvula-esfera-inox-2.jpg',
            }
          },
          {
            id: 'latao',
            name: 'Latão',
            description: 'Excelente para aplicações residenciais e comerciais.',
            sizes: {
              '1/2"': '/imagens/valvulas-industriais/valvula-esfera-latao-1-2.jpg',
              '3/4"': '/imagens/valvulas-industriais/valvula-esfera-latao-3-4.jpg',
            }
          }
        ]
      },
      {
        id: 'valvula-gaveta',
        title: 'Válvula de Gaveta',
        slug: 'valvula-gaveta',
        description: 'Válvulas de gaveta para controle de fluxo em sistemas de alta pressão.',
        image: '/imagens/valvulas-industriais/valvula_gaveta.jpg',
        specifications: {
          'Pressão Máxima': '300 PSI',
          'Temperatura': '-29°C a 425°C',
          'Tipo de Operação': 'Volante / Atuador',
          'Vedação': 'Metal-to-Metal',
        },
        applications: [
          'Refinarias de petróleo',
          'Indústria petroquímica',
          'Sistemas de alta pressão',
        ],
        standards: ['ASME B16.34', 'API 600'],
        variants: [
          {
            id: 'aco-carbono',
            name: 'Aço Carbono',
            sizes: {
              '2"': '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-2.jpg',
              '3"': '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-3.jpg',
              '4"': '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-4.jpg',
            }
          },
          {
            id: 'inox',
            name: 'Inox',
            sizes: {
              '2"': '/imagens/valvulas-industriais/valvula-gaveta-inox-2.jpg',
              '3"': '/imagens/valvulas-industriais/valvula-gaveta-inox-3.jpg',
            }
          }
        ]
      },
      {
        id: 'valvula-retencao',
        title: 'Válvula de Retenção',
        slug: 'valvula-retencao',
        description: 'Válvulas de retenção para prevenir refluxo em sistemas de bombeamento.',
        image: '/imagens/valvulas-industriais/valvula_retencao.png',
        sizes: {
          '1"': '/imagens/valvulas-industriais/valvula-retencao-1.jpg',
          '2"': '/imagens/valvulas-industriais/valvula-retencao-2.jpg',
          '3"': '/imagens/valvulas-industriais/valvula-retencao-3.jpg',
        }
      },
      {
        id: 'valvula-borboleta',
        title: 'Válvula de Borboleta',
        slug: 'valvula-borboleta',
        description: 'Válvulas de borboleta para controle de fluxo em sistemas de alta pressão.',
        image: '/imagens/valvulas-industriais/valvula_borboleta.png',
        sizes: {
          '1"': '/imagens/valvulas-industriais/valvula-borboleta-1.jpg',
          '2"': '/imagens/valvulas-industriais/valvula-borboleta-2.jpg',
          '3"': '/imagens/valvulas-industriais/valvula-borboleta-3.jpg',
        }
      }
    ]
  },
  {
    id: '2',
    name: 'Conexões Tubulares',
    slug: 'conexoes-tubulares',
    description: 'Conexões e acessórios para sistemas de tubulação industrial.',
    image: '/imagens/conexoes.png',
    products: [
      {
        id: 'flanges',
        title: 'Flanges',
        slug: 'flanges',
        description: 'Flanges para conexão de tubulações industriais.',
        image: '/imagens/flanges.png'
      },
      {
        id: 'tes-90',
        title: 'Tês 90',
        slug: 'tes-90',
        description: 'Tês e reduções para sistemas de tubulação.',
        variants: [
          {
            id: 'aco-carbono',
            name: 'Aço Carbono',
            sizes: {
              '1" x 1/2"': '/imagens/conexoes-tubulares/te-90/te-reducao-aco-1x1-2.jpg',
              '2" x 1"': '/imagens/conexoes-tubulares/te-90/te-reducao-aco-2x1.jpg',
            }
          }
        ]
      }
    ]
  }
];

/**
 * Funções auxiliares para buscar categorias
 */
export function getCategories(): ProductCategory[] {
  return categories;
}

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return categories.find(cat => cat.slug === slug);
}

/**
 * Funções auxiliares para buscar produtos
 */
export function getAllProducts(categorySlug?: string): Product[] {
  if (categorySlug) {
    const category = getCategoryBySlug(categorySlug);
    return category?.products || [];
  }
  return categories.flatMap(cat => cat.products);
}

/**
 * Funções auxiliares para identificar o tipo de produto
 */

/**
 * Verifica se o produto é COMPLEXO (tem variants)
 */
export function isComplexProduct(product: Product): boolean {
  return Boolean(product.variants && product.variants.length > 0);
}

/**
 * Verifica se o produto é INTERMEDIÁRIO (tem sizes, mas não variants)
 */
export function isIntermediateProduct(product: Product): boolean {
  return Boolean(
    !product.variants && 
    product.sizes && 
    Object.keys(product.sizes).length > 0
  );
}

/**
 * Verifica se o produto é SIMPLES (apenas image)
 */
export function isSimpleProduct(product: Product): boolean {
  return Boolean(
    !product.variants && 
    !product.sizes && 
    product.image
  );
}


/**
 * Busca variante por ID dentro de um produto
 */
export function getVariantById(product: Product, variantId: string): ProductVariant | undefined {
  if (!product.variants) return undefined;
  return product.variants.find(v => v.id === variantId);
}

/**
 * Obtém todos os tamanhos disponíveis para um produto
 * Funciona para produtos INTERMEDIÁRIOS e COMPLEXOS
 * Retorna ordenado numericamente por polegadas
 */
export function getAvailableSizes(product: Product, variantId?: string): string[] {
  let sizes: string[] = [];
  
  // CASO 2: INTERMEDIÁRIO - sizes diretos
  if (product.sizes) {
    sizes = Object.keys(product.sizes);
  }
  
  // CASO 1: COMPLEXO - sizes da variante
  if (product.variants && variantId) {
    const variant = getVariantById(product, variantId);
    if (variant?.sizes) {
      sizes = Object.keys(variant.sizes);
    }
  }
  
  // Ordenar numericamente por polegadas
  if (sizes.length > 0) {
    return sortSizes(sizes);
  }
  
  return [];
}

/**
 * Obtém a URL da imagem para um produto
 * Suporta todos os 3 cenários
 */
export function getProductImage(
  product: Product, 
  variantId?: string, 
  size?: string
): string | undefined {
  // CASO 1: COMPLEXO - Tipo → Tamanho → Imagem
  if (product.variants && variantId && size) {
    const variant = getVariantById(product, variantId);
    if (variant?.sizes) {
      return variant.sizes[size];
    }
    // Se variante tem singleImage (sem tamanhos)
    if (variant?.singleImage) {
      return variant.singleImage;
    }
  }
  
  // CASO 2: INTERMEDIÁRIO - Tamanho → Imagem
  if (product.sizes && size) {
    return product.sizes[size];
  }
  
  // CASO 3: SIMPLES - Imagem fixa
  if (product.image) {
    return product.image;
  }
  
  return undefined;
}

/**
 * Obtém a primeira imagem disponível de um produto (para listagens)
 * Prioridade: image do produto > primeira variant/size > primeira size
 */
export function getProductDisplayImage(product: Product): string | undefined {
  // PRIORIDADE 1: Imagem do produto (se existir, sempre usa esta)
  if (product.image) {
    return product.image;
  }
  
  // PRIORIDADE 2: CASO 1 - COMPLEXO - primeira variante, menor tamanho (ordenado)
  if (product.variants && product.variants.length > 0) {
    const firstVariant = product.variants[0];
    if (firstVariant.sizes) {
      const sorted = sortSizes(Object.keys(firstVariant.sizes));
      const firstSize = sorted[0];
      return firstVariant.sizes[firstSize];
    }
    if (firstVariant.singleImage) {
      return firstVariant.singleImage;
    }
  }
  
  // PRIORIDADE 3: CASO 2 - INTERMEDIÁRIO - menor tamanho (ordenado)
  if (product.sizes) {
    const sorted = sortSizes(Object.keys(product.sizes));
    const firstSize = sorted[0];
    return product.sizes[firstSize];
  }
  
  return undefined;
}

/**
 * Busca produto por slug dentro de uma categoria
 */
export function getProductBySlug(categorySlug: string, productSlug: string): Product | undefined {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;
  return category.products.find(p => p.slug === productSlug);
}

/**
 * Busca produto por ID (procura em todas as categorias)
 */
export function getProductById(id: string): Product | undefined {
  for (const category of categories) {
    const product = category.products.find(p => p.id === id);
    if (product) return product;
  }
  return undefined;
}

/**
 * Obtém o número total de variações disponíveis
 */
export function getProductVariationsCount(product: Product): number {
  if (product.variants) {
    return product.variants.reduce((total, variant) => {
      return total + (variant.sizes ? Object.keys(variant.sizes).length : 0);
    }, 0);
  }
  if (product.sizes) {
    return Object.keys(product.sizes).length;
  }
  return 0;
}


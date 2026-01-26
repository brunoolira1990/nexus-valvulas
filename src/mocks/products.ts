/**
 * Produtos Mockados
 * 
 * Estrutura hierárquica:
 * - Categoria
 *   - Tipo de Produto
 *     - Variants (type + sizes)
 *       - Cada size possui sua própria imagem
 */

export interface ProductSize {
  size: string;
  image: string;
  description?: string;
}

export interface ProductVariant {
  type: string; // Ex: "Aço Carbono", "Inox", "Latão"
  sizes: ProductSize[];
  description?: string;
}

export interface ProductType {
  id: string;
  name: string;
  slug: string;
  description: string;
  /** Imagem principal do produto (usada quando não há variants/sizes) */
  image?: string;
  /** Variantes do produto (ex: Aço Carbono, Inox, Latão) */
  variants?: ProductVariant[];
  /** Tamanhos diretos (quando produto não tem variants, mas tem sizes) */
  sizes?: ProductSize[]; 
  /** Especificações técnicas adicionais */
  specifications?: Record<string, string>;
  /** Aplicações recomendadas */
  applications?: string[];
  /** Normas técnicas aplicáveis */
  standards?: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  types: ProductType[];
}

// Dados mockados dos produtos
export const mockProducts: ProductCategory[] = [
  {
    id: '1',
    name: 'Válvulas Industriais',
    slug: 'valvulas-industriais',
    description: 'Linha completa de válvulas para aplicações industriais de alta performance.',
    image: '/imagens/valvulas.png',
    types: [
      {
        id: '1',
        name: 'Válvula de Esfera',
        slug: 'valvula-esfera',
        description: 'Válvulas de esfera para controle de fluxo em sistemas industriais. Alta durabilidade e confiabilidade. Ideal para aplicações que exigem controle preciso e vedação hermética.',
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
            type: 'Aço Carbono',
            description: 'Ideal para aplicações gerais com boa relação custo-benefício.',
            sizes: [
              {
                size: '1/2"',
                image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1-2.jpg',
                description: 'Válvula de esfera aço carbono 1/2"'
              },
              {
                size: '1"',
                image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1.jpg',
                description: 'Válvula de esfera aço carbono 1"'
              },
              {
                size: '2"',
                image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-2.jpg',
                description: 'Válvula de esfera aço carbono 2"'
              }
            ]
          },
          {
            type: 'Inox',
            description: 'Resistente à corrosão, ideal para ambientes agressivos.',
            sizes: [
              {
                size: '1/2"',
                image: '/imagens/valvulas-industriais/valvula-esfera-inox-1-2.jpg',
                description: 'Válvula de esfera inox 1/2"'
              },
              {
                size: '1"',
                image: '/imagens/valvulas-industriais/valvula-esfera-inox-1.jpg',
                description: 'Válvula de esfera inox 1"'
              },
              {
                size: '2"',
                image: '/imagens/valvulas-industriais/valvula-esfera-inox-2.jpg',
                description: 'Válvula de esfera inox 2"'
              }
            ]
          },
          {
            type: 'Latão',
            description: 'Excelente para aplicações residenciais e comerciais.',
            sizes: [
              {
                size: '1/2"',
                image: '/imagens/valvulas-industriais/valvula-esfera-latao-1-2.jpg',
                description: 'Válvula de esfera latão 1/2"'
              },
              {
                size: '3/4"',
                image: '/imagens/valvulas-industriais/valvula-esfera-latao-3-4.jpg',
                description: 'Válvula de esfera latão 3/4"'
              }
            ]
          }
        ]
      },
      {
        id: '2',
        name: 'Válvula de Gaveta',
        slug: 'valvula-gaveta',
        description: 'Válvulas de gaveta para controle de fluxo em sistemas de alta pressão.',
        variants: [
          {
            type: 'Aço Carbono',
            sizes: [
              {
                size: '2"',
                image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-2.jpg'
              },
              {
                size: '3"',
                image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-3.jpg'
              },
              {
                size: '4"',
                image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-4.jpg'
              }
            ]
          },
          {
            type: 'Inox',
            sizes: [
              {
                size: '2"',
                image: '/imagens/valvulas-industriais/valvula-gaveta-inox-2.jpg'
              },
              {
                size: '3"',
                image: '/imagens/valvulas-industriais/valvula-gaveta-inox-3.jpg'
              }
            ]
          }
        ]
      },
      {
        id: '3',
        name: 'Válvula de Retenção',
        slug: 'valvula-retencao',
        description: 'Válvulas de retenção para prevenir refluxo em sistemas de bombeamento.',
        // Produto sem variants - apenas sizes diretos
        image: '/imagens/valvulas-industriais/valvula-retencao.jpg',
        sizes: [
          {
            size: '1"',
            image: '/imagens/valvulas-industriais/valvula-retencao-1.jpg'
          },
          {
            size: '2"',
            image: '/imagens/valvulas-industriais/valvula-retencao-2.jpg'
          },
          {
            size: '3"',
            image: '/imagens/valvulas-industriais/valvula-retencao-3.jpg'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Conexões Tubulares',
    slug: 'conexoes-tubulares',
    description: 'Conexões e acessórios para sistemas de tubulação industrial.',
    image: '/imagens/conexoes.png',
    types: [
      {
        id: '4',
        name: 'Flanges',
        slug: 'flanges',
        description: 'Flanges para conexão de tubulações industriais.',
        // Produto simples sem variants nem sizes
        image: '/imagens/flanges.png'
      },
      {
        id: '5',
        name: 'Tês 90',
        slug: 'tes-90',
        description: 'Tês e reduções para sistemas de tubulação.',
        variants: [
          {
            type: 'Aço Carbono',
            sizes: [
              {
                size: '1" x 1/2"',
                image: '/imagens/conexoes-tubulares/te-90/te-reducao-aco-1x1-2.jpg'
              },
              {
                size: '2" x 1"',
                image: '/imagens/conexoes-tubulares/te-90/te-reducao-aco-2x1.jpg'
              }
            ]
          }
        ]
      }
    ]
  }
];

/**
 * Funções auxiliares para buscar produtos
 */

export function getCategories(): ProductCategory[] {
  return mockProducts;
}

export function getCategoryBySlug(slug: string): ProductCategory | undefined {
  return mockProducts.find(cat => cat.slug === slug);
}

export function getProductTypeBySlug(
  categorySlug: string,
  typeSlug: string
): ProductType | undefined {
  const category = getCategoryBySlug(categorySlug);
  if (!category) return undefined;
  return category.types.find(type => type.slug === typeSlug);
}

export function getAllProductTypes(categorySlug?: string): ProductType[] {
  if (categorySlug) {
    const category = getCategoryBySlug(categorySlug);
    return category?.types || [];
  }
  return mockProducts.flatMap(cat => cat.types);
}

/**
 * Obtém a imagem de exibição de um produto para listagens
 * Prioridade: image > primeira variant/size > primeira size
 */
export function getProductDisplayImage(product: ProductType): string | undefined {
  // 1. Imagem padrão do produto
  if (product.image) {
    return product.image;
  }
  
  // 2. Primeira imagem de variant (primeiro tipo, primeiro tamanho)
  if (product.variants && product.variants.length > 0) {
    const firstVariant = product.variants[0];
    if (firstVariant.sizes && firstVariant.sizes.length > 0) {
      return firstVariant.sizes[0].image;
    }
  }
  
  // 3. Primeira imagem de size direto
  if (product.sizes && product.sizes.length > 0) {
    return product.sizes[0].image;
  }
  
  return undefined;
}

/**
 * Verifica se um produto tem variações
 */
export function hasProductVariations(product: ProductType): boolean {
  return Boolean(
    (product.variants && product.variants.length > 0) ||
    (product.sizes && product.sizes.length > 0)
  );
}

/**
 * Obtém o número total de variações disponíveis
 */
export function getProductVariationsCount(product: ProductType): number {
  if (product.variants) {
    return product.variants.reduce((total, variant) => total + variant.sizes.length, 0);
  }
  if (product.sizes) {
    return product.sizes.length;
  }
  return 0;
}


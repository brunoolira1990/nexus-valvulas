export type ValveType = {
  id: string;
  name: string;
  description?: string;
  /** Mapa de tamanhos para URLs de imagens */
  sizes: Record<string, string>;
};

/**
 * Tipos de válvulas de esfera disponíveis.
 *
 * Os caminhos de imagem seguem o padrão usado em `products.ts`
 * para manter consistência visual no catálogo.
 */
export const sphericalValvesTypes: ValveType[] = [
  {
    id: "aco-carbono",
    name: "Aço Carbono",
    description: "Ideal para aplicações gerais com boa relação custo-benefício.",
    sizes: {
      '1/2"': "/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1-2.jpg",
      '1"': "/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1.jpg",
      '2"': "/imagens/valvulas-industriais/valvula-esfera-aco-carbono-2.jpg",
    },
  },
  {
    id: "inox",
    name: "Inox",
    description: "Resistente à corrosão, ideal para ambientes agressivos.",
    sizes: {
      '1/2"': "/imagens/valvulas-industriais/valvula-esfera-inox-1-2.jpg",
      '1"': "/imagens/valvulas-industriais/valvula-esfera-inox-1.jpg",
      '2"': "/imagens/valvulas-industriais/valvula-esfera-inox-2.jpg",
    },
  },
  {
    id: "latao",
    name: "Latão",
    description: "Excelente para aplicações residenciais e comerciais.",
    sizes: {
      '1/2"': "/imagens/valvulas-industriais/valvula-esfera-latao-1-2.jpg",
      '3/4"': "/imagens/valvulas-industriais/valvula-esfera-latao-3-4.jpg",
    },
  },
];

/**
 * Busca um tipo de válvula de esfera pelo ID.
 */
export function getValveTypeById(id: string): ValveType | undefined {
  if (!id) return undefined;
  return sphericalValvesTypes.find(type => type.id === id);
}

/**
 * Retorna a URL da imagem com base no tipo e tamanho selecionados.
 */
export function getImageUrl(typeId: string, size: string): string | undefined {
  const type = getValveTypeById(typeId);
  if (!type) return undefined;
  return type.sizes[size];
}

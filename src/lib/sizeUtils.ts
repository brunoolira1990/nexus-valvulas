/**
 * Utilitários para ordenação e manipulação de tamanhos (polegadas)
 */

/**
 * Converte uma string de polegada para número para ordenação
 * Exemplos:
 * - "1/2"    → 0.5
 * - "3/4"    → 0.75
 * - "1"      → 1
 * - "1 1/4"  → 1.25
 * - "1.1/2"  → 1.5
 * - "2 1/2"  → 2.5
 * - "DN50"   → 50 (fallback baseado no primeiro número)
 */
export function parseInchToNumber(sizeStr: string): number {
  if (!sizeStr) return NaN;

  // Normaliza: remove aspas e espaços extras
  const raw = sizeStr.replace(/"/g, "").trim();

  // 1) Misto (inteiro + fração) aceitando espaço ou ponto como separador
  // Ex: "1 1/2", "1.1/2", "2.1/2"
  const mixedMatch = raw.match(/^(\d+)[\s\.]+(\d+)\/(\d+)$/);
  if (mixedMatch) {
    const whole = Number(mixedMatch[1]);
    const num = Number(mixedMatch[2]);
    const den = Number(mixedMatch[3]);
    if (den !== 0) {
      return whole + num / den;
    }
  }

  // 2) Fração pura (ex: "1/2", "3/4")
  const fracMatch = raw.match(/^(\d+)\/(\d+)$/);
  if (fracMatch) {
    const num = Number(fracMatch[1]);
    const den = Number(fracMatch[2]);
    if (den !== 0) {
      return num / den;
    }
  }

  // 3) Inteiro ou decimal simples (ex: "2", "3", "1.5")
  const numberMatch = raw.match(/^(\d+(\.\d+)?)$/);
  if (numberMatch) {
    return Number(numberMatch[1]);
  }

  // 4) Fallback: pega o primeiro número encontrado (ex: "DN50" -> 50)
  const anyNumberMatch = raw.match(/(\d+(\.\d+)?)/);
  if (anyNumberMatch) {
    return Number(anyNumberMatch[1]);
  }

  return NaN;
}

/**
 * Ordena um array de tamanhos (polegadas) em ordem numérica crescente
 * 
 * @param sizes Array de strings de tamanhos (ex: ["1/2", "1", "2", "1 1/4"])
 * @returns Array ordenado numericamente
 * 
 * @example
 * sortSizes(["2", "1/2", "1", "3/4", "1 1/4"])
 * // Retorna: ["1/2", "3/4", "1", "1 1/4", "2"]
 */
export function sortSizes(sizes: string[]): string[] {
  return [...sizes].sort((a, b) => {
    const numA = parseInchToNumber(a);
    const numB = parseInchToNumber(b);

    const aIsNaN = Number.isNaN(numA);
    const bIsNaN = Number.isNaN(numB);

    if (aIsNaN && bIsNaN) return 0;
    if (aIsNaN) return 1;
    if (bIsNaN) return -1;

    return numA - numB;
  });
}

/**
 * Ordena as chaves de um Record de tamanhos
 * 
 * @param sizesRecord Record onde chave = tamanho, valor = URL da imagem
 * @returns Array de tamanhos ordenados
 * 
 * @example
 * sortSizeKeys({ "2": "/img/2.jpg", "1/2": "/img/12.jpg", "1": "/img/1.jpg" })
 * // Retorna: ["1/2", "1", "2"]
 */
export function sortSizeKeys(sizesRecord: Record<string, string>): string[] {
  return sortSizes(Object.keys(sizesRecord));
}

/**
 * Formata um tamanho para exibição (adiciona aspas se necessário)
 * 
 * @param size Tamanho em string (ex: "1/2", "1", "1 1/4")
 * @returns Tamanho formatado (ex: "1/2\"", "1\"", "1 1/4\"")
 */
export function formatSize(size: string): string {
  return size.includes('"') ? size : `${size}"`;
}


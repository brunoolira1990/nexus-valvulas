# Exemplos de Estrutura de Dados - Produtos Nexus

## 📋 Formato Completo de Produto

Este documento mostra exemplos práticos de como estruturar os dados dos produtos, incluindo todas as funcionalidades disponíveis.

---

## 1. Produto com Variants (Múltiplos Materiais)

**Exemplo**: Válvula de Esfera com diferentes materiais (Aço Carbono, Inox, Latão)

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo em sistemas industriais. Alta durabilidade e confiabilidade. Ideal para aplicações que exigem controle preciso e vedação hermética.',
  
  // Especificações técnicas gerais
  specifications: {
    'Pressão Máxima': '150 PSI',
    'Temperatura de Operação': '-20°C a 200°C',
    'Tipo de Conexão': 'Rosqueada / Flangeada',
    'Vedação': 'Teflon (PTFE)',
  },
  
  // Aplicações recomendadas
  applications: [
    'Refinarias de petróleo',
    'Indústria química',
    'Siderúrgicas',
    'Sistemas de água e esgoto',
    'Indústria alimentícia',
  ],
  
  // Normas técnicas aplicáveis
  standards: ['ASME B16.34', 'API 600', 'ISO 5211'],
  
  // Variantes (diferentes materiais)
  variants: [
    {
      type: 'Aço Carbono',
      description: 'Ideal para aplicações gerais com boa relação custo-benefício. Resistente a corrosão moderada.',
      sizes: [
        {
          size: '1/2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1-2.jpg',
          description: 'Válvula de esfera aço carbono 1/2" - Ideal para instalações residenciais e comerciais.'
        },
        {
          size: '1"',
          image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1.jpg',
          description: 'Válvula de esfera aço carbono 1" - Aplicações industriais de pequeno porte.'
        },
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-2.jpg',
          description: 'Válvula de esfera aço carbono 2" - Para sistemas de maior vazão.'
        }
      ]
    },
    {
      type: 'Inox',
      description: 'Resistente à corrosão, ideal para ambientes agressivos e aplicações que exigem higiene.',
      sizes: [
        {
          size: '1/2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-inox-1-2.jpg',
          description: 'Válvula de esfera inox 1/2" - Ideal para indústria alimentícia e química.'
        },
        {
          size: '1"',
          image: '/imagens/valvulas-industriais/valvula-esfera-inox-1.jpg',
          description: 'Válvula de esfera inox 1" - Aplicações em ambientes corrosivos.'
        },
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-inox-2.jpg',
          description: 'Válvula de esfera inox 2" - Sistemas industriais de alta performance.'
        }
      ]
    },
    {
      type: 'Latão',
      description: 'Excelente para aplicações residenciais e comerciais. Boa resistência à corrosão.',
      sizes: [
        {
          size: '1/2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-latao-1-2.jpg',
          description: 'Válvula de esfera latão 1/2" - Uso residencial e comercial.'
        },
        {
          size: '3/4"',
          image: '/imagens/valvulas-industriais/valvula-esfera-latao-3-4.jpg',
          description: 'Válvula de esfera latão 3/4" - Aplicações comerciais.'
        }
      ]
    }
  ]
}
```

**Como funciona**:
- Usuário seleciona **Material** (ex: "Inox")
- Sistema mostra apenas os tamanhos disponíveis para "Inox"
- Usuário seleciona **Tamanho** (ex: "2\"")
- Imagem exibida: `/imagens/.../valvula-esfera-inox-2.jpg`

---

## 2. Produto com Sizes Apenas (Sem Variants)

**Exemplo**: Válvula de Retenção (mesmo material, diferentes tamanhos)

```typescript
{
  id: '3',
  name: 'Válvula de Retenção',
  slug: 'valvula-retencao',
  description: 'Válvulas de retenção para prevenir refluxo em sistemas de bombeamento. Fabricada em aço carbono com vedação em borracha NBR.',
  
  // Imagem padrão (usada quando nenhum tamanho está selecionado)
  image: '/imagens/valvulas-industriais/valvula-retencao.jpg',
  
  specifications: {
    'Pressão Máxima': '200 PSI',
    'Temperatura': '-10°C a 150°C',
    'Material': 'Aço Carbono',
    'Vedação': 'Borracha NBR',
  },
  
  applications: [
    'Sistemas de bombeamento',
    'Estações de tratamento de água',
    'Sistemas de irrigação',
  ],
  
  standards: ['ASME B16.34'],
  
  // Tamanhos diretos (sem variants)
  sizes: [
    {
      size: '1"',
      image: '/imagens/valvulas-industriais/valvula-retencao-1.jpg',
      description: 'Válvula de retenção 1" - Para sistemas de pequeno porte.'
    },
    {
      size: '2"',
      image: '/imagens/valvulas-industriais/valvula-retencao-2.jpg',
      description: 'Válvula de retenção 2" - Aplicações industriais médias.'
    },
    {
      size: '3"',
      image: '/imagens/valvulas-industriais/valvula-retencao-3.jpg',
      description: 'Válvula de retenção 3" - Para sistemas de grande vazão.'
    },
    {
      size: '4"',
      image: '/imagens/valvulas-industriais/valvula-retencao-4.jpg',
      description: 'Válvula de retenção 4" - Aplicações industriais pesadas.'
    }
  ]
}
```

**Como funciona**:
- Usuário vê apenas seletor de **Tamanho**
- Não há seletor de Material (produto único)
- Cada tamanho tem sua própria imagem

---

## 3. Produto Simples (Sem Variants Nem Sizes)

**Exemplo**: Flanges (produto único, sem variações)

```typescript
{
  id: '4',
  name: 'Flanges',
  slug: 'flanges',
  description: 'Flanges para conexão de tubulações industriais. Fabricados em aço carbono conforme normas ASME. Disponíveis em diversos diâmetros e classes de pressão.',
  
  // Apenas uma imagem
  image: '/imagens/conexoes-tubulares/flanges.png',
  
  specifications: {
    'Norma': 'ASME B16.5',
    'Material': 'Aço Carbono A105',
    'Classes de Pressão': '150, 300, 600 PSI',
    'Diâmetros': '1/2" até 24"',
  },
  
  applications: [
    'Conexão de tubulações',
    'Sistemas de processo industrial',
    'Refinarias',
    'Petroquímicas',
  ],
  
  standards: ['ASME B16.5', 'API 6A'],
  
  // Sem variants nem sizes
  // Interface se adapta automaticamente
}
```

**Como funciona**:
- Nenhum seletor é exibido
- Apenas imagem padrão e informações do produto
- Layout simplificado

---

## 4. Produto com Especificações Detalhadas

**Exemplo**: Válvula de Gaveta com especificações técnicas completas

```typescript
{
  id: '2',
  name: 'Válvula de Gaveta',
  slug: 'valvula-gaveta',
  description: 'Válvulas de gaveta para controle de fluxo em sistemas de alta pressão. Projeto robusto com vedação metálica.',
  
  specifications: {
    'Pressão Máxima': '300 PSI',
    'Temperatura': '-29°C a 425°C',
    'Tipo de Operação': 'Volante / Atuador',
    'Vedação': 'Metal-to-Metal',
    'Conexão': 'Flangeada RF',
    'Norma de Teste': 'API 598',
  },
  
  applications: [
    'Refinarias de petróleo',
    'Indústria petroquímica',
    'Sistemas de alta pressão',
    'Aplicações críticas',
  ],
  
  standards: ['ASME B16.34', 'API 600', 'API 598'],
  
  variants: [
    {
      type: 'Aço Carbono',
      description: 'Para aplicações gerais de alta pressão. Boa resistência mecânica.',
      sizes: [
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-2.jpg',
          description: 'Válvula de gaveta aço carbono 2" - Classe 150.'
        },
        {
          size: '3"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-3.jpg',
          description: 'Válvula de gaveta aço carbono 3" - Classe 300.'
        },
        {
          size: '4"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-4.jpg',
          description: 'Válvula de gaveta aço carbono 4" - Classe 600.'
        }
      ]
    },
    {
      type: 'Inox',
      description: 'Para ambientes corrosivos e aplicações que exigem alta pureza.',
      sizes: [
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-inox-2.jpg',
          description: 'Válvula de gaveta inox 2" - Aço inoxidável 316L.'
        },
        {
          size: '3"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-inox-3.jpg',
          description: 'Válvula de gaveta inox 3" - Resistente a corrosão.'
        }
      ]
    }
  ]
}
```

---

## 📝 Campos Opcionais vs Obrigatórios

### Obrigatórios
- `id`: Identificador único
- `name`: Nome do produto
- `slug`: URL amigável (único)
- `description`: Descrição do produto

### Opcionais mas Recomendados
- `image`: Imagem padrão (quando não há variants/sizes)
- `specifications`: Especificações técnicas
- `applications`: Aplicações recomendadas
- `standards`: Normas técnicas

### Estrutura Condicional
- **Se tem `variants`**: Cada variant tem `type` e `sizes[]`
- **Se não tem `variants` mas tem `sizes`**: Tamanhos diretos no produto
- **Se não tem nem `variants` nem `sizes`**: Produto simples, usa apenas `image`

---

## 🎯 Boas Práticas

### 1. Nomenclatura de Imagens
```
/imagens/
  valvulas-industriais/
    valvula-esfera-aco-carbono-1-2.jpg
    valvula-esfera-aco-carbono-1.jpg
    valvula-esfera-inox-1-2.jpg
    valvula-gaveta-aco-carbono-2.jpg
```

### 2. Descrições
- **Produto**: Descrição geral (2-3 linhas)
- **Variant**: Características do material/tipo
- **Size**: Informações específicas do tamanho

### 3. Especificações
- Use chaves descritivas: `'Pressão Máxima'` não `'pressure'`
- Valores claros: `'150 PSI'` não `'150'`
- Ordene por importância

### 4. Aplicações
- Liste de forma específica: `'Refinarias de petróleo'` não `'Indústria'`
- Máximo 5-7 aplicações principais

### 5. Standards
- Use códigos completos: `'ASME B16.34'` não `'B16.34'`
- Ordene por relevância

---

## 🔄 Migração de Dados Existentes

Se você já tem produtos cadastrados, pode adicionar os novos campos gradualmente:

```typescript
// Antes
{
  name: 'Válvula de Esfera',
  description: '...',
  variants: [...]
}

// Depois (adicionar campos opcionais)
{
  name: 'Válvula de Esfera',
  description: '...',
  variants: [...],
  specifications: { ... },  // Novo
  applications: [...],        // Novo
  standards: [...]           // Novo
}
```

Os campos novos são opcionais, então produtos antigos continuam funcionando!

---

**Estrutura pronta para uso!** 🚀



## 📋 Formato Completo de Produto

Este documento mostra exemplos práticos de como estruturar os dados dos produtos, incluindo todas as funcionalidades disponíveis.

---

## 1. Produto com Variants (Múltiplos Materiais)

**Exemplo**: Válvula de Esfera com diferentes materiais (Aço Carbono, Inox, Latão)

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo em sistemas industriais. Alta durabilidade e confiabilidade. Ideal para aplicações que exigem controle preciso e vedação hermética.',
  
  // Especificações técnicas gerais
  specifications: {
    'Pressão Máxima': '150 PSI',
    'Temperatura de Operação': '-20°C a 200°C',
    'Tipo de Conexão': 'Rosqueada / Flangeada',
    'Vedação': 'Teflon (PTFE)',
  },
  
  // Aplicações recomendadas
  applications: [
    'Refinarias de petróleo',
    'Indústria química',
    'Siderúrgicas',
    'Sistemas de água e esgoto',
    'Indústria alimentícia',
  ],
  
  // Normas técnicas aplicáveis
  standards: ['ASME B16.34', 'API 600', 'ISO 5211'],
  
  // Variantes (diferentes materiais)
  variants: [
    {
      type: 'Aço Carbono',
      description: 'Ideal para aplicações gerais com boa relação custo-benefício. Resistente a corrosão moderada.',
      sizes: [
        {
          size: '1/2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1-2.jpg',
          description: 'Válvula de esfera aço carbono 1/2" - Ideal para instalações residenciais e comerciais.'
        },
        {
          size: '1"',
          image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1.jpg',
          description: 'Válvula de esfera aço carbono 1" - Aplicações industriais de pequeno porte.'
        },
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-2.jpg',
          description: 'Válvula de esfera aço carbono 2" - Para sistemas de maior vazão.'
        }
      ]
    },
    {
      type: 'Inox',
      description: 'Resistente à corrosão, ideal para ambientes agressivos e aplicações que exigem higiene.',
      sizes: [
        {
          size: '1/2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-inox-1-2.jpg',
          description: 'Válvula de esfera inox 1/2" - Ideal para indústria alimentícia e química.'
        },
        {
          size: '1"',
          image: '/imagens/valvulas-industriais/valvula-esfera-inox-1.jpg',
          description: 'Válvula de esfera inox 1" - Aplicações em ambientes corrosivos.'
        },
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-inox-2.jpg',
          description: 'Válvula de esfera inox 2" - Sistemas industriais de alta performance.'
        }
      ]
    },
    {
      type: 'Latão',
      description: 'Excelente para aplicações residenciais e comerciais. Boa resistência à corrosão.',
      sizes: [
        {
          size: '1/2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-latao-1-2.jpg',
          description: 'Válvula de esfera latão 1/2" - Uso residencial e comercial.'
        },
        {
          size: '3/4"',
          image: '/imagens/valvulas-industriais/valvula-esfera-latao-3-4.jpg',
          description: 'Válvula de esfera latão 3/4" - Aplicações comerciais.'
        }
      ]
    }
  ]
}
```

**Como funciona**:
- Usuário seleciona **Material** (ex: "Inox")
- Sistema mostra apenas os tamanhos disponíveis para "Inox"
- Usuário seleciona **Tamanho** (ex: "2\"")
- Imagem exibida: `/imagens/.../valvula-esfera-inox-2.jpg`

---

## 2. Produto com Sizes Apenas (Sem Variants)

**Exemplo**: Válvula de Retenção (mesmo material, diferentes tamanhos)

```typescript
{
  id: '3',
  name: 'Válvula de Retenção',
  slug: 'valvula-retencao',
  description: 'Válvulas de retenção para prevenir refluxo em sistemas de bombeamento. Fabricada em aço carbono com vedação em borracha NBR.',
  
  // Imagem padrão (usada quando nenhum tamanho está selecionado)
  image: '/imagens/valvulas-industriais/valvula-retencao.jpg',
  
  specifications: {
    'Pressão Máxima': '200 PSI',
    'Temperatura': '-10°C a 150°C',
    'Material': 'Aço Carbono',
    'Vedação': 'Borracha NBR',
  },
  
  applications: [
    'Sistemas de bombeamento',
    'Estações de tratamento de água',
    'Sistemas de irrigação',
  ],
  
  standards: ['ASME B16.34'],
  
  // Tamanhos diretos (sem variants)
  sizes: [
    {
      size: '1"',
      image: '/imagens/valvulas-industriais/valvula-retencao-1.jpg',
      description: 'Válvula de retenção 1" - Para sistemas de pequeno porte.'
    },
    {
      size: '2"',
      image: '/imagens/valvulas-industriais/valvula-retencao-2.jpg',
      description: 'Válvula de retenção 2" - Aplicações industriais médias.'
    },
    {
      size: '3"',
      image: '/imagens/valvulas-industriais/valvula-retencao-3.jpg',
      description: 'Válvula de retenção 3" - Para sistemas de grande vazão.'
    },
    {
      size: '4"',
      image: '/imagens/valvulas-industriais/valvula-retencao-4.jpg',
      description: 'Válvula de retenção 4" - Aplicações industriais pesadas.'
    }
  ]
}
```

**Como funciona**:
- Usuário vê apenas seletor de **Tamanho**
- Não há seletor de Material (produto único)
- Cada tamanho tem sua própria imagem

---

## 3. Produto Simples (Sem Variants Nem Sizes)

**Exemplo**: Flanges (produto único, sem variações)

```typescript
{
  id: '4',
  name: 'Flanges',
  slug: 'flanges',
  description: 'Flanges para conexão de tubulações industriais. Fabricados em aço carbono conforme normas ASME. Disponíveis em diversos diâmetros e classes de pressão.',
  
  // Apenas uma imagem
  image: '/imagens/conexoes-tubulares/flanges.png',
  
  specifications: {
    'Norma': 'ASME B16.5',
    'Material': 'Aço Carbono A105',
    'Classes de Pressão': '150, 300, 600 PSI',
    'Diâmetros': '1/2" até 24"',
  },
  
  applications: [
    'Conexão de tubulações',
    'Sistemas de processo industrial',
    'Refinarias',
    'Petroquímicas',
  ],
  
  standards: ['ASME B16.5', 'API 6A'],
  
  // Sem variants nem sizes
  // Interface se adapta automaticamente
}
```

**Como funciona**:
- Nenhum seletor é exibido
- Apenas imagem padrão e informações do produto
- Layout simplificado

---

## 4. Produto com Especificações Detalhadas

**Exemplo**: Válvula de Gaveta com especificações técnicas completas

```typescript
{
  id: '2',
  name: 'Válvula de Gaveta',
  slug: 'valvula-gaveta',
  description: 'Válvulas de gaveta para controle de fluxo em sistemas de alta pressão. Projeto robusto com vedação metálica.',
  
  specifications: {
    'Pressão Máxima': '300 PSI',
    'Temperatura': '-29°C a 425°C',
    'Tipo de Operação': 'Volante / Atuador',
    'Vedação': 'Metal-to-Metal',
    'Conexão': 'Flangeada RF',
    'Norma de Teste': 'API 598',
  },
  
  applications: [
    'Refinarias de petróleo',
    'Indústria petroquímica',
    'Sistemas de alta pressão',
    'Aplicações críticas',
  ],
  
  standards: ['ASME B16.34', 'API 600', 'API 598'],
  
  variants: [
    {
      type: 'Aço Carbono',
      description: 'Para aplicações gerais de alta pressão. Boa resistência mecânica.',
      sizes: [
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-2.jpg',
          description: 'Válvula de gaveta aço carbono 2" - Classe 150.'
        },
        {
          size: '3"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-3.jpg',
          description: 'Válvula de gaveta aço carbono 3" - Classe 300.'
        },
        {
          size: '4"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-4.jpg',
          description: 'Válvula de gaveta aço carbono 4" - Classe 600.'
        }
      ]
    },
    {
      type: 'Inox',
      description: 'Para ambientes corrosivos e aplicações que exigem alta pureza.',
      sizes: [
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-inox-2.jpg',
          description: 'Válvula de gaveta inox 2" - Aço inoxidável 316L.'
        },
        {
          size: '3"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-inox-3.jpg',
          description: 'Válvula de gaveta inox 3" - Resistente a corrosão.'
        }
      ]
    }
  ]
}
```

---

## 📝 Campos Opcionais vs Obrigatórios

### Obrigatórios
- `id`: Identificador único
- `name`: Nome do produto
- `slug`: URL amigável (único)
- `description`: Descrição do produto

### Opcionais mas Recomendados
- `image`: Imagem padrão (quando não há variants/sizes)
- `specifications`: Especificações técnicas
- `applications`: Aplicações recomendadas
- `standards`: Normas técnicas

### Estrutura Condicional
- **Se tem `variants`**: Cada variant tem `type` e `sizes[]`
- **Se não tem `variants` mas tem `sizes`**: Tamanhos diretos no produto
- **Se não tem nem `variants` nem `sizes`**: Produto simples, usa apenas `image`

---

## 🎯 Boas Práticas

### 1. Nomenclatura de Imagens
```
/imagens/
  valvulas-industriais/
    valvula-esfera-aco-carbono-1-2.jpg
    valvula-esfera-aco-carbono-1.jpg
    valvula-esfera-inox-1-2.jpg
    valvula-gaveta-aco-carbono-2.jpg
```

### 2. Descrições
- **Produto**: Descrição geral (2-3 linhas)
- **Variant**: Características do material/tipo
- **Size**: Informações específicas do tamanho

### 3. Especificações
- Use chaves descritivas: `'Pressão Máxima'` não `'pressure'`
- Valores claros: `'150 PSI'` não `'150'`
- Ordene por importância

### 4. Aplicações
- Liste de forma específica: `'Refinarias de petróleo'` não `'Indústria'`
- Máximo 5-7 aplicações principais

### 5. Standards
- Use códigos completos: `'ASME B16.34'` não `'B16.34'`
- Ordene por relevância

---

## 🔄 Migração de Dados Existentes

Se você já tem produtos cadastrados, pode adicionar os novos campos gradualmente:

```typescript
// Antes
{
  name: 'Válvula de Esfera',
  description: '...',
  variants: [...]
}

// Depois (adicionar campos opcionais)
{
  name: 'Válvula de Esfera',
  description: '...',
  variants: [...],
  specifications: { ... },  // Novo
  applications: [...],        // Novo
  standards: [...]           // Novo
}
```

Os campos novos são opcionais, então produtos antigos continuam funcionando!

---

**Estrutura pronta para uso!** 🚀



## 📋 Formato Completo de Produto

Este documento mostra exemplos práticos de como estruturar os dados dos produtos, incluindo todas as funcionalidades disponíveis.

---

## 1. Produto com Variants (Múltiplos Materiais)

**Exemplo**: Válvula de Esfera com diferentes materiais (Aço Carbono, Inox, Latão)

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo em sistemas industriais. Alta durabilidade e confiabilidade. Ideal para aplicações que exigem controle preciso e vedação hermética.',
  
  // Especificações técnicas gerais
  specifications: {
    'Pressão Máxima': '150 PSI',
    'Temperatura de Operação': '-20°C a 200°C',
    'Tipo de Conexão': 'Rosqueada / Flangeada',
    'Vedação': 'Teflon (PTFE)',
  },
  
  // Aplicações recomendadas
  applications: [
    'Refinarias de petróleo',
    'Indústria química',
    'Siderúrgicas',
    'Sistemas de água e esgoto',
    'Indústria alimentícia',
  ],
  
  // Normas técnicas aplicáveis
  standards: ['ASME B16.34', 'API 600', 'ISO 5211'],
  
  // Variantes (diferentes materiais)
  variants: [
    {
      type: 'Aço Carbono',
      description: 'Ideal para aplicações gerais com boa relação custo-benefício. Resistente a corrosão moderada.',
      sizes: [
        {
          size: '1/2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1-2.jpg',
          description: 'Válvula de esfera aço carbono 1/2" - Ideal para instalações residenciais e comerciais.'
        },
        {
          size: '1"',
          image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-1.jpg',
          description: 'Válvula de esfera aço carbono 1" - Aplicações industriais de pequeno porte.'
        },
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-aco-carbono-2.jpg',
          description: 'Válvula de esfera aço carbono 2" - Para sistemas de maior vazão.'
        }
      ]
    },
    {
      type: 'Inox',
      description: 'Resistente à corrosão, ideal para ambientes agressivos e aplicações que exigem higiene.',
      sizes: [
        {
          size: '1/2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-inox-1-2.jpg',
          description: 'Válvula de esfera inox 1/2" - Ideal para indústria alimentícia e química.'
        },
        {
          size: '1"',
          image: '/imagens/valvulas-industriais/valvula-esfera-inox-1.jpg',
          description: 'Válvula de esfera inox 1" - Aplicações em ambientes corrosivos.'
        },
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-inox-2.jpg',
          description: 'Válvula de esfera inox 2" - Sistemas industriais de alta performance.'
        }
      ]
    },
    {
      type: 'Latão',
      description: 'Excelente para aplicações residenciais e comerciais. Boa resistência à corrosão.',
      sizes: [
        {
          size: '1/2"',
          image: '/imagens/valvulas-industriais/valvula-esfera-latao-1-2.jpg',
          description: 'Válvula de esfera latão 1/2" - Uso residencial e comercial.'
        },
        {
          size: '3/4"',
          image: '/imagens/valvulas-industriais/valvula-esfera-latao-3-4.jpg',
          description: 'Válvula de esfera latão 3/4" - Aplicações comerciais.'
        }
      ]
    }
  ]
}
```

**Como funciona**:
- Usuário seleciona **Material** (ex: "Inox")
- Sistema mostra apenas os tamanhos disponíveis para "Inox"
- Usuário seleciona **Tamanho** (ex: "2\"")
- Imagem exibida: `/imagens/.../valvula-esfera-inox-2.jpg`

---

## 2. Produto com Sizes Apenas (Sem Variants)

**Exemplo**: Válvula de Retenção (mesmo material, diferentes tamanhos)

```typescript
{
  id: '3',
  name: 'Válvula de Retenção',
  slug: 'valvula-retencao',
  description: 'Válvulas de retenção para prevenir refluxo em sistemas de bombeamento. Fabricada em aço carbono com vedação em borracha NBR.',
  
  // Imagem padrão (usada quando nenhum tamanho está selecionado)
  image: '/imagens/valvulas-industriais/valvula-retencao.jpg',
  
  specifications: {
    'Pressão Máxima': '200 PSI',
    'Temperatura': '-10°C a 150°C',
    'Material': 'Aço Carbono',
    'Vedação': 'Borracha NBR',
  },
  
  applications: [
    'Sistemas de bombeamento',
    'Estações de tratamento de água',
    'Sistemas de irrigação',
  ],
  
  standards: ['ASME B16.34'],
  
  // Tamanhos diretos (sem variants)
  sizes: [
    {
      size: '1"',
      image: '/imagens/valvulas-industriais/valvula-retencao-1.jpg',
      description: 'Válvula de retenção 1" - Para sistemas de pequeno porte.'
    },
    {
      size: '2"',
      image: '/imagens/valvulas-industriais/valvula-retencao-2.jpg',
      description: 'Válvula de retenção 2" - Aplicações industriais médias.'
    },
    {
      size: '3"',
      image: '/imagens/valvulas-industriais/valvula-retencao-3.jpg',
      description: 'Válvula de retenção 3" - Para sistemas de grande vazão.'
    },
    {
      size: '4"',
      image: '/imagens/valvulas-industriais/valvula-retencao-4.jpg',
      description: 'Válvula de retenção 4" - Aplicações industriais pesadas.'
    }
  ]
}
```

**Como funciona**:
- Usuário vê apenas seletor de **Tamanho**
- Não há seletor de Material (produto único)
- Cada tamanho tem sua própria imagem

---

## 3. Produto Simples (Sem Variants Nem Sizes)

**Exemplo**: Flanges (produto único, sem variações)

```typescript
{
  id: '4',
  name: 'Flanges',
  slug: 'flanges',
  description: 'Flanges para conexão de tubulações industriais. Fabricados em aço carbono conforme normas ASME. Disponíveis em diversos diâmetros e classes de pressão.',
  
  // Apenas uma imagem
  image: '/imagens/conexoes-tubulares/flanges.png',
  
  specifications: {
    'Norma': 'ASME B16.5',
    'Material': 'Aço Carbono A105',
    'Classes de Pressão': '150, 300, 600 PSI',
    'Diâmetros': '1/2" até 24"',
  },
  
  applications: [
    'Conexão de tubulações',
    'Sistemas de processo industrial',
    'Refinarias',
    'Petroquímicas',
  ],
  
  standards: ['ASME B16.5', 'API 6A'],
  
  // Sem variants nem sizes
  // Interface se adapta automaticamente
}
```

**Como funciona**:
- Nenhum seletor é exibido
- Apenas imagem padrão e informações do produto
- Layout simplificado

---

## 4. Produto com Especificações Detalhadas

**Exemplo**: Válvula de Gaveta com especificações técnicas completas

```typescript
{
  id: '2',
  name: 'Válvula de Gaveta',
  slug: 'valvula-gaveta',
  description: 'Válvulas de gaveta para controle de fluxo em sistemas de alta pressão. Projeto robusto com vedação metálica.',
  
  specifications: {
    'Pressão Máxima': '300 PSI',
    'Temperatura': '-29°C a 425°C',
    'Tipo de Operação': 'Volante / Atuador',
    'Vedação': 'Metal-to-Metal',
    'Conexão': 'Flangeada RF',
    'Norma de Teste': 'API 598',
  },
  
  applications: [
    'Refinarias de petróleo',
    'Indústria petroquímica',
    'Sistemas de alta pressão',
    'Aplicações críticas',
  ],
  
  standards: ['ASME B16.34', 'API 600', 'API 598'],
  
  variants: [
    {
      type: 'Aço Carbono',
      description: 'Para aplicações gerais de alta pressão. Boa resistência mecânica.',
      sizes: [
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-2.jpg',
          description: 'Válvula de gaveta aço carbono 2" - Classe 150.'
        },
        {
          size: '3"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-3.jpg',
          description: 'Válvula de gaveta aço carbono 3" - Classe 300.'
        },
        {
          size: '4"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-aco-carbono-4.jpg',
          description: 'Válvula de gaveta aço carbono 4" - Classe 600.'
        }
      ]
    },
    {
      type: 'Inox',
      description: 'Para ambientes corrosivos e aplicações que exigem alta pureza.',
      sizes: [
        {
          size: '2"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-inox-2.jpg',
          description: 'Válvula de gaveta inox 2" - Aço inoxidável 316L.'
        },
        {
          size: '3"',
          image: '/imagens/valvulas-industriais/valvula-gaveta-inox-3.jpg',
          description: 'Válvula de gaveta inox 3" - Resistente a corrosão.'
        }
      ]
    }
  ]
}
```

---

## 📝 Campos Opcionais vs Obrigatórios

### Obrigatórios
- `id`: Identificador único
- `name`: Nome do produto
- `slug`: URL amigável (único)
- `description`: Descrição do produto

### Opcionais mas Recomendados
- `image`: Imagem padrão (quando não há variants/sizes)
- `specifications`: Especificações técnicas
- `applications`: Aplicações recomendadas
- `standards`: Normas técnicas

### Estrutura Condicional
- **Se tem `variants`**: Cada variant tem `type` e `sizes[]`
- **Se não tem `variants` mas tem `sizes`**: Tamanhos diretos no produto
- **Se não tem nem `variants` nem `sizes`**: Produto simples, usa apenas `image`

---

## 🎯 Boas Práticas

### 1. Nomenclatura de Imagens
```
/imagens/
  valvulas-industriais/
    valvula-esfera-aco-carbono-1-2.jpg
    valvula-esfera-aco-carbono-1.jpg
    valvula-esfera-inox-1-2.jpg
    valvula-gaveta-aco-carbono-2.jpg
```

### 2. Descrições
- **Produto**: Descrição geral (2-3 linhas)
- **Variant**: Características do material/tipo
- **Size**: Informações específicas do tamanho

### 3. Especificações
- Use chaves descritivas: `'Pressão Máxima'` não `'pressure'`
- Valores claros: `'150 PSI'` não `'150'`
- Ordene por importância

### 4. Aplicações
- Liste de forma específica: `'Refinarias de petróleo'` não `'Indústria'`
- Máximo 5-7 aplicações principais

### 5. Standards
- Use códigos completos: `'ASME B16.34'` não `'B16.34'`
- Ordene por relevância

---

## 🔄 Migração de Dados Existentes

Se você já tem produtos cadastrados, pode adicionar os novos campos gradualmente:

```typescript
// Antes
{
  name: 'Válvula de Esfera',
  description: '...',
  variants: [...]
}

// Depois (adicionar campos opcionais)
{
  name: 'Válvula de Esfera',
  description: '...',
  variants: [...],
  specifications: { ... },  // Novo
  applications: [...],        // Novo
  standards: [...]           // Novo
}
```

Os campos novos são opcionais, então produtos antigos continuam funcionando!

---

**Estrutura pronta para uso!** 🚀



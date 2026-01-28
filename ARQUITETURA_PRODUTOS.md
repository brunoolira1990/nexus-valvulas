# Arquitetura de Produtos - Nexus Válvulas

## 📁 Estrutura de Pastas Recomendada

```
src/
├── components/
│   ├── products/              # Componentes específicos de produtos
│   │   ├── ProductGallery.tsx      # Galeria de imagens com zoom
│   │   ├── VariantSelector.tsx    # Seletor de variações (tipo/tamanho)
│   │   ├── ProductSpecs.tsx       # Especificações técnicas
│   │   └── ProductCard.tsx        # Card de produto (opcional)
│   └── ui/                    # Componentes shadcn/ui (já existente)
│
├── hooks/
│   └── useProductVariants.ts  # Hook para gerenciar variações
│
├── mocks/
│   └── products.ts            # Dados dos produtos (JSON/TS)
│
├── pages/
│   ├── Produtos.tsx           # Lista de categorias
│   ├── ProdutoCategoria.tsx    # Lista de produtos da categoria
│   └── ProdutoDetalhes.tsx     # Página de detalhes do produto
│
└── lib/
    └── utils.ts               # Utilitários (cn, etc.)
```

---

## 📊 Estrutura de Dados

### Tipos TypeScript

```typescript
// Tamanho do produto (ex: 1/2", 1", 2")
interface ProductSize {
  size: string;              // Ex: "1/2\"", "2\""
  image: string;             // URL da imagem específica deste tamanho
  description?: string;      // Descrição opcional
}

// Variante do produto (ex: Aço Carbono, Inox, Latão)
interface ProductVariant {
  type: string;              // Ex: "Aço Carbono", "Inox"
  sizes: ProductSize[];      // Tamanhos disponíveis para este tipo
  description?: string;      // Descrição do material/tipo
}

// Tipo de Produto (ex: Válvula de Esfera)
interface ProductType {
  id: string;
  name: string;              // Ex: "Válvula de Esfera"
  slug: string;              // Ex: "valvula-esfera"
  description: string;       // Descrição geral do produto
  
  // Imagem padrão (usada quando não há variants/sizes)
  image?: string;
  
  // Variações do produto (ex: diferentes materiais)
  variants?: ProductVariant[];
  
  // Tamanhos diretos (quando não há variants, mas há sizes)
  sizes?: ProductSize[];
  
  // Dados adicionais para SEO e especificações
  specifications?: Record<string, string>;  // Ex: { "Pressão": "150 PSI", "Temperatura": "200°C" }
  applications?: string[];                  // Ex: ["Refinarias", "Siderúrgicas"]
  standards?: string[];                     // Ex: ["ASME B16.34", "API 600"]
}

// Categoria de Produtos
interface ProductCategory {
  id: string;
  name: string;              // Ex: "Válvulas Industriais"
  slug: string;              // Ex: "valvulas-industriais"
  description: string;
  image: string;             // Imagem da categoria
  types: ProductType[];       // Tipos de produtos nesta categoria
}
```

---

## 🎨 Componentes Principais

### 1. ProductGallery

**Responsabilidade**: Exibir imagens do produto com zoom e miniaturas.

**Features**:
- Imagem principal em destaque
- Miniaturas clicáveis
- Zoom ao clicar na imagem
- Placeholder quando imagem não carrega
- Lazy loading para performance

**Uso**:
```tsx
<ProductGallery 
  images={availableImages} 
  productName={product.name} 
/>
```

---

### 2. VariantSelector

**Responsabilidade**: Permitir seleção de tipo e tamanho do produto.

**Features**:
- Suporta dois modos: `select` (dropdown) ou `radio` (botões)
- Exibe descrições quando disponíveis
- Atualiza estado automaticamente

**Uso**:
```tsx
<VariantSelector
  label="Material"
  value={selectedType}
  options={typeOptions}
  onChange={setSelectedType}
  variant="radio"  // ou "select"
/>
```

---

### 3. ProductSpecs

**Responsabilidade**: Exibir especificações técnicas, aplicações e normas.

**Features**:
- Especificações técnicas em formato chave-valor
- Lista de aplicações recomendadas
- Badges de normas técnicas
- Configuração selecionada (tipo + tamanho)

**Uso**:
```tsx
<ProductSpecs
  specifications={product.specifications}
  applications={product.applications}
  standards={product.standards}
  selectedVariant={{ type: "Inox", size: "2\"" }}
/>
```

---

### 4. useProductVariants (Hook)

**Responsabilidade**: Gerenciar lógica de variações de produtos.

**Features**:
- Estado de tipo e tamanho selecionados
- Cálculo automático de imagens disponíveis
- Opções de tipos e tamanhos baseadas na seleção
- Reset automático quando produto muda

**Uso**:
```tsx
const {
  selectedType,
  selectedSize,
  availableImages,
  typeOptions,
  sizeOptions,
  setSelectedType,
  setSelectedSize,
  hasVariants,
  hasSizesOnly,
  isSimple,
} = useProductVariants(product);
```

---

## 🔄 Fluxo de Funcionamento

### Produto com Variants (ex: Válvula de Esfera)

1. **Usuário acessa página**: `/produtos/valvulas-industriais/valvula-esfera`
2. **Hook inicializa**: Seleciona primeiro tipo (ex: "Aço Carbono") e primeiro tamanho (ex: "1/2\"")
3. **Imagem carrega**: Imagem específica para "Aço Carbono 1/2\""
4. **Usuário seleciona novo tipo**: Ex: "Inox"
   - Hook reseta tamanho para primeiro disponível em "Inox"
   - Imagem atualiza automaticamente
5. **Usuário seleciona novo tamanho**: Ex: "2\""
   - Imagem atualiza para "Inox 2\""

### Produto com Sizes Apenas (ex: Válvula de Retenção)

1. **Usuário acessa página**: `/produtos/valvulas-industriais/valvula-retencao`
2. **Hook inicializa**: Seleciona primeiro tamanho (ex: "1\"")
3. **Imagem carrega**: Imagem específica para "1\""
4. **Usuário seleciona novo tamanho**: Ex: "3\""
   - Imagem atualiza automaticamente

### Produto Simples (ex: Flanges)

1. **Usuário acessa página**: `/produtos/conexoes-tubulares/flanges`
2. **Hook detecta**: Produto sem variants nem sizes
3. **Imagem carrega**: Imagem padrão do produto
4. **Sem seletores**: Interface se adapta automaticamente

---

## 🎯 Lógica de Troca de Imagens

A lógica está centralizada no hook `useProductVariants`:

```typescript
// 1. Se tem variants E tipo selecionado E tamanho selecionado
if (product.variants && selectedType && selectedSize) {
  const variant = product.variants.find(v => v.type === selectedType);
  const size = variant?.sizes.find(s => s.size === selectedSize);
  if (size?.image) {
    images.push(size.image);  // Imagem específica: tipo + tamanho
  }
}
// 2. Se tem apenas sizes E tamanho selecionado
else if (product.sizes && selectedSize) {
  const size = product.sizes.find(s => s.size === selectedSize);
  if (size?.image) {
    images.push(size.image);  // Imagem específica: tamanho
  }
}
// 3. Imagem padrão do produto
else if (product.image) {
  images.push(product.image);  // Imagem genérica
}
```

**Regras**:
- Prioridade: Variant+Size > Size > Imagem padrão
- Quando tipo muda, tamanho reseta para primeiro disponível
- Imagens são calculadas automaticamente via `useMemo`

---

## 🎨 UI/UX Profissional B2B

### Princípios Aplicados

1. **Hierarquia Visual Clara**
   - Título em destaque
   - Badges para categoria/tipo/tamanho
   - Separação visual entre seções

2. **Feedback Imediato**
   - Seletores destacam opção escolhida
   - Imagem atualiza instantaneamente
   - Descrições contextuais aparecem

3. **Layout Responsivo**
   - Grid adaptável (1 coluna mobile, 2 desktop)
   - Imagens responsivas
   - CTAs empilhados em mobile

4. **Visual Industrial**
   - Cores profissionais (azul/laranja)
   - Tipografia clara e legível
   - Espaçamento generoso
   - Cards com sombras sutis

5. **Acessibilidade**
   - Labels descritivos
   - ARIA labels nos botões
   - Navegação por teclado
   - Contraste adequado

---

## 🔍 SEO Otimizado

### Metadados Dinâmicos

```tsx
<SEO
  title={`${product.name}${selectedSize ? ` ${selectedSize}` : ""} - ${category.name} | Nexus Válvulas`}
  description={product.description || `Conheça ${product.name}...`}
  keywords={`${product.name}, ${category.name}, válvulas industriais, ${selectedType || ""}`}
  image={availableImages[0] || product.image}
  canonical={`/produtos/${categoria}/${produto}`}
/>
```

### URLs Amigáveis

- `/produtos/valvulas-industriais/valvula-esfera`
- `/produtos/conexoes-tubulares/flanges`

### Structured Data (Opcional)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Válvula de Esfera",
  "description": "...",
  "category": "Válvulas Industriais",
  "image": "..."
}
```

### Headings Semânticos

- `<h1>`: Nome do produto (apenas um por página)
- `<h2>`: Seções principais
- `<h3>`: Subseções

---

## 📝 Exemplo de Dados

### Produto com Variants

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo...',
  variants: [
    {
      type: 'Aço Carbono',
      description: 'Ideal para aplicações gerais...',
      sizes: [
        { size: '1/2"', image: '/imagens/.../aco-1-2.jpg' },
        { size: '1"', image: '/imagens/.../aco-1.jpg' },
        { size: '2"', image: '/imagens/.../aco-2.jpg' }
      ]
    },
    {
      type: 'Inox',
      description: 'Resistente à corrosão...',
      sizes: [
        { size: '1/2"', image: '/imagens/.../inox-1-2.jpg' },
        { size: '1"', image: '/imagens/.../inox-1.jpg' }
      ]
    }
  ],
  specifications: {
    "Pressão Máxima": "150 PSI",
    "Temperatura": "-20°C a 200°C"
  },
  applications: ["Refinarias", "Siderúrgicas", "Química"],
  standards: ["ASME B16.34", "API 600"]
}
```

### Produto com Sizes Apenas

```typescript
{
  id: '3',
  name: 'Válvula de Retenção',
  slug: 'valvula-retencao',
  description: 'Válvulas de retenção para prevenir refluxo...',
  image: '/imagens/valvula-retencao.jpg',  // Imagem padrão
  sizes: [
    { size: '1"', image: '/imagens/.../retencao-1.jpg' },
    { size: '2"', image: '/imagens/.../retencao-2.jpg' },
    { size: '3"', image: '/imagens/.../retencao-3.jpg' }
  ]
}
```

### Produto Simples

```typescript
{
  id: '4',
  name: 'Flanges',
  slug: 'flanges',
  description: 'Flanges para conexão de tubulações...',
  image: '/imagens/flanges.png'  // Apenas uma imagem
}
```

---

## 🚀 Performance

### Otimizações Implementadas

1. **Lazy Loading de Imagens**
   - Primeira imagem: `loading="eager"`
   - Demais: `loading="lazy"`

2. **Memoização**
   - `useMemo` para cálculos de imagens/opções
   - Evita recálculos desnecessários

3. **Code Splitting**
   - Componentes lazy-loaded via React Router
   - Reduz bundle inicial

4. **Imagens Otimizadas**
   - Formato WebP quando possível
   - Tamanhos adequados
   - Placeholders durante carregamento

---

## ✅ Checklist de Implementação

- [x] Tipos TypeScript corrigidos e expandidos
- [x] Hook `useProductVariants` criado
- [x] Componente `ProductGallery` criado
- [x] Componente `VariantSelector` criado
- [x] Componente `ProductSpecs` criado
- [x] Página `ProdutoDetalhes` refatorada
- [x] SEO otimizado com metadados dinâmicos
- [x] UI/UX profissional B2B
- [x] Responsividade implementada
- [x] Acessibilidade considerada

---

## 📚 Próximos Passos (Opcional)

1. **Galeria de Imagens Avançada**
   - Lightbox para zoom
   - Navegação por setas
   - Indicador de imagem atual

2. **Comparação de Produtos**
   - Tabela comparativa
   - Destaque de diferenças

3. **Downloads**
   - PDFs técnicos
   - Desenhos CAD
   - Catálogos

4. **Filtros Avançados**
   - Por material
   - Por tamanho
   - Por aplicação

5. **Busca**
   - Busca por nome
   - Busca por especificações
   - Autocomplete

---

**Arquitetura pronta para produção!** 🎉



## 📁 Estrutura de Pastas Recomendada

```
src/
├── components/
│   ├── products/              # Componentes específicos de produtos
│   │   ├── ProductGallery.tsx      # Galeria de imagens com zoom
│   │   ├── VariantSelector.tsx    # Seletor de variações (tipo/tamanho)
│   │   ├── ProductSpecs.tsx       # Especificações técnicas
│   │   └── ProductCard.tsx        # Card de produto (opcional)
│   └── ui/                    # Componentes shadcn/ui (já existente)
│
├── hooks/
│   └── useProductVariants.ts  # Hook para gerenciar variações
│
├── mocks/
│   └── products.ts            # Dados dos produtos (JSON/TS)
│
├── pages/
│   ├── Produtos.tsx           # Lista de categorias
│   ├── ProdutoCategoria.tsx    # Lista de produtos da categoria
│   └── ProdutoDetalhes.tsx     # Página de detalhes do produto
│
└── lib/
    └── utils.ts               # Utilitários (cn, etc.)
```

---

## 📊 Estrutura de Dados

### Tipos TypeScript

```typescript
// Tamanho do produto (ex: 1/2", 1", 2")
interface ProductSize {
  size: string;              // Ex: "1/2\"", "2\""
  image: string;             // URL da imagem específica deste tamanho
  description?: string;      // Descrição opcional
}

// Variante do produto (ex: Aço Carbono, Inox, Latão)
interface ProductVariant {
  type: string;              // Ex: "Aço Carbono", "Inox"
  sizes: ProductSize[];      // Tamanhos disponíveis para este tipo
  description?: string;      // Descrição do material/tipo
}

// Tipo de Produto (ex: Válvula de Esfera)
interface ProductType {
  id: string;
  name: string;              // Ex: "Válvula de Esfera"
  slug: string;              // Ex: "valvula-esfera"
  description: string;       // Descrição geral do produto
  
  // Imagem padrão (usada quando não há variants/sizes)
  image?: string;
  
  // Variações do produto (ex: diferentes materiais)
  variants?: ProductVariant[];
  
  // Tamanhos diretos (quando não há variants, mas há sizes)
  sizes?: ProductSize[];
  
  // Dados adicionais para SEO e especificações
  specifications?: Record<string, string>;  // Ex: { "Pressão": "150 PSI", "Temperatura": "200°C" }
  applications?: string[];                  // Ex: ["Refinarias", "Siderúrgicas"]
  standards?: string[];                     // Ex: ["ASME B16.34", "API 600"]
}

// Categoria de Produtos
interface ProductCategory {
  id: string;
  name: string;              // Ex: "Válvulas Industriais"
  slug: string;              // Ex: "valvulas-industriais"
  description: string;
  image: string;             // Imagem da categoria
  types: ProductType[];       // Tipos de produtos nesta categoria
}
```

---

## 🎨 Componentes Principais

### 1. ProductGallery

**Responsabilidade**: Exibir imagens do produto com zoom e miniaturas.

**Features**:
- Imagem principal em destaque
- Miniaturas clicáveis
- Zoom ao clicar na imagem
- Placeholder quando imagem não carrega
- Lazy loading para performance

**Uso**:
```tsx
<ProductGallery 
  images={availableImages} 
  productName={product.name} 
/>
```

---

### 2. VariantSelector

**Responsabilidade**: Permitir seleção de tipo e tamanho do produto.

**Features**:
- Suporta dois modos: `select` (dropdown) ou `radio` (botões)
- Exibe descrições quando disponíveis
- Atualiza estado automaticamente

**Uso**:
```tsx
<VariantSelector
  label="Material"
  value={selectedType}
  options={typeOptions}
  onChange={setSelectedType}
  variant="radio"  // ou "select"
/>
```

---

### 3. ProductSpecs

**Responsabilidade**: Exibir especificações técnicas, aplicações e normas.

**Features**:
- Especificações técnicas em formato chave-valor
- Lista de aplicações recomendadas
- Badges de normas técnicas
- Configuração selecionada (tipo + tamanho)

**Uso**:
```tsx
<ProductSpecs
  specifications={product.specifications}
  applications={product.applications}
  standards={product.standards}
  selectedVariant={{ type: "Inox", size: "2\"" }}
/>
```

---

### 4. useProductVariants (Hook)

**Responsabilidade**: Gerenciar lógica de variações de produtos.

**Features**:
- Estado de tipo e tamanho selecionados
- Cálculo automático de imagens disponíveis
- Opções de tipos e tamanhos baseadas na seleção
- Reset automático quando produto muda

**Uso**:
```tsx
const {
  selectedType,
  selectedSize,
  availableImages,
  typeOptions,
  sizeOptions,
  setSelectedType,
  setSelectedSize,
  hasVariants,
  hasSizesOnly,
  isSimple,
} = useProductVariants(product);
```

---

## 🔄 Fluxo de Funcionamento

### Produto com Variants (ex: Válvula de Esfera)

1. **Usuário acessa página**: `/produtos/valvulas-industriais/valvula-esfera`
2. **Hook inicializa**: Seleciona primeiro tipo (ex: "Aço Carbono") e primeiro tamanho (ex: "1/2\"")
3. **Imagem carrega**: Imagem específica para "Aço Carbono 1/2\""
4. **Usuário seleciona novo tipo**: Ex: "Inox"
   - Hook reseta tamanho para primeiro disponível em "Inox"
   - Imagem atualiza automaticamente
5. **Usuário seleciona novo tamanho**: Ex: "2\""
   - Imagem atualiza para "Inox 2\""

### Produto com Sizes Apenas (ex: Válvula de Retenção)

1. **Usuário acessa página**: `/produtos/valvulas-industriais/valvula-retencao`
2. **Hook inicializa**: Seleciona primeiro tamanho (ex: "1\"")
3. **Imagem carrega**: Imagem específica para "1\""
4. **Usuário seleciona novo tamanho**: Ex: "3\""
   - Imagem atualiza automaticamente

### Produto Simples (ex: Flanges)

1. **Usuário acessa página**: `/produtos/conexoes-tubulares/flanges`
2. **Hook detecta**: Produto sem variants nem sizes
3. **Imagem carrega**: Imagem padrão do produto
4. **Sem seletores**: Interface se adapta automaticamente

---

## 🎯 Lógica de Troca de Imagens

A lógica está centralizada no hook `useProductVariants`:

```typescript
// 1. Se tem variants E tipo selecionado E tamanho selecionado
if (product.variants && selectedType && selectedSize) {
  const variant = product.variants.find(v => v.type === selectedType);
  const size = variant?.sizes.find(s => s.size === selectedSize);
  if (size?.image) {
    images.push(size.image);  // Imagem específica: tipo + tamanho
  }
}
// 2. Se tem apenas sizes E tamanho selecionado
else if (product.sizes && selectedSize) {
  const size = product.sizes.find(s => s.size === selectedSize);
  if (size?.image) {
    images.push(size.image);  // Imagem específica: tamanho
  }
}
// 3. Imagem padrão do produto
else if (product.image) {
  images.push(product.image);  // Imagem genérica
}
```

**Regras**:
- Prioridade: Variant+Size > Size > Imagem padrão
- Quando tipo muda, tamanho reseta para primeiro disponível
- Imagens são calculadas automaticamente via `useMemo`

---

## 🎨 UI/UX Profissional B2B

### Princípios Aplicados

1. **Hierarquia Visual Clara**
   - Título em destaque
   - Badges para categoria/tipo/tamanho
   - Separação visual entre seções

2. **Feedback Imediato**
   - Seletores destacam opção escolhida
   - Imagem atualiza instantaneamente
   - Descrições contextuais aparecem

3. **Layout Responsivo**
   - Grid adaptável (1 coluna mobile, 2 desktop)
   - Imagens responsivas
   - CTAs empilhados em mobile

4. **Visual Industrial**
   - Cores profissionais (azul/laranja)
   - Tipografia clara e legível
   - Espaçamento generoso
   - Cards com sombras sutis

5. **Acessibilidade**
   - Labels descritivos
   - ARIA labels nos botões
   - Navegação por teclado
   - Contraste adequado

---

## 🔍 SEO Otimizado

### Metadados Dinâmicos

```tsx
<SEO
  title={`${product.name}${selectedSize ? ` ${selectedSize}` : ""} - ${category.name} | Nexus Válvulas`}
  description={product.description || `Conheça ${product.name}...`}
  keywords={`${product.name}, ${category.name}, válvulas industriais, ${selectedType || ""}`}
  image={availableImages[0] || product.image}
  canonical={`/produtos/${categoria}/${produto}`}
/>
```

### URLs Amigáveis

- `/produtos/valvulas-industriais/valvula-esfera`
- `/produtos/conexoes-tubulares/flanges`

### Structured Data (Opcional)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Válvula de Esfera",
  "description": "...",
  "category": "Válvulas Industriais",
  "image": "..."
}
```

### Headings Semânticos

- `<h1>`: Nome do produto (apenas um por página)
- `<h2>`: Seções principais
- `<h3>`: Subseções

---

## 📝 Exemplo de Dados

### Produto com Variants

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo...',
  variants: [
    {
      type: 'Aço Carbono',
      description: 'Ideal para aplicações gerais...',
      sizes: [
        { size: '1/2"', image: '/imagens/.../aco-1-2.jpg' },
        { size: '1"', image: '/imagens/.../aco-1.jpg' },
        { size: '2"', image: '/imagens/.../aco-2.jpg' }
      ]
    },
    {
      type: 'Inox',
      description: 'Resistente à corrosão...',
      sizes: [
        { size: '1/2"', image: '/imagens/.../inox-1-2.jpg' },
        { size: '1"', image: '/imagens/.../inox-1.jpg' }
      ]
    }
  ],
  specifications: {
    "Pressão Máxima": "150 PSI",
    "Temperatura": "-20°C a 200°C"
  },
  applications: ["Refinarias", "Siderúrgicas", "Química"],
  standards: ["ASME B16.34", "API 600"]
}
```

### Produto com Sizes Apenas

```typescript
{
  id: '3',
  name: 'Válvula de Retenção',
  slug: 'valvula-retencao',
  description: 'Válvulas de retenção para prevenir refluxo...',
  image: '/imagens/valvula-retencao.jpg',  // Imagem padrão
  sizes: [
    { size: '1"', image: '/imagens/.../retencao-1.jpg' },
    { size: '2"', image: '/imagens/.../retencao-2.jpg' },
    { size: '3"', image: '/imagens/.../retencao-3.jpg' }
  ]
}
```

### Produto Simples

```typescript
{
  id: '4',
  name: 'Flanges',
  slug: 'flanges',
  description: 'Flanges para conexão de tubulações...',
  image: '/imagens/flanges.png'  // Apenas uma imagem
}
```

---

## 🚀 Performance

### Otimizações Implementadas

1. **Lazy Loading de Imagens**
   - Primeira imagem: `loading="eager"`
   - Demais: `loading="lazy"`

2. **Memoização**
   - `useMemo` para cálculos de imagens/opções
   - Evita recálculos desnecessários

3. **Code Splitting**
   - Componentes lazy-loaded via React Router
   - Reduz bundle inicial

4. **Imagens Otimizadas**
   - Formato WebP quando possível
   - Tamanhos adequados
   - Placeholders durante carregamento

---

## ✅ Checklist de Implementação

- [x] Tipos TypeScript corrigidos e expandidos
- [x] Hook `useProductVariants` criado
- [x] Componente `ProductGallery` criado
- [x] Componente `VariantSelector` criado
- [x] Componente `ProductSpecs` criado
- [x] Página `ProdutoDetalhes` refatorada
- [x] SEO otimizado com metadados dinâmicos
- [x] UI/UX profissional B2B
- [x] Responsividade implementada
- [x] Acessibilidade considerada

---

## 📚 Próximos Passos (Opcional)

1. **Galeria de Imagens Avançada**
   - Lightbox para zoom
   - Navegação por setas
   - Indicador de imagem atual

2. **Comparação de Produtos**
   - Tabela comparativa
   - Destaque de diferenças

3. **Downloads**
   - PDFs técnicos
   - Desenhos CAD
   - Catálogos

4. **Filtros Avançados**
   - Por material
   - Por tamanho
   - Por aplicação

5. **Busca**
   - Busca por nome
   - Busca por especificações
   - Autocomplete

---

**Arquitetura pronta para produção!** 🎉



## 📁 Estrutura de Pastas Recomendada

```
src/
├── components/
│   ├── products/              # Componentes específicos de produtos
│   │   ├── ProductGallery.tsx      # Galeria de imagens com zoom
│   │   ├── VariantSelector.tsx    # Seletor de variações (tipo/tamanho)
│   │   ├── ProductSpecs.tsx       # Especificações técnicas
│   │   └── ProductCard.tsx        # Card de produto (opcional)
│   └── ui/                    # Componentes shadcn/ui (já existente)
│
├── hooks/
│   └── useProductVariants.ts  # Hook para gerenciar variações
│
├── mocks/
│   └── products.ts            # Dados dos produtos (JSON/TS)
│
├── pages/
│   ├── Produtos.tsx           # Lista de categorias
│   ├── ProdutoCategoria.tsx    # Lista de produtos da categoria
│   └── ProdutoDetalhes.tsx     # Página de detalhes do produto
│
└── lib/
    └── utils.ts               # Utilitários (cn, etc.)
```

---

## 📊 Estrutura de Dados

### Tipos TypeScript

```typescript
// Tamanho do produto (ex: 1/2", 1", 2")
interface ProductSize {
  size: string;              // Ex: "1/2\"", "2\""
  image: string;             // URL da imagem específica deste tamanho
  description?: string;      // Descrição opcional
}

// Variante do produto (ex: Aço Carbono, Inox, Latão)
interface ProductVariant {
  type: string;              // Ex: "Aço Carbono", "Inox"
  sizes: ProductSize[];      // Tamanhos disponíveis para este tipo
  description?: string;      // Descrição do material/tipo
}

// Tipo de Produto (ex: Válvula de Esfera)
interface ProductType {
  id: string;
  name: string;              // Ex: "Válvula de Esfera"
  slug: string;              // Ex: "valvula-esfera"
  description: string;       // Descrição geral do produto
  
  // Imagem padrão (usada quando não há variants/sizes)
  image?: string;
  
  // Variações do produto (ex: diferentes materiais)
  variants?: ProductVariant[];
  
  // Tamanhos diretos (quando não há variants, mas há sizes)
  sizes?: ProductSize[];
  
  // Dados adicionais para SEO e especificações
  specifications?: Record<string, string>;  // Ex: { "Pressão": "150 PSI", "Temperatura": "200°C" }
  applications?: string[];                  // Ex: ["Refinarias", "Siderúrgicas"]
  standards?: string[];                     // Ex: ["ASME B16.34", "API 600"]
}

// Categoria de Produtos
interface ProductCategory {
  id: string;
  name: string;              // Ex: "Válvulas Industriais"
  slug: string;              // Ex: "valvulas-industriais"
  description: string;
  image: string;             // Imagem da categoria
  types: ProductType[];       // Tipos de produtos nesta categoria
}
```

---

## 🎨 Componentes Principais

### 1. ProductGallery

**Responsabilidade**: Exibir imagens do produto com zoom e miniaturas.

**Features**:
- Imagem principal em destaque
- Miniaturas clicáveis
- Zoom ao clicar na imagem
- Placeholder quando imagem não carrega
- Lazy loading para performance

**Uso**:
```tsx
<ProductGallery 
  images={availableImages} 
  productName={product.name} 
/>
```

---

### 2. VariantSelector

**Responsabilidade**: Permitir seleção de tipo e tamanho do produto.

**Features**:
- Suporta dois modos: `select` (dropdown) ou `radio` (botões)
- Exibe descrições quando disponíveis
- Atualiza estado automaticamente

**Uso**:
```tsx
<VariantSelector
  label="Material"
  value={selectedType}
  options={typeOptions}
  onChange={setSelectedType}
  variant="radio"  // ou "select"
/>
```

---

### 3. ProductSpecs

**Responsabilidade**: Exibir especificações técnicas, aplicações e normas.

**Features**:
- Especificações técnicas em formato chave-valor
- Lista de aplicações recomendadas
- Badges de normas técnicas
- Configuração selecionada (tipo + tamanho)

**Uso**:
```tsx
<ProductSpecs
  specifications={product.specifications}
  applications={product.applications}
  standards={product.standards}
  selectedVariant={{ type: "Inox", size: "2\"" }}
/>
```

---

### 4. useProductVariants (Hook)

**Responsabilidade**: Gerenciar lógica de variações de produtos.

**Features**:
- Estado de tipo e tamanho selecionados
- Cálculo automático de imagens disponíveis
- Opções de tipos e tamanhos baseadas na seleção
- Reset automático quando produto muda

**Uso**:
```tsx
const {
  selectedType,
  selectedSize,
  availableImages,
  typeOptions,
  sizeOptions,
  setSelectedType,
  setSelectedSize,
  hasVariants,
  hasSizesOnly,
  isSimple,
} = useProductVariants(product);
```

---

## 🔄 Fluxo de Funcionamento

### Produto com Variants (ex: Válvula de Esfera)

1. **Usuário acessa página**: `/produtos/valvulas-industriais/valvula-esfera`
2. **Hook inicializa**: Seleciona primeiro tipo (ex: "Aço Carbono") e primeiro tamanho (ex: "1/2\"")
3. **Imagem carrega**: Imagem específica para "Aço Carbono 1/2\""
4. **Usuário seleciona novo tipo**: Ex: "Inox"
   - Hook reseta tamanho para primeiro disponível em "Inox"
   - Imagem atualiza automaticamente
5. **Usuário seleciona novo tamanho**: Ex: "2\""
   - Imagem atualiza para "Inox 2\""

### Produto com Sizes Apenas (ex: Válvula de Retenção)

1. **Usuário acessa página**: `/produtos/valvulas-industriais/valvula-retencao`
2. **Hook inicializa**: Seleciona primeiro tamanho (ex: "1\"")
3. **Imagem carrega**: Imagem específica para "1\""
4. **Usuário seleciona novo tamanho**: Ex: "3\""
   - Imagem atualiza automaticamente

### Produto Simples (ex: Flanges)

1. **Usuário acessa página**: `/produtos/conexoes-tubulares/flanges`
2. **Hook detecta**: Produto sem variants nem sizes
3. **Imagem carrega**: Imagem padrão do produto
4. **Sem seletores**: Interface se adapta automaticamente

---

## 🎯 Lógica de Troca de Imagens

A lógica está centralizada no hook `useProductVariants`:

```typescript
// 1. Se tem variants E tipo selecionado E tamanho selecionado
if (product.variants && selectedType && selectedSize) {
  const variant = product.variants.find(v => v.type === selectedType);
  const size = variant?.sizes.find(s => s.size === selectedSize);
  if (size?.image) {
    images.push(size.image);  // Imagem específica: tipo + tamanho
  }
}
// 2. Se tem apenas sizes E tamanho selecionado
else if (product.sizes && selectedSize) {
  const size = product.sizes.find(s => s.size === selectedSize);
  if (size?.image) {
    images.push(size.image);  // Imagem específica: tamanho
  }
}
// 3. Imagem padrão do produto
else if (product.image) {
  images.push(product.image);  // Imagem genérica
}
```

**Regras**:
- Prioridade: Variant+Size > Size > Imagem padrão
- Quando tipo muda, tamanho reseta para primeiro disponível
- Imagens são calculadas automaticamente via `useMemo`

---

## 🎨 UI/UX Profissional B2B

### Princípios Aplicados

1. **Hierarquia Visual Clara**
   - Título em destaque
   - Badges para categoria/tipo/tamanho
   - Separação visual entre seções

2. **Feedback Imediato**
   - Seletores destacam opção escolhida
   - Imagem atualiza instantaneamente
   - Descrições contextuais aparecem

3. **Layout Responsivo**
   - Grid adaptável (1 coluna mobile, 2 desktop)
   - Imagens responsivas
   - CTAs empilhados em mobile

4. **Visual Industrial**
   - Cores profissionais (azul/laranja)
   - Tipografia clara e legível
   - Espaçamento generoso
   - Cards com sombras sutis

5. **Acessibilidade**
   - Labels descritivos
   - ARIA labels nos botões
   - Navegação por teclado
   - Contraste adequado

---

## 🔍 SEO Otimizado

### Metadados Dinâmicos

```tsx
<SEO
  title={`${product.name}${selectedSize ? ` ${selectedSize}` : ""} - ${category.name} | Nexus Válvulas`}
  description={product.description || `Conheça ${product.name}...`}
  keywords={`${product.name}, ${category.name}, válvulas industriais, ${selectedType || ""}`}
  image={availableImages[0] || product.image}
  canonical={`/produtos/${categoria}/${produto}`}
/>
```

### URLs Amigáveis

- `/produtos/valvulas-industriais/valvula-esfera`
- `/produtos/conexoes-tubulares/flanges`

### Structured Data (Opcional)

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Válvula de Esfera",
  "description": "...",
  "category": "Válvulas Industriais",
  "image": "..."
}
```

### Headings Semânticos

- `<h1>`: Nome do produto (apenas um por página)
- `<h2>`: Seções principais
- `<h3>`: Subseções

---

## 📝 Exemplo de Dados

### Produto com Variants

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo...',
  variants: [
    {
      type: 'Aço Carbono',
      description: 'Ideal para aplicações gerais...',
      sizes: [
        { size: '1/2"', image: '/imagens/.../aco-1-2.jpg' },
        { size: '1"', image: '/imagens/.../aco-1.jpg' },
        { size: '2"', image: '/imagens/.../aco-2.jpg' }
      ]
    },
    {
      type: 'Inox',
      description: 'Resistente à corrosão...',
      sizes: [
        { size: '1/2"', image: '/imagens/.../inox-1-2.jpg' },
        { size: '1"', image: '/imagens/.../inox-1.jpg' }
      ]
    }
  ],
  specifications: {
    "Pressão Máxima": "150 PSI",
    "Temperatura": "-20°C a 200°C"
  },
  applications: ["Refinarias", "Siderúrgicas", "Química"],
  standards: ["ASME B16.34", "API 600"]
}
```

### Produto com Sizes Apenas

```typescript
{
  id: '3',
  name: 'Válvula de Retenção',
  slug: 'valvula-retencao',
  description: 'Válvulas de retenção para prevenir refluxo...',
  image: '/imagens/valvula-retencao.jpg',  // Imagem padrão
  sizes: [
    { size: '1"', image: '/imagens/.../retencao-1.jpg' },
    { size: '2"', image: '/imagens/.../retencao-2.jpg' },
    { size: '3"', image: '/imagens/.../retencao-3.jpg' }
  ]
}
```

### Produto Simples

```typescript
{
  id: '4',
  name: 'Flanges',
  slug: 'flanges',
  description: 'Flanges para conexão de tubulações...',
  image: '/imagens/flanges.png'  // Apenas uma imagem
}
```

---

## 🚀 Performance

### Otimizações Implementadas

1. **Lazy Loading de Imagens**
   - Primeira imagem: `loading="eager"`
   - Demais: `loading="lazy"`

2. **Memoização**
   - `useMemo` para cálculos de imagens/opções
   - Evita recálculos desnecessários

3. **Code Splitting**
   - Componentes lazy-loaded via React Router
   - Reduz bundle inicial

4. **Imagens Otimizadas**
   - Formato WebP quando possível
   - Tamanhos adequados
   - Placeholders durante carregamento

---

## ✅ Checklist de Implementação

- [x] Tipos TypeScript corrigidos e expandidos
- [x] Hook `useProductVariants` criado
- [x] Componente `ProductGallery` criado
- [x] Componente `VariantSelector` criado
- [x] Componente `ProductSpecs` criado
- [x] Página `ProdutoDetalhes` refatorada
- [x] SEO otimizado com metadados dinâmicos
- [x] UI/UX profissional B2B
- [x] Responsividade implementada
- [x] Acessibilidade considerada

---

## 📚 Próximos Passos (Opcional)

1. **Galeria de Imagens Avançada**
   - Lightbox para zoom
   - Navegação por setas
   - Indicador de imagem atual

2. **Comparação de Produtos**
   - Tabela comparativa
   - Destaque de diferenças

3. **Downloads**
   - PDFs técnicos
   - Desenhos CAD
   - Catálogos

4. **Filtros Avançados**
   - Por material
   - Por tamanho
   - Por aplicação

5. **Busca**
   - Busca por nome
   - Busca por especificações
   - Autocomplete

---

**Arquitetura pronta para produção!** 🎉



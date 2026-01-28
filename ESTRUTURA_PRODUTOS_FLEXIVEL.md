# Estrutura de Dados Flexível para Produtos

## 📋 Visão Geral

Estrutura TypeScript que suporta **3 cenários diferentes** de produtos usando a mesma tipagem e componentes.

---

## 🎯 Os 3 Cenários

### 1. **COMPLEXO** (Ex: Válvula Esfera)
- Usuário escolhe **TIPO** → depois **TAMANHO** → imagem muda
- Estrutura: `variants[]` → cada variant tem `sizes{}`

### 2. **INTERMEDIÁRIO** (Ex: Válvula Gaveta)
- Usuário escolhe **TAMANHO** → imagem muda
- Estrutura: `sizes{}` direto no produto (sem variants)

### 3. **SIMPLES** (Ex: Filtro Y)
- Produto único, sem variações
- Estrutura: apenas `image` fixa

---

## 📊 Estrutura de Dados

### Tipos TypeScript

```typescript
export type ProductVariant = {
  id: string;
  name: string;
  description?: string;
  sizes?: Record<string, string>;      // Tamanhos → Imagens
  singleImage?: string;                // Imagem única (sem tamanhos)
};

export type Product = {
  id: string;
  title: string;
  description: string;
  slug: string;
  
  // CASO 3: SIMPLES
  image?: string;
  
  // CASO 1: COMPLEXO
  variants?: ProductVariant[];
  
  // CASO 2: INTERMEDIÁRIO
  sizes?: Record<string, string>;
  
  // Opcionais
  specifications?: Record<string, string>;
  applications?: string[];
  standards?: string[];
};
```

---

## 📝 Exemplos de Uso

### CASO 1: COMPLEXO (Válvula Esfera)

```typescript
{
  id: "valvula-esfera",
  title: "Válvula de Esfera",
  slug: "valvula-esfera",
  description: "Controle de fluxo de alta performance...",
  variants: [
    {
      id: "tripartida-300-pr",
      name: "Tripartida 300# Passagem Reduzida",
      sizes: {
        "1/2": "/img/esfera/tripartida300_12.jpg",
        "1": "/img/esfera/tripartida300_1.jpg",
        "2": "/img/esfera/tripartida300_2.jpg"
      }
    },
    {
      id: "monobloco",
      name: "Monobloco",
      sizes: {
        "1/2": "/img/esfera/monobloco_12.jpg",
        "1": "/img/esfera/monobloco_1.jpg"
      }
    }
  ]
}
```

**Fluxo**: Tipo selecionado → Tamanhos disponíveis → Imagem atualizada

---

### CASO 2: INTERMEDIÁRIO (Válvula Gaveta)

```typescript
{
  id: "valvula-gaveta",
  title: "Válvula de Gaveta",
  slug: "valvula-gaveta",
  description: "Controle de fluxo em alta pressão...",
  // Sem variants, mas tem sizes diretos
  sizes: {
    "2": "/img/gaveta/gaveta2.jpg",
    "3": "/img/gaveta/gaveta3.jpg",
    "4": "/img/gaveta/gaveta4.jpg"
  }
}
```

**Fluxo**: Tamanho selecionado → Imagem atualizada

---

### CASO 3: SIMPLES (Filtro Y)

```typescript
{
  id: "filtro-y",
  title: "Filtro Y",
  slug: "filtro-y",
  description: "Filtro para retenção de partículas...",
  // Apenas imagem fixa
  image: "/img/filtros/filtro-y-padrao.jpg"
}
```

**Fluxo**: Apenas exibe imagem e descrição (sem seletores)

---

## 🎣 Hook: `useProductSelection`

Hook unificado que gerencia os 3 cenários automaticamente.

### Uso no Componente

```typescript
import { useProductSelection } from "@/hooks/useProductSelection";
import { getProductBySlug } from "@/data/products";

function ProductPage() {
  const product = getProductBySlug("valvula-esfera");
  
  if (!product) return <NotFound />;
  
  const {
    selectedVariantId,
    selectedSize,
    currentImage,
    productType,           // "complex" | "intermediate" | "simple"
    availableVariants,
    availableSizes,
    setSelectedVariant,
    setSelectedSize,
    hasVariants,
    hasSizes,
    isSimple,
  } = useProductSelection(product);
  
  return (
    <div>
      {/* Galeria de Imagens */}
      <ProductGallery images={currentImage ? [currentImage] : []} />
      
      {/* Seletor de Tipo (apenas se complex) */}
      {hasVariants && (
        <VariantSelector
          label="Tipo"
          value={selectedVariantId}
          options={availableVariants.map(v => ({
            value: v.id,
            label: v.name,
            description: v.description
          }))}
          onChange={setSelectedVariant}
        />
      )}
      
      {/* Seletor de Tamanho (se complex ou intermediate) */}
      {hasSizes && (
        <SizeSelector
          label="Tamanho"
          value={selectedSize}
          options={availableSizes.map(s => ({
            value: s,
            label: s
          }))}
          onChange={setSelectedSize}
        />
      )}
      
      {/* Produto simples não mostra seletores */}
    </div>
  );
}
```

---

## 🔧 Funções Auxiliares

### Identificar Tipo de Produto

```typescript
import { 
  isComplexProduct, 
  isIntermediateProduct, 
  isSimpleProduct 
} from "@/data/products";

const product = getProductBySlug("valvula-esfera");

if (isComplexProduct(product)) {
  // Renderizar seletores de tipo e tamanho
}

if (isIntermediateProduct(product)) {
  // Renderizar apenas seletor de tamanho
}

if (isSimpleProduct(product)) {
  // Renderizar apenas imagem e descrição
}
```

### Obter Imagem

```typescript
import { getProductImage, getProductDisplayImage } from "@/data/products";

// Imagem específica (com seleções)
const image = getProductImage(product, "tripartida-300-pr", "1/2");

// Primeira imagem disponível (para listagens)
const displayImage = getProductDisplayImage(product);
```

### Obter Tamanhos Disponíveis

```typescript
import { getAvailableSizes } from "@/data/products";

// Para produto intermediário
const sizes = getAvailableSizes(product);

// Para produto complexo (de uma variante específica)
const sizes = getAvailableSizes(product, "tripartida-300-pr");
```

---

## 🎨 Adaptação do Componente

O componente deve se adaptar automaticamente:

```typescript
function ProductDetails({ product }: { product: Product }) {
  const {
    currentImage,
    hasVariants,
    hasSizes,
    isSimple,
    // ... outros
  } = useProductSelection(product);
  
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Imagem sempre presente */}
      <ProductGallery images={currentImage ? [currentImage] : []} />
      
      <div>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        
        {/* Seletor de Tipo - apenas se complex */}
        {hasVariants && (
          <VariantSelector ... />
        )}
        
        {/* Seletor de Tamanho - se complex ou intermediate */}
        {hasSizes && (
          <SizeSelector ... />
        )}
        
        {/* Produto simples não mostra seletores */}
        {isSimple && (
          <p className="text-muted">Produto único, sem variações</p>
        )}
      </div>
    </div>
  );
}
```

---

## ✅ Checklist de Implementação

- [x] Estrutura de dados criada (`src/data/products.ts`)
- [x] Tipos TypeScript definidos
- [x] Funções auxiliares implementadas
- [x] Hook `useProductSelection` criado
- [x] Exemplos para os 3 cenários
- [ ] Componente adaptável (próximo passo)

---

## 🚀 Próximos Passos

1. **Criar componente unificado** que use `useProductSelection`
2. **Testar os 3 cenários** com dados reais
3. **Adicionar mais produtos** seguindo a estrutura

---

**Estrutura pronta e flexível!** 🎉


## 📋 Visão Geral

Estrutura TypeScript que suporta **3 cenários diferentes** de produtos usando a mesma tipagem e componentes.

---

## 🎯 Os 3 Cenários

### 1. **COMPLEXO** (Ex: Válvula Esfera)
- Usuário escolhe **TIPO** → depois **TAMANHO** → imagem muda
- Estrutura: `variants[]` → cada variant tem `sizes{}`

### 2. **INTERMEDIÁRIO** (Ex: Válvula Gaveta)
- Usuário escolhe **TAMANHO** → imagem muda
- Estrutura: `sizes{}` direto no produto (sem variants)

### 3. **SIMPLES** (Ex: Filtro Y)
- Produto único, sem variações
- Estrutura: apenas `image` fixa

---

## 📊 Estrutura de Dados

### Tipos TypeScript

```typescript
export type ProductVariant = {
  id: string;
  name: string;
  description?: string;
  sizes?: Record<string, string>;      // Tamanhos → Imagens
  singleImage?: string;                // Imagem única (sem tamanhos)
};

export type Product = {
  id: string;
  title: string;
  description: string;
  slug: string;
  
  // CASO 3: SIMPLES
  image?: string;
  
  // CASO 1: COMPLEXO
  variants?: ProductVariant[];
  
  // CASO 2: INTERMEDIÁRIO
  sizes?: Record<string, string>;
  
  // Opcionais
  specifications?: Record<string, string>;
  applications?: string[];
  standards?: string[];
};
```

---

## 📝 Exemplos de Uso

### CASO 1: COMPLEXO (Válvula Esfera)

```typescript
{
  id: "valvula-esfera",
  title: "Válvula de Esfera",
  slug: "valvula-esfera",
  description: "Controle de fluxo de alta performance...",
  variants: [
    {
      id: "tripartida-300-pr",
      name: "Tripartida 300# Passagem Reduzida",
      sizes: {
        "1/2": "/img/esfera/tripartida300_12.jpg",
        "1": "/img/esfera/tripartida300_1.jpg",
        "2": "/img/esfera/tripartida300_2.jpg"
      }
    },
    {
      id: "monobloco",
      name: "Monobloco",
      sizes: {
        "1/2": "/img/esfera/monobloco_12.jpg",
        "1": "/img/esfera/monobloco_1.jpg"
      }
    }
  ]
}
```

**Fluxo**: Tipo selecionado → Tamanhos disponíveis → Imagem atualizada

---

### CASO 2: INTERMEDIÁRIO (Válvula Gaveta)

```typescript
{
  id: "valvula-gaveta",
  title: "Válvula de Gaveta",
  slug: "valvula-gaveta",
  description: "Controle de fluxo em alta pressão...",
  // Sem variants, mas tem sizes diretos
  sizes: {
    "2": "/img/gaveta/gaveta2.jpg",
    "3": "/img/gaveta/gaveta3.jpg",
    "4": "/img/gaveta/gaveta4.jpg"
  }
}
```

**Fluxo**: Tamanho selecionado → Imagem atualizada

---

### CASO 3: SIMPLES (Filtro Y)

```typescript
{
  id: "filtro-y",
  title: "Filtro Y",
  slug: "filtro-y",
  description: "Filtro para retenção de partículas...",
  // Apenas imagem fixa
  image: "/img/filtros/filtro-y-padrao.jpg"
}
```

**Fluxo**: Apenas exibe imagem e descrição (sem seletores)

---

## 🎣 Hook: `useProductSelection`

Hook unificado que gerencia os 3 cenários automaticamente.

### Uso no Componente

```typescript
import { useProductSelection } from "@/hooks/useProductSelection";
import { getProductBySlug } from "@/data/products";

function ProductPage() {
  const product = getProductBySlug("valvula-esfera");
  
  if (!product) return <NotFound />;
  
  const {
    selectedVariantId,
    selectedSize,
    currentImage,
    productType,           // "complex" | "intermediate" | "simple"
    availableVariants,
    availableSizes,
    setSelectedVariant,
    setSelectedSize,
    hasVariants,
    hasSizes,
    isSimple,
  } = useProductSelection(product);
  
  return (
    <div>
      {/* Galeria de Imagens */}
      <ProductGallery images={currentImage ? [currentImage] : []} />
      
      {/* Seletor de Tipo (apenas se complex) */}
      {hasVariants && (
        <VariantSelector
          label="Tipo"
          value={selectedVariantId}
          options={availableVariants.map(v => ({
            value: v.id,
            label: v.name,
            description: v.description
          }))}
          onChange={setSelectedVariant}
        />
      )}
      
      {/* Seletor de Tamanho (se complex ou intermediate) */}
      {hasSizes && (
        <SizeSelector
          label="Tamanho"
          value={selectedSize}
          options={availableSizes.map(s => ({
            value: s,
            label: s
          }))}
          onChange={setSelectedSize}
        />
      )}
      
      {/* Produto simples não mostra seletores */}
    </div>
  );
}
```

---

## 🔧 Funções Auxiliares

### Identificar Tipo de Produto

```typescript
import { 
  isComplexProduct, 
  isIntermediateProduct, 
  isSimpleProduct 
} from "@/data/products";

const product = getProductBySlug("valvula-esfera");

if (isComplexProduct(product)) {
  // Renderizar seletores de tipo e tamanho
}

if (isIntermediateProduct(product)) {
  // Renderizar apenas seletor de tamanho
}

if (isSimpleProduct(product)) {
  // Renderizar apenas imagem e descrição
}
```

### Obter Imagem

```typescript
import { getProductImage, getProductDisplayImage } from "@/data/products";

// Imagem específica (com seleções)
const image = getProductImage(product, "tripartida-300-pr", "1/2");

// Primeira imagem disponível (para listagens)
const displayImage = getProductDisplayImage(product);
```

### Obter Tamanhos Disponíveis

```typescript
import { getAvailableSizes } from "@/data/products";

// Para produto intermediário
const sizes = getAvailableSizes(product);

// Para produto complexo (de uma variante específica)
const sizes = getAvailableSizes(product, "tripartida-300-pr");
```

---

## 🎨 Adaptação do Componente

O componente deve se adaptar automaticamente:

```typescript
function ProductDetails({ product }: { product: Product }) {
  const {
    currentImage,
    hasVariants,
    hasSizes,
    isSimple,
    // ... outros
  } = useProductSelection(product);
  
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Imagem sempre presente */}
      <ProductGallery images={currentImage ? [currentImage] : []} />
      
      <div>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        
        {/* Seletor de Tipo - apenas se complex */}
        {hasVariants && (
          <VariantSelector ... />
        )}
        
        {/* Seletor de Tamanho - se complex ou intermediate */}
        {hasSizes && (
          <SizeSelector ... />
        )}
        
        {/* Produto simples não mostra seletores */}
        {isSimple && (
          <p className="text-muted">Produto único, sem variações</p>
        )}
      </div>
    </div>
  );
}
```

---

## ✅ Checklist de Implementação

- [x] Estrutura de dados criada (`src/data/products.ts`)
- [x] Tipos TypeScript definidos
- [x] Funções auxiliares implementadas
- [x] Hook `useProductSelection` criado
- [x] Exemplos para os 3 cenários
- [ ] Componente adaptável (próximo passo)

---

## 🚀 Próximos Passos

1. **Criar componente unificado** que use `useProductSelection`
2. **Testar os 3 cenários** com dados reais
3. **Adicionar mais produtos** seguindo a estrutura

---

**Estrutura pronta e flexível!** 🎉


## 📋 Visão Geral

Estrutura TypeScript que suporta **3 cenários diferentes** de produtos usando a mesma tipagem e componentes.

---

## 🎯 Os 3 Cenários

### 1. **COMPLEXO** (Ex: Válvula Esfera)
- Usuário escolhe **TIPO** → depois **TAMANHO** → imagem muda
- Estrutura: `variants[]` → cada variant tem `sizes{}`

### 2. **INTERMEDIÁRIO** (Ex: Válvula Gaveta)
- Usuário escolhe **TAMANHO** → imagem muda
- Estrutura: `sizes{}` direto no produto (sem variants)

### 3. **SIMPLES** (Ex: Filtro Y)
- Produto único, sem variações
- Estrutura: apenas `image` fixa

---

## 📊 Estrutura de Dados

### Tipos TypeScript

```typescript
export type ProductVariant = {
  id: string;
  name: string;
  description?: string;
  sizes?: Record<string, string>;      // Tamanhos → Imagens
  singleImage?: string;                // Imagem única (sem tamanhos)
};

export type Product = {
  id: string;
  title: string;
  description: string;
  slug: string;
  
  // CASO 3: SIMPLES
  image?: string;
  
  // CASO 1: COMPLEXO
  variants?: ProductVariant[];
  
  // CASO 2: INTERMEDIÁRIO
  sizes?: Record<string, string>;
  
  // Opcionais
  specifications?: Record<string, string>;
  applications?: string[];
  standards?: string[];
};
```

---

## 📝 Exemplos de Uso

### CASO 1: COMPLEXO (Válvula Esfera)

```typescript
{
  id: "valvula-esfera",
  title: "Válvula de Esfera",
  slug: "valvula-esfera",
  description: "Controle de fluxo de alta performance...",
  variants: [
    {
      id: "tripartida-300-pr",
      name: "Tripartida 300# Passagem Reduzida",
      sizes: {
        "1/2": "/img/esfera/tripartida300_12.jpg",
        "1": "/img/esfera/tripartida300_1.jpg",
        "2": "/img/esfera/tripartida300_2.jpg"
      }
    },
    {
      id: "monobloco",
      name: "Monobloco",
      sizes: {
        "1/2": "/img/esfera/monobloco_12.jpg",
        "1": "/img/esfera/monobloco_1.jpg"
      }
    }
  ]
}
```

**Fluxo**: Tipo selecionado → Tamanhos disponíveis → Imagem atualizada

---

### CASO 2: INTERMEDIÁRIO (Válvula Gaveta)

```typescript
{
  id: "valvula-gaveta",
  title: "Válvula de Gaveta",
  slug: "valvula-gaveta",
  description: "Controle de fluxo em alta pressão...",
  // Sem variants, mas tem sizes diretos
  sizes: {
    "2": "/img/gaveta/gaveta2.jpg",
    "3": "/img/gaveta/gaveta3.jpg",
    "4": "/img/gaveta/gaveta4.jpg"
  }
}
```

**Fluxo**: Tamanho selecionado → Imagem atualizada

---

### CASO 3: SIMPLES (Filtro Y)

```typescript
{
  id: "filtro-y",
  title: "Filtro Y",
  slug: "filtro-y",
  description: "Filtro para retenção de partículas...",
  // Apenas imagem fixa
  image: "/img/filtros/filtro-y-padrao.jpg"
}
```

**Fluxo**: Apenas exibe imagem e descrição (sem seletores)

---

## 🎣 Hook: `useProductSelection`

Hook unificado que gerencia os 3 cenários automaticamente.

### Uso no Componente

```typescript
import { useProductSelection } from "@/hooks/useProductSelection";
import { getProductBySlug } from "@/data/products";

function ProductPage() {
  const product = getProductBySlug("valvula-esfera");
  
  if (!product) return <NotFound />;
  
  const {
    selectedVariantId,
    selectedSize,
    currentImage,
    productType,           // "complex" | "intermediate" | "simple"
    availableVariants,
    availableSizes,
    setSelectedVariant,
    setSelectedSize,
    hasVariants,
    hasSizes,
    isSimple,
  } = useProductSelection(product);
  
  return (
    <div>
      {/* Galeria de Imagens */}
      <ProductGallery images={currentImage ? [currentImage] : []} />
      
      {/* Seletor de Tipo (apenas se complex) */}
      {hasVariants && (
        <VariantSelector
          label="Tipo"
          value={selectedVariantId}
          options={availableVariants.map(v => ({
            value: v.id,
            label: v.name,
            description: v.description
          }))}
          onChange={setSelectedVariant}
        />
      )}
      
      {/* Seletor de Tamanho (se complex ou intermediate) */}
      {hasSizes && (
        <SizeSelector
          label="Tamanho"
          value={selectedSize}
          options={availableSizes.map(s => ({
            value: s,
            label: s
          }))}
          onChange={setSelectedSize}
        />
      )}
      
      {/* Produto simples não mostra seletores */}
    </div>
  );
}
```

---

## 🔧 Funções Auxiliares

### Identificar Tipo de Produto

```typescript
import { 
  isComplexProduct, 
  isIntermediateProduct, 
  isSimpleProduct 
} from "@/data/products";

const product = getProductBySlug("valvula-esfera");

if (isComplexProduct(product)) {
  // Renderizar seletores de tipo e tamanho
}

if (isIntermediateProduct(product)) {
  // Renderizar apenas seletor de tamanho
}

if (isSimpleProduct(product)) {
  // Renderizar apenas imagem e descrição
}
```

### Obter Imagem

```typescript
import { getProductImage, getProductDisplayImage } from "@/data/products";

// Imagem específica (com seleções)
const image = getProductImage(product, "tripartida-300-pr", "1/2");

// Primeira imagem disponível (para listagens)
const displayImage = getProductDisplayImage(product);
```

### Obter Tamanhos Disponíveis

```typescript
import { getAvailableSizes } from "@/data/products";

// Para produto intermediário
const sizes = getAvailableSizes(product);

// Para produto complexo (de uma variante específica)
const sizes = getAvailableSizes(product, "tripartida-300-pr");
```

---

## 🎨 Adaptação do Componente

O componente deve se adaptar automaticamente:

```typescript
function ProductDetails({ product }: { product: Product }) {
  const {
    currentImage,
    hasVariants,
    hasSizes,
    isSimple,
    // ... outros
  } = useProductSelection(product);
  
  return (
    <div className="grid grid-cols-2 gap-8">
      {/* Imagem sempre presente */}
      <ProductGallery images={currentImage ? [currentImage] : []} />
      
      <div>
        <h1>{product.title}</h1>
        <p>{product.description}</p>
        
        {/* Seletor de Tipo - apenas se complex */}
        {hasVariants && (
          <VariantSelector ... />
        )}
        
        {/* Seletor de Tamanho - se complex ou intermediate */}
        {hasSizes && (
          <SizeSelector ... />
        )}
        
        {/* Produto simples não mostra seletores */}
        {isSimple && (
          <p className="text-muted">Produto único, sem variações</p>
        )}
      </div>
    </div>
  );
}
```

---

## ✅ Checklist de Implementação

- [x] Estrutura de dados criada (`src/data/products.ts`)
- [x] Tipos TypeScript definidos
- [x] Funções auxiliares implementadas
- [x] Hook `useProductSelection` criado
- [x] Exemplos para os 3 cenários
- [ ] Componente adaptável (próximo passo)

---

## 🚀 Próximos Passos

1. **Criar componente unificado** que use `useProductSelection`
2. **Testar os 3 cenários** com dados reais
3. **Adicionar mais produtos** seguindo a estrutura

---

**Estrutura pronta e flexível!** 🎉


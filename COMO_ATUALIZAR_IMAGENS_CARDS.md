# 📸 Como Atualizar Imagens dos Cards de Produtos

## 🎯 Onde as Imagens Aparecem

As imagens que você vê nos **cards de produtos** (como na página "Válvulas Industriais") vêm do arquivo:

**`src/mocks/products.ts`**

---

## 📋 Como Funciona

A página `ProdutoCategoria.tsx` usa a função `getProductDisplayImage()` que busca a imagem assim:

1. **Se o produto tem variants** → Pega a primeira imagem do primeiro variant
2. **Se o produto tem sizes** → Pega a primeira imagem do primeiro size  
3. **Se o produto tem image direta** → Usa essa imagem
4. **Se não tem nada** → Mostra placeholder

---

## 🔧 Como Atualizar as Imagens dos Cards

### **Opção 1: Adicionar Imagem Direta ao Produto** (Mais Simples)

Edite `src/mocks/products.ts` e adicione o campo `image`:

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo...',
  image: '/imagens/valvulas-industriais/esfera/card-valvula-esfera.jpg', // ← ADICIONE AQUI
  variants: [
    // ... variants ...
  ]
}
```

**Vantagem:** Imagem específica para o card, independente das variações.

---

### **Opção 2: Atualizar a Primeira Imagem do Primeiro Variant**

A função `getProductDisplayImage()` pega automaticamente a primeira imagem do primeiro variant. Então você só precisa:

1. **Colocar a imagem** na pasta:
   ```
   public/imagens/valvulas-industriais/esfera/minha-imagem.jpg
   ```

2. **Atualizar o primeiro variant**:
   ```typescript
   {
     id: '1',
     name: 'Válvula de Esfera',
     variants: [
       {
         type: 'Aço Carbono',
         sizes: [
           {
             size: '1/2"',
             image: '/imagens/valvulas-industriais/esfera/minha-imagem.jpg', // ← PRIMEIRA IMAGEM
             description: '...'
           },
           // ... outros tamanhos ...
         ]
       }
     ]
   }
   ```

**Importante:** A primeira imagem do primeiro variant será usada no card!

---

### **Opção 3: Criar Pasta Específica para Cards**

1. **Crie uma pasta para imagens de cards:**
   ```
   public/imagens/valvulas-industriais/cards/
   ├── valvula-esfera.jpg
   ├── valvula-gaveta.jpg
   └── valvula-retencao.jpg
   ```

2. **Atualize o código:**
   ```typescript
   {
     id: '1',
     name: 'Válvula de Esfera',
     slug: 'valvula-esfera',
     description: '...',
     image: '/imagens/valvulas-industriais/cards/valvula-esfera.jpg', // ← Imagem do card
     variants: [
       // ... variants com suas próprias imagens ...
     ]
   }
   ```

---

## 📝 Exemplo Prático Completo

### **Atualizar Card "Válvula de Esfera"**

**Arquivo:** `src/mocks/products.ts`

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo em sistemas industriais...',
  
  // OPÇÃO 1: Imagem específica para o card
  image: '/imagens/valvulas-industriais/esfera/card-principal.jpg',
  
  variants: [
    {
      type: 'Aço Carbono',
      sizes: [
        {
          size: '1/2"',
          // Esta será usada se não houver 'image' acima
          image: '/imagens/valvulas-industriais/esfera/tripartida300pr12.jpg',
          description: 'Válvula de esfera aço carbono 1/2"'
        },
        // ... outros tamanhos ...
      ]
    }
  ]
}
```

---

## 🎨 Estrutura Recomendada

```
public/imagens/
└── valvulas-industriais/
    ├── cards/                          ← Imagens específicas para cards
    │   ├── valvula-esfera.jpg
    │   ├── valvula-gaveta.jpg
    │   └── valvula-retencao.jpg
    └── esfera/                         ← Imagens dos produtos (detalhes)
        ├── tripartida300pr12.jpg
        ├── monobloco12.jpg
        └── ...
```

---

## ✅ Checklist Rápido

Para atualizar a imagem de um card:

1. [ ] Coloque a imagem em `public/imagens/...`
2. [ ] Adicione `image: '/imagens/...'` no produto em `src/mocks/products.ts`
3. [ ] OU atualize a primeira imagem do primeiro variant
4. [ ] Teste no navegador (limpe o cache se necessário)

---

## 🔍 Verificar se Funcionou

1. Abra a página: `http://localhost:3000/produtos/valvulas-industriais`
2. Verifique se o card mostra a nova imagem
3. Se não aparecer, abra DevTools (F12) → Network → Img
4. Verifique se a imagem está carregando (status 200)

---

## ⚠️ Dica Importante

**Prioridade da função `getProductDisplayImage()`:**

1. ✅ `product.image` (se existir) → **USA ESTA**
2. ✅ Primeira imagem do primeiro variant (se não tiver `image`)
3. ✅ Primeira imagem do primeiro size (se não tiver variants)
4. ❌ Placeholder (se não tiver nada)

**Então:** Se você adicionar `image: '/imagens/...'` no produto, essa será sempre usada no card! 🎯


## 🎯 Onde as Imagens Aparecem

As imagens que você vê nos **cards de produtos** (como na página "Válvulas Industriais") vêm do arquivo:

**`src/mocks/products.ts`**

---

## 📋 Como Funciona

A página `ProdutoCategoria.tsx` usa a função `getProductDisplayImage()` que busca a imagem assim:

1. **Se o produto tem variants** → Pega a primeira imagem do primeiro variant
2. **Se o produto tem sizes** → Pega a primeira imagem do primeiro size  
3. **Se o produto tem image direta** → Usa essa imagem
4. **Se não tem nada** → Mostra placeholder

---

## 🔧 Como Atualizar as Imagens dos Cards

### **Opção 1: Adicionar Imagem Direta ao Produto** (Mais Simples)

Edite `src/mocks/products.ts` e adicione o campo `image`:

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo...',
  image: '/imagens/valvulas-industriais/esfera/card-valvula-esfera.jpg', // ← ADICIONE AQUI
  variants: [
    // ... variants ...
  ]
}
```

**Vantagem:** Imagem específica para o card, independente das variações.

---

### **Opção 2: Atualizar a Primeira Imagem do Primeiro Variant**

A função `getProductDisplayImage()` pega automaticamente a primeira imagem do primeiro variant. Então você só precisa:

1. **Colocar a imagem** na pasta:
   ```
   public/imagens/valvulas-industriais/esfera/minha-imagem.jpg
   ```

2. **Atualizar o primeiro variant**:
   ```typescript
   {
     id: '1',
     name: 'Válvula de Esfera',
     variants: [
       {
         type: 'Aço Carbono',
         sizes: [
           {
             size: '1/2"',
             image: '/imagens/valvulas-industriais/esfera/minha-imagem.jpg', // ← PRIMEIRA IMAGEM
             description: '...'
           },
           // ... outros tamanhos ...
         ]
       }
     ]
   }
   ```

**Importante:** A primeira imagem do primeiro variant será usada no card!

---

### **Opção 3: Criar Pasta Específica para Cards**

1. **Crie uma pasta para imagens de cards:**
   ```
   public/imagens/valvulas-industriais/cards/
   ├── valvula-esfera.jpg
   ├── valvula-gaveta.jpg
   └── valvula-retencao.jpg
   ```

2. **Atualize o código:**
   ```typescript
   {
     id: '1',
     name: 'Válvula de Esfera',
     slug: 'valvula-esfera',
     description: '...',
     image: '/imagens/valvulas-industriais/cards/valvula-esfera.jpg', // ← Imagem do card
     variants: [
       // ... variants com suas próprias imagens ...
     ]
   }
   ```

---

## 📝 Exemplo Prático Completo

### **Atualizar Card "Válvula de Esfera"**

**Arquivo:** `src/mocks/products.ts`

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo em sistemas industriais...',
  
  // OPÇÃO 1: Imagem específica para o card
  image: '/imagens/valvulas-industriais/esfera/card-principal.jpg',
  
  variants: [
    {
      type: 'Aço Carbono',
      sizes: [
        {
          size: '1/2"',
          // Esta será usada se não houver 'image' acima
          image: '/imagens/valvulas-industriais/esfera/tripartida300pr12.jpg',
          description: 'Válvula de esfera aço carbono 1/2"'
        },
        // ... outros tamanhos ...
      ]
    }
  ]
}
```

---

## 🎨 Estrutura Recomendada

```
public/imagens/
└── valvulas-industriais/
    ├── cards/                          ← Imagens específicas para cards
    │   ├── valvula-esfera.jpg
    │   ├── valvula-gaveta.jpg
    │   └── valvula-retencao.jpg
    └── esfera/                         ← Imagens dos produtos (detalhes)
        ├── tripartida300pr12.jpg
        ├── monobloco12.jpg
        └── ...
```

---

## ✅ Checklist Rápido

Para atualizar a imagem de um card:

1. [ ] Coloque a imagem em `public/imagens/...`
2. [ ] Adicione `image: '/imagens/...'` no produto em `src/mocks/products.ts`
3. [ ] OU atualize a primeira imagem do primeiro variant
4. [ ] Teste no navegador (limpe o cache se necessário)

---

## 🔍 Verificar se Funcionou

1. Abra a página: `http://localhost:3000/produtos/valvulas-industriais`
2. Verifique se o card mostra a nova imagem
3. Se não aparecer, abra DevTools (F12) → Network → Img
4. Verifique se a imagem está carregando (status 200)

---

## ⚠️ Dica Importante

**Prioridade da função `getProductDisplayImage()`:**

1. ✅ `product.image` (se existir) → **USA ESTA**
2. ✅ Primeira imagem do primeiro variant (se não tiver `image`)
3. ✅ Primeira imagem do primeiro size (se não tiver variants)
4. ❌ Placeholder (se não tiver nada)

**Então:** Se você adicionar `image: '/imagens/...'` no produto, essa será sempre usada no card! 🎯


## 🎯 Onde as Imagens Aparecem

As imagens que você vê nos **cards de produtos** (como na página "Válvulas Industriais") vêm do arquivo:

**`src/mocks/products.ts`**

---

## 📋 Como Funciona

A página `ProdutoCategoria.tsx` usa a função `getProductDisplayImage()` que busca a imagem assim:

1. **Se o produto tem variants** → Pega a primeira imagem do primeiro variant
2. **Se o produto tem sizes** → Pega a primeira imagem do primeiro size  
3. **Se o produto tem image direta** → Usa essa imagem
4. **Se não tem nada** → Mostra placeholder

---

## 🔧 Como Atualizar as Imagens dos Cards

### **Opção 1: Adicionar Imagem Direta ao Produto** (Mais Simples)

Edite `src/mocks/products.ts` e adicione o campo `image`:

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo...',
  image: '/imagens/valvulas-industriais/esfera/card-valvula-esfera.jpg', // ← ADICIONE AQUI
  variants: [
    // ... variants ...
  ]
}
```

**Vantagem:** Imagem específica para o card, independente das variações.

---

### **Opção 2: Atualizar a Primeira Imagem do Primeiro Variant**

A função `getProductDisplayImage()` pega automaticamente a primeira imagem do primeiro variant. Então você só precisa:

1. **Colocar a imagem** na pasta:
   ```
   public/imagens/valvulas-industriais/esfera/minha-imagem.jpg
   ```

2. **Atualizar o primeiro variant**:
   ```typescript
   {
     id: '1',
     name: 'Válvula de Esfera',
     variants: [
       {
         type: 'Aço Carbono',
         sizes: [
           {
             size: '1/2"',
             image: '/imagens/valvulas-industriais/esfera/minha-imagem.jpg', // ← PRIMEIRA IMAGEM
             description: '...'
           },
           // ... outros tamanhos ...
         ]
       }
     ]
   }
   ```

**Importante:** A primeira imagem do primeiro variant será usada no card!

---

### **Opção 3: Criar Pasta Específica para Cards**

1. **Crie uma pasta para imagens de cards:**
   ```
   public/imagens/valvulas-industriais/cards/
   ├── valvula-esfera.jpg
   ├── valvula-gaveta.jpg
   └── valvula-retencao.jpg
   ```

2. **Atualize o código:**
   ```typescript
   {
     id: '1',
     name: 'Válvula de Esfera',
     slug: 'valvula-esfera',
     description: '...',
     image: '/imagens/valvulas-industriais/cards/valvula-esfera.jpg', // ← Imagem do card
     variants: [
       // ... variants com suas próprias imagens ...
     ]
   }
   ```

---

## 📝 Exemplo Prático Completo

### **Atualizar Card "Válvula de Esfera"**

**Arquivo:** `src/mocks/products.ts`

```typescript
{
  id: '1',
  name: 'Válvula de Esfera',
  slug: 'valvula-esfera',
  description: 'Válvulas de esfera para controle de fluxo em sistemas industriais...',
  
  // OPÇÃO 1: Imagem específica para o card
  image: '/imagens/valvulas-industriais/esfera/card-principal.jpg',
  
  variants: [
    {
      type: 'Aço Carbono',
      sizes: [
        {
          size: '1/2"',
          // Esta será usada se não houver 'image' acima
          image: '/imagens/valvulas-industriais/esfera/tripartida300pr12.jpg',
          description: 'Válvula de esfera aço carbono 1/2"'
        },
        // ... outros tamanhos ...
      ]
    }
  ]
}
```

---

## 🎨 Estrutura Recomendada

```
public/imagens/
└── valvulas-industriais/
    ├── cards/                          ← Imagens específicas para cards
    │   ├── valvula-esfera.jpg
    │   ├── valvula-gaveta.jpg
    │   └── valvula-retencao.jpg
    └── esfera/                         ← Imagens dos produtos (detalhes)
        ├── tripartida300pr12.jpg
        ├── monobloco12.jpg
        └── ...
```

---

## ✅ Checklist Rápido

Para atualizar a imagem de um card:

1. [ ] Coloque a imagem em `public/imagens/...`
2. [ ] Adicione `image: '/imagens/...'` no produto em `src/mocks/products.ts`
3. [ ] OU atualize a primeira imagem do primeiro variant
4. [ ] Teste no navegador (limpe o cache se necessário)

---

## 🔍 Verificar se Funcionou

1. Abra a página: `http://localhost:3000/produtos/valvulas-industriais`
2. Verifique se o card mostra a nova imagem
3. Se não aparecer, abra DevTools (F12) → Network → Img
4. Verifique se a imagem está carregando (status 200)

---

## ⚠️ Dica Importante

**Prioridade da função `getProductDisplayImage()`:**

1. ✅ `product.image` (se existir) → **USA ESTA**
2. ✅ Primeira imagem do primeiro variant (se não tiver `image`)
3. ✅ Primeira imagem do primeiro size (se não tiver variants)
4. ❌ Placeholder (se não tiver nada)

**Então:** Se você adicionar `image: '/imagens/...'` no produto, essa será sempre usada no card! 🎯


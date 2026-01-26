# 📦 Conceito dos Produtos no Sistema

## 🎯 Visão Geral

O sistema de produtos é organizado de forma **hierárquica** para gerenciar válvulas industriais e seus componentes. A estrutura permite organizar produtos por categorias, com múltiplas imagens, PDFs técnicos e variantes (diferentes tipos e tamanhos).

---

## 📊 Estrutura Hierárquica

```
Categoria (Category)
  └── Produto (Product)
      ├── Imagens (ProductImage) - múltiplas
      ├── PDFs (ProductPdf) - múltiplos
      └── Variantes (Variant) - múltiplas
          └── Desenho técnico (drawing_url)
```

---

## 🗂️ Componentes do Sistema

### 1. **Categoria (Category)**

**Conceito**: Agrupa produtos relacionados. Ex: "Válvulas Industriais", "Válvulas de Esfera", etc.

**Campos**:
- `name`: Nome da categoria (ex: "Válvulas Industriais")
- `slug`: URL amigável (ex: "valvulas-industriais")
- `description`: Descrição da categoria
- `images`: Uma ou mais imagens representativas

**Exemplo**:
```json
{
  "id": 1,
  "name": "Válvulas Industriais",
  "slug": "valvulas-industriais",
  "description": "Linha completa de válvulas para aplicações industriais",
  "image": "http://localhost:8000/media/uploads/categories/1234567890.jpg"
}
```

---

### 2. **Produto (Product)**

**Conceito**: Representa um produto específico dentro de uma categoria. Ex: "Válvula de Esfera 1/2"", "Válvula de Gaveta 2"", etc.

**Campos**:
- `title`: Nome do produto
- `slug`: URL amigável (ex: "valvula-esfera-1-2")
- `description`: Descrição detalhada do produto
- `category`: Categoria à qual pertence (obrigatório)
- `images`: Múltiplas imagens do produto
- `pdfs`: Múltiplos PDFs técnicos (manuais, catálogos, etc.)

**Características**:
- ✅ **Obrigatório**: Pelo menos 1 imagem ao criar
- ✅ **Opcional**: PDFs técnicos
- ✅ **Relacionamento**: Pertence a uma categoria (PROTECT - não pode deletar categoria com produtos)

**Exemplo**:
```json
{
  "id": 1,
  "title": "Válvula de Esfera 1/2\"",
  "slug": "valvula-esfera-1-2",
  "description": "Válvula de esfera para aplicações industriais...",
  "category": {
    "id": 1,
    "name": "Válvulas Industriais",
    "slug": "valvulas-industriais"
  },
  "images": [
    {"url": "http://.../image1.jpg", "position": 1},
    {"url": "http://.../image2.jpg", "position": 2}
  ],
  "pdfs": [
    {"url": "http://.../manual.pdf", "position": 1}
  ]
}
```

---

### 3. **Imagens do Produto (ProductImage)**

**Conceito**: Múltiplas imagens para um produto (fotos, detalhes, aplicações).

**Campos**:
- `product`: Produto ao qual pertence
- `url`: URL da imagem (gerada automaticamente no upload)
- `position`: Ordem de exibição (1, 2, 3...)

**Regras**:
- ✅ **Obrigatório**: Pelo menos 1 imagem ao criar produto
- ✅ **Upload**: Apenas por upload de arquivo (não aceita URLs externas)
- ✅ **Múltiplas**: Um produto pode ter várias imagens

**Fluxo**:
1. Criar produto (sem imagens)
2. Fazer upload das imagens via endpoint `/api/products/{slug}/upload_images`

---

### 4. **PDFs do Produto (ProductPdf)**

**Conceito**: Documentos técnicos relacionados ao produto (manuais, catálogos, especificações).

**Campos**:
- `product`: Produto ao qual pertence
- `url`: URL do PDF (gerada automaticamente no upload)
- `position`: Ordem de exibição

**Regras**:
- ✅ **Opcional**: Não é obrigatório ter PDFs
- ✅ **Upload**: Apenas por upload de arquivo (não aceita URLs externas)
- ✅ **Múltiplos**: Um produto pode ter vários PDFs

**Fluxo**:
1. Criar produto
2. Fazer upload dos PDFs via endpoint `/api/products/{slug}/upload_pdfs`

---

### 5. **Variantes (Variant)**

**Conceito**: Diferentes configurações/tamanhos de um mesmo produto. Ex: "Válvula de Esfera 1/2\"", "Válvula de Esfera 1\"", etc.

**Campos**:
- `product`: Produto ao qual pertence
- `type`: Tipo da variante (ex: "Bronze", "Aço Inox", "PVC")
- `size`: Tamanho (ex: "1/2\"", "1\"", "2\"")
- `specifications`: Especificações técnicas em JSON (pressão, temperatura, etc.)
- `drawing_url`: URL do desenho técnico (upload separado)
- `position`: Ordem de exibição

**Características**:
- ✅ **Múltiplas**: Um produto pode ter várias variantes
- ✅ **Ordenação**: Por posição, tipo e tamanho
- ✅ **Desenho técnico**: Upload opcional de desenho técnico

**Exemplo**:
```json
{
  "id": 1,
  "product_id": 1,
  "type": "Bronze",
  "size": "1/2\"",
  "specifications": {
    "pressao_max": "16 bar",
    "temperatura_max": "120°C",
    "material": "Bronze"
  },
  "drawing_url": "http://.../drawing.pdf",
  "position": 1
}
```

---

## 🔄 Fluxo de Criação

### Criar um Produto Completo:

1. **Criar Categoria** (se não existir)
   ```
   POST /api/categories
   {
     "name": "Válvulas Industriais",
     "slug": "valvulas-industriais",
     "description": "..."
   }
   ```

2. **Upload de Imagem da Categoria**
   ```
   POST /api/categories/{id}/image
   FormData: image file
   ```

3. **Criar Produto**
   ```
   POST /api/products
   {
     "title": "Válvula de Esfera",
     "slug": "valvula-esfera",
     "description": "...",
     "category_id": 1
   }
   ```

4. **Upload de Imagens do Produto** (obrigatório)
   ```
   POST /api/products/{slug}/upload_images
   FormData: images[] (múltiplos arquivos)
   ```

5. **Upload de PDFs do Produto** (opcional)
   ```
   POST /api/products/{slug}/upload_pdfs
   FormData: pdfs[] (múltiplos arquivos)
   ```

6. **Criar Variantes**
   ```
   POST /api/products/{product_id}/variants
   {
     "type": "Bronze",
     "size": "1/2\"",
     "specifications": {...}
   }
   ```

7. **Upload de Desenho Técnico da Variante** (opcional)
   ```
   POST /api/variants/{variant_id}/drawing
   FormData: drawing file
   ```

---

## 🌐 URLs e Navegação

### Estrutura de URLs:

```
/produtos                          → Lista todas as categorias
/produtos/{categoria-slug}         → Lista produtos da categoria
/produtos/{categoria-slug}/{produto-slug}  → Detalhes do produto
```

**Exemplo**:
```
/produtos                                    → Todas as categorias
/produtos/valvulas-industriais                → Produtos de "Válvulas Industriais"
/produtos/valvulas-industriais/valvula-esfera → Detalhes de "Válvula de Esfera"
```

---

## 🔍 Busca e Filtros

### Endpoints da API:

1. **Listar Categorias**
   ```
   GET /api/categories
   GET /api/categories?slug=valvulas-industriais  (filtrar por slug)
   ```

2. **Listar Produtos**
   ```
   GET /api/products
   GET /api/products?category=valvulas-industriais  (filtrar por categoria)
   ```

3. **Detalhes do Produto** (com variantes)
   ```
   GET /api/products/{slug}
   Retorna: { product: {...}, variants: [...] }
   ```

---

## 📋 Regras de Negócio

### Produtos:
- ✅ **Obrigatório**: Título, slug, categoria, pelo menos 1 imagem
- ✅ **Opcional**: Descrição, PDFs
- ✅ **Slug único**: Não pode haver dois produtos com o mesmo slug
- ✅ **Proteção**: Não pode deletar categoria que tem produtos

### Imagens:
- ✅ **Upload obrigatório**: Não aceita URLs externas
- ✅ **Múltiplas**: Um produto pode ter várias imagens
- ✅ **Ordenação**: Por campo `position`

### Variantes:
- ✅ **Opcional**: Produto pode existir sem variantes
- ✅ **Múltiplas**: Um produto pode ter várias variantes
- ✅ **Ordenação**: Por `position`, `type` e `size`
- ✅ **Desenho técnico**: Upload opcional por variante

---

## 🎨 Exibição no Frontend

### Página de Categorias (`/produtos`):
- Grid de cards com todas as categorias
- Cada card mostra: imagem, nome, descrição
- Link para `/produtos/{categoria-slug}`

### Página de Produtos da Categoria (`/produtos/{categoria-slug}`):
- Grid de cards com produtos da categoria
- Cada card mostra: primeira imagem, título
- Link para `/produtos/{categoria-slug}/{produto-slug}`

### Página de Detalhes do Produto (`/produtos/{categoria-slug}/{produto-slug}`):
- Galeria de imagens (todas as imagens do produto)
- Descrição completa
- Lista de PDFs para download
- Seletor de variantes (tipo e tamanho)
- Especificações técnicas da variante selecionada
- Desenho técnico da variante (se houver)

---

## 💡 Casos de Uso

### Exemplo Real:

**Categoria**: "Válvulas de Esfera"

**Produto**: "Válvula de Esfera Industrial"

**Imagens**:
- Foto geral do produto
- Detalhe da conexão
- Aplicação em instalação

**PDFs**:
- Manual técnico
- Catálogo
- Certificado de qualidade

**Variantes**:
1. Tipo: Bronze, Tamanho: 1/2", Pressão: 16 bar
2. Tipo: Bronze, Tamanho: 1", Pressão: 16 bar
3. Tipo: Aço Inox, Tamanho: 1/2", Pressão: 25 bar
4. Tipo: Aço Inox, Tamanho: 1", Pressão: 25 bar

Cada variante pode ter seu próprio desenho técnico.

---

## 🔐 Permissões

### Público (AllowAny):
- ✅ Listar categorias
- ✅ Listar produtos
- ✅ Ver detalhes do produto
- ✅ Ver variantes

### Admin (IsAuthenticated + IsAdmin):
- ✅ Criar/editar/deletar categorias
- ✅ Criar/editar/deletar produtos
- ✅ Upload de imagens/PDFs
- ✅ Criar/editar/deletar variantes
- ✅ Upload de desenhos técnicos

---

## 📝 Resumo

**Produto** = Entidade principal que representa um item vendido
- Pertence a uma **Categoria**
- Tem múltiplas **Imagens** (obrigatório)
- Pode ter múltiplos **PDFs** (opcional)
- Pode ter múltiplas **Variantes** (opcional)

**Variante** = Configuração específica do produto
- Define tipo, tamanho e especificações
- Pode ter desenho técnico próprio

Esta estrutura permite gerenciar um catálogo completo de produtos industriais com todas as informações técnicas necessárias.








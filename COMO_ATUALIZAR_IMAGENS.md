# 📸 Como Atualizar Imagens no Projeto

## 📁 Estrutura de Pastas

Todas as imagens devem estar na pasta `public/imagens/`:

```
public/
└── imagens/
    ├── valvulas.png                    (imagens de categorias)
    ├── conexoes.png
    ├── flanges.png
    └── valvulas-industriais/
        ├── esfera/                     (imagens das válvulas esfera)
        │   ├── tripartida300pr12.jpg
        │   ├── monobloco12.jpg
        │   └── ...
        ├── gaveta/
        ├── borboleta/
        └── ...
```

---

## 🔧 Como Adicionar/Atualizar Imagens

### **Passo 1: Colocar a Imagem na Pasta Correta**

1. Abra a pasta do projeto: `nexus-valvulas/public/imagens/`
2. Navegue até a subpasta correta:
   - Válvulas esfera → `valvulas-industriais/esfera/`
   - Válvulas gaveta → `valvulas-industriais/gaveta/`
   - Conexões → `conexoes-tubulares/`
3. Copie a imagem para a pasta

**Exemplo:**
```
public/imagens/valvulas-industriais/esfera/minha-nova-valvula.jpg
```

---

### **Passo 2: Atualizar o Código**

#### **Para Válvulas Esfera** (`src/data/sphericalValves.ts`)

Edite o arquivo e adicione/atualize o caminho da imagem:

```typescript
{
  id: "meu-tipo-valvula",
  name: "Meu Tipo de Válvula",
  description: "Descrição da válvula...",
  sizes: {
    "1/2": "/imagens/valvulas-industriais/esfera/minha-nova-valvula-12.jpg",
    "1": "/imagens/valvulas-industriais/esfera/minha-nova-valvula-1.jpg",
    "2": "/imagens/valvulas-industriais/esfera/minha-nova-valvula-2.jpg",
  }
}
```

**Regras importantes:**
- ✅ Caminho sempre começa com `/imagens/`
- ✅ Use nomes de arquivo descritivos
- ✅ Mantenha a estrutura de pastas organizada

---

#### **Para Outros Produtos** (`src/data/products.ts`)

```typescript
{
  id: "meu-produto",
  title: "Meu Produto",
  slug: "meu-produto",
  description: "Descrição...",
  variants: [
    {
      id: "variante-1",
      name: "Variante 1",
      sizes: {
        "1/2": "/imagens/valvulas-industriais/gaveta/gaveta-12.jpg",
        "1": "/imagens/valvulas-industriais/gaveta/gaveta-1.jpg",
      }
    }
  ]
}
```

---

#### **Para Produtos Simples** (sem variações)

```typescript
{
  id: "filtro-y",
  title: "Filtro Y",
  slug: "filtro-y",
  description: "Descrição...",
  // Apenas uma imagem fixa
  image: "/imagens/acessorios/filtro-y.jpg"
}
```

---

### **Passo 3: Verificar o Nome do Arquivo**

⚠️ **IMPORTANTE:** O nome do arquivo no código DEVE corresponder exatamente ao nome do arquivo na pasta!

**✅ Correto:**
```typescript
"1/2": "/imagens/valvulas-industriais/esfera/tripartida300pr12.jpg"
```
Arquivo: `public/imagens/valvulas-industriais/esfera/tripartida300pr12.jpg`

**❌ Errado:**
```typescript
"1/2": "/imagens/valvulas-industriais/esfera/tripartida300pr12.jpg"
```
Arquivo: `public/imagens/valvulas-industriais/esfera/tripartida300pr_12.jpg` (nome diferente!)

---

## 📝 Exemplos Práticos

### **Exemplo 1: Adicionar Nova Válvula Esfera**

1. **Colocar imagem:**
   ```
   public/imagens/valvulas-industriais/esfera/nova-tripartida-12.jpg
   ```

2. **Atualizar código** (`src/data/sphericalValves.ts`):
   ```typescript
   export const sphericalValvesTypes: ValveType[] = [
     // ... tipos existentes ...
     {
       id: "nova-tripartida",
       name: "Nova Tripartida 300#",
       description: "Descrição da nova válvula...",
       sizes: {
         "1/2": "/imagens/valvulas-industriais/esfera/nova-tripartida-12.jpg",
         "1": "/imagens/valvulas-industriais/esfera/nova-tripartida-1.jpg",
       }
     }
   ];
   ```

---

### **Exemplo 2: Atualizar Imagem Existente**

1. **Substituir o arquivo:**
   ```
   public/imagens/valvulas-industriais/esfera/tripartida300pr12.jpg
   ```
   (Substitua o arquivo antigo pelo novo, mantendo o mesmo nome)

2. **Não precisa alterar o código!** 
   O caminho já está correto, apenas substitua o arquivo físico.

---

### **Exemplo 3: Adicionar Novo Tamanho a Válvula Existente**

1. **Adicionar imagem:**
   ```
   public/imagens/valvulas-industriais/esfera/tripartida300pr4.jpg
   ```

2. **Atualizar código:**
   ```typescript
   {
     id: "tripartida-300-pr",
     name: "Válvula Esfera Tripartida 300# Passagem Reduzida",
     sizes: {
       "1/2": "/imagens/valvulas-industriais/esfera/tripartida300pr12.jpg",
       "3/4": "/imagens/valvulas-industriais/esfera/tripartida300pr34.jpg",
       "1": "/imagens/valvulas-industriais/esfera/tripartida300pr1.jpg",
       // ... tamanhos existentes ...
       "4": "/imagens/valvulas-industriais/esfera/tripartida300pr4.jpg", // NOVO
     }
   }
   ```

---

## 🔍 Verificar se a Imagem Está Correta

### **Método 1: Testar no Navegador**

1. Inicie o servidor: `npm run dev`
2. Acesse a página do produto
3. Abra o DevTools (F12)
4. Vá na aba **Network**
5. Filtre por **Img**
6. Verifique se a imagem carrega (status 200) ou se dá erro 404

### **Método 2: Verificar o Caminho Direto**

No navegador, acesse:
```
http://localhost:3000/imagens/valvulas-industriais/esfera/tripartida300pr12.jpg
```

Se a imagem aparecer, o caminho está correto! ✅

---

## ⚠️ Problemas Comuns

### **Problema 1: Imagem não aparece (404)**

**Causa:** Caminho incorreto ou arquivo não existe

**Solução:**
1. Verifique se o arquivo existe na pasta `public/imagens/...`
2. Verifique se o caminho no código está correto
3. Verifique se o nome do arquivo está exatamente igual (case-sensitive!)

---

### **Problema 2: Imagem aparece quebrada**

**Causa:** Arquivo corrompido ou formato não suportado

**Solução:**
1. Verifique se o arquivo não está corrompido
2. Use formatos: `.jpg`, `.jpeg`, `.png`, `.webp`
3. Tente abrir a imagem em um visualizador

---

### **Problema 3: Imagem antiga ainda aparece**

**Causa:** Cache do navegador

**Solução:**
1. Limpe o cache (Ctrl + Shift + Delete)
2. Ou faça hard refresh (Ctrl + F5)
3. Ou reinicie o servidor de desenvolvimento

---

## 📋 Checklist de Atualização

- [ ] Imagem colocada na pasta correta (`public/imagens/...`)
- [ ] Nome do arquivo corresponde ao caminho no código
- [ ] Caminho no código começa com `/imagens/`
- [ ] Formato da imagem é suportado (.jpg, .png, .webp)
- [ ] Testei no navegador e a imagem aparece
- [ ] Se necessário, limpei o cache

---

## 🎯 Resumo Rápido

1. **Coloque a imagem** em `public/imagens/[categoria]/[produto]/`
2. **Atualize o código** com o caminho `/imagens/[categoria]/[produto]/[arquivo]`
3. **Verifique** se o nome do arquivo está exatamente igual
4. **Teste** no navegador

**Pronto!** 🎉


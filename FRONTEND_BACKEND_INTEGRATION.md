# Integração Frontend com Backend Django

## ✅ Correções Realizadas

### 1. Portas Padronizadas
- Todas as referências de `localhost:4000` foram atualizadas para `localhost:8000`
- Arquivos corrigidos:
  - `src/contexts/AuthContext.tsx`
  - `src/pages/admin/AdminProducts.tsx`
  - `src/pages/admin/AdminCategories.tsx`
  - `src/pages/admin/AdminDashboard.tsx`
  - `src/pages/admin/AdminBlog.tsx`
  - `src/pages/Produtos.tsx`
  - `src/pages/ProdutoDetalhes.tsx`
  - `src/pages/ProdutoCategoria.tsx`
  - `src/pages/Contato.tsx`

### 2. Endpoints Ajustados

#### Produtos
- **Antes**: `/products/{id}` (Laravel)
- **Agora**: `/products/{slug}` (Django usa slug como lookup_field)
- **Upload de imagens**: `/products/{slug}/upload_images`
- **Upload de PDFs**: `/products/{slug}/upload_pdfs`

#### Categorias
- Mantido: `/categories/{id}` (Django usa ID para categorias)
- Upload de imagem: `/categories/{id}/upload_image`

#### Blog
- Adicionado endpoint: `/blog/posts/slug/{slug}` para compatibilidade
- Endpoint padrão: `/blog/posts/{slug}` também funciona

### 3. Compatibilidade de Respostas

A API Django retorna os mesmos formatos que o Laravel:
- **Login**: `{ user: {...}, token: "..." }`
- **Produtos**: `{ product: {...}, variants: [...] }`
- **Categorias**: `[{ id, name, slug, image, ... }]`

## 🔧 Configuração Necessária

### 1. Variável de Ambiente do Frontend

No arquivo `.env` na raiz do projeto (frontend), configure:

```env
VITE_API_BASE=http://localhost:8000
```

### 2. CORS Configurado

O backend Django já está configurado para aceitar requisições de:
- `http://localhost:3000`
- `http://localhost:5173`
- `http://localhost:4000`

## 🚀 Como Testar

### 1. Iniciar o Backend Django

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
```

Backend rodando em: `http://localhost:8000`

### 2. Iniciar o Frontend React

```powershell
# Na raiz do projeto
npm install
npm run dev
```

Frontend rodando em: `http://localhost:5173`

### 3. Testar Integração

1. **Teste da API**: Acesse `http://localhost:8000/api/test`
2. **Frontend**: Acesse `http://localhost:5173`
3. **Login Admin**: Use as credenciais criadas no Django
4. **Navegação**: Teste as páginas de produtos, categorias, blog

## ⚠️ Diferenças Importantes

### Produtos
- **Frontend deve usar slug**, não ID
- Ao criar produto, use o `slug` retornado para uploads
- Ao editar/deletar, use o `slug` do produto

### Categorias
- **Frontend pode usar ID** (Django usa ID como lookup_field)
- Funciona como antes

### Autenticação
- Mantém o mesmo formato JWT
- Token no header: `Authorization: Bearer <token>`

## 📝 Checklist de Compatibilidade

- [x] Portas atualizadas (4000 → 8000)
- [x] Endpoints de produtos ajustados (ID → slug)
- [x] Endpoint de blog por slug adicionado
- [x] Uploads ajustados para usar slug
- [x] Autenticação JWT compatível
- [x] CORS configurado
- [x] Formato de respostas compatível

## 🐛 Possíveis Problemas

### Erro: "Product not found"
- **Causa**: Frontend usando ID em vez de slug
- **Solução**: Verifique se está usando `product.slug` em vez de `product.id`

### Erro: CORS
- **Causa**: Frontend em porta diferente
- **Solução**: Adicione a porta no `CORS_ALLOWED_ORIGINS` do Django

### Erro: "Token inválido"
- **Causa**: Token expirado ou formato incorreto
- **Solução**: Faça login novamente

## 📚 Próximos Passos

1. Testar todas as funcionalidades do admin
2. Testar páginas públicas (produtos, blog, contato)
3. Verificar uploads de imagens e PDFs
4. Testar autenticação e permissões








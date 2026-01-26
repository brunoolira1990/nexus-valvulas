# Backend Django - Sistema de Blog

Backend Django focado exclusivamente no sistema de **BLOG institucional** com API REST.

## 🎯 Objetivo

API REST para gerenciar posts e categorias do blog institucional. O sistema de produtos será mockado no frontend e não possui backend.

## 🧱 Stack

- Python 3.11+
- Django 5.0+
- Django Rest Framework
- PostgreSQL (produção) / SQLite (desenvolvimento)
- Django Admin

## 📦 Instalação

### 1. Criar ambiente virtual

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### 2. Instalar dependências

```powershell
pip install -r requirements.txt
```

### 3. Configurar variáveis de ambiente

Copie o arquivo de exemplo e configure:

```powershell
copy env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
SECRET_KEY=sua-chave-secreta-aqui
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
USE_SQLITE=True

# PostgreSQL (quando USE_SQLITE=False)
DB_NAME=nexus_blog
DB_USER=postgres
DB_PASSWORD=sua-senha
DB_HOST=localhost
DB_PORT=5432

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173

# Media
PUBLIC_URL=http://localhost:8000
```

### 4. Executar migrações

```powershell
python manage.py migrate
```

### 5. Criar superusuário

```powershell
python manage.py createsuperuser
```

### 6. Iniciar servidor

```powershell
python manage.py runserver
```

O servidor estará disponível em: `http://localhost:8000`

## 📚 Estrutura do Projeto

```
backend/
├── blog/              # App do blog
│   ├── models.py      # BlogCategory, BlogPost
│   ├── serializers.py # Serializers DRF
│   ├── views.py       # ViewSets da API
│   ├── urls.py        # URLs do blog
│   └── admin.py       # Configuração Django Admin
├── api/               # App de autenticação (User model)
├── config/            # Configurações do projeto
│   ├── settings.py
│   └── urls.py
└── manage.py
```

## 🌐 Endpoints da API

### Categorias

- `GET /api/blog/categories` - Lista todas as categorias
- `GET /api/blog/categories/{slug}` - Detalhes da categoria
- `POST /api/blog/categories` - Criar categoria (admin)
- `PUT /api/blog/categories/{slug}` - Atualizar categoria (admin)
- `DELETE /api/blog/categories/{slug}` - Deletar categoria (admin)

### Posts

- `GET /api/blog/posts` - Lista posts publicados
- `GET /api/blog/posts?category={slug}` - Filtrar por categoria
- `GET /api/blog/posts/{slug}` - Detalhes do post
- `POST /api/blog/posts` - Criar post (admin)
- `PUT /api/blog/posts/{slug}` - Atualizar post (admin)
- `DELETE /api/blog/posts/{slug}` - Deletar post (admin)

## 🔐 Autenticação

Para criar/editar/deletar posts e categorias, é necessário autenticação JWT.

### Obter token (Django Admin)

1. Acesse `http://localhost:8000/admin`
2. Faça login com seu superusuário
3. Use o token JWT nas requisições (se implementado)

## 📝 Models

### BlogCategory

- `name`: Nome da categoria
- `slug`: Slug único (gerado automaticamente)
- `description`: Descrição opcional
- `created_at`: Data de criação

### BlogPost

- `title`: Título do post
- `slug`: Slug único (gerado automaticamente)
- `content`: Conteúdo (HTML ou Markdown)
- `excerpt`: Resumo curto
- `category`: ForeignKey para BlogCategory (PROTECT)
- `featured_image`: Upload de imagem destacada
- `is_published`: Boolean (apenas posts publicados aparecem publicamente)
- `published_at`: Data de publicação (automática quando is_published=True)
- `created_at`: Data de criação
- `updated_at`: Data de atualização

## 🛠️ Regras de Negócio

- Apenas posts com `is_published=True` são visíveis publicamente
- Slugs são únicos e gerados automaticamente
- Categorias não podem ser deletadas se possuírem posts (PROTECT)
- Upload de imagens apenas via multipart/form-data

## 🎨 Django Admin

Acesse `http://localhost:8000/admin` para gerenciar:

- **Categorias do Blog**: CRUD completo
- **Posts do Blog**: CRUD completo com preview de imagem
- **Usuários**: Gerenciamento de usuários

### Funcionalidades do Admin

- Slug gerado automaticamente
- Preview da imagem destacada
- Filtros por categoria e status de publicação
- Contagem de posts por categoria

## 📁 Upload de Imagens

As imagens são salvas em `media/blog/featured/` e servidas via:

```
http://localhost:8000/media/blog/featured/nome-do-arquivo.jpg
```

## 🚀 Deploy em Produção

### PostgreSQL

1. Configure `USE_SQLITE=False` no `.env`
2. Configure credenciais do PostgreSQL
3. Execute migrações: `python manage.py migrate`
4. Colete arquivos estáticos: `python manage.py collectstatic`

### Variáveis de Ambiente

```env
DEBUG=False
ALLOWED_HOSTS=seu-dominio.com
USE_SQLITE=False
DB_NAME=nexus_blog
DB_USER=postgres
DB_PASSWORD=senha-segura
DB_HOST=localhost
DB_PORT=5432
PUBLIC_URL=https://seu-dominio.com
```

## 📦 Dependências Principais

- `Django>=5.0`
- `djangorestframework>=3.14`
- `djangorestframework-simplejwt` (autenticação)
- `django-cors-headers` (CORS)
- `python-decouple` (variáveis de ambiente)
- `Pillow` (processamento de imagens)
- `psycopg2-binary` (PostgreSQL)

## 🐛 Troubleshooting

### Erro ao instalar psycopg2-binary no Windows

Use SQLite para desenvolvimento:

```env
USE_SQLITE=True
```

### Erro ao fazer upload de imagens

Verifique se a pasta `media/blog/featured/` existe e tem permissões de escrita.

### CORS bloqueando requisições

Verifique se `CORS_ALLOWED_ORIGINS` no `.env` inclui a URL do frontend.

## 📄 Licença

Este projeto é privado e proprietário.

# 🚀 Setup do Backend Django - Nexus Forge

## 📋 Pré-requisitos

- Python 3.10+
- pip
- Virtual environment (recomendado)

---

## 🔧 Instalação

### 1. Criar e Ativar Ambiente Virtual

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Linux/Mac
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar Dependências

```bash
pip install -r requirements_backend.txt
```

### 3. Configurar Settings.py

Adicione ao `settings.py` do seu projeto Django:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third party
    'rest_framework',
    'django_filters',
    'corsheaders',
    
    # Apps locais
    'apps.products',
    'apps.blog',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Adicione aqui
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# Media files (para upload de imagens)
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# CORS Settings (ajustar para produção)
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
]

CORS_ALLOW_CREDENTIALS = True

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
}
```

### 4. Configurar URLs Principal

No `urls.py` principal do projeto:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('products/', include('apps.products.urls')),
    path('blog/', include('apps.blog.urls')),
]

# Servir arquivos de mídia em desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

### 5. Executar Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Criar Superuser

```bash
python manage.py createsuperuser
```

### 7. Rodar Servidor

```bash
python manage.py runserver
```

---

## 📝 Estrutura de Arquivos Criada

```
backend/
├── apps/
│   ├── products/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py          ✅ Models completos
│   │   ├── admin.py           ✅ Admin otimizado
│   │   ├── serializers.py     ✅ Serializers formatados
│   │   ├── views.py           ✅ ViewSets REST
│   │   └── urls.py            ✅ URLs configuradas
│   │
│   └── blog/
│       ├── __init__.py
│       ├── apps.py
│       ├── models.py          ✅ Model Post
│       ├── admin.py           ✅ Admin configurado
│       ├── serializers.py     ✅ Serializers
│       ├── views.py           ✅ ViewSet
│       └── urls.py            ✅ URLs
│
├── requirements_backend.txt   ✅ Dependências
├── README_BACKEND.md         ✅ Documentação
└── SETUP_BACKEND.md          ✅ Este arquivo
```

---

## ✅ Checklist de Configuração

- [ ] Ambiente virtual criado e ativado
- [ ] Dependências instaladas
- [ ] Apps adicionados ao `INSTALLED_APPS`
- [ ] Middleware CORS configurado
- [ ] `MEDIA_URL` e `MEDIA_ROOT` configurados
- [ ] URLs incluídas no projeto principal
- [ ] Migrations executadas
- [ ] Superuser criado
- [ ] Servidor rodando

---

## 🎯 Próximos Passos

1. Acessar Admin: `http://localhost:8000/admin/`
2. Criar categorias
3. Cadastrar produtos manualmente
4. Testar API: `http://localhost:8000/products/api/categories/`

---

## 🔍 Endpoints Disponíveis

### Products
- `GET /products/api/categories/`
- `GET /products/api/categories/{slug}/`
- `GET /products/api/products/`
- `GET /products/api/products/{slug}/`

### Blog
- `GET /blog/api/posts/`
- `GET /blog/api/posts/{slug}/`


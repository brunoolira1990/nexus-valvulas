# Nexus Válvulas

Site institucional da Nexus Válvulas com catálogo de produtos e área administrativa.

## 🚀 Início Rápido com Docker

O projeto está totalmente containerizado e pode ser executado com Docker Compose.

### Pré-requisitos

- Docker (versão 20.10+)
- Docker Compose (versão 2.0+)
- Node.js 20+ (apenas para build do frontend)

### Passos para Iniciar

1. **Build do Frontend**:
```bash
npm install
npm run build:prod
```

2. **Configurar Variáveis de Ambiente**:
```bash
cp .env.docker.example .env.docker
# Edite .env.docker com suas configurações
```

3. **Iniciar Containers**:
```bash
docker-compose up --build -d
```

4. **Acessar a Aplicação**:
- Frontend: http://localhost:8000
- API: http://localhost:8000/api
- Teste: http://localhost:8000/api/test

Para mais detalhes, consulte [DOCKER.md](./DOCKER.md).

## Desenvolvimento Local (sem Docker)

### Frontend

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
- Criar arquivo `.env` com:
```bash
VITE_API_BASE=http://localhost:8000  # URL do backend Django
VITE_DISABLE_AUTH=1                  # Bypass auth em dev
```

3. Iniciar em modo desenvolvimento:
```bash
npm run dev
```

O frontend irá rodar em http://localhost:5173

### Backend Django

O backend está na pasta `backend/`. 

Consulte o [README do backend](./backend/README.md) para instruções detalhadas de instalação e configuração.

**Resumo rápido:**

1. Instalar dependências:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Linux/Mac
# ou
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

2. Configurar ambiente:
```bash
cp env.example .env
# Edite o .env com suas configurações
```

3. Configurar banco de dados PostgreSQL e executar migrações:
```bash
python manage.py migrate
```

4. Criar usuário admin:
```bash
python manage.py shell
```
```python
from api.models import User
user = User.objects.create_user(
    email='admin@nexus.com',
    password='admin123',
    name='Admin',
    role='ADMIN'
)
```

5. Iniciar servidor:
```bash
python manage.py runserver
```

O backend roda em http://localhost:8000

## Tecnologias Utilizadas

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Django 5.0 + Django Rest Framework + Python 3.10+
- **Banco de Dados**: PostgreSQL
- **Containerização**: Docker + Docker Compose
- **Autenticação**: JWT (djangorestframework-simplejwt)

## SEO e Performance

O site foi otimizado para:

- SEO profissional com meta tags, Open Graph, sitemap.xml
- Performance com lazy loading, code splitting e PWA
- Core Web Vitals otimizados
- Mobile-first e responsivo

## Segurança

- Validação de entrada em formulários
- Proteção CSRF
- Rate limiting

## Monitoramento

- Web Vitals para monitoramento de performance
- Logs estruturados para debugging

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/eae600b1-8112-4cab-b2f1-ccfab94ddb86) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/eae600b1-8112-4cab-b2f1-ccfab94ddb86) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
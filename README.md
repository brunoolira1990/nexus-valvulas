# Nexus Válvulas

Site institucional da Nexus Válvulas com catálogo de produtos e área administrativa.

## Desenvolvimento Local

### Frontend

1. Instalar dependências:
```bash
npm install
```

2. Configurar variáveis de ambiente:
- Criar arquivo `.env` com:
```
VITE_API_BASE=http://localhost:4000  # URL do backend
VITE_DISABLE_AUTH=1                  # Bypass auth em dev
```

3. Iniciar em modo desenvolvimento:
```bash
npm run dev
```

O frontend irá rodar em http://localhost:5173

### Backend

O backend está na pasta `backend/`. 

1. Instalar dependências:
```bash
cd backend
npm install
```

2. Criar banco de dados:
```bash
npx prisma generate
npx prisma migrate dev --name init
```

3. Criar usuário admin:
```bash
node scripts/create-admin.js
```
Credenciais padrão:
- Email: admin@nexus.com
- Senha: admin123

4. Iniciar servidor:
```bash
npm run dev
```

O backend roda em http://localhost:4000

## Tecnologias Utilizadas

- React + Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- React Hook Form
- Zod (validação)
- React Query
- Prisma ORM
- PostgreSQL
- Express.js
- Nginx (produção)
- PM2 (gerenciamento de processos)

## Deployment em Produção

### Arquitetura

O projeto utiliza uma arquitetura de frontend e backend separados:

- **Frontend**: nexusvalvulas.com.br
- **Backend/API**: api.nexusvalvulas.com.br

### Configuração de Ambiente

#### Backend (.env.production)
```bash
DATABASE_URL=postgresql://usuario:senha@host:porta/nome_do_banco?schema=public
JWT_SECRET=sua_chave_secreta_forte_aqui
PUBLIC_URL=https://api.nexusvalvulas.com.br
PORT=4000
```

#### Frontend (.env.production)
```bash
VITE_API_BASE=https://api.nexusvalvulas.com.br
```

### Servidor

O deployment em produção utiliza:

1. **Nginx** como servidor web e proxy reverso
2. **PM2** para gerenciamento de processos do backend
3. **PostgreSQL** como banco de dados
4. **SSL/TLS** com Let's Encrypt

### Processo de Deployment

1. Configurar ambiente de produção (variáveis de ambiente)
2. Build do frontend: `npm run build:prod`
3. Deploy do backend: `pm2 start backend/src/index.js`
4. Configurar Nginx com os arquivos de configuração fornecidos
5. Configurar SSL/TLS
6. Testar a aplicação
7. Monitorar logs e performance

## SEO e Performance

O site foi otimizado para:

- SEO profissional com meta tags, Open Graph, sitemap.xml
- Performance com lazy loading, code splitting e PWA
- Core Web Vitals otimizados
- Mobile-first e responsivo

## Segurança

- HTTPS obrigatório
- Headers de segurança (CSP, X-Frame-Options, etc.)
- Validação de entrada em formulários
- Proteção CSRF
- Rate limiting

## Monitoramento

- Analytics com Google Analytics 4
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

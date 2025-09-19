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

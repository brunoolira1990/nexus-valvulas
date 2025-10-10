Small local backend (Node + Express + Prisma + SQLite) for development.

Quick start (PowerShell):

# 1) entrar na pasta backend
cd backend

# 2) instalar dependências
npm install

# 3) gerar client Prisma e rodar migration inicial
npx prisma generate
npx prisma migrate dev --name init --preview-feature

# 4) iniciar servidor
npm run dev

Endpoints:
- GET /categories
- POST /categories       { name, slug, description }
- POST /categories/:id/image  form-data (image)
- DELETE /categories/:id

Notes:
- Uploads vão para backend/uploads/categories e são servidos em /uploads/categories
- Em produção troque SQLite por Postgres
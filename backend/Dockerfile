# Dockerfile para Backend Node.js + Express + Prisma
# Otimizado para produção

FROM node:18-alpine AS base

# Instalar dependências do sistema necessárias
RUN apk add --no-cache \
    openssl \
    postgresql-client \
    curl

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production --silent

# Copiar código fonte
COPY . .

# Gerar cliente Prisma
RUN npx prisma generate

# Criar diretórios necessários
RUN mkdir -p uploads/categories uploads/products uploads/variants uploads/blog

# Estágio de desenvolvimento (opcional)
FROM base AS development
RUN npm ci
CMD ["npm", "run", "dev"]

# Estágio de produção
FROM base AS production

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Alterar propriedade dos arquivos
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expor porta
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/test || exit 1

# Comando para iniciar a aplicação
CMD ["npm", "start"]

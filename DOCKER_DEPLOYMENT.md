# 🐳 Docker Deployment - Nexus Válvulas

## 📋 Visão Geral

Esta estrutura Docker unifica frontend e backend em um único domínio, eliminando problemas de CORS e simplificando o deploy. A arquitetura inclui:

- **Frontend**: React + Vite + PWA (containerizado)
- **Backend**: Node.js + Express + Prisma (containerizado)
- **Banco**: PostgreSQL (containerizado)
- **Proxy**: Nginx (proxy reverso unificado)
- **Cache**: Redis (opcional)

## 🏗️ Arquitetura

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx Proxy   │────│   Frontend      │    │   Backend       │
│   (Port 80/443) │    │   (React SPA)   │    │   (Node.js API) │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐    ┌─────────────────┐
                    │   PostgreSQL    │    │     Redis       │
                    │   (Database)    │    │     (Cache)     │
                    └─────────────────┘    └─────────────────┘
```

## 🚀 Instalação e Configuração

### 1. Pré-requisitos

```bash
# Instalar Docker e Docker Compose
# Ubuntu/Debian:
sudo apt update
sudo apt install docker.io docker-compose

# CentOS/RHEL:
sudo yum install docker docker-compose

# macOS: Docker Desktop
# Windows: Docker Desktop
```

### 2. Configuração das Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp env.example .env

# Editar variáveis (IMPORTANTE: alterar senhas e chaves)
nano .env
```

**Variáveis obrigatórias:**
```env
# Banco de dados
POSTGRES_PASSWORD=senha_super_segura_2024

# JWT Secret (IMPORTANTE: alterar em produção)
JWT_SECRET=sua-chave-jwt-super-secreta

# Email (configurar SMTP)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
```

### 3. Estrutura de Arquivos

```
nexus-valvulas/
├── docker-compose.yml          # Orquestração dos containers
├── Dockerfile.frontend        # Build do frontend
├── nginx/                     # Configurações do Nginx
│   ├── nginx.conf
│   └── conf.d/
│       └── default.conf
├── backend/
│   ├── Dockerfile            # Build do backend
│   └── env.example
├── .env                      # Variáveis de ambiente
└── ssl/                      # Certificados SSL (opcional)
```

## 🏃‍♂️ Comandos de Deploy

### Desenvolvimento Local

```bash
# 1. Construir e iniciar todos os serviços
docker-compose up --build

# 2. Em outro terminal, executar migrações do banco
docker-compose exec backend npx prisma migrate deploy

# 3. Acessar aplicação
# Frontend: http://localhost
# Backend API: http://localhost/api
# Banco: localhost:5432
```

### Produção

```bash
# 1. Deploy em produção
docker-compose up -d --build

# 2. Executar migrações
docker-compose exec backend npx prisma migrate deploy

# 3. Verificar status
docker-compose ps
docker-compose logs -f
```

## 🔧 Comandos Úteis

### Gerenciamento de Containers

```bash
# Ver status dos containers
docker-compose ps

# Ver logs em tempo real
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx

# Parar todos os serviços
docker-compose down

# Parar e remover volumes (CUIDADO: apaga dados)
docker-compose down -v
```

### Backup e Restore

```bash
# Backup do banco de dados
docker-compose exec database pg_dump -U nexus_user nexus_valvulas > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore do banco de dados
docker-compose exec -T database psql -U nexus_user nexus_valvulas < backup_file.sql
```

### Atualizações

```bash
# Atualizar aplicação (rebuild)
docker-compose up -d --build

# Atualizar apenas um serviço
docker-compose up -d --build backend

# Forçar rebuild sem cache
docker-compose build --no-cache
docker-compose up -d
```

## 🔒 Configuração SSL (HTTPS)

### 1. Certificados Let's Encrypt (Recomendado)

```bash
# Instalar certbot
sudo apt install certbot

# Obter certificado
sudo certbot certonly --standalone -d nexusvalvulas.com.br -d www.nexusvalvulas.com.br

# Copiar certificados para pasta ssl/
sudo cp /etc/letsencrypt/live/nexusvalvulas.com.br/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/nexusvalvulas.com.br/privkey.pem ./ssl/
```

### 2. Configuração Nginx para HTTPS

```bash
# Editar nginx/conf.d/default.conf
# Adicionar configuração SSL (já incluída no arquivo)
```

## 📊 Monitoramento

### Health Checks

```bash
# Verificar saúde dos containers
docker-compose ps

# Testar endpoints
curl http://localhost/health
curl http://localhost/api/test
```

### Logs e Debugging

```bash
# Logs em tempo real
docker-compose logs -f

# Logs específicos
docker-compose logs -f --tail=100 backend
docker-compose logs -f --tail=100 nginx

# Entrar no container para debug
docker-compose exec backend sh
docker-compose exec database psql -U nexus_user nexus_valvulas
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Erro de CORS**
   - Verificar se frontend e backend estão na mesma rede
   - Verificar configuração do Nginx

2. **Banco não conecta**
   - Verificar se container do banco está rodando
   - Verificar variáveis de ambiente

3. **PWA não atualiza**
   - Limpar cache do navegador
   - Verificar se service worker está sendo servido corretamente

4. **Uploads não funcionam**
   - Verificar permissões do diretório uploads/
   - Verificar configuração do Nginx para arquivos grandes

### Comandos de Debug

```bash
# Verificar rede interna
docker network ls
docker network inspect nexus-valvulas_nexus-network

# Verificar volumes
docker volume ls
docker volume inspect nexus-valvulas_postgres_data

# Verificar recursos
docker stats
```

## 🔄 CI/CD e Deploy Automatizado

### Script de Deploy

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando deploy..."

# Parar containers existentes
docker-compose down

# Pull das imagens mais recentes
docker-compose pull

# Build e start
docker-compose up -d --build

# Executar migrações
docker-compose exec backend npx prisma migrate deploy

# Verificar saúde
sleep 30
docker-compose ps

echo "✅ Deploy concluído!"
```

### GitHub Actions (Opcional)

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy
        run: |
          docker-compose up -d --build
          docker-compose exec backend npx prisma migrate deploy
```

## 📈 Performance e Otimização

### Configurações de Performance

1. **Nginx**: Gzip, cache de assets
2. **PostgreSQL**: Configurações de memória
3. **Redis**: Cache de sessões e queries
4. **Docker**: Limites de recursos

### Monitoramento

```bash
# Instalar ferramentas de monitoramento
docker run -d --name monitoring \
  -p 3000:3000 \
  grafana/grafana

# Métricas do sistema
docker stats --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}"
```

## 🛡️ Segurança

### Checklist de Segurança

- [ ] Alterar senhas padrão
- [ ] Configurar JWT secret forte
- [ ] Configurar SSL/HTTPS
- [ ] Limitar recursos dos containers
- [ ] Configurar firewall
- [ ] Backup automático
- [ ] Monitoramento de logs

### Configurações de Segurança

```bash
# Firewall (UFW)
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable

# Limitar recursos
# Adicionar no docker-compose.yml:
deploy:
  resources:
    limits:
      memory: 512M
      cpus: '0.5'
```

## 📞 Suporte

Para problemas ou dúvidas:

1. Verificar logs: `docker-compose logs -f`
2. Verificar status: `docker-compose ps`
3. Verificar rede: `docker network ls`
4. Verificar volumes: `docker volume ls`

---

**🎉 Parabéns!** Sua aplicação Nexus Válvulas está rodando com Docker! 

Acesse: http://localhost (ou seu domínio configurado)

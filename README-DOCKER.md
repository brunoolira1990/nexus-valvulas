# 🐳 Nexus Válvulas - Docker Setup

## 🎯 Objetivo

Esta estrutura Docker resolve os problemas atuais:
- ✅ **CORS eliminado**: Frontend e backend na mesma rede interna
- ✅ **Deploy simplificado**: Um comando para subir tudo
- ✅ **PWA atualizado**: Service worker funciona corretamente
- ✅ **Domínio unificado**: Tudo em `nexusvalvulas.com.br`
- ✅ **Escalável**: Fácil de adicionar novos serviços

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                    Nginx Proxy (Port 80/443)              │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │   Frontend      │  │   Backend       │  │   Database   │ │
│  │   (React SPA)   │  │   (Node.js API) │  │ (PostgreSQL) │ │
│  │   Port 3000     │  │   Port 4000     │  │   Port 5432  │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

## 🚀 Quick Start

### 1. Configuração Inicial

```bash
# 1. Clonar/copiar arquivos Docker
# 2. Configurar variáveis de ambiente
cp env.example .env
nano .env  # Editar variáveis

# 3. Deploy automático
./deploy.sh prod
```

### 2. Acesso

- **Frontend**: http://localhost
- **API**: http://localhost/api
- **Health Check**: http://localhost/health

## 📁 Estrutura de Arquivos

```
nexus-valvulas/
├── 🐳 Docker Files
│   ├── docker-compose.yml          # Produção
│   ├── docker-compose.dev.yml      # Desenvolvimento
│   ├── Dockerfile.frontend         # Frontend
│   └── backend/Dockerfile          # Backend
│
├── 🌐 Nginx
│   ├── nginx/nginx.conf            # Config principal
│   ├── nginx/conf.d/default.conf   # Config do servidor
│   └── nginx-frontend.conf         # Config do frontend
│
├── ⚙️ Configuração
│   ├── .env                        # Variáveis de ambiente
│   ├── env.example                 # Exemplo de variáveis
│   └── deploy.sh                   # Script de deploy
│
└── 📚 Documentação
    ├── DOCKER_DEPLOYMENT.md        # Guia completo
    └── README-DOCKER.md            # Este arquivo
```

## 🔧 Comandos Essenciais

### Desenvolvimento

```bash
# Iniciar em modo desenvolvimento
docker-compose -f docker-compose.dev.yml up --build

# Parar desenvolvimento
docker-compose -f docker-compose.dev.yml down
```

### Produção

```bash
# Deploy completo
./deploy.sh prod

# Deploy com limpeza
./deploy.sh prod clean

# Parar tudo
docker-compose down

# Ver logs
docker-compose logs -f
```

### Manutenção

```bash
# Backup do banco
docker-compose exec database pg_dump -U nexus_user nexus_valvulas > backup.sql

# Restore do banco
docker-compose exec -T database psql -U nexus_user nexus_valvulas < backup.sql

# Executar migrações
docker-compose exec backend npx prisma migrate deploy

# Ver status
docker-compose ps
```

## 🔒 Configuração de Segurança

### 1. Variáveis de Ambiente Obrigatórias

```env
# Banco de dados
POSTGRES_PASSWORD=senha_super_segura_2024

# JWT (IMPORTANTE: alterar em produção)
JWT_SECRET=sua-chave-jwt-super-secreta

# Email SMTP
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-de-app
```

### 2. SSL/HTTPS (Produção)

```bash
# 1. Obter certificados Let's Encrypt
sudo certbot certonly --standalone -d nexusvalvulas.com.br

# 2. Copiar certificados
sudo cp /etc/letsencrypt/live/nexusvalvulas.com.br/fullchain.pem ./ssl/
sudo cp /etc/letsencrypt/live/nexusvalvulas.com.br/privkey.pem ./ssl/

# 3. Configurar Nginx para HTTPS
# (já incluído na configuração)
```

## 📊 Monitoramento

### Health Checks

```bash
# Verificar saúde dos containers
docker-compose ps

# Testar endpoints
curl http://localhost/health
curl http://localhost/api/test

# Ver logs em tempo real
docker-compose logs -f
```

### Métricas

```bash
# Uso de recursos
docker stats

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f nginx
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **"Container não inicia"**
   ```bash
   # Verificar logs
   docker-compose logs [nome-do-container]
   
   # Verificar se porta está em uso
   netstat -tulpn | grep :80
   ```

2. **"Banco não conecta"**
   ```bash
   # Verificar se banco está rodando
   docker-compose ps database
   
   # Testar conexão
   docker-compose exec database pg_isready -U nexus_user
   ```

3. **"CORS ainda aparece"**
   ```bash
   # Verificar se containers estão na mesma rede
   docker network ls
   docker network inspect nexus-valvulas_nexus-network
   ```

4. **"PWA não atualiza"**
   ```bash
   # Limpar cache do navegador
   # Verificar se service worker está sendo servido
   curl -I http://localhost/sw.js
   ```

### Debug Avançado

```bash
# Entrar no container
docker-compose exec backend sh
docker-compose exec frontend sh

# Verificar rede interna
docker network inspect nexus-valvulas_nexus-network

# Verificar volumes
docker volume ls
docker volume inspect nexus-valvulas_postgres_data
```

## 🔄 CI/CD

### GitHub Actions

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
          cp env.example .env
          ./deploy.sh prod
```

### Script de Deploy Automatizado

```bash
#!/bin/bash
# deploy-production.sh

# 1. Backup atual
docker-compose exec database pg_dump -U nexus_user nexus_valvulas > backup_$(date +%Y%m%d_%H%M%S).sql

# 2. Deploy
./deploy.sh prod

# 3. Verificar saúde
sleep 30
curl -f http://localhost/health || exit 1

echo "✅ Deploy concluído com sucesso!"
```

## 📈 Performance

### Otimizações Incluídas

- ✅ **Multi-stage builds**: Imagens menores
- ✅ **Nginx gzip**: Compressão de assets
- ✅ **Cache headers**: Assets com cache longo
- ✅ **Health checks**: Monitoramento automático
- ✅ **Resource limits**: Controle de recursos

### Configurações de Performance

```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'
```

## 🎉 Benefícios

### Antes (Problemas)
- ❌ CORS entre frontend e backend
- ❌ Deploy manual complicado
- ❌ PWA não atualiza
- ❌ Dependências no servidor
- ❌ Dois domínios diferentes

### Depois (Soluções)
- ✅ **Zero CORS**: Rede interna Docker
- ✅ **Deploy simples**: `./deploy.sh prod`
- ✅ **PWA funciona**: Service worker atualiza
- ✅ **Sem dependências**: Tudo containerizado
- ✅ **Domínio único**: `nexusvalvulas.com.br`

## 📞 Suporte

### Comandos de Emergência

```bash
# Parar tudo
docker-compose down

# Limpar tudo (CUIDADO: apaga dados)
docker-compose down -v --rmi all

# Restaurar backup
docker-compose exec -T database psql -U nexus_user nexus_valvulas < backup.sql
```

### Logs Importantes

```bash
# Logs do sistema
docker-compose logs -f

# Logs específicos
docker-compose logs -f nginx | grep error
docker-compose logs -f backend | grep error
```

---

**🎯 Resultado**: Aplicação Nexus Válvulas rodando perfeitamente com Docker, sem CORS, com deploy simplificado e PWA funcionando! 🚀

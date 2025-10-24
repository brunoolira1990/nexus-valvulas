# 🚀 Guia de Deploy em Produção - Nexus Válvulas
# Domínio: nexusvalvulas.com.br
# Ambiente: Docker Production

## 📋 Pré-requisitos

### Servidor
- **OS**: Ubuntu 20.04+ ou CentOS 8+
- **RAM**: Mínimo 4GB (recomendado 8GB+)
- **CPU**: Mínimo 2 cores (recomendado 4+ cores)
- **Disco**: Mínimo 50GB (recomendado 100GB+)
- **Rede**: IP público com domínio configurado

### Software
- **Docker**: 20.10+
- **Docker Compose**: 2.0+
- **Git**: Para clonar o repositório
- **Certbot**: Para certificados SSL (Let's Encrypt)

## 🔧 Configuração Inicial

### 1. Preparar o Servidor
```bash
# Atualizar sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER
```

### 2. Clonar o Repositório
```bash
# Clonar projeto
git clone https://github.com/seu-usuario/nexus-valvulas.git
cd nexus-valvulas

# Verificar arquivos
ls -la
```

## ⚙️ Configuração dos Arquivos de Ambiente

### 1. Configurar Frontend (.env.prod.frontend)
```bash
# Copiar arquivo de exemplo
cp env.prod.frontend .env.prod.frontend

# Editar configurações
nano .env.prod.frontend
```

**Configurações importantes:**
- `VITE_API_BASE=https://nexusvalvulas.com.br/api`
- `VITE_PUBLIC_URL=https://nexusvalvulas.com.br`
- `VITE_DOMAIN=nexusvalvulas.com.br`

### 2. Configurar Backend (.env.prod.backend)
```bash
# Copiar arquivo de exemplo
cp env.prod.backend .env.prod.backend

# Editar configurações
nano .env.prod.backend
```

**Configurações obrigatórias:**
```bash
# Gerar senha forte para PostgreSQL
POSTGRES_PASSWORD=sua_senha_postgres_super_forte_aqui

# Gerar JWT secret forte (64+ caracteres)
JWT_SECRET=sua_chave_jwt_super_secreta_aqui_minimo_64_caracteres

# Configurar email Google Workspace
EMAIL_USER=contato@nexusvalvulas.com.br
EMAIL_PASS=sua_senha_de_app_google_aqui
EMAIL_FROM=Nexus Válvulas <contato@nexusvalvulas.com.br>
```

### 3. Configurar Nginx (.env.prod.nginx)
```bash
# Copiar arquivo de exemplo
cp env.prod.nginx .env.prod.nginx

# Editar configurações
nano .env.prod.nginx
```

**Configurações importantes:**
- `NGINX_DOMAIN=nexusvalvulas.com.br`
- `SSL_ENABLED=true`
- `SSL_CERT_PATH=/etc/nginx/ssl/fullchain.pem`

## 🔐 Configuração SSL (Let's Encrypt)

### 1. Instalar Certbot
```bash
# Ubuntu/Debian
sudo apt install certbot python3-certbot-nginx -y

# CentOS/RHEL
sudo yum install certbot python3-certbot-nginx -y
```

### 2. Obter Certificado SSL
```bash
# Parar Nginx temporariamente
sudo systemctl stop nginx

# Obter certificado
sudo certbot certonly --standalone -d nexusvalvulas.com.br -d www.nexusvalvulas.com.br

# Verificar certificados
sudo ls -la /etc/letsencrypt/live/nexusvalvulas.com.br/
```

### 3. Configurar Renovação Automática
```bash
# Testar renovação
sudo certbot renew --dry-run

# Adicionar ao crontab
sudo crontab -e
# Adicionar linha:
# 0 12 * * * /usr/bin/certbot renew --quiet
```

## 🚀 Deploy da Aplicação

### 1. Preparar Diretórios
```bash
# Criar diretórios necessários
mkdir -p ssl backup logs uploads

# Copiar certificados SSL
sudo cp /etc/letsencrypt/live/nexusvalvulas.com.br/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/nexusvalvulas.com.br/privkey.pem ssl/
sudo chown -R $USER:$USER ssl/
```

### 2. Build e Deploy
```bash
# Build das imagens
docker-compose -f docker-compose.production.yml build

# Iniciar serviços
docker-compose -f docker-compose.production.yml up -d

# Verificar status
docker-compose -f docker-compose.production.yml ps
```

### 3. Configurar Banco de Dados
```bash
# Executar migrações
docker exec nexus-backend npx prisma migrate deploy

# Criar dados iniciais
docker exec nexus-backend node prisma/seed.js

# Verificar banco
docker exec nexus-database psql -U nexus_user -d nexus_valvulas -c "\dt"
```

## 🔍 Verificação e Testes

### 1. Verificar Serviços
```bash
# Status dos containers
docker ps

# Logs dos serviços
docker logs nexus-backend
docker logs nexus-frontend
docker logs nexus-nginx
docker logs nexus-database
docker logs nexus-redis
```

### 2. Testar Endpoints
```bash
# Testar frontend
curl -I https://nexusvalvulas.com.br

# Testar API
curl -I https://nexusvalvulas.com.br/api/health

# Testar banco
docker exec nexus-database pg_isready -U nexus_user -d nexus_valvulas
```

### 3. Verificar SSL
```bash
# Testar certificado SSL
openssl s_client -connect nexusvalvulas.com.br:443 -servername nexusvalvulas.com.br

# Verificar grade SSL
curl -I https://nexusvalvulas.com.br
```

## 📊 Monitoramento

### 1. Logs
```bash
# Ver logs em tempo real
docker logs -f nexus-backend
docker logs -f nexus-nginx

# Logs do sistema
sudo journalctl -u docker -f
```

### 2. Métricas
```bash
# Uso de recursos
docker stats

# Espaço em disco
df -h
docker system df
```

### 3. Health Checks
```bash
# Verificar saúde dos containers
docker inspect nexus-backend | grep -A 10 Health
docker inspect nexus-database | grep -A 10 Health
```

## 🔄 Backup e Manutenção

### 1. Backup do Banco
```bash
# Backup manual
docker exec nexus-database pg_dump -U nexus_user -d nexus_valvulas > backup/nexus_backup_$(date +%Y%m%d_%H%M%S).sql

# Backup automático (crontab)
# 0 2 * * * docker exec nexus-database pg_dump -U nexus_user -d nexus_valvulas > /path/to/backup/nexus_backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql
```

### 2. Limpeza de Logs
```bash
# Limpar logs antigos
docker system prune -f
docker volume prune -f

# Rotacionar logs do Nginx
sudo logrotate /etc/logrotate.d/nginx
```

### 3. Atualizações
```bash
# Atualizar código
git pull origin main

# Rebuild e restart
docker-compose -f docker-compose.production.yml down
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### 1. Container não inicia
```bash
# Verificar logs
docker logs nexus-backend

# Verificar configurações
docker-compose -f docker-compose.production.yml config

# Verificar recursos
docker system df
```

#### 2. Erro de conexão com banco
```bash
# Verificar se banco está rodando
docker ps | grep nexus-database

# Testar conexão
docker exec nexus-database pg_isready -U nexus_user -d nexus_valvulas

# Verificar logs do banco
docker logs nexus-database
```

#### 3. Problemas de SSL
```bash
# Verificar certificados
sudo ls -la /etc/letsencrypt/live/nexusvalvulas.com.br/

# Renovar certificados
sudo certbot renew

# Reiniciar Nginx
docker restart nexus-nginx
```

#### 4. Problemas de email
```bash
# Verificar configurações de email
docker exec nexus-backend env | grep EMAIL

# Testar envio de email
docker exec nexus-backend node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransporter({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});
transporter.verify((error, success) => {
  if (error) console.log('Erro:', error);
  else console.log('Email configurado corretamente');
});
"
```

## 📞 Suporte

### Comandos Úteis
```bash
# Reiniciar todos os serviços
docker-compose -f docker-compose.production.yml restart

# Parar todos os serviços
docker-compose -f docker-compose.production.yml down

# Ver logs de todos os serviços
docker-compose -f docker-compose.production.yml logs -f

# Executar comando em container
docker exec -it nexus-backend bash
docker exec -it nexus-database psql -U nexus_user -d nexus_valvulas
```

### Logs Importantes
- **Backend**: `docker logs nexus-backend`
- **Frontend**: `docker logs nexus-frontend`
- **Nginx**: `docker logs nexus-nginx`
- **Database**: `docker logs nexus-database`
- **Redis**: `docker logs nexus-redis`

---

**🎉 Deploy em produção concluído com sucesso!**

**🌐 Acesse**: https://nexusvalvulas.com.br

**📧 Suporte**: contato@nexusvalvulas.com.br
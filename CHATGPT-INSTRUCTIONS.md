# 🤖 Instrução Completa para ChatGPT - Projeto Nexus Válvulas

## 📋 Contexto do Projeto

Você é um assistente especializado em DevOps, Docker e desenvolvimento web. O projeto **Nexus Válvulas** é uma aplicação completa para uma empresa de válvulas industriais, desenvolvida com tecnologias modernas e configurada para produção.

### 🏗️ Arquitetura do Sistema
- **Frontend**: React + Vite + TypeScript + Tailwind CSS + ShadCN/UI
- **Backend**: Node.js + Express + Prisma + PostgreSQL + Redis
- **Proxy**: Nginx (proxy reverso)
- **Banco**: PostgreSQL 15
- **Cache**: Redis 7
- **Deploy**: Docker + Docker Compose
- **Domínio**: nexusvalvulas.com.br

### 📁 Estrutura do Projeto
```
nexus-valvulas/
├── frontend/                 # React + Vite
├── backend/                  # Node.js + Express + Prisma
├── nginx/                    # Configurações Nginx
├── docker-compose.*.yml      # Configurações Docker
├── env.*                     # Variáveis de ambiente
├── scripts/                  # Scripts PowerShell
└── docs/                     # Documentação
```

## 🚀 Configurações Disponíveis

### 1. **Desenvolvimento Local (Windows 11 Pro)**
- Arquivo: `docker-compose.windows-prod.yml`
- Scripts: `setup-windows.ps1`, `deploy-windows.ps1`, `manage-windows.ps1`
- Ambiente: `env.windows.production`

### 2. **Produção (Servidor Linux)**
- Arquivo: `docker-compose.production.yml`
- Ambiente: `env.prod.backend`, `env.prod.frontend`, `env.prod.nginx`
- Guia: `DEPLOY-PRODUCTION-GUIDE.md`

### 3. **Servidor de Produção Existente**
- Arquivo: `docker-compose.production-server.yml`
- Configuração: Para servidor já configurado

## 🔧 Resolução do Problema Atual

O usuário está recebendo avisos sobre variáveis de ambiente não definidas. **SOLUÇÃO**:

### 1. Criar arquivo `.env` no diretório raiz:
```bash
# Copiar arquivo de exemplo
cp env.prod.backend .env

# Ou criar manualmente
nano .env
```

### 2. Conteúdo do arquivo `.env`:
```env
# Configurações obrigatórias para produção
POSTGRES_DB=nexus_valvulas
POSTGRES_USER=nexus_user
POSTGRES_PASSWORD=sua_senha_postgres_forte_aqui

JWT_SECRET=sua_chave_jwt_super_secreta_aqui_minimo_64_caracteres

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=contato@nexusvalvulas.com.br
EMAIL_PASS=sua_senha_de_app_google_aqui
EMAIL_FROM=Nexus Válvulas <contato@nexusvalvulas.com.br>

PUBLIC_URL=https://nexusvalvulas.com.br
NODE_ENV=production
```

### 3. Executar build novamente:
```bash
docker-compose -f docker-compose.production-server.yml build
```

## 📚 Comandos Essenciais

### **Desenvolvimento Local (Windows)**
```powershell
# Configuração inicial
.\setup-windows.ps1

# Deploy completo
.\deploy-windows.ps1

# Gerenciar serviços
.\manage-windows.ps1 -Action status
.\manage-windows.ps1 -Action logs -Follow

# Configurar banco
.\setup-database.ps1 -Action setup

# Backup do banco
.\backup-database.ps1 -Action backup
```

### **Produção (Linux)**
```bash
# Build e deploy
docker-compose -f docker-compose.production.yml build
docker-compose -f docker-compose.production.yml up -d

# Configurar banco
docker exec nexus-backend npx prisma migrate deploy
docker exec nexus-backend node prisma/seed.js

# Verificar logs
docker logs nexus-backend -f
docker logs nexus-nginx -f
```

### **Servidor Existente**
```bash
# Build com variáveis de ambiente
docker-compose -f docker-compose.production-server.yml build

# Deploy
docker-compose -f docker-compose.production-server.yml up -d

# Verificar status
docker-compose -f docker-compose.production-server.yml ps
```

## 🔍 Diagnóstico e Solução de Problemas

### **Problema: Variáveis de ambiente não definidas**
```bash
# Verificar arquivo .env
cat .env

# Verificar variáveis no container
docker exec nexus-backend env | grep EMAIL

# Recriar containers com novas variáveis
docker-compose -f docker-compose.production-server.yml down
docker-compose -f docker-compose.production-server.yml up -d
```

### **Problema: Container não inicia**
```bash
# Verificar logs
docker logs nexus-backend
docker logs nexus-database

# Verificar recursos
docker system df
docker stats

# Verificar configuração
docker-compose -f docker-compose.production-server.yml config
```

### **Problema: Banco de dados não conecta**
```bash
# Verificar se banco está rodando
docker ps | grep nexus-database

# Testar conexão
docker exec nexus-database pg_isready -U nexus_user -d nexus_valvulas

# Verificar logs do banco
docker logs nexus-database
```

### **Problema: Email não funciona**
```bash
# Verificar configurações
docker exec nexus-backend env | grep EMAIL

# Testar conexão SMTP
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
  else console.log('Email OK');
});
"
```

## 📊 Monitoramento

### **Health Checks**
```bash
# Verificar saúde dos containers
docker inspect nexus-backend | grep -A 10 Health
docker inspect nexus-database | grep -A 10 Health

# Testar endpoints
curl -I https://nexusvalvulas.com.br
curl -I https://nexusvalvulas.com.br/api/health
```

### **Logs**
```bash
# Logs em tempo real
docker logs -f nexus-backend
docker logs -f nexus-nginx
docker logs -f nexus-database

# Logs de todos os serviços
docker-compose -f docker-compose.production-server.yml logs -f
```

### **Métricas**
```bash
# Uso de recursos
docker stats

# Espaço em disco
df -h
docker system df
```

## 🔐 Configurações de Segurança

### **Senhas Obrigatórias**
1. **POSTGRES_PASSWORD**: Senha forte para PostgreSQL
2. **JWT_SECRET**: Chave de 64+ caracteres para JWT
3. **EMAIL_PASS**: Senha de app do Google (não senha normal)

### **Certificados SSL**
```bash
# Verificar certificados
sudo ls -la /etc/letsencrypt/live/nexusvalvulas.com.br/

# Renovar certificados
sudo certbot renew

# Copiar para projeto
sudo cp /etc/letsencrypt/live/nexusvalvulas.com.br/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/nexusvalvulas.com.br/privkey.pem ssl/
```

## 🌐 Acesso à Aplicação

### **URLs de Produção**
- **Frontend**: https://nexusvalvulas.com.br
- **API**: https://nexusvalvulas.com.br/api
- **Admin**: https://nexusvalvulas.com.br/admin

### **Credenciais Padrão**
- **Email**: admin@nexusvalvulas.com.br
- **Senha**: admin123
- **Role**: ADMIN

## 📞 Suporte e Recursos

### **Documentação Disponível**
- `README-WINDOWS-PRODUCTION.md` - Guia Windows
- `DATABASE-GUIDE.md` - Guia do banco
- `DEPLOY-PRODUCTION-GUIDE.md` - Guia de produção
- `GIT-GUIDE.md` - Guia Git

### **Scripts Úteis**
- `setup-windows.ps1` - Configuração inicial Windows
- `deploy-windows.ps1` - Deploy Windows
- `manage-windows.ps1` - Gerenciamento Windows
- `setup-database.ps1` - Configuração banco
- `backup-database.ps1` - Backup banco

### **Comandos de Emergência**
```bash
# Parar tudo
docker-compose -f docker-compose.production-server.yml down

# Limpar sistema
docker system prune -f

# Restaurar backup
docker exec nexus-database psql -U nexus_user -d nexus_valvulas < backup.sql

# Reiniciar tudo
docker-compose -f docker-compose.production-server.yml restart
```

## 🎯 Instruções Específicas para ChatGPT

### **Quando o usuário perguntar sobre:**
1. **Deploy**: Use `docker-compose.production-server.yml` e crie arquivo `.env`
2. **Problemas**: Sempre verifique logs primeiro (`docker logs`)
3. **Banco**: Use `setup-database.ps1` ou comandos Prisma diretos
4. **Email**: Verifique configurações SMTP e senha de app
5. **SSL**: Use Certbot para Let's Encrypt
6. **Backup**: Use `backup-database.ps1` ou pg_dump direto

### **Sempre incluir:**
- Verificação de logs
- Comandos de diagnóstico
- Soluções passo a passo
- Verificação de recursos
- Testes de conectividade

### **Prioridades:**
1. **Segurança**: Senhas fortes, HTTPS, headers de segurança
2. **Performance**: Cache Redis, compressão Nginx, otimizações
3. **Monitoramento**: Health checks, logs, métricas
4. **Backup**: Sistema automático de backup
5. **Manutenção**: Atualizações, limpeza, otimização

---

**🎉 Projeto Nexus Válvulas está pronto para produção com todas as configurações necessárias!**

**📧 Suporte**: contato@nexusvalvulas.com.br  
**🌐 Site**: https://nexusvalvulas.com.br  
**📚 Docs**: Consulte os arquivos README-*.md para guias específicos
# Nexus Válvulas - Deploy em Produção Windows 11 Pro

## 📋 Visão Geral

Este guia fornece instruções completas para configurar e executar o projeto Nexus Válvulas em produção no Windows 11 Pro usando Docker Desktop.

## 🚀 Pré-requisitos

### Software Necessário
- **Windows 11 Pro** (build 22000 ou superior)
- **Docker Desktop for Windows** (versão 4.20 ou superior)
- **PowerShell 7.0** ou superior
- **Git** (para clonar o repositório)

### Recursos do Sistema
- **RAM**: Mínimo 8GB (recomendado 16GB)
- **CPU**: Mínimo 4 cores (recomendado 8 cores)
- **Armazenamento**: Mínimo 50GB de espaço livre
- **Rede**: Conexão estável com internet

## 📁 Estrutura de Arquivos

```
nexus-valvulas/
├── docker-compose.windows-prod.yml    # Compose principal para Windows
├── Dockerfile.frontend.windows        # Frontend otimizado para Windows
├── backend/Dockerfile.windows         # Backend otimizado para Windows
├── env.windows.production             # Variáveis de ambiente
├── nginx/nginx-windows.conf            # Configuração Nginx
├── nginx-frontend-windows.conf         # Configuração Frontend
├── postgresql.conf                     # Configuração PostgreSQL
├── monitoring/prometheus.yml           # Configuração Prometheus
├── deploy-windows.ps1                 # Script de deploy
├── manage-windows.ps1                  # Script de gerenciamento
└── data/                              # Diretório de dados persistentes
    ├── postgres/
    ├── uploads/
    ├── logs/
    ├── nginx-logs/
    ├── nginx-cache/
    ├── redis/
    └── prometheus/
```

## ⚙️ Configuração Inicial

### 1. Instalar Docker Desktop

1. Baixe o Docker Desktop do site oficial
2. Execute o instalador como Administrador
3. Reinicie o computador após a instalação
4. Abra o Docker Desktop e configure:
   - Ative WSL 2 integration
   - Configure recursos: RAM 8GB+, CPU 4+ cores
   - Ative Kubernetes (opcional)

### 2. Configurar Variáveis de Ambiente

Edite o arquivo `env.windows.production` com suas configurações:

```bash
# Configurações do banco de dados
POSTGRES_DB=nexus_valvulas
POSTGRES_USER=nexus_user
POSTGRES_PASSWORD=sua_senha_segura_aqui

# Configurações do backend
JWT_SECRET=seu_jwt_secret_aqui
PUBLIC_URL=http://localhost

# Configurações de email
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
```

### 3. Criar Diretórios Necessários

Execute o PowerShell como Administrador e execute:

```powershell
# Criar estrutura de diretórios
New-Item -ItemType Directory -Path ".\data\postgres" -Force
New-Item -ItemType Directory -Path ".\data\uploads" -Force
New-Item -ItemType Directory -Path ".\data\logs" -Force
New-Item -ItemType Directory -Path ".\data\nginx-logs" -Force
New-Item -ItemType Directory -Path ".\data\nginx-cache" -Force
New-Item -ItemType Directory -Path ".\data\redis" -Force
New-Item -ItemType Directory -Path ".\data\prometheus" -Force
New-Item -ItemType Directory -Path ".\backup" -Force
```

## 🚀 Deploy da Aplicação

### Método 1: Script Automatizado (Recomendado)

Execute o PowerShell como Administrador:

```powershell
# Deploy completo
.\deploy-windows.ps1

# Deploy sem rebuild (mais rápido)
.\deploy-windows.ps1 -SkipBuild

# Deploy sem backup (mais rápido)
.\deploy-windows.ps1 -SkipBackup
```

### Método 2: Comandos Manuais

```powershell
# 1. Parar containers existentes
docker-compose -f docker-compose.windows-prod.yml down

# 2. Construir imagens
docker-compose -f docker-compose.windows-prod.yml build

# 3. Iniciar serviços
docker-compose -f docker-compose.windows-prod.yml up -d

# 4. Verificar status
docker-compose -f docker-compose.windows-prod.yml ps
```

## 🔧 Gerenciamento de Serviços

### Script de Gerenciamento

```powershell
# Iniciar todos os serviços
.\manage-windows.ps1 -Action start

# Parar todos os serviços
.\manage-windows.ps1 -Action stop

# Reiniciar todos os serviços
.\manage-windows.ps1 -Action restart

# Ver status dos containers
.\manage-windows.ps1 -Action status

# Ver logs em tempo real
.\manage-windows.ps1 -Action logs -Follow

# Ver logs de um serviço específico
.\manage-windows.ps1 -Action logs -Service backend -Follow

# Fazer backup do banco
.\manage-windows.ps1 -Action backup

# Restaurar banco de dados
.\manage-windows.ps1 -Action restore

# Limpar sistema Docker
.\manage-windows.ps1 -Action clean
```

### Comandos Docker Diretos

```powershell
# Ver logs de um container específico
docker logs nexus-backend-win -f

# Executar comando em um container
docker exec -it nexus-backend-win bash

# Ver uso de recursos
docker stats

# Ver volumes
docker volume ls

# Ver redes
docker network ls
```

## 🌐 Acesso à Aplicação

Após o deploy bem-sucedido, a aplicação estará disponível em:

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Prometheus**: http://localhost:9090
- **Banco PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 📊 Monitoramento

### Prometheus
- Acesse: http://localhost:9090
- Métricas disponíveis:
  - Backend Node.js
  - PostgreSQL
  - Redis
  - Nginx
  - Docker containers

### Logs
```powershell
# Logs do backend
docker logs nexus-backend-win -f

# Logs do frontend
docker logs nexus-frontend-win -f

# Logs do nginx
docker logs nexus-nginx-win -f

# Logs do banco
docker logs nexus-database-win -f
```

## 🔒 Segurança

### Configurações de Segurança Implementadas

1. **Containers não-root**: Todos os containers executam com usuários não-privilegiados
2. **Rate limiting**: Proteção contra ataques de força bruta
3. **Headers de segurança**: X-Frame-Options, X-XSS-Protection, etc.
4. **SSL/TLS**: Configuração preparada para HTTPS
5. **Firewall**: Configuração de rede isolada

### Recomendações Adicionais

1. **Alterar senhas padrão** no arquivo `env.windows.production`
2. **Configurar SSL** para produção
3. **Ativar firewall do Windows**
4. **Manter Docker Desktop atualizado**
5. **Fazer backups regulares**

## 🗄️ Backup e Restore

### Backup Automático
```powershell
# Backup manual
.\manage-windows.ps1 -Action backup

# Backup agendado (configure no Task Scheduler)
# Execute: .\manage-windows.ps1 -Action backup
# Frequência: Diariamente às 2:00 AM
```

### Restore Manual
```powershell
# Restore interativo
.\manage-windows.ps1 -Action restore
```

### Backup Completo do Sistema
```powershell
# Backup de todos os volumes
docker run --rm -v nexus-valvulas-win_postgres_data_win:/data -v ${PWD}/backup:/backup alpine tar czf /backup/postgres-backup.tar.gz -C /data .
docker run --rm -v nexus-valvulas-win_redis_data_win:/data -v ${PWD}/backup:/backup alpine tar czf /backup/redis-backup.tar.gz -C /data .
```

## 🚨 Solução de Problemas

### Problemas Comuns

#### 1. Docker não inicia
```powershell
# Verificar se WSL 2 está habilitado
wsl --list --verbose

# Atualizar WSL
wsl --update

# Reiniciar Docker Desktop
```

#### 2. Containers não sobem
```powershell
# Verificar logs
docker-compose -f docker-compose.windows-prod.yml logs

# Verificar recursos disponíveis
docker system df
docker system prune -f
```

#### 3. Problemas de rede
```powershell
# Verificar redes Docker
docker network ls
docker network inspect nexus-network-win

# Recriar rede
docker network rm nexus-network-win
docker-compose -f docker-compose.windows-prod.yml up -d
```

#### 4. Problemas de performance
```powershell
# Verificar uso de recursos
docker stats

# Ajustar recursos no Docker Desktop
# Settings > Resources > Advanced
```

### Logs de Debug

```powershell
# Logs detalhados do Docker
docker-compose -f docker-compose.windows-prod.yml logs --tail=100

# Logs de um serviço específico
docker logs nexus-backend-win --details

# Verificar saúde dos containers
docker inspect nexus-backend-win | Select-String -Pattern "Health"
```

## 📈 Otimizações de Performance

### Configurações Recomendadas

1. **Docker Desktop Resources**:
   - RAM: 8GB+ (recomendado 16GB)
   - CPU: 4+ cores (recomendado 8 cores)
   - Swap: 2GB

2. **PostgreSQL**:
   - shared_buffers: 256MB
   - effective_cache_size: 1GB
   - work_mem: 4MB

3. **Nginx**:
   - worker_processes: auto
   - worker_connections: 1024
   - gzip: habilitado

4. **Node.js**:
   - NODE_OPTIONS: --max-old-space-size=1024
   - UV_THREADPOOL_SIZE: 16

## 🔄 Atualizações

### Atualizar Aplicação
```powershell
# 1. Fazer backup
.\manage-windows.ps1 -Action backup

# 2. Parar serviços
.\manage-windows.ps1 -Action stop

# 3. Atualizar código
git pull origin main

# 4. Rebuild e iniciar
.\deploy-windows.ps1
```

### Atualizar Docker Desktop
1. Baixar nova versão do site oficial
2. Executar instalador
3. Reiniciar computador
4. Verificar compatibilidade

## 📞 Suporte

### Recursos Úteis
- [Documentação Docker Desktop](https://docs.docker.com/desktop/windows/)
- [Docker Compose Reference](https://docs.docker.com/compose/compose-file/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)

### Contato
Para suporte técnico específico do projeto Nexus Válvulas, entre em contato com a equipe de desenvolvimento.

---

**Última atualização**: Dezembro 2024  
**Versão**: 1.0  
**Compatibilidade**: Windows 11 Pro + Docker Desktop 4.20+
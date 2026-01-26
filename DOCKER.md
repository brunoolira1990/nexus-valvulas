# Docker Setup - Nexus Válvulas

Este documento descreve como configurar e executar o projeto Nexus Válvulas totalmente em Docker.

## 📋 Pré-requisitos

- Docker (versão 20.10+)
- Docker Compose (versão 2.0+)
- Node.js 20+ (apenas para build do frontend)

## 🏗️ Arquitetura

O projeto está configurado com os seguintes containers:

```
┌─────────────────┐
│   Frontend      │  (React + TypeScript + Tailwind)
│   Porta 3000    │  (Opcional - também serve pelo backend)
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   Backend       │  (Laravel 11 + PHP 8.2 + Nginx)
│   Porta 8000    │  (Serve API + Frontend)
└─────────────────┘
         │
         ▼
┌─────────────────┐
│   MySQL 8.0    │  (Banco de Dados)
│   Porta 3306   │
└─────────────────┘
```

## 🚀 Início Rápido

### 1. Build do Frontend

Primeiro, é necessário fazer o build do frontend:

```bash
npm install
npm run build:prod
```

Isso criará a pasta `dist/` com os arquivos estáticos do frontend.

### 2. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo e configure:

```bash
cp .env.docker.example .env.docker
```

Edite o arquivo `.env.docker` com suas configurações:

```env
# Banco de Dados
DB_DATABASE=nexus_valvulas
DB_USERNAME=nexus_user
DB_PASSWORD=sua_senha_segura
DB_ROOT_PASSWORD=senha_root_segura

# Laravel
APP_KEY=base64:...  # Será gerado automaticamente
APP_URL=http://localhost:8000
JWT_SECRET=sua_chave_jwt_secreta

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-app
MAIL_FROM_ADDRESS=noreply@nexusvalvulas.com.br
```

### 3. Iniciar os Containers

```bash
# Build e iniciar todos os containers
docker-compose up --build -d

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
```

### 4. Executar Migrações

As migrações são executadas automaticamente no startup, mas você pode executar manualmente:

```bash
docker-compose exec backend php artisan migrate
```

### 5. Criar Usuário Admin

```bash
docker-compose exec backend php artisan tinker
```

No tinker:
```php
$user = new App\Models\User();
$user->name = 'Admin';
$user->email = 'admin@nexus.com';
$user->password = bcrypt('admin123');
$user->role = 'admin';
$user->save();
```

## 📁 Estrutura de Arquivos Docker

```
.
├── docker-compose.yml          # Orquestração dos containers
├── Dockerfile.frontend         # Build do frontend React
├── .dockerignore               # Arquivos ignorados no build
├── docker/
│   ├── nginx.conf             # Configuração Nginx para Laravel
│   ├── nginx-frontend.conf    # Configuração Nginx para frontend standalone
│   └── supervisord.conf       # Gerenciamento de processos
├── laravel-backend/
│   ├── Dockerfile             # PHP-FPM apenas
│   ├── Dockerfile.nginx       # PHP-FPM + Nginx
│   └── .dockerignore
└── .env.docker.example        # Exemplo de variáveis de ambiente
```

## 🔧 Comandos Úteis

### Gerenciar Containers

```bash
# Iniciar containers
docker-compose up -d

# Parar containers
docker-compose down

# Parar e remover volumes
docker-compose down -v

# Rebuild sem cache
docker-compose build --no-cache

# Ver status
docker-compose ps
```

### Executar Comandos no Container

```bash
# Acessar shell do backend
docker-compose exec backend bash

# Executar comandos Artisan
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan route:list

# Acessar MySQL
docker-compose exec mysql mysql -u nexus_user -p nexus_valvulas
```

### Logs

```bash
# Todos os logs
docker-compose logs -f

# Logs específicos
docker-compose logs -f backend
docker-compose logs -f mysql
docker-compose logs -f frontend
```

### Volumes

```bash
# Ver volumes
docker volume ls

# Inspecionar volume
docker volume inspect nexus-valvulas_mysql_data

# Backup do banco
docker-compose exec mysql mysqldump -u nexus_user -p nexus_valvulas > backup.sql

# Restore do banco
docker-compose exec -T mysql mysql -u nexus_user -p nexus_valvulas < backup.sql
```

## 🌐 Acessos

Após iniciar os containers:

- **Frontend**: http://localhost:8000 (servido pelo backend Laravel)
- **API**: http://localhost:8000/api
- **Teste API**: http://localhost:8000/api/test
- **MySQL**: localhost:3306

## 🔐 Segurança

### Para Produção

1. **Altere todas as senhas padrão** no `.env.docker`
2. **Use senhas fortes** para JWT_SECRET e DB_PASSWORD
3. **Configure HTTPS** usando um proxy reverso (Nginx/Apache) na frente
4. **Limite acesso** ao MySQL (não exponha a porta 3306 publicamente)
5. **Use secrets** do Docker para informações sensíveis

### Exemplo com Secrets

```bash
# Criar secrets
echo "sua_senha_secreta" | docker secret create db_password -
echo "sua_jwt_secret" | docker secret create jwt_secret -

# Usar no docker-compose.yml
secrets:
  db_password:
    external: true
  jwt_secret:
    external: true
```

## 🐛 Troubleshooting

### Problema: Frontend não aparece

**Solução**: Certifique-se de que o build do frontend foi executado:

```bash
npm run build:prod
```

Verifique se a pasta `dist/` existe e contém arquivos.

### Problema: Erro de permissões

**Solução**: Ajuste as permissões:

```bash
docker-compose exec backend chmod -R 755 storage bootstrap/cache
```

### Problema: Banco de dados não conecta

**Solução**: Verifique se o MySQL está saudável:

```bash
docker-compose ps mysql
docker-compose logs mysql
```

### Problema: Migrações falham

**Solução**: Execute manualmente:

```bash
docker-compose exec backend php artisan migrate:fresh --force
```

### Problema: Container não inicia

**Solução**: Verifique os logs:

```bash
docker-compose logs backend
```

## 🔄 Atualização

Para atualizar o projeto:

```bash
# 1. Parar containers
docker-compose down

# 2. Atualizar código
git pull

# 3. Rebuild frontend
npm run build:prod

# 4. Rebuild containers
docker-compose up --build -d

# 5. Executar migrações (se houver)
docker-compose exec backend php artisan migrate
```

## 📦 Deploy em VPS

### 1. Preparar VPS

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Clonar e Configurar

```bash
git clone <seu-repositorio>
cd nexus-valvulas

# Build frontend (precisa Node.js temporariamente)
npm install
npm run build:prod

# Configurar .env.docker
cp .env.docker.example .env.docker
nano .env.docker
```

### 3. Iniciar

```bash
docker-compose up -d --build
```

### 4. Configurar Nginx Reverso (Opcional)

Se quiser usar Nginx na frente dos containers:

```nginx
server {
    listen 80;
    server_name nexusvalvulas.com.br;

    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 📚 Recursos Adicionais

- [Documentação Docker](https://docs.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev/)

## ✅ Checklist de Deploy

- [ ] Build do frontend executado (`npm run build:prod`)
- [ ] Arquivo `.env.docker` configurado
- [ ] Senhas alteradas (não usar padrões)
- [ ] Containers iniciados (`docker-compose up -d`)
- [ ] Migrações executadas
- [ ] Usuário admin criado
- [ ] API testada (`/api/test`)
- [ ] Frontend acessível
- [ ] Logs verificados (sem erros)
- [ ] Backup do banco configurado





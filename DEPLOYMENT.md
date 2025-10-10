# Guia de Deployment para Produção - Nexus Válvulas

## 📋 Visão Geral da Arquitetura

O projeto Nexus Válvulas é composto por duas partes principais:

1. **Frontend (React + Vite)** - Cliente web responsivo
2. **Backend (Node.js + Express)** - API REST com PostgreSQL

### Arquitetura de Domínios

O projeto utiliza uma arquitetura de frontend e backend separados:

- **Frontend**: nexusvalvulas.com.br
- **Backend/API**: api.nexusvalvulas.com.br

## 🗄️ Banco de Dados

- **Sistema**: PostgreSQL
- **ORM**: Prisma
- **Localização**: Servidor local ou cloud

## 🚀 Processo de Deployment

### 1. Pré-requisitos

- Node.js v18+ instalado
- PostgreSQL v13+ instalado e configurado
- Acesso ao servidor de produção

### 2. Configuração do Ambiente

#### Backend (.env)
```bash
# URL de conexão com PostgreSQL
DATABASE_URL=postgresql://usuario:senha@host:porta/nome_do_banco?schema=public

# Chave secreta para JWT (deve ser alterada em produção)
JWT_SECRET=sua_chave_secreta_forte_aqui

# URL pública da API (para acesso externo)
PUBLIC_URL=https://api.nexusvalvulas.com.br
```

#### Frontend (.env)
```bash
# URL base da API (deve apontar para o backend em produção)
VITE_API_BASE=https://api.nexusvalvulas.com.br
```

### 3. Build do Projeto

#### Backend
```bash
# Navegar até o diretório do backend
cd backend

# Instalar dependências
npm install

# Gerar cliente Prisma
npx prisma generate

# Rodar migrações do banco de dados
npx prisma migrate deploy

# Iniciar o servidor (usando PM2 ou similar para produção)
npm start
```

#### Frontend
```bash
# Navegar até o diretório raiz
cd ..

# Instalar dependências
npm install

# Build para produção
npm run build
```

### 4. Configuração do Servidor Web

#### Usando Nginx (recomendado)

```nginx
# Configuração Nginx para Nexus Válvulas em Produção

# Configurações de eventos
events {
    worker_connections 1024;
}

# Configurações HTTP
http {
    # Tipos MIME
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Formato de log
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    # Arquivos de log
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Configurações de performance
    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    types_hash_max_size 2048;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/json
        application/xml
        application/xml+rss
        application/xhtml+xml
        application/x-font-ttf
        application/x-font-opentype
        application/vnd.ms-fontobject
        image/svg+xml
        image/x-icon
        application/wasm;

    # Configurações de segurança
    server_tokens off;

    # Servidor HTTP para frontend (redireciona para HTTPS)
    server {
        listen 80;
        server_name nexusvalvulas.com.br www.nexusvalvulas.com.br;
        return 301 https://$server_name$request_uri;
    }

    # Servidor HTTP para API (redireciona para HTTPS)
    server {
        listen 80;
        server_name api.nexusvalvulas.com.br;
        return 301 https://$server_name$request_uri;
    }

    # Servidor HTTPS para frontend
    server {
        listen 443 ssl http2;
        server_name nexusvalvulas.com.br www.nexusvalvulas.com.br;

        # Configurações SSL (ajustar caminhos para seus certificados)
        ssl_certificate /caminho/para/seu-certificado-frontend.pem;
        ssl_certificate_key /caminho/para/sua-chave-privada-frontend.pem;
        
        # Configurações SSL recomendadas
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Headers de segurança
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Root directory for frontend static files
        root /var/www/nexus-valvulas/dist;
        index index.html;

        # Localização para arquivos estáticos
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Bloquear acesso a arquivos sensíveis
        location ~ /\. {
            deny all;
            access_log off;
            log_not_found off;
        }

        # Configurações específicas para tipos de arquivos
        location ~* \.(jpg|jpeg|png|gif|ico|svg|webp)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location ~* \.(css|js)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        location ~* \.(woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Servidor HTTPS para API
    server {
        listen 443 ssl http2;
        server_name api.nexusvalvulas.com.br;

        # Configurações SSL (ajustar caminhos para seus certificados)
        ssl_certificate /caminho/para/seu-certificado-api.pem;
        ssl_certificate_key /caminho/para/sua-chave-privada-api.pem;
        
        # Configurações SSL recomendadas
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Headers de segurança
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Localização para API backend (proxy para localhost:4000)
        location / {
            proxy_pass http://localhost:4000/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeout settings
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Localização para uploads
        location /uploads/ {
            proxy_pass http://localhost:4000/uploads/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### 5. Processos de Inicialização

#### Backend (usando PM2)
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar backend com PM2
pm2 start backend/src/index.js --name "nexus-backend"

# Configurar para iniciar automaticamente após reinicialização
pm2 startup
pm2 save
```

#### Frontend
Os arquivos do frontend (após build) devem ser servidos por um servidor web como Nginx ou Apache.

### 6. Monitoramento e Logs

#### PM2 Logs
```bash
# Visualizar logs em tempo real
pm2 logs

# Visualizar logs específicos
pm2 logs nexus-backend
```

#### Nginx Logs
```bash
# Logs de acesso
tail -f /var/log/nginx/access.log

# Logs de erro
tail -f /var/log/nginx/error.log
```

## 🔧 Manutenção

### Atualização do Sistema
```bash
# Pull das últimas alterações
git pull origin main

# Backend
cd backend
npm install
npx prisma migrate deploy
pm2 restart nexus-backend

# Frontend
cd ..
npm install
npm run build
# Reiniciar servidor web (nginx/apache)
```

### Backup do Banco de Dados
```bash
# Backup completo
pg_dump -h host -U usuario nome_do_banco > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
psql -h host -U usuario nome_do_banco < backup_arquivo.sql
```

## 🛡️ Segurança

### Checklist de Segurança
- [ ] Alterar JWT_SECRET para valor forte em produção
- [ ] Usar HTTPS (SSL/TLS)
- [ ] Configurar headers de segurança no Nginx
- [ ] Limitar acesso ao banco de dados
- [ ] Usar firewalls apropriados
- [ ] Manter sistema atualizado
- [ ] Configurar backups regulares

## 📊 Performance

### Otimizações Implementadas
- Lazy loading de imagens
- Code splitting automático
- PWA (Progressive Web App)
- Otimização de imagens
- Minificação de assets
- Compressão gzip/brotli

### Recomendações Adicionais
- Usar CDN para assets estáticos
- Implementar caching estratégico
- Monitorar Core Web Vitals
- Usar HTTP/2

## 📈 SEO

### Otimizações Implementadas
- Meta tags personalizadas por página
- Open Graph e Twitter Cards
- Sitemap.xml automático
- Robots.txt configurado
- Structured data (JSON-LD)
- URLs canônicas
- Link interno estratégico

### Recomendações
- Submeter sitemap ao Google Search Console
- Monitorar performance de indexação
- Criar conteúdo regularmente (blog)
- Construir backlinks de qualidade

## 🆘 Troubleshooting

### Problemas Comuns

1. **API não responde**
   - Verificar se o backend está rodando: `pm2 list`
   - Verificar logs: `pm2 logs nexus-backend`
   - Verificar firewall e portas

2. **Frontend não carrega**
   - Verificar build: `npm run build`
   - Verificar configuração do servidor web
   - Verificar permissões de arquivos

3. **Erro de conexão com banco de dados**
   - Verificar DATABASE_URL no .env
   - Verificar credenciais do PostgreSQL
   - Verificar se PostgreSQL está rodando

4. **Problemas de segurança**
   - Verificar headers HTTP
   - Verificar configurações SSL
   - Verificar permissões de acesso

## 📞 Suporte

Para suporte adicional, entre em contato com a equipe de desenvolvimento.
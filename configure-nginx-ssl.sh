#!/bin/bash

# Script para Configurar Nginx com SSL - Nexus Válvulas
# Atualiza configuração Nginx para usar certificados SSL

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configurações
DOMAIN="nexusvalvulas.com.br"
WWW_DOMAIN="www.nexusvalvulas.com.br"
SSL_DIR="/home/nexusvalvulas.com.br/public_html/ssl"
NGINX_CONFIG="/home/nexusvalvulas.com.br/public_html/nginx/nginx-production.conf"
CONTAINER_NAME="nexus-nginx"

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# Verificar se os certificados existem
check_certificates() {
    log "Verificando certificados SSL..."
    if [ ! -f "$SSL_DIR/fullchain.pem" ] || [ ! -f "$SSL_DIR/privkey.pem" ]; then
        error "Certificados SSL não encontrados em $SSL_DIR"
    fi
    success "Certificados SSL encontrados"
}

# Fazer backup da configuração atual
backup_config() {
    log "Fazendo backup da configuração Nginx..."
    if [ -f "$NGINX_CONFIG" ]; then
        cp "$NGINX_CONFIG" "${NGINX_CONFIG}.backup.$(date +%Y%m%d_%H%M%S)"
        success "Backup criado"
    else
        warning "Arquivo de configuração não encontrado: $NGINX_CONFIG"
    fi
}

# Atualizar configuração Nginx com SSL
update_nginx_config() {
    log "Atualizando configuração Nginx com SSL..."
    
    cat > "$NGINX_CONFIG" << 'EOF'
# Configuração Nginx para Produção com SSL - Nexus Válvulas
# Domínios: nexusvalvulas.com.br, www.nexusvalvulas.com.br

# Configurações de eventos
events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

# Configurações HTTP
http {
    # Tipos MIME
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Formato de log otimizado
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for" '
                    'rt=$request_time uct="$upstream_connect_time" '
                    'uht="$upstream_header_time" urt="$upstream_response_time"';

    # Arquivos de log
    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log warn;

    # Configurações de performance
    sendfile            on;
    tcp_nopush          on;
    tcp_nodelay         on;
    keepalive_timeout   65;
    keepalive_requests  100;
    types_hash_max_size 2048;
    client_max_body_size 50M;

    # Gzip otimizado
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

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=contact:10m rate=5r/m;

    # Upstream para backend
    upstream backend {
        server nexus-backend:4000;
        keepalive 32;
    }

    # Upstream para frontend
    upstream frontend {
        server nexus-frontend:3001;
        keepalive 32;
    }

    # Configurações de segurança globais
    server_tokens off;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Redirecionamento HTTP → HTTPS
    server {
        listen 80;
        server_name nexusvalvulas.com.br www.nexusvalvulas.com.br;
        return 301 https://$server_name$request_uri;
    }

    # Servidor HTTPS principal
    server {
        listen 443 ssl http2;
        server_name nexusvalvulas.com.br www.nexusvalvulas.com.br;

        # Configurações SSL
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        
        # Configurações SSL otimizadas
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;
        ssl_session_tickets off;

        # Headers de segurança HTTPS
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # Logs específicos
        access_log /var/log/nginx/nexus_access.log main;
        error_log /var/log/nginx/nexus_error.log warn;

        # Configuração para API (backend)
        location /api/ {
            # Rate limiting para API
            limit_req zone=api burst=20 nodelay;
            
            # Proxy para backend
            proxy_pass http://backend/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Configuração para uploads (arquivos estáticos do backend)
        location /uploads/ {
            proxy_pass http://backend/uploads/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Cache para uploads
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Configuração para contato (rate limiting específico)
        location /api/contact {
            limit_req zone=contact burst=5 nodelay;
            
            proxy_pass http://backend/contact;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            
            # Timeouts maiores para envio de email
            proxy_connect_timeout 120s;
            proxy_send_timeout 120s;
            proxy_read_timeout 120s;
        }

        # Configuração para frontend (React SPA)
        location / {
            # Proxy para frontend
            proxy_pass http://frontend/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
            
            # Fallback para SPA (React Router)
            proxy_intercept_errors on;
            error_page 404 = @fallback;
        }

        # Fallback para SPA
        location @fallback {
            proxy_pass http://frontend/;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Cache otimizado para assets estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            
            # Cache agressivo para assets
            expires 1y;
            add_header Cache-Control "public, immutable";
            add_header Vary "Accept-Encoding";
        }

        # Service Worker e manifest (sem cache)
        location ~* \.(sw\.js|manifest\.json|webmanifest)$ {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            
            expires -1;
            add_header Cache-Control "no-cache, no-store, must-revalidate";
            add_header Pragma "no-cache";
        }

        # Bloquear acesso a arquivos sensíveis
        location ~ /\. {
            deny all;
            access_log off;
            log_not_found off;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
EOF

    success "Configuração Nginx atualizada com SSL"
}

# Reiniciar container Nginx
restart_nginx() {
    log "Reiniciando container Nginx..."
    docker restart "$CONTAINER_NAME"
    
    # Aguardar o container ficar pronto
    sleep 5
    
    # Verificar se está rodando
    if docker ps | grep -q "$CONTAINER_NAME"; then
        success "Container Nginx reiniciado com sucesso"
    else
        error "Falha ao reiniciar container Nginx"
    fi
}

# Verificar se HTTPS está funcionando
verify_https() {
    log "Verificando se HTTPS está funcionando..."
    
    # Aguardar um pouco para o serviço ficar pronto
    sleep 10
    
    # Verificar HTTPS
    if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200"; then
        success "HTTPS funcionando para $DOMAIN"
    else
        warning "HTTPS pode não estar funcionando para $DOMAIN"
    fi
    
    if curl -s -o /dev/null -w "%{http_code}" "https://$WWW_DOMAIN" | grep -q "200"; then
        success "HTTPS funcionando para $WWW_DOMAIN"
    else
        warning "HTTPS pode não estar funcionando para $WWW_DOMAIN"
    fi
}

# Função principal
main() {
    echo "🔧 Configurando Nginx com SSL - Nexus Válvulas"
    echo "=============================================="
    echo ""
    
    check_certificates
    backup_config
    update_nginx_config
    restart_nginx
    verify_https
    
    echo ""
    echo "🎉 Configuração Nginx com SSL concluída!"
    echo ""
    echo "🔗 Teste os domínios:"
    echo "   https://$DOMAIN"
    echo "   https://$WWW_DOMAIN"
    echo ""
    echo "📊 Verificações:"
    echo "   Status: docker ps | grep $CONTAINER_NAME"
    echo "   Logs: docker logs $CONTAINER_NAME"
    echo "   SSL: curl -I https://$DOMAIN"
    echo ""
}

# Executar função principal
main

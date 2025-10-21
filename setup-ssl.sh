#!/bin/bash

# Script de Configuração SSL - Nexus Válvulas
# Configura SSL usando Certbot com webroot sem parar containers Docker
# Domínios: nexusvalvulas.com.br e www.nexusvalvulas.com.br

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configurações
DOMAIN="nexusvalvulas.com.br"
WWW_DOMAIN="www.nexusvalvulas.com.br"
WEBROOT_PATH="/home/nexusvalvulas.com.br/public_html/dist"
SSL_DIR="/home/nexusvalvulas.com.br/public_html/ssl"
CONTAINER_NAME="nexus-nginx"
PROJECT_DIR="/home/nexusvalvulas.com.br/public_html"

# Função para log colorido
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

info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

# Verificar se está rodando como root
check_root() {
    log "Verificando permissões..."
    if [ "$EUID" -ne 0 ]; then
        error "Este script deve ser executado como root. Use: sudo $0"
    fi
    success "Permissões OK"
}

# Verificar se o diretório do projeto existe
check_project_directory() {
    log "Verificando diretório do projeto..."
    if [ ! -d "$PROJECT_DIR" ]; then
        error "Diretório do projeto não encontrado: $PROJECT_DIR"
    fi
    success "Diretório do projeto encontrado"
}

# Verificar se o webroot existe
check_webroot() {
    log "Verificando diretório webroot..."
    if [ ! -d "$WEBROOT_PATH" ]; then
        warning "Diretório webroot não encontrado: $WEBROOT_PATH"
        log "Criando diretório webroot..."
        mkdir -p "$WEBROOT_PATH"
        success "Diretório webroot criado"
    else
        success "Diretório webroot encontrado"
    fi
}

# Verificar se o container está rodando
check_container() {
    log "Verificando se o container $CONTAINER_NAME está rodando..."
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        error "Container $CONTAINER_NAME não está rodando. Inicie o container primeiro."
    fi
    success "Container $CONTAINER_NAME está rodando"
}

# Instalar Certbot se necessário
install_certbot() {
    log "Verificando se o Certbot está instalado..."
    if ! command -v certbot &> /dev/null; then
        log "Instalando Certbot..."
        apt update
        apt install -y certbot
        success "Certbot instalado"
    else
        success "Certbot já está instalado"
    fi
}

# Verificar se os domínios estão acessíveis
check_domains() {
    log "Verificando se os domínios estão acessíveis..."
    
    # Verificar nexusvalvulas.com.br
    if ! curl -s -o /dev/null -w "%{http_code}" "http://$DOMAIN" | grep -q "200\|301\|302"; then
        warning "Domínio $DOMAIN pode não estar acessível via HTTP"
    else
        success "Domínio $DOMAIN está acessível"
    fi
    
    # Verificar www.nexusvalvulas.com.br
    if ! curl -s -o /dev/null -w "%{http_code}" "http://$WWW_DOMAIN" | grep -q "200\|301\|302"; then
        warning "Domínio $WWW_DOMAIN pode não estar acessível via HTTP"
    else
        success "Domínio $WWW_DOMAIN está acessível"
    fi
}

# Criar diretório SSL
create_ssl_directory() {
    log "Criando diretório SSL..."
    mkdir -p "$SSL_DIR"
    chown root:root "$SSL_DIR"
    chmod 755 "$SSL_DIR"
    success "Diretório SSL criado: $SSL_DIR"
}

# Solicitar certificado SSL
request_ssl_certificate() {
    log "Solicitando certificado SSL para $DOMAIN e $WWW_DOMAIN..."
    
    # Parar temporariamente o nginx para liberar a porta 80
    log "Parando temporariamente o container nginx..."
    docker stop "$CONTAINER_NAME" || warning "Container já estava parado"
    
    # Solicitar certificado
    certbot certonly \
        --standalone \
        --non-interactive \
        --agree-tos \
        --email admin@nexusvalvulas.com.br \
        --domains "$DOMAIN,$WWW_DOMAIN" \
        --expand
    
    if [ $? -eq 0 ]; then
        success "Certificado SSL solicitado com sucesso"
    else
        error "Falha ao solicitar certificado SSL"
    fi
}

# Copiar certificados para o diretório SSL
copy_certificates() {
    log "Copiando certificados para o diretório SSL..."
    
    local cert_path="/etc/letsencrypt/live/$DOMAIN"
    
    if [ ! -f "$cert_path/fullchain.pem" ] || [ ! -f "$cert_path/privkey.pem" ]; then
        error "Certificados não encontrados em $cert_path"
    fi
    
    # Copiar certificados
    cp "$cert_path/fullchain.pem" "$SSL_DIR/"
    cp "$cert_path/privkey.pem" "$SSL_DIR/"
    
    # Ajustar permissões
    chown root:root "$SSL_DIR"/*.pem
    chmod 600 "$SSL_DIR"/*.pem
    
    success "Certificados copiados e permissões ajustadas"
}

# Verificar se a configuração Nginx tem SSL
check_nginx_ssl_config() {
    log "Verificando configuração SSL do Nginx..."
    
    local nginx_config="$PROJECT_DIR/nginx/nginx-production.conf"
    
    if [ -f "$nginx_config" ]; then
        if grep -q "ssl_certificate" "$nginx_config"; then
            success "Configuração SSL encontrada no Nginx"
        else
            warning "Configuração SSL não encontrada no Nginx"
            info "Certifique-se de que a configuração Nginx está usando os certificados SSL"
        fi
    else
        warning "Arquivo de configuração Nginx não encontrado: $nginx_config"
    fi
}

# Reiniciar container Nginx
restart_nginx() {
    log "Reiniciando container Nginx..."
    
    # Iniciar o container
    docker start "$CONTAINER_NAME"
    
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

# Configurar renovação automática
setup_auto_renewal() {
    log "Configurando renovação automática do certificado..."
    
    # Criar script de renovação
    cat > /etc/cron.d/certbot-nexus << EOF
# Renovação automática do certificado SSL para Nexus Válvulas
0 2 * * * root certbot renew --quiet --post-hook "cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $SSL_DIR/ && cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $SSL_DIR/ && chown root:root $SSL_DIR/*.pem && chmod 600 $SSL_DIR/*.pem && docker restart $CONTAINER_NAME"
EOF
    
    success "Renovação automática configurada"
}

# Mostrar informações finais
show_final_info() {
    echo ""
    echo "🎉 Configuração SSL concluída com sucesso!"
    echo ""
    echo "📋 Informações importantes:"
    echo "   Domínios: $DOMAIN, $WWW_DOMAIN"
    echo "   Certificados: $SSL_DIR/"
    echo "   Container: $CONTAINER_NAME"
    echo ""
    echo "🔗 Teste os domínios:"
    echo "   https://$DOMAIN"
    echo "   https://$WWW_DOMAIN"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "   Ver status: docker ps | grep $CONTAINER_NAME"
    echo "   Ver logs: docker logs $CONTAINER_NAME"
    echo "   Reiniciar: docker restart $CONTAINER_NAME"
    echo "   Renovar certificado: certbot renew"
    echo ""
    echo "📊 Monitoramento:"
    echo "   Verificar certificado: openssl x509 -in $SSL_DIR/fullchain.pem -text -noout"
    echo "   Testar SSL: curl -I https://$DOMAIN"
    echo ""
    echo "⚠️  Importante:"
    echo "   - O certificado será renovado automaticamente"
    echo "   - Os certificados estão em: $SSL_DIR/"
    echo "   - Permissões: 600 (root:root)"
    echo ""
}

# Função principal
main() {
    echo "🔐 Nexus Válvulas - Configuração SSL"
    echo "===================================="
    echo ""
    echo "Domínios: $DOMAIN, $WWW_DOMAIN"
    echo "Webroot: $WEBROOT_PATH"
    echo "SSL Dir: $SSL_DIR"
    echo ""
    
    # Executar todas as etapas
    check_root
    check_project_directory
    check_webroot
    check_container
    install_certbot
    check_domains
    create_ssl_directory
    request_ssl_certificate
    copy_certificates
    check_nginx_ssl_config
    restart_nginx
    verify_https
    setup_auto_renewal
    show_final_info
}

# Verificar argumentos
if [ "$1" = "help" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Uso: $0 [help|renew|verify|status]"
    echo ""
    echo "Comandos:"
    echo "  help   - Mostrar esta ajuda"
    echo "  renew  - Renovar certificado existente"
    echo "  verify - Verificar certificado atual"
    echo "  status - Ver status do SSL"
    echo ""
    echo "Exemplos:"
    echo "  sudo $0          # Configurar SSL"
    echo "  sudo $0 renew    # Renovar certificado"
    echo "  sudo $0 verify   # Verificar certificado"
    exit 0
fi

# Executar comando específico
case "$1" in
    "renew")
        log "Renovando certificado SSL..."
        certbot renew --quiet
        copy_certificates
        restart_nginx
        success "Certificado renovado"
        ;;
    "verify")
        log "Verificando certificado SSL..."
        if [ -f "$SSL_DIR/fullchain.pem" ]; then
            openssl x509 -in "$SSL_DIR/fullchain.pem" -text -noout
            success "Certificado verificado"
        else
            error "Certificado não encontrado"
        fi
        ;;
    "status")
        log "Status do SSL..."
        echo "Domínios: $DOMAIN, $WWW_DOMAIN"
        echo "Certificados: $SSL_DIR/"
        echo "Container: $CONTAINER_NAME"
        if [ -f "$SSL_DIR/fullchain.pem" ]; then
            echo "Certificado: ✅ Presente"
            openssl x509 -in "$SSL_DIR/fullchain.pem" -noout -dates
        else
            echo "Certificado: ❌ Ausente"
        fi
        ;;
    *)
        # Configuração completa
        main
        ;;
esac

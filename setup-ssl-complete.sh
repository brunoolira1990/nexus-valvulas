#!/bin/bash

# Script Master para Configuração SSL Completa - Nexus Válvulas
# Orquestra todo o processo de configuração SSL sem parar containers

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configurações
DOMAIN="nexusvalvulas.com.br"
WWW_DOMAIN="www.nexusvalvulas.com.br"
PROJECT_DIR="/home/nexusvalvulas.com.br/public_html"
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

info() {
    echo -e "${PURPLE}ℹ️  $1${NC}"
}

header() {
    echo -e "${CYAN}$1${NC}"
}

# Verificar se está no diretório correto
check_directory() {
    log "Verificando diretório de trabalho..."
    if [ ! -d "$PROJECT_DIR" ]; then
        error "Execute este script no diretório: $PROJECT_DIR"
    fi
    cd "$PROJECT_DIR"
    success "Diretório correto"
}

# Verificar se os scripts existem
check_scripts() {
    log "Verificando scripts necessários..."
    if [ ! -f "setup-ssl.sh" ]; then
        error "Script setup-ssl.sh não encontrado"
    fi
    if [ ! -f "configure-nginx-ssl.sh" ]; then
        error "Script configure-nginx-ssl.sh não encontrado"
    fi
    success "Scripts encontrados"
}

# Tornar scripts executáveis
make_executable() {
    log "Tornando scripts executáveis..."
    chmod +x setup-ssl.sh
    chmod +x configure-nginx-ssl.sh
    success "Scripts executáveis"
}

# Verificar se o container está rodando
check_container() {
    log "Verificando se o container $CONTAINER_NAME está rodando..."
    if ! docker ps | grep -q "$CONTAINER_NAME"; then
        warning "Container $CONTAINER_NAME não está rodando"
        info "Iniciando container..."
        docker-compose -f docker-compose.production-server.yml up -d "$CONTAINER_NAME"
        sleep 10
    fi
    success "Container $CONTAINER_NAME está rodando"
}

# Executar configuração SSL
run_ssl_setup() {
    log "Executando configuração SSL..."
    sudo ./setup-ssl.sh
    success "Configuração SSL concluída"
}

# Configurar Nginx com SSL
configure_nginx() {
    log "Configurando Nginx com SSL..."
    ./configure-nginx-ssl.sh
    success "Nginx configurado com SSL"
}

# Verificar se tudo está funcionando
verify_setup() {
    log "Verificando configuração completa..."
    
    # Verificar container
    if docker ps | grep -q "$CONTAINER_NAME"; then
        success "Container Nginx está rodando"
    else
        error "Container Nginx não está rodando"
    fi
    
    # Verificar certificados
    if [ -f "/home/nexusvalvulas.com.br/public_html/ssl/fullchain.pem" ]; then
        success "Certificados SSL encontrados"
    else
        error "Certificados SSL não encontrados"
    fi
    
    # Verificar HTTPS
    sleep 10
    if curl -s -o /dev/null -w "%{http_code}" "https://$DOMAIN" | grep -q "200"; then
        success "HTTPS funcionando para $DOMAIN"
    else
        warning "HTTPS pode não estar funcionando para $DOMAIN"
    fi
}

# Mostrar informações finais
show_final_info() {
    echo ""
    header "🎉 Configuração SSL Completa - Nexus Válvulas"
    echo ""
    echo "📋 Resumo da configuração:"
    echo "   Domínios: $DOMAIN, $WWW_DOMAIN"
    echo "   Certificados: /home/nexusvalvulas.com.br/public_html/ssl/"
    echo "   Container: $CONTAINER_NAME"
    echo "   Projeto: $PROJECT_DIR"
    echo ""
    echo "🔗 Teste os domínios:"
    echo "   https://$DOMAIN"
    echo "   https://$WWW_DOMAIN"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "   Status: docker ps | grep $CONTAINER_NAME"
    echo "   Logs: docker logs $CONTAINER_NAME"
    echo "   Reiniciar: docker restart $CONTAINER_NAME"
    echo "   Renovar SSL: sudo ./setup-ssl.sh renew"
    echo ""
    echo "📊 Monitoramento:"
    echo "   Verificar certificado: openssl x509 -in /home/nexusvalvulas.com.br/public_html/ssl/fullchain.pem -text -noout"
    echo "   Testar SSL: curl -I https://$DOMAIN"
    echo "   Ver logs: docker logs $CONTAINER_NAME"
    echo ""
    echo "⚠️  Importante:"
    echo "   - O certificado será renovado automaticamente"
    echo "   - Os certificados estão em: /home/nexusvalvulas.com.br/public_html/ssl/"
    echo "   - Permissões: 600 (root:root)"
    echo "   - Configuração Nginx: /home/nexusvalvulas.com.br/public_html/nginx/nginx-production.conf"
    echo ""
    echo "🎯 Próximos passos:"
    echo "   1. Teste os domínios HTTPS"
    echo "   2. Configure DNS se necessário"
    echo "   3. Monitore os logs: docker logs $CONTAINER_NAME"
    echo "   4. Configure backup dos certificados"
    echo ""
}

# Função principal
main() {
    header "🔐 Nexus Válvulas - Configuração SSL Completa"
    echo "=============================================="
    echo ""
    echo "Este script irá:"
    echo "1. Verificar e instalar Certbot se necessário"
    echo "2. Solicitar certificados SSL para $DOMAIN e $WWW_DOMAIN"
    echo "3. Configurar Nginx com SSL"
    echo "4. Reiniciar container sem downtime"
    echo "5. Configurar renovação automática"
    echo ""
    echo "Domínios: $DOMAIN, $WWW_DOMAIN"
    echo "Projeto: $PROJECT_DIR"
    echo ""
    
    # Executar todas as etapas
    check_directory
    check_scripts
    make_executable
    check_container
    run_ssl_setup
    configure_nginx
    verify_setup
    show_final_info
}

# Verificar argumentos
if [ "$1" = "help" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Uso: $0 [help|ssl-only|nginx-only|verify|status]"
    echo ""
    echo "Comandos:"
    echo "  help        - Mostrar esta ajuda"
    echo "  ssl-only    - Apenas configurar SSL"
    echo "  nginx-only  - Apenas configurar Nginx"
    echo "  verify      - Verificar configuração"
    echo "  status      - Ver status atual"
    echo ""
    echo "Exemplos:"
    echo "  $0              # Configuração completa"
    echo "  $0 ssl-only     # Apenas SSL"
    echo "  $0 verify       # Verificar"
    exit 0
fi

# Executar comando específico
case "$1" in
    "ssl-only")
        check_directory
        check_scripts
        make_executable
        check_container
        run_ssl_setup
        ;;
    "nginx-only")
        check_directory
        check_scripts
        make_executable
        configure_nginx
        ;;
    "verify")
        check_directory
        verify_setup
        ;;
    "status")
        echo "Status da configuração SSL:"
        echo "Domínios: $DOMAIN, $WWW_DOMAIN"
        echo "Container: $CONTAINER_NAME"
        if docker ps | grep -q "$CONTAINER_NAME"; then
            echo "Container: ✅ Rodando"
        else
            echo "Container: ❌ Parado"
        fi
        if [ -f "/home/nexusvalvulas.com.br/public_html/ssl/fullchain.pem" ]; then
            echo "Certificados: ✅ Presentes"
            openssl x509 -in "/home/nexusvalvulas.com.br/public_html/ssl/fullchain.pem" -noout -dates
        else
            echo "Certificados: ❌ Ausentes"
        fi
        ;;
    *)
        # Configuração completa
        main
        ;;
esac

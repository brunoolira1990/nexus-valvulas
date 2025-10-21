#!/bin/bash

# Script de Configuração para Produção - Nexus Válvulas
# Servidor: Ubuntu
# Diretório: /home/nexusvalvulas.com.br/public_html

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

# Verificar se está rodando como root ou com sudo
check_permissions() {
    log "Verificando permissões..."
    if [ "$EUID" -ne 0 ]; then
        error "Execute este script com sudo: sudo $0"
    fi
    success "Permissões OK"
}

# Criar estrutura de diretórios
create_directories() {
    log "Criando estrutura de diretórios..."
    
    # Diretórios principais
    mkdir -p /home/nexusvalvulas.com.br/public_html/{ssl,logs,backup}
    mkdir -p /var/log/nexus
    
    # Permissões
    chown -R nexusvalvulas:nexusvalvulas /home/nexusvalvulas.com.br/public_html
    chmod 755 /home/nexusvalvulas.com.br/public_html
    chmod 700 /home/nexusvalvulas.com.br/public_html/ssl
    chmod 755 /home/nexusvalvulas.com.br/public_html/logs
    chmod 755 /home/nexusvalvulas.com.br/public_html/backup
    
    success "Estrutura de diretórios criada"
}

# Configurar SSL
setup_ssl() {
    log "Configurando SSL..."
    
    if [ ! -f "/home/nexusvalvulas.com.br/public_html/ssl/fullchain.pem" ]; then
        warning "Certificados SSL não encontrados. Configure Let's Encrypt:"
        echo "sudo certbot certonly --standalone -d nexusvalvulas.com.br -d www.nexusvalvulas.com.br"
        echo "sudo cp /etc/letsencrypt/live/nexusvalvulas.com.br/fullchain.pem /home/nexusvalvulas.com.br/public_html/ssl/"
        echo "sudo cp /etc/letsencrypt/live/nexusvalvulas.com.br/privkey.pem /home/nexusvalvulas.com.br/public_html/ssl/"
        echo "sudo chown nexusvalvulas:nexusvalvulas /home/nexusvalvulas.com.br/public_html/ssl/*.pem"
        echo "sudo chmod 600 /home/nexusvalvulas.com.br/public_html/ssl/*.pem"
    else
        success "Certificados SSL encontrados"
    fi
}

# Configurar Docker
setup_docker() {
    log "Configurando Docker..."
    
    # Adicionar usuário ao grupo docker
    usermod -aG docker nexusvalvulas
    
    # Configurar limite de memória para containers
    echo '{"default-ulimits":{"memlock":{"Name":"memlock","Hard":-1,"Soft":-1}}}' > /etc/docker/daemon.json
    
    # Reiniciar Docker
    systemctl restart docker
    
    success "Docker configurado"
}

# Configurar firewall
setup_firewall() {
    log "Configurando firewall..."
    
    # UFW
    ufw allow 22/tcp    # SSH
    ufw allow 80/tcp    # HTTP
    ufw allow 443/tcp   # HTTPS
    ufw --force enable
    
    success "Firewall configurado"
}

# Configurar logrotate
setup_logrotate() {
    log "Configurando logrotate..."
    
    cat > /etc/logrotate.d/nexus << EOF
/var/log/nexus/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 nexusvalvulas nexusvalvulas
    postrotate
        docker-compose -f /home/nexusvalvulas.com.br/public_html/docker-compose.production-server.yml restart nexus-nginx
    endscript
}
EOF
    
    success "Logrotate configurado"
}

# Configurar cron para backup
setup_backup_cron() {
    log "Configurando backup automático..."
    
    cat > /etc/cron.d/nexus-backup << EOF
# Backup diário do banco de dados Nexus Válvulas
0 2 * * * nexusvalvulas cd /home/nexusvalvulas.com.br/public_html && ./deploy-production.sh backup
EOF
    
    success "Backup automático configurado"
}

# Configurar monitoramento
setup_monitoring() {
    log "Configurando monitoramento..."
    
    # Script de monitoramento
    cat > /home/nexusvalvulas.com.br/public_html/monitor.sh << 'EOF'
#!/bin/bash
# Script de monitoramento para Nexus Válvulas

cd /home/nexusvalvulas.com.br/public_html

# Verificar se containers estão rodando
if ! docker-compose -f docker-compose.production-server.yml ps | grep -q "Up"; then
    echo "$(date): Containers não estão rodando, reiniciando..." >> /var/log/nexus/monitor.log
    docker-compose -f docker-compose.production-server.yml up -d
fi

# Verificar saúde dos serviços
if ! curl -f http://localhost/health >/dev/null 2>&1; then
    echo "$(date): Nginx não está respondendo, reiniciando..." >> /var/log/nexus/monitor.log
    docker-compose -f docker-compose.production-server.yml restart nexus-nginx
fi
EOF
    
    chmod +x /home/nexusvalvulas.com.br/public_html/monitor.sh
    
    # Adicionar ao cron
    echo "*/5 * * * * nexusvalvulas /home/nexusvalvulas.com.br/public_html/monitor.sh" >> /etc/crontab
    
    success "Monitoramento configurado"
}

# Função principal
main() {
    echo "🔧 Nexus Válvulas - Configuração de Produção"
    echo "============================================="
    echo ""
    
    check_permissions
    create_directories
    setup_ssl
    setup_docker
    setup_firewall
    setup_logrotate
    setup_backup_cron
    setup_monitoring
    
    echo ""
    echo "🎉 Configuração de produção concluída!"
    echo ""
    echo "📋 Próximos passos:"
    echo "1. Configure os certificados SSL"
    echo "2. Edite o arquivo env.production com suas configurações"
    echo "3. Execute: ./deploy-production.sh"
    echo ""
}

main

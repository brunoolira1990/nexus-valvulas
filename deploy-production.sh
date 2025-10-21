#!/bin/bash

# Script de Deploy para Produção - Nexus Válvulas
# Servidor: Ubuntu
# Diretório: /home/nexusvalvulas.com.br/public_html

set -e  # Parar em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

# Verificar se está no diretório correto
check_directory() {
    log "Verificando diretório de trabalho..."
    if [ ! -f "docker-compose.production-server.yml" ]; then
        error "Execute este script no diretório /home/nexusvalvulas.com.br/public_html"
    fi
    success "Diretório correto"
}

# Verificar se Docker está rodando
check_docker() {
    log "Verificando Docker..."
    if ! docker info >/dev/null 2>&1; then
        error "Docker não está rodando. Inicie o Docker primeiro."
    fi
    success "Docker está rodando"
}

# Backup do banco de dados
backup_database() {
    log "Fazendo backup do banco de dados..."
    if docker-compose -f docker-compose.production-server.yml ps nexus-database | grep -q "Up"; then
        docker-compose -f docker-compose.production-server.yml exec -T nexus-database pg_dump -U nexus_user nexus_valvulas > backup_$(date +%Y%m%d_%H%M%S).sql
        success "Backup criado"
    else
        warning "Banco de dados não está rodando, pulando backup"
    fi
}

# Parar containers existentes
stop_containers() {
    log "Parando containers existentes..."
    docker-compose -f docker-compose.production-server.yml down 2>/dev/null || true
    success "Containers parados"
}

# Atualizar imagens
update_images() {
    log "Atualizando imagens..."
    docker-compose -f docker-compose.production-server.yml pull
    success "Imagens atualizadas"
}

# Construir e iniciar containers
build_and_start() {
    log "Construindo e iniciando containers..."
    docker-compose -f docker-compose.production-server.yml up -d --build
    success "Containers iniciados"
}

# Aguardar serviços ficarem prontos
wait_for_services() {
    log "Aguardando serviços ficarem prontos..."
    
    # Aguardar banco de dados
    log "Aguardando banco de dados..."
    timeout 60 bash -c 'until docker-compose -f docker-compose.production-server.yml exec nexus-database pg_isready -U nexus_user; do sleep 2; done' || error "Banco de dados não ficou pronto"
    success "Banco de dados pronto"
    
    # Aguardar backend
    log "Aguardando backend..."
    timeout 60 bash -c 'until curl -f http://localhost:4000/test >/dev/null 2>&1; do sleep 2; done' || warning "Backend pode não estar pronto ainda"
    success "Backend pronto"
    
    # Aguardar frontend
    log "Aguardando frontend..."
    timeout 60 bash -c 'until curl -f http://localhost:3001 >/dev/null 2>&1; do sleep 2; done' || warning "Frontend pode não estar pronto ainda"
    success "Frontend pronto"
    
    # Aguardar nginx
    log "Aguardando nginx..."
    timeout 60 bash -c 'until curl -f http://localhost/health >/dev/null 2>&1; do sleep 2; done' || warning "Nginx pode não estar pronto ainda"
    success "Nginx pronto"
}

# Executar migrações do banco
run_migrations() {
    log "Executando migrações do banco de dados..."
    
    # Aguardar um pouco mais para o backend ficar totalmente pronto
    sleep 10
    
    if docker-compose -f docker-compose.production-server.yml exec nexus-backend npx prisma migrate deploy; then
        success "Migrações executadas com sucesso"
    else
        warning "Erro ao executar migrações. Execute manualmente: docker-compose -f docker-compose.production-server.yml exec nexus-backend npx prisma migrate deploy"
    fi
}

# Verificar saúde dos serviços
health_check() {
    log "Verificando saúde dos serviços..."
    
    # Verificar containers
    if docker-compose -f docker-compose.production-server.yml ps | grep -q "Up"; then
        success "Containers estão rodando"
    else
        error "Alguns containers não estão rodando"
    fi
    
    # Verificar endpoints
    if curl -f http://localhost/health >/dev/null 2>&1; then
        success "Nginx está respondendo"
    else
        warning "Nginx pode não estar respondendo ainda"
    fi
    
    if curl -f http://localhost/api/test >/dev/null 2>&1; then
        success "API está respondendo"
    else
        warning "API pode não estar respondendo ainda"
    fi
}

# Verificar permissões
check_permissions() {
    log "Verificando permissões..."
    
    # Verificar permissões do diretório SSL
    if [ -d "ssl" ]; then
        chmod 600 ssl/*.pem 2>/dev/null || warning "Não foi possível ajustar permissões dos certificados SSL"
        success "Permissões SSL verificadas"
    else
        warning "Diretório SSL não encontrado"
    fi
    
    # Verificar permissões dos logs
    mkdir -p logs
    chmod 755 logs
    success "Permissões verificadas"
}

# Mostrar informações de acesso
show_access_info() {
    echo ""
    echo "🎉 Deploy de produção concluído com sucesso!"
    echo ""
    echo "📱 Acesse a aplicação:"
    echo "   Frontend: https://nexusvalvulas.com.br"
    echo "   API:      https://nexusvalvulas.com.br/api"
    echo "   Health:   https://nexusvalvulas.com.br/health"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "   Ver logs:     docker-compose -f docker-compose.production-server.yml logs -f"
    echo "   Parar:        docker-compose -f docker-compose.production-server.yml down"
    echo "   Status:       docker-compose -f docker-compose.production-server.yml ps"
    echo "   Rebuild:      docker-compose -f docker-compose.production-server.yml up -d --build"
    echo ""
    echo "📊 Monitoramento:"
    echo "   Logs em tempo real: docker-compose -f docker-compose.production-server.yml logs -f"
    echo "   Status dos containers: docker-compose -f docker-compose.production-server.yml ps"
    echo "   Uso de recursos: docker stats"
    echo ""
}

# Função principal
main() {
    echo "🚀 Nexus Válvulas - Deploy de Produção"
    echo "======================================"
    echo ""
    
    # Verificações iniciais
    check_directory
    check_docker
    
    # Backup
    backup_database
    
    # Parar containers existentes
    stop_containers
    
    # Atualizar e construir
    update_images
    build_and_start
    
    # Aguardar serviços
    wait_for_services
    
    # Executar migrações
    run_migrations
    
    # Verificar saúde
    health_check
    
    # Verificar permissões
    check_permissions
    
    # Mostrar informações
    show_access_info
}

# Verificar argumentos
if [ "$1" = "help" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Uso: $0 [backup|stop|start|restart|logs|status]"
    echo ""
    echo "Comandos:"
    echo "  backup   - Fazer backup do banco de dados"
    echo "  stop     - Parar todos os containers"
    echo "  start    - Iniciar containers existentes"
    echo "  restart  - Reiniciar todos os containers"
    echo "  logs     - Ver logs em tempo real"
    echo "  status   - Ver status dos containers"
    echo ""
    echo "Exemplos:"
    echo "  $0 backup    # Backup do banco"
    echo "  $0 restart   # Reiniciar tudo"
    echo "  $0 logs      # Ver logs"
    exit 0
fi

# Executar comando específico
case "$1" in
    "backup")
        backup_database
        ;;
    "stop")
        stop_containers
        ;;
    "start")
        docker-compose -f docker-compose.production-server.yml up -d
        ;;
    "restart")
        stop_containers
        docker-compose -f docker-compose.production-server.yml up -d
        ;;
    "logs")
        docker-compose -f docker-compose.production-server.yml logs -f
        ;;
    "status")
        docker-compose -f docker-compose.production-server.yml ps
        ;;
    *)
        # Deploy completo
        main
        ;;
esac

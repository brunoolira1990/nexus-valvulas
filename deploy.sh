#!/bin/bash

# Script de Deploy Automatizado - Nexus Válvulas
# Uso: ./deploy.sh [dev|prod]

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

# Verificar se Docker está instalado
check_docker() {
    log "Verificando Docker..."
    if ! command -v docker &> /dev/null; then
        error "Docker não está instalado. Instale Docker primeiro."
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        error "Docker Compose não está instalado. Instale Docker Compose primeiro."
    fi
    
    success "Docker e Docker Compose estão instalados"
}

# Verificar se arquivo .env existe
check_env() {
    log "Verificando arquivo .env..."
    if [ ! -f ".env" ]; then
        warning "Arquivo .env não encontrado. Criando a partir do exemplo..."
        if [ -f "env.example" ]; then
            cp env.example .env
            warning "Arquivo .env criado. Configure as variáveis antes de continuar."
            echo "Edite o arquivo .env e execute novamente: nano .env"
            exit 1
        else
            error "Arquivo env.example não encontrado."
        fi
    fi
    success "Arquivo .env encontrado"
}

# Parar containers existentes
stop_containers() {
    log "Parando containers existentes..."
    docker-compose down 2>/dev/null || true
    success "Containers parados"
}

# Limpar containers e imagens antigas (opcional)
cleanup() {
    if [ "$1" = "clean" ]; then
        log "Limpando containers e imagens antigas..."
        docker-compose down --rmi all --volumes --remove-orphans 2>/dev/null || true
        docker system prune -f
        success "Limpeza concluída"
    fi
}

# Construir e iniciar containers
build_and_start() {
    local mode=$1
    
    log "Construindo e iniciando containers ($mode)..."
    
    if [ "$mode" = "prod" ]; then
        docker-compose up -d --build
    else
        docker-compose up --build
    fi
    
    success "Containers iniciados"
}

# Aguardar serviços ficarem prontos
wait_for_services() {
    log "Aguardando serviços ficarem prontos..."
    
    # Aguardar banco de dados
    log "Aguardando banco de dados..."
    timeout 60 bash -c 'until docker-compose exec database pg_isready -U nexus_user; do sleep 2; done' || error "Banco de dados não ficou pronto"
    success "Banco de dados pronto"
    
    # Aguardar backend
    log "Aguardando backend..."
    timeout 60 bash -c 'until curl -f http://localhost:4000/test >/dev/null 2>&1; do sleep 2; done' || warning "Backend pode não estar pronto ainda"
    success "Backend pronto"
    
    # Aguardar frontend
    log "Aguardando frontend..."
    timeout 60 bash -c 'until curl -f http://localhost:3000 >/dev/null 2>&1; do sleep 2; done' || warning "Frontend pode não estar pronto ainda"
    success "Frontend pronto"
}

# Executar migrações do banco
run_migrations() {
    log "Executando migrações do banco de dados..."
    
    # Aguardar um pouco mais para o backend ficar totalmente pronto
    sleep 10
    
    if docker-compose exec backend npx prisma migrate deploy; then
        success "Migrações executadas com sucesso"
    else
        warning "Erro ao executar migrações. Execute manualmente: docker-compose exec backend npx prisma migrate deploy"
    fi
}

# Verificar saúde dos serviços
health_check() {
    log "Verificando saúde dos serviços..."
    
    # Verificar containers
    if docker-compose ps | grep -q "Up"; then
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

# Mostrar informações de acesso
show_access_info() {
    echo ""
    echo "🎉 Deploy concluído com sucesso!"
    echo ""
    echo "📱 Acesse a aplicação:"
    echo "   Frontend: http://localhost"
    echo "   API:      http://localhost/api"
    echo "   Health:   http://localhost/health"
    echo ""
    echo "🔧 Comandos úteis:"
    echo "   Ver logs:     docker-compose logs -f"
    echo "   Parar:        docker-compose down"
    echo "   Status:       docker-compose ps"
    echo "   Rebuild:      docker-compose up -d --build"
    echo ""
    echo "📊 Monitoramento:"
    echo "   Logs em tempo real: docker-compose logs -f"
    echo "   Status dos containers: docker-compose ps"
    echo "   Uso de recursos: docker stats"
    echo ""
}

# Função principal
main() {
    local mode=${1:-dev}
    
    echo "🐳 Nexus Válvulas - Deploy Automatizado"
    echo "========================================"
    echo ""
    
    # Verificações iniciais
    check_docker
    check_env
    
    # Limpeza (se solicitado)
    cleanup $2
    
    # Parar containers existentes
    stop_containers
    
    # Construir e iniciar
    build_and_start $mode
    
    # Aguardar serviços
    wait_for_services
    
    # Executar migrações
    run_migrations
    
    # Verificar saúde
    health_check
    
    # Mostrar informações
    show_access_info
}

# Verificar argumentos
if [ "$1" = "help" ] || [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
    echo "Uso: $0 [dev|prod] [clean]"
    echo ""
    echo "Argumentos:"
    echo "  dev   - Modo desenvolvimento (logs em tempo real)"
    echo "  prod  - Modo produção (background)"
    echo "  clean - Limpar containers e imagens antigas"
    echo ""
    echo "Exemplos:"
    echo "  $0 dev        # Desenvolvimento"
    echo "  $0 prod       # Produção"
    echo "  $0 prod clean # Produção com limpeza"
    exit 0
fi

# Executar função principal
main $@

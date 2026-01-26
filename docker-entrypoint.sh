#!/bin/bash

# Script para preparar o ambiente Docker antes de iniciar os containers

echo "🚀 Preparando ambiente Docker..."

# Verificar se o frontend foi buildado
if [ ! -d "dist" ]; then
    echo "⚠️  Frontend não encontrado. Buildando frontend..."
    npm run build:prod
fi

# Verificar se o diretório dist existe e tem conteúdo
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "❌ Erro: Frontend não foi buildado corretamente."
    echo "   Execute: npm run build:prod"
    exit 1
fi

echo "✅ Frontend buildado encontrado!"

# Verificar se o arquivo .env.docker existe
if [ ! -f ".env.docker" ]; then
    echo "⚠️  Arquivo .env.docker não encontrado. Criando a partir do exemplo..."
    if [ -f ".env.docker.example" ]; then
        cp .env.docker.example .env.docker
        echo "✅ Arquivo .env.docker criado. Configure as variáveis antes de continuar."
    else
        echo "❌ Erro: Arquivo .env.docker.example não encontrado."
        exit 1
    fi
fi

echo "✅ Ambiente Docker preparado!"
echo ""
echo "📋 Próximos passos:"
echo "   1. Configure o arquivo .env.docker com suas credenciais"
echo "   2. Execute: docker-compose up --build"





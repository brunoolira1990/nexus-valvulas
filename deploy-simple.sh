#!/bin/bash

# Script de deploy simplificado para Nexus Válvulas (sem Nginx)
# Este script faz o build do frontend e inicia o backend que servirá o frontend

echo "🚀 Iniciando deploy simplificado do Nexus Válvulas..."

# 1. Build do frontend
echo "🔨 Fazendo build do frontend..."
npm run build:prod

if [ $? -ne 0 ]; then
  echo "❌ Erro ao fazer build do frontend"
  exit 1
fi

echo "✅ Frontend build concluído"

# 2. Verificar se o diretório dist foi criado
if [ ! -d "dist" ]; then
  echo "❌ Diretório dist não foi criado"
  exit 1
fi

echo "📁 Diretório dist encontrado com $(ls -1 dist | wc -l) arquivos"

# 3. Copiar arquivos importantes para o diretório dist
if [ -f "public/manifest.json" ]; then
  cp public/manifest.json dist/
  echo "📋 manifest.json copiado para dist/"
fi

# 4. Reiniciar o backend
echo "🔄 Reiniciando o backend..."

# Parar qualquer instância anterior
pm2 stop nexus-backend 2>/dev/null || true

# Iniciar o backend com PM2
pm2 start backend/src/index.js --name nexus-backend

if [ $? -ne 0 ]; then
  echo "❌ Erro ao iniciar o backend com PM2"
  exit 1
fi

echo "✅ Backend iniciado com sucesso"
echo "🌐 Site disponível em: http://localhost:4000"
echo "🎉 Deploy simplificado concluído!"
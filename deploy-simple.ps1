# Script de deploy simplificado para Nexus Válvulas (sem Nginx) - Windows
# Este script faz o build do frontend e inicia o backend que servirá o frontend

Write-Host "🚀 Iniciando deploy simplificado do Nexus Válvulas..." -ForegroundColor Green

# 1. Build do frontend
Write-Host "🔨 Fazendo build do frontend..." -ForegroundColor Yellow
npm run build:prod

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Erro ao fazer build do frontend" -ForegroundColor Red
  exit 1
}

Write-Host "✅ Frontend build concluído" -ForegroundColor Green

# 2. Verificar se o diretório dist foi criado
if (!(Test-Path "dist")) {
  Write-Host "❌ Diretório dist não foi criado" -ForegroundColor Red
  exit 1
}

$distFiles = (Get-ChildItem "dist" | Measure-Object).Count
Write-Host "📁 Diretório dist encontrado com $distFiles arquivos" -ForegroundColor Green

# 3. Copiar arquivos importantes para o diretório dist
if (Test-Path "public/manifest.json") {
  Copy-Item "public/manifest.json" "dist/"
  Write-Host "📋 manifest.json copiado para dist/" -ForegroundColor Green
}

# 4. Reiniciar o backend
Write-Host "🔄 Reiniciando o backend..." -ForegroundColor Yellow

# Parar qualquer instância anterior
try {
  pm2 stop nexus-backend 2>$null
} catch {
  # Ignorar erros se o serviço não estiver rodando
}

# Iniciar o backend com PM2
pm2 start backend/src/index.js --name nexus-backend

if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Erro ao iniciar o backend com PM2" -ForegroundColor Red
  exit 1
}

Write-Host "✅ Backend iniciado com sucesso" -ForegroundColor Green
Write-Host "🌐 Site disponível em: http://localhost:4000" -ForegroundColor Cyan
Write-Host "🎉 Deploy simplificado concluído!" -ForegroundColor Green
# Script para iniciar o Frontend React
# Execute: .\start-frontend.ps1

Write-Host "=== Iniciando Frontend React ===" -ForegroundColor Cyan

# Verificar se node_modules existe
if (-not (Test-Path node_modules)) {
    Write-Host "`nInstalando dependências..." -ForegroundColor Yellow
    npm install
}

# Verificar se já está rodando
$port5173 = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($port5173) {
    Write-Host "`n⚠️  Porta 5173 já está em uso!" -ForegroundColor Yellow
    Write-Host "Pare o servidor existente ou use outra porta." -ForegroundColor Yellow
    Read-Host "Pressione Enter para continuar mesmo assim"
}

# Iniciar servidor
Write-Host "`nIniciando servidor Vite..." -ForegroundColor Green
Write-Host "Frontend estará em: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Pressione CTRL+C para parar`n" -ForegroundColor Yellow

npm run dev








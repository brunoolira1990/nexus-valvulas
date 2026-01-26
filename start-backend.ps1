# Script para iniciar o Backend Django
# Execute: .\start-backend.ps1

Write-Host "=== Iniciando Backend Django ===" -ForegroundColor Cyan

cd backend

# Ativar venv
Write-Host "`nAtivando ambiente virtual..." -ForegroundColor Green
& .\venv\Scripts\Activate.ps1

# Verificar se já está rodando
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($port8000) {
    Write-Host "`n⚠️  Porta 8000 já está em uso!" -ForegroundColor Yellow
    Write-Host "Pare o servidor existente ou use outra porta." -ForegroundColor Yellow
    Read-Host "Pressione Enter para continuar mesmo assim"
}

# Iniciar servidor
Write-Host "`nIniciando servidor Django..." -ForegroundColor Green
Write-Host "Servidor estará em: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Pressione CTRL+C para parar`n" -ForegroundColor Yellow

python manage.py runserver








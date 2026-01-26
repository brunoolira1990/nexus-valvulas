# Script para parar e reiniciar o Backend Django
# Execute: .\reiniciar-backend.ps1

Write-Host "=== Reiniciando Backend Django ===" -ForegroundColor Cyan

# Verificar se a porta 8000 está em uso
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($port8000) {
    $processId = $port8000.OwningProcess
    Write-Host "`n🛑 Parando processo existente (PID: $processId)..." -ForegroundColor Yellow
    
    try {
        Stop-Process -Id $processId -Force -ErrorAction Stop
        Write-Host "✅ Processo parado com sucesso!" -ForegroundColor Green
        Start-Sleep -Seconds 2
    } catch {
        Write-Host "❌ Erro ao parar processo: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   Tente parar manualmente (CTRL+C no terminal do servidor)" -ForegroundColor Yellow
    }
} else {
    Write-Host "`n✅ Nenhum processo na porta 8000" -ForegroundColor Green
}

# Iniciar servidor
Write-Host "`n🚀 Iniciando servidor Django..." -ForegroundColor Green
cd backend

# Ativar venv
Write-Host "`nAtivando ambiente virtual..." -ForegroundColor Cyan
& .\venv\Scripts\Activate.ps1

# Iniciar servidor
Write-Host "`nServidor estará em: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Pressione CTRL+C para parar`n" -ForegroundColor Yellow

python manage.py runserver








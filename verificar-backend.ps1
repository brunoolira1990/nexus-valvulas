# Script para verificar e iniciar o Backend Django
# Execute: .\verificar-backend.ps1

Write-Host "=== Verificando Backend Django ===" -ForegroundColor Cyan

# Verificar se a porta 8000 está em uso
$port8000 = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($port8000) {
    Write-Host "`n✅ Porta 8000 está em uso (processo: $($port8000.OwningProcess))" -ForegroundColor Green
    
    # Testar se o servidor está respondendo
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:8000/api/test" -UseBasicParsing -TimeoutSec 2
        Write-Host "✅ Servidor Django está respondendo!" -ForegroundColor Green
        Write-Host "   Status: $($response.StatusCode)" -ForegroundColor Cyan
        Write-Host "   Resposta: $($response.Content)" -ForegroundColor Gray
    } catch {
        Write-Host "`n❌ Servidor não está respondendo!" -ForegroundColor Red
        Write-Host "   Erro: $($_.Exception.Message)" -ForegroundColor Yellow
        Write-Host "`n💡 Solução: Pare o processo e reinicie o servidor" -ForegroundColor Yellow
        Write-Host "   Execute: .\start-backend.ps1" -ForegroundColor Cyan
    }
} else {
    Write-Host "`n❌ Porta 8000 não está em uso" -ForegroundColor Red
    Write-Host "`n💡 Solução: Inicie o servidor Django" -ForegroundColor Yellow
    Write-Host "   Execute: .\start-backend.ps1" -ForegroundColor Cyan
}

Write-Host "`n=== Verificação concluída ===" -ForegroundColor Cyan








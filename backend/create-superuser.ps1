# Script para criar superusuário do Django Admin
# Execute: .\create-superuser.ps1

Write-Host "=== Criar Superusuário do Django Admin ===" -ForegroundColor Cyan
Write-Host ""

# Ativar venv
& .\venv\Scripts\Activate.ps1

Write-Host "Criando superusuário..." -ForegroundColor Green
Write-Host "Você será solicitado a inserir:" -ForegroundColor Yellow
Write-Host "  - Email (use: admin@nexus.com)" -ForegroundColor Yellow
Write-Host "  - Password (use: admin123)" -ForegroundColor Yellow
Write-Host ""

python manage.py createsuperuser

Write-Host ""
Write-Host "=== Superusuário criado! ===" -ForegroundColor Green
Write-Host "Agora você pode fazer login em: http://127.0.0.1:8000/admin/" -ForegroundColor Cyan








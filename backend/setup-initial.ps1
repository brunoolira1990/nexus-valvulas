# Script para configuração inicial do projeto Django
# Execute: .\setup-initial.ps1

Write-Host "=== Configuração Inicial do Backend Django ===" -ForegroundColor Cyan

# Ativar venv
Write-Host "`n1. Ativando ambiente virtual..." -ForegroundColor Green
& .\venv\Scripts\Activate.ps1

# Verificar se .env existe
if (-not (Test-Path .env)) {
    Write-Host "`n2. Criando arquivo .env a partir do env.example..." -ForegroundColor Green
    Copy-Item env.example .env
    Write-Host "   ⚠️  IMPORTANTE: Edite o arquivo .env com suas configurações!" -ForegroundColor Yellow
} else {
    Write-Host "`n2. Arquivo .env já existe." -ForegroundColor Green
}

# Executar migrações
Write-Host "`n3. Executando migrações do banco de dados..." -ForegroundColor Green
python manage.py migrate

# Criar superusuário (opcional)
Write-Host "`n4. Criando usuário admin..." -ForegroundColor Green
Write-Host "   Você pode criar um usuário admin agora ou depois com:" -ForegroundColor Yellow
Write-Host "   python manage.py shell" -ForegroundColor Yellow
Write-Host "   from api.models import User" -ForegroundColor Yellow
Write-Host "   user = User.objects.create_user(email='admin@nexus.com', password='admin123', name='Admin', role='ADMIN')" -ForegroundColor Yellow

Write-Host "`n=== Configuração concluída! ===" -ForegroundColor Cyan
Write-Host "`nPróximos passos:" -ForegroundColor Green
Write-Host "1. Edite o arquivo .env com suas configurações de banco de dados" -ForegroundColor White
Write-Host "2. Configure o PostgreSQL ou use SQLite temporariamente" -ForegroundColor White
Write-Host "3. Execute: python manage.py runserver" -ForegroundColor White
Write-Host "4. Acesse: http://localhost:8000/api/test" -ForegroundColor White








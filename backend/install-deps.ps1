# Script PowerShell para instalar dependências no Windows
# Execute: .\install-deps.ps1

Write-Host "Ativando ambiente virtual..." -ForegroundColor Green
& .\venv\Scripts\Activate.ps1

Write-Host "Atualizando pip, setuptools e wheel..." -ForegroundColor Green
python -m pip install --upgrade pip setuptools wheel

Write-Host "Instalando Pillow (versão mais recente)..." -ForegroundColor Green
pip install Pillow

Write-Host "Instalando Django e dependências..." -ForegroundColor Green
pip install Django==5.0.1 djangorestframework==3.14.0 djangorestframework-simplejwt==5.3.0 django-cors-headers==4.3.1 python-decouple==3.8

Write-Host "Instalando psycopg2-binary..." -ForegroundColor Green
pip install psycopg2-binary

Write-Host "`nInstalação concluída! Verificando..." -ForegroundColor Green
python -c "import django; print('Django:', django.get_version())"
python -c "import rest_framework; print('DRF: OK')"
python -c "import PIL; print('Pillow: OK')"
python -c "import psycopg2; print('psycopg2: OK')"

Write-Host "`nTudo instalado com sucesso!" -ForegroundColor Green








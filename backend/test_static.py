"""
Script para testar se os arquivos estáticos estão configurados corretamente
Execute: python test_static.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from pathlib import Path

print("=== Configuração de Arquivos Estáticos ===\n")
print(f"DEBUG: {settings.DEBUG}")
print(f"STATIC_URL: {settings.STATIC_URL}")
print(f"STATIC_ROOT: {settings.STATIC_ROOT}")
print(f"STATIC_ROOT existe: {Path(settings.STATIC_ROOT).exists()}")

# Verificar se arquivos do admin existem
admin_css = Path(settings.STATIC_ROOT) / 'admin' / 'css' / 'base.css'
print(f"\nArquivo admin/css/base.css existe: {admin_css.exists()}")

if admin_css.exists():
    print(f"Tamanho do arquivo: {admin_css.stat().st_size} bytes")
else:
    print("ERRO: Arquivo CSS do admin não encontrado!")
    print("Execute: python manage.py collectstatic")








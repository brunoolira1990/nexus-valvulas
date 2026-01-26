"""
Script para listar todas as URLs do projeto
Execute: python list_urls.py
"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.urls import get_resolver
from django.conf import settings

def show_urls(urlconf=None, prefix=''):
    resolver = get_resolver(urlconf)
    for pattern in resolver.url_patterns:
        if hasattr(pattern, 'url_patterns'):
            # É um include
            show_urls(pattern.urlconf_name, prefix + str(pattern.pattern))
        else:
            # É uma URL
            print(f"{prefix}{pattern.pattern} -> {pattern.name or 'unnamed'}")

print("=== URLs Disponíveis ===\n")
show_urls()








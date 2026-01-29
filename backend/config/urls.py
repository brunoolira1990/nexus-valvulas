"""
URL configuration for nexus_valvulas project.
"""
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),  # Autenticação
    path('api/products/', include('apps.products.urls')),
    path('api/blog/', include('apps.blog.urls')),
]

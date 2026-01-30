"""
URL configuration for nexus_valvulas project.
"""
from django.contrib import admin
from django.urls import path, include
from apps.blog.views import sitemap_view

urlpatterns = [
    path("admin/", admin.site.urls),
    path("sitemap.xml", sitemap_view),
    path("api/", include("api.urls")),
    path("api/products/", include("apps.products.urls")),
    path("api/blog/", include("apps.blog.urls")),
]

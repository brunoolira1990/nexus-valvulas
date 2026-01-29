from django.contrib import admin
from django.utils.html import format_html
from django.utils import timezone
from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = [
        "title",
        "slug",
        "cover_image_preview",
        "category",
        "is_published",
        "published_at",
        "created_at",
    ]
    list_filter = ["is_published", "category", "created_at", "published_at"]
    search_fields = ["title", "slug", "content", "excerpt", "meta_title", "keywords"]
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ["created_at", "updated_at", "cover_image_preview", "published_at"]

    fieldsets = (
        ("Conteúdo", {
            "fields": ("title", "slug", "excerpt", "content"),
            "description": "Título, slug e editor rico do post.",
        }),
        ("SEO", {
            "fields": ("meta_title", "meta_description", "keywords", "focus_keyword"),
            "description": "Campos para motores de busca. Meta title/description aparecem nos resultados do Google.",
        }),
        ("Mídia & Capa", {
            "fields": ("cover_image", "cover_image_preview"),
        }),
        ("Publicação", {
            "fields": ("category", "is_published", "published_at", "created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )

    def cover_image_preview(self, obj):
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="max-height: 150px; max-width: 200px;" />',
                obj.cover_image.url,
            )
        return "Sem imagem"

    cover_image_preview.short_description = "Preview"

    def save_model(self, request, obj, form, change):
        if obj.is_published and not obj.published_at:
            obj.published_at = timezone.now()
        super().save_model(request, obj, form, change)

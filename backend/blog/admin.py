from django.contrib import admin
from django.utils.html import format_html
from .models import Post


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    """Admin para Post."""
    list_display = [
        'title', 'published', 'cover_image_preview',
        'created_at', 'updated_at'
    ]
    list_filter = ['published', 'created_at', 'updated_at']
    search_fields = ['title', 'slug', 'excerpt', 'content']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'cover_image_preview']
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('title', 'slug', 'excerpt')
        }),
        ('Conteúdo', {
            'fields': ('content',)
        }),
        ('Imagem', {
            'fields': ('cover_image', 'cover_image_preview')
        }),
        ('Publicação', {
            'fields': ('published',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def cover_image_preview(self, obj):
        """Preview da imagem de capa no admin."""
        if obj.cover_image:
            return format_html(
                '<img src="{}" style="max-height: 200px; max-width: 200px;" />',
                obj.cover_image
            )
        return '-'
    cover_image_preview.short_description = 'Preview da Imagem'

from django.contrib import admin
from django.utils.html import format_html
from django.urls import reverse
from .models import Category, Product, ProductVariant, ProductSize


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'image_preview', 'product_count', 'is_active', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['created_at', 'updated_at', 'image_preview']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('name', 'slug', 'description')
        }),
        ('Imagem', {
            'fields': ('image', 'image_preview')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 100px;" />',
                obj.image.url
            )
        return "Sem imagem"
    image_preview.short_description = "Preview"

    def product_count(self, obj):
        count = obj.products.count()
        url = reverse('admin:products_product_changelist') + f'?category__id__exact={obj.id}'
        return format_html('<a href="{}">{} produtos</a>', url, count)
    product_count.short_description = "Produtos"


class ProductSizeInline(admin.TabularInline):
    """Inline para tamanhos vinculados diretamente ao produto (Cenário Intermediário)"""
    model = ProductSize
    extra = 1
    fields = ('size_label', 'image', 'order')
    verbose_name = "Tamanho (sem variante)"
    verbose_name_plural = "Tamanhos (sem variante)"
    
    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.filter(variant__isnull=True)


class ProductVariantSizeInline(admin.TabularInline):
    """Inline para tamanhos de uma variante (Cenário Complexo)"""
    model = ProductSize
    extra = 1
    fields = ('size_label', 'image', 'order')
    verbose_name = "Tamanho"
    verbose_name_plural = "Tamanhos"
    fk_name = 'variant'


class ProductVariantInline(admin.TabularInline):
    """Inline para variantes do produto (Cenário Complexo)"""
    model = ProductVariant
    extra = 1
    fields = ('name', 'description', 'image', 'order')
    inlines = [ProductVariantSizeInline]
    verbose_name = "Variante"
    verbose_name_plural = "Variantes"


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        'title',
        'category',
        'image_preview',
        'product_type_badge',
        'variants_count',
        'sizes_count',
        'is_active',
        'created_at'
    ]
    list_filter = ['category', 'is_active', 'created_at']
    search_fields = ['title', 'slug', 'description']
    prepopulated_fields = {'slug': ('title',)}
    readonly_fields = ['created_at', 'updated_at', 'image_preview', 'product_type_badge']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('category', 'title', 'slug', 'description')
        }),
        ('Imagem Principal', {
            'fields': ('image', 'image_preview'),
            'description': 'Imagem de capa (obrigatória para produtos simples)'
        }),
        ('Especificações Técnicas', {
            'fields': ('specifications', 'applications', 'standards'),
            'classes': ('collapse',)
        }),
        ('Tipo de Produto', {
            'fields': ('product_type_badge',),
            'description': 'O tipo é determinado automaticamente pela presença de variantes/sizes'
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    inlines = [
        ProductVariantInline,  # Variantes (Cenário Complexo)
        ProductSizeInline,      # Tamanhos diretos (Cenário Intermediário)
    ]

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 100px;" />',
                obj.image.url
            )
        return "Sem imagem"
    image_preview.short_description = "Preview"

    def product_type_badge(self, obj):
        if obj.has_variants:
            return format_html(
                '<span style="background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px;">COMPLEXO</span>'
            )
        elif obj.has_sizes_only:
            return format_html(
                '<span style="background: #10b981; color: white; padding: 4px 8px; border-radius: 4px;">INTERMEDIÁRIO</span>'
            )
        else:
            return format_html(
                '<span style="background: #6b7280; color: white; padding: 4px 8px; border-radius: 4px;">SIMPLES</span>'
            )
    product_type_badge.short_description = "Tipo"

    def variants_count(self, obj):
        count = obj.variants.count()
        if count > 0:
            url = reverse('admin:products_productvariant_changelist') + f'?product__id__exact={obj.id}'
            return format_html('<a href="{}">{} variantes</a>', url, count)
        return "0"
    variants_count.short_description = "Variantes"

    def sizes_count(self, obj):
        # Conta sizes diretos + sizes de variantes
        direct_sizes = obj.sizes.filter(variant__isnull=True).count()
        variant_sizes = sum(v.sizes.count() for v in obj.variants.all())
        total = direct_sizes + variant_sizes
        if total > 0:
            return f"{total} tamanhos"
        return "0"
    sizes_count.short_description = "Tamanhos"


@admin.register(ProductVariant)
class ProductVariantAdmin(admin.ModelAdmin):
    list_display = ['name', 'product', 'image_preview', 'sizes_count', 'order', 'created_at']
    list_filter = ['product__category', 'created_at']
    search_fields = ['name', 'product__title', 'description']
    readonly_fields = ['created_at', 'updated_at', 'image_preview']
    
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('product', 'name', 'description', 'order')
        }),
        ('Imagem', {
            'fields': ('image', 'image_preview')
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    inlines = [ProductVariantSizeInline]

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 100px;" />',
                obj.image.url
            )
        return "Sem imagem"
    image_preview.short_description = "Preview"

    def sizes_count(self, obj):
        count = obj.sizes.count()
        if count > 0:
            url = reverse('admin:products_productsize_changelist') + f'?variant__id__exact={obj.id}'
            return format_html('<a href="{}">{} tamanhos</a>', url, count)
        return "0"
    sizes_count.short_description = "Tamanhos"


@admin.register(ProductSize)
class ProductSizeAdmin(admin.ModelAdmin):
    list_display = ['size_label', 'product_or_variant', 'image_preview', 'order', 'created_at']
    list_filter = ['product__category', 'created_at']
    search_fields = ['size_label', 'product__title', 'variant__name']
    readonly_fields = ['created_at', 'updated_at', 'image_preview']
    
    fieldsets = (
        ('Vinculação', {
            'fields': ('product', 'variant'),
            'description': 'Vincule a um PRODUTO (sem variantes) OU a uma VARIANTE (com variantes)'
        }),
        ('Informações do Tamanho', {
            'fields': ('size_label', 'image', 'image_preview', 'order')
        }),
        ('Datas', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="max-height: 100px; max-width: 100px;" />',
                obj.image.url
            )
        return "Sem imagem"
    image_preview.short_description = "Preview"

    def product_or_variant(self, obj):
        if obj.variant:
            return format_html(
                '<strong>Variante:</strong> {}<br><small>Produto: {}</small>',
                obj.variant.name,
                obj.variant.product.title
            )
        elif obj.product:
            return format_html('<strong>Produto:</strong> {}', obj.product.title)
        return "-"
    product_or_variant.short_description = "Vinculado a"

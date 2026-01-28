from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """Categoria de produtos (ex: Válvulas Industriais, Conexões)"""
    name = models.CharField(max_length=200, verbose_name="Nome")
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name="Slug")
    description = models.TextField(blank=True, verbose_name="Descrição")
    image = models.ImageField(
        upload_to='categories/',
        blank=True,
        null=True,
        verbose_name="Imagem",
        help_text="Imagem representativa da categoria"
    )
    is_active = models.BooleanField(default=True, verbose_name="Ativa")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        verbose_name = "Categoria"
        verbose_name_plural = "Categorias"
        ordering = ['name']

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)


class Product(models.Model):
    """Produto principal - Suporta 3 cenários: Simples, Intermediário, Complexo"""
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='products',
        verbose_name="Categoria"
    )
    title = models.CharField(max_length=200, verbose_name="Título")
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name="Slug")
    description = models.TextField(blank=True, default='', verbose_name="Descrição")
    
    # Imagem principal (obrigatória para produtos simples)
    image = models.ImageField(
        upload_to='products/',
        blank=True,
        null=True,
        verbose_name="Imagem Principal",
        help_text="Imagem de capa do produto (usada em cards e produtos simples)"
    )
    
    # Especificações técnicas (JSON flexível)
    specifications = models.JSONField(
        default=dict,
        blank=True,
        verbose_name="Especificações Técnicas",
        help_text='Ex: {"Pressão Máxima": "150 PSI", "Temperatura": "-20°C a 200°C"}'
    )
    
    # Aplicações recomendadas
    applications = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Aplicações",
        help_text='Lista de aplicações: ["Refinarias", "Indústria química"]'
    )
    
    # Normas técnicas
    standards = models.JSONField(
        default=list,
        blank=True,
        verbose_name="Normas Técnicas",
        help_text='Lista de normas: ["ASME B16.34", "API 600"]'
    )
    
    is_active = models.BooleanField(default=True, verbose_name="Ativo")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        verbose_name = "Produto"
        verbose_name_plural = "Produtos"
        ordering = ['title']
        unique_together = [['category', 'slug']]

    def __str__(self):
        return f"{self.title} ({self.category.name})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    @property
    def has_variants(self):
        """Verifica se o produto tem variantes (Cenário Complexo)"""
        return self.variants.exists()

    @property
    def has_sizes_only(self):
        """Verifica se o produto tem apenas sizes (Cenário Intermediário)"""
        return not self.has_variants and self.sizes.exists()

    @property
    def is_simple(self):
        """Verifica se o produto é simples (apenas imagem)"""
        return not self.has_variants and not self.has_sizes_only


class ProductVariant(models.Model):
    """Variante do produto (ex: Tripartida 300#, Monobloco, Aço Carbono)"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants',
        verbose_name="Produto"
    )
    name = models.CharField(max_length=200, verbose_name="Nome")
    description = models.TextField(blank=True, verbose_name="Descrição")
    
    # Imagem opcional da variante
    image = models.ImageField(
        upload_to='products/variants/',
        blank=True,
        null=True,
        verbose_name="Imagem",
        help_text="Imagem representativa da variante (opcional)"
    )
    
    order = models.PositiveIntegerField(default=0, verbose_name="Ordem")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        verbose_name = "Variante"
        verbose_name_plural = "Variantes"
        ordering = ['order', 'name']
        unique_together = [['product', 'name']]

    def __str__(self):
        return f"{self.product.title} - {self.name}"


class ProductSize(models.Model):
    """Tamanho do produto com imagem específica"""
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='sizes',
        null=True,
        blank=True,
        verbose_name="Produto",
        help_text="Use este campo se o produto NÃO tiver variantes (Cenário Intermediário)"
    )
    variant = models.ForeignKey(
        ProductVariant,
        on_delete=models.CASCADE,
        related_name='sizes',
        null=True,
        blank=True,
        verbose_name="Variante",
        help_text="Use este campo se o produto TIVER variantes (Cenário Complexo)"
    )
    size_label = models.CharField(
        max_length=50,
        verbose_name="Tamanho",
        help_text='Ex: "1/2", "1", "2", "1 1/4"'
    )
    image = models.ImageField(
        upload_to='products/sizes/',
        verbose_name="Imagem",
        help_text="Foto específica deste tamanho"
    )
    order = models.PositiveIntegerField(default=0, verbose_name="Ordem")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")

    class Meta:
        verbose_name = "Tamanho"
        verbose_name_plural = "Tamanhos"
        ordering = ['order', 'size_label']
        constraints = [
            models.CheckConstraint(
                check=(
                    models.Q(product__isnull=False, variant__isnull=True) |
                    models.Q(product__isnull=True, variant__isnull=False)
                ),
                name='product_size_must_have_product_or_variant'
            )
        ]

    def __str__(self):
        if self.variant:
            return f"{self.variant.product.title} - {self.variant.name} - {self.size_label}"
        return f"{self.product.title} - {self.size_label}"

    def clean(self):
        from django.core.exceptions import ValidationError
        if not self.product and not self.variant:
            raise ValidationError("Tamanho deve estar vinculado a um Produto OU a uma Variante")
        if self.product and self.variant:
            raise ValidationError("Tamanho não pode estar vinculado a Produto E Variante ao mesmo tempo")
    
    def save(self, *args, **kwargs):
        self.full_clean()  # Executa validações
        super().save(*args, **kwargs)

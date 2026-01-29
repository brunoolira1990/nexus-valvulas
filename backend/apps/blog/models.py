from django.db import models
from django.utils.text import slugify
from ckeditor.fields import RichTextField


class Post(models.Model):
    """Post do blog"""
    
    CATEGORY_CHOICES = [
        ('Noticias', 'Notícias'),
        ('Tecnico', 'Técnico'),
        ('Eventos', 'Eventos'),
        ('Produtos', 'Produtos'),
    ]
    
    title = models.CharField(max_length=200, verbose_name="Título")
    slug = models.SlugField(max_length=200, unique=True, blank=True, verbose_name="Slug")
    content = RichTextField(verbose_name="Conteúdo")
    cover_image = models.ImageField(
        upload_to='blog/',
        blank=True,
        null=True,
        verbose_name="Imagem de Capa"
    )
    excerpt = models.TextField(
        max_length=500,
        blank=True,
        verbose_name="Resumo",
        help_text="Breve resumo do post (até 500 caracteres)"
    )
    category = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        default='Noticias',
        verbose_name="Categoria"
    )
    is_published = models.BooleanField(default=False, verbose_name="Publicado")
    
    # Campos de SEO
    meta_title = models.CharField(
        max_length=70,
        blank=True,
        verbose_name="Meta Title",
        help_text="Título para o Google. Se vazio, usa o título original."
    )
    meta_description = models.CharField(
        max_length=160,
        blank=True,
        verbose_name="Meta Description",
        help_text="Resumo que aparece nos resultados de busca (até 160 caracteres)."
    )
    keywords = models.CharField(
        max_length=255,
        blank=True,
        verbose_name="Palavras-chave",
        help_text="Palavras-chave separadas por vírgula."
    )
    focus_keyword = models.CharField(
        max_length=100,
        blank=True,
        verbose_name="Palavra-chave Foco",
        help_text="Palavra-chave principal para SEO (uso interno)"
    )
    
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Criado em")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Atualizado em")
    published_at = models.DateTimeField(
        blank=True,
        null=True,
        verbose_name="Publicado em",
        help_text="Data de publicação (preenchido automaticamente ao publicar)"
    )

    class Meta:
        verbose_name = "Post"
        verbose_name_plural = "Posts"
        ordering = ['-published_at', '-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        
        # Se está sendo publicado pela primeira vez, define published_at
        if self.is_published and not self.published_at:
            from django.utils import timezone
            self.published_at = timezone.now()
        
        super().save(*args, **kwargs)

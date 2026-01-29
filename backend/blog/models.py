from django.db import models
from django.conf import settings
from django.utils.text import slugify
from ckeditor.fields import RichTextField


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Post(models.Model):
    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
    )
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True)

    # Conteúdo com Editor Rico
    content = RichTextField()

    excerpt = models.TextField(blank=True, help_text="Breve resumo do post")
    cover_image = models.ImageField(upload_to='blog_covers/', blank=True, null=True)

    # --- CAMPOS DE SEO ---
    meta_title = models.CharField(
        max_length=70,
        blank=True,
        help_text="Título Otimizado para Google (máx 70 chars)",
    )
    meta_description = models.CharField(
        max_length=160,
        blank=True,
        help_text="Descrição para Google (máx 160 chars)",
    )
    keywords = models.CharField(
        max_length=255,
        blank=True,
        help_text="Palavras-chave separadas por vírgula",
    )
    focus_keyword = models.CharField(max_length=100, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(blank=True, null=True)
    is_published = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

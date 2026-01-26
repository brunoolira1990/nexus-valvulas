from django.db import models
from django.utils.text import slugify
from django.utils import timezone


class Post(models.Model):
    """Post do blog institucional."""
    title = models.CharField(max_length=255, verbose_name='Título')
    slug = models.SlugField(unique=True, verbose_name='Slug')
    content = models.TextField(verbose_name='Conteúdo')
    excerpt = models.TextField(max_length=500, null=True, blank=True, verbose_name='Resumo')
    cover_image = models.URLField(null=True, blank=True, verbose_name='Imagem de Capa')
    published = models.BooleanField(default=False, verbose_name='Publicado')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        verbose_name = 'Post do Blog'
        verbose_name_plural = 'Posts do Blog'
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

from rest_framework import serializers
from .models import Category, Post


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer completo para detalhe do post.
    Garante: id, title, slug, excerpt, content, cover_image, author_name, published_at, category_name.
    """
    cover_image_url = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "content",
            "cover_image",
            "cover_image_url",
            "author_name",
            "published_at",
            "category_name",
            # SEO e metadados (opcionais para o frontend)
            "meta_title",
            "meta_description",
            "keywords",
            "focus_keyword",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["published_at", "created_at", "updated_at"]

    def get_author_name(self, obj):
        """Sempre retorna string: nome do autor ou 'Equipe Nexus'."""
        if not obj.author:
            return "Equipe Nexus"
        name = f"{obj.author.first_name or ''} {obj.author.last_name or ''}".strip()
        return name or "Equipe Nexus"

    def get_category_name(self, obj):
        """Retorna nome da categoria ou None."""
        return obj.category.name if obj.category else None

    def get_cover_image_url(self, obj):
        """URL absoluta da imagem de capa para uso no frontend."""
        if obj.cover_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class PostListSerializer(serializers.ModelSerializer):
    """
    Serializer para listagem. Inclui slug para montar o link /blog/{slug}.
    """
    cover_image_url = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "cover_image_url",
            "category_name",
            "published_at",
            "created_at",
        ]

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None

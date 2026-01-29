from rest_framework import serializers
from .models import Category, Post


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


def _safe_author_name(obj) -> str:
    """Retorna nome do autor ou 'Equipe Nexus'. Nunca levanta exceção."""
    try:
        author = getattr(obj, "author", None)
        if author is None:
            return "Equipe Nexus"
        first = getattr(author, "first_name", None) or ""
        last = getattr(author, "last_name", None) or ""
        if isinstance(first, str) and isinstance(last, str):
            name = f"{first} {last}".strip()
            return name if name else "Equipe Nexus"
        return "Equipe Nexus"
    except Exception:
        return "Equipe Nexus"


def _safe_cover_image_url(obj, context) -> str | None:
    """Retorna URL absoluta da imagem de capa ou None. Nunca levanta exceção."""
    try:
        cover = getattr(obj, "cover_image", None)
        if not cover:
            return None
        request = context.get("request") if context else None
        if request and hasattr(request, "build_absolute_uri"):
            return request.build_absolute_uri(cover.url)
        if hasattr(cover, "url"):
            return cover.url
        return None
    except Exception:
        return None


def _safe_category_name(obj) -> str | None:
    """Retorna nome da categoria ou None. Nunca levanta exceção."""
    try:
        category = getattr(obj, "category", None)
        if category is None:
            return None
        name = getattr(category, "name", None)
        return str(name) if name is not None else None
    except Exception:
        return None


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer completo para detalhe do post.
    Defensive: get_author_name e cover_image_url nunca levantam exceção.
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
            "meta_title",
            "meta_description",
            "keywords",
            "focus_keyword",
            "is_published",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["published_at", "created_at", "updated_at"]

    def get_author_name(self, obj) -> str:
        return _safe_author_name(obj)

    def get_category_name(self, obj) -> str | None:
        return _safe_category_name(obj)

    def get_cover_image_url(self, obj) -> str | None:
        return _safe_cover_image_url(obj, self.context)


class PostListSerializer(serializers.ModelSerializer):
    """
    Serializer para listagem. Inclui slug para montar o link /blog/{slug}.
    Defensive: métodos auxiliares nunca levantam exceção.
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

    def get_category_name(self, obj) -> str | None:
        return _safe_category_name(obj)

    def get_cover_image_url(self, obj) -> str | None:
        return _safe_cover_image_url(obj, self.context)

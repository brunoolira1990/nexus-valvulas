from rest_framework import serializers
from .models import Category, Post


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


def _safe_author_name(obj) -> str:
    """
    Retorna nome do autor ou 'Equipe Nexus'.
    Nunca levanta exceção: autor nulo, deletado ou qualquer erro → "Equipe Nexus".
    """
    try:
        if obj is None:
            return "Equipe Nexus"
        # Evita disparar lookup do FK se não houver author_id (autor nulo)
        author_id = getattr(obj, "author_id", None)
        if author_id is None:
            return "Equipe Nexus"
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
    """
    Retorna URL absoluta da imagem de capa ou None.
    Nunca levanta exceção: imagem ausente, arquivo deletado ou qualquer erro → None.
    """
    try:
        if obj is None:
            return None
        cover = getattr(obj, "cover_image", None)
        if not cover:
            return None
        # Não acessar cover.url se o arquivo pode não existir no storage
        try:
            url = getattr(cover, "url", None)
            if not url:
                return None
        except Exception:
            return None
        request = context.get("request") if context else None
        if request and hasattr(request, "build_absolute_uri"):
            return request.build_absolute_uri(url)
        return url if isinstance(url, str) else None
    except Exception:
        return None


def _safe_category_name(obj) -> str | None:
    """Retorna nome da categoria ou None. Nunca levanta exceção."""
    try:
        if obj is None:
            return None
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
    Programação defensiva: autor (inclusive deletado), imagem e categoria nunca quebram.
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
        try:
            return _safe_author_name(obj)
        except Exception:
            return "Equipe Nexus"

    def get_category_name(self, obj) -> str | None:
        try:
            return _safe_category_name(obj)
        except Exception:
            return None

    def get_cover_image_url(self, obj) -> str | None:
        try:
            return _safe_cover_image_url(obj, self.context)
        except Exception:
            return None

    def to_representation(self, instance):
        """Garante que nenhum erro na serialização resulte em 500."""
        try:
            data = super().to_representation(instance)
            if not isinstance(data, dict):
                return data
            # Garantir que campos críticos existam mesmo se algo falhou no meio
            data.setdefault("author_name", "Equipe Nexus")
            data.setdefault("cover_image_url", None)
            data.setdefault("category_name", None)
            return data
        except Exception:
            # Fallback mínimo para nunca retornar 500
            return {
                "id": getattr(instance, "id", None),
                "title": getattr(instance, "title", ""),
                "slug": getattr(instance, "slug", ""),
                "excerpt": getattr(instance, "excerpt", "") or "",
                "content": getattr(instance, "content", "") or "",
                "cover_image_url": None,
                "author_name": "Equipe Nexus",
                "published_at": None,
                "category_name": None,
                "meta_title": getattr(instance, "meta_title", "") or "",
                "meta_description": getattr(instance, "meta_description", "") or "",
                "keywords": getattr(instance, "keywords", "") or "",
                "focus_keyword": getattr(instance, "focus_keyword", "") or "",
                "is_published": getattr(instance, "is_published", False),
                "created_at": None,
                "updated_at": None,
            }


class PostListSerializer(serializers.ModelSerializer):
    """
    Serializer para listagem. Defensive: imagem e categoria nunca quebram.
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
        try:
            return _safe_category_name(obj)
        except Exception:
            return None

    def get_cover_image_url(self, obj) -> str | None:
        try:
            return _safe_cover_image_url(obj, self.context)
        except Exception:
            return None

    def to_representation(self, instance):
        try:
            data = super().to_representation(instance)
            data.setdefault("cover_image_url", None)
            data.setdefault("category_name", None)
            return data
        except Exception:
            return {
                "id": getattr(instance, "id", None),
                "title": getattr(instance, "title", ""),
                "slug": getattr(instance, "slug", ""),
                "excerpt": getattr(instance, "excerpt", "") or "",
                "cover_image_url": None,
                "category_name": None,
                "published_at": None,
                "created_at": None,
            }

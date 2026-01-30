from rest_framework import serializers
from .models import Post, Category


class PostSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "content",
            "excerpt",
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

    def get_author_name(self, obj):
        if not obj.author:
            return "Equipe Nexus"

        # Tenta pegar nome completo se existir método, senão tenta username, senão email
        try:
            if hasattr(obj.author, "get_full_name"):
                name = obj.author.get_full_name()
                if name:
                    return name

            # Fallback seguro: usa username ou email (User customizado pode não ter first_name/last_name)
            return getattr(obj.author, "username", getattr(obj.author, "email", "Equipe Nexus"))
        except Exception:
            return "Equipe Nexus"

    def get_category_name(self, obj):
        # BLINDAGEM: category pode ser None (ForeignKey null)
        try:
            if obj.category:
                return getattr(obj.category, "name", None)
        except Exception:
            pass
        return None

    def get_cover_image_url(self, obj):
        # BLINDAGEM: Se a imagem não existir, retorna None em vez de travar
        try:
            if obj.cover_image:
                request = self.context.get("request")
                if request and hasattr(request, "build_absolute_uri"):
                    return request.build_absolute_uri(obj.cover_image.url)
                return getattr(obj.cover_image, "url", None)
        except Exception:
            pass
        return None


class PostListSerializer(serializers.ModelSerializer):
    """Serializer para listagem (slug obrigatório para o link)."""
    category_name = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()

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
        try:
            if obj.category:
                return getattr(obj.category, "name", None)
        except Exception:
            pass
        return None

    def get_cover_image_url(self, obj):
        try:
            if obj.cover_image:
                request = self.context.get("request")
                if request and hasattr(request, "build_absolute_uri"):
                    return request.build_absolute_uri(obj.cover_image.url)
                return getattr(obj.cover_image, "url", None)
        except Exception:
            pass
        return None

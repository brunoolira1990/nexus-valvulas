from rest_framework import serializers
from .models import Category, Post


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name", "slug"]


class PostSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    category_slug = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "author",
            "author_name",
            "category",
            "category_name",
            "category_slug",
            "content",
            "excerpt",
            "cover_image",
            "cover_image_url",
            "meta_title",
            "meta_description",
            "keywords",
            "focus_keyword",
            "is_published",
            "published_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["published_at", "created_at", "updated_at"]

    def get_author_name(self, obj):
        if not obj.author:
            return None
        name = f"{obj.author.first_name or ''} {obj.author.last_name or ''}".strip()
        return name or "Equipe Nexus"

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_category_slug(self, obj):
        return obj.category.slug if obj.category else None

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None


class PostListSerializer(serializers.ModelSerializer):
    cover_image_url = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()
    category_slug = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "cover_image_url",
            "category",
            "category_name",
            "category_slug",
            "is_published",
            "published_at",
            "created_at",
        ]

    def get_category_name(self, obj):
        return obj.category.name if obj.category else None

    def get_category_slug(self, obj):
        return obj.category.slug if obj.category else None

    def get_cover_image_url(self, obj):
        if obj.cover_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.cover_image.url)
            return obj.cover_image.url
        return None

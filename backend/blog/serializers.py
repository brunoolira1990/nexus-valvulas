from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    """Serializer para Post."""
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'content', 'excerpt',
            'cover_image', 'published', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at']


class PostListSerializer(serializers.ModelSerializer):
    """Serializer simplificado para listagem de posts."""
    
    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'excerpt',
            'cover_image', 'created_at'
        ]

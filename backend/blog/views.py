from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404

from .models import Post
from .serializers import PostSerializer, PostListSerializer


class PostViewSet(viewsets.ModelViewSet):
    """ViewSet para gerenciar posts do blog."""
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'slug'
    permission_classes = [AllowAny]

    def get_permissions(self):
        """Permissões: público para leitura, autenticado para escrita."""
        if self.action in ['create', 'update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        """Filtra posts publicados para usuários não autenticados."""
        queryset = super().get_queryset()
        
        # Se não for admin, mostra apenas posts publicados
        if not self.request.user.is_authenticated or not self.request.user.is_staff:
            queryset = queryset.filter(published=True)
        
        return queryset

    def get_serializer_class(self):
        """Usa serializer simplificado para listagem."""
        if self.action == 'list':
            return PostListSerializer
        return PostSerializer

    def retrieve(self, request, slug=None):
        """Retorna post por slug."""
        queryset = self.get_queryset()
        post = get_object_or_404(queryset, slug=slug)
        serializer = self.get_serializer(post)
        return Response(serializer.data)

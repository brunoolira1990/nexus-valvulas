from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils import timezone
from .models import Post
from .serializers import PostSerializer, PostListSerializer


class PostViewSet(viewsets.ModelViewSet):
    """
    ViewSet para posts do blog
    GET /api/blog/posts/ - Lista posts publicados
    GET /api/blog/posts/{slug}/ - Detalhes de um post
    POST /api/blog/posts/ - Criar post (autenticado)
    PUT /api/blog/posts/{slug}/ - Atualizar post (autenticado)
    DELETE /api/blog/posts/{slug}/ - Deletar post (autenticado)
    """
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    lookup_field = 'slug'
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_permissions(self):
        """Permissões: público para leitura, autenticado para escrita."""
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        """
        Filtra posts publicados apenas para usuários anônimos.
        Usuários autenticados (admin via painel) enxergam todos os posts,
        incluindo rascunhos.
        """
        queryset = super().get_queryset()
        if not self.request.user.is_authenticated:
            queryset = queryset.filter(is_published=True)
        return queryset

    def get_serializer_class(self):
        """Usa serializer simplificado para listagem."""
        if self.action == 'list':
            return PostListSerializer
        return PostSerializer

    def perform_create(self, serializer):
        """Define published_at ao criar se is_published=True."""
        post = serializer.save()
        if post.is_published and not post.published_at:
            post.published_at = timezone.now()
            post.save()

    def perform_update(self, serializer):
        """Define published_at ao atualizar se is_published=True."""
        post = serializer.save()
        if post.is_published and not post.published_at:
            post.published_at = timezone.now()
            post.save()

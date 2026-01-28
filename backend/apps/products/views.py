from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.shortcuts import get_object_or_404
from .models import Category, Product, ProductVariant, ProductSize
from .serializers import (
    CategorySerializer,
    CategoryWithProductsSerializer,
    ProductSerializer,
    ProductVariantSerializer,
    ProductSizeSerializer,
)


class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet para categorias
    GET /api/products/categories/ - Lista todas as categorias (público)
    POST /api/products/categories/ - Cria categoria (admin)
    GET /api/products/categories/{slug}/ - Detalhes de uma categoria (público)
    PUT /api/products/categories/{slug}/ - Atualiza categoria (admin)
    DELETE /api/products/categories/{slug}/ - Deleta categoria (admin)
    POST /api/products/categories/{slug}/image/ - Upload de imagem (admin)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    lookup_field = 'slug'
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_permissions(self):
        """
        Permite leitura pública, mas requer autenticação para escrita
        """
        if self.action in ['list', 'retrieve', 'products']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Para listagem pública, mostra apenas categorias ativas
        Para admins, mostra todas
        """
        if self.action == 'list' and not self.request.user.is_authenticated:
            return Category.objects.filter(is_active=True)
        return Category.objects.all()

    @action(detail=True, methods=['get'], url_path='products')
    def products(self, request, slug=None):
        """Retorna produtos de uma categoria"""
        category = self.get_object()
        products = category.products.filter(is_active=True)
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='image')
    def upload_image(self, request, slug=None):
        """Upload de imagem para categoria"""
        category = self.get_object()
        if 'image' not in request.FILES:
            return Response(
                {'error': 'Imagem não fornecida'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        category.image = request.FILES['image']
        category.save()
        
        serializer = self.get_serializer(category)
        return Response(serializer.data, status=status.HTTP_200_OK)


class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet para produtos
    GET /api/products/products/ - Lista todos os produtos (público)
    POST /api/products/products/ - Cria produto (admin)
    GET /api/products/products/{slug}/ - Detalhes de um produto (público)
    PUT /api/products/products/{slug}/ - Atualiza produto (admin)
    DELETE /api/products/products/{slug}/ - Deleta produto (admin)
    POST /api/products/products/{slug}/variants/ - Cria variante (admin)
    POST /api/products/products/{slug}/sizes/ - Cria tamanho direto (admin)
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_permissions(self):
        """
        Permite leitura pública, mas requer autenticação para escrita
        """
        if self.action in ['list', 'retrieve', 'by_category']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Para listagem pública, mostra apenas produtos ativos
        Para admins, mostra todos
        """
        queryset = super().get_queryset()
        
        # Filtrar por categoria se fornecido
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Para listagem pública, mostrar apenas ativos
        if self.action == 'list' and not self.request.user.is_authenticated:
            queryset = queryset.filter(is_active=True)
        
        return queryset.select_related('category').prefetch_related(
            'variants__sizes',
            'sizes'
        )

    @action(detail=False, methods=['get'], url_path='by-category/(?P<category_slug>[^/.]+)')
    def by_category(self, request, category_slug=None):
        """Retorna produtos de uma categoria específica"""
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        products = self.get_queryset().filter(category=category, is_active=True)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='variants')
    def create_variant(self, request, slug=None):
        """Cria uma variante para o produto"""
        from .models import ProductVariant
        from .serializers import ProductVariantSerializer
        
        product = self.get_object()
        
        variant_data = {
            'product': product.id,
            'name': request.data.get('name'),
            'description': request.data.get('description', ''),
        }
        
        serializer = ProductVariantSerializer(data=variant_data, context={'request': request})
        if serializer.is_valid():
            variant = serializer.save()
            
            # Upload de imagem da variante se fornecido
            if 'image' in request.FILES:
                variant.image = request.FILES['image']
                variant.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='sizes')
    def create_size(self, request, slug=None):
        """Cria um tamanho direto do produto (sem variante)"""
        from .models import ProductSize
        from .serializers import ProductSizeSerializer
        
        product = self.get_object()
        
        if 'image' not in request.FILES:
            return Response(
                {'error': 'Imagem é obrigatória'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        size_data = {
            'product': product.id,
            'variant': None,  # Tamanho direto do produto
            'size_label': request.data.get('size_label'),
            'image': request.FILES['image'],
        }
        
        serializer = ProductSizeSerializer(data=size_data, context={'request': request})
        if serializer.is_valid():
            size = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductVariantViewSet(viewsets.ModelViewSet):
    """
    ViewSet para variantes de produtos
    - GET /api/products/variants/            (lista todas as variantes)
    - GET /api/products/variants/{id}/       (detalhe)
    - POST /api/products/variants/           (cria variante)
    - PUT/PATCH /api/products/variants/{id}/ (atualiza)
    - DELETE /api/products/variants/{id}/    (remove)
    - POST /api/products/variants/{id}/sizes/ (cria tamanho para a variante)
    """

    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @action(detail=True, methods=['post'], url_path='sizes')
    def create_size(self, request, id=None):
        """Cria um tamanho para a variante"""
        variant = self.get_object()

        if 'image' not in request.FILES:
            return Response(
                {'error': 'Imagem é obrigatória'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        size_data = {
            'product': None,  # Tamanho da variante, não do produto
            'variant': variant.id,
            'size_label': request.data.get('size_label'),
            'image': request.FILES['image'],
        }

        serializer = ProductSizeSerializer(data=size_data, context={'request': request})
        if serializer.is_valid():
            size = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductSizeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para tamanhos de produtos e variantes
    - CRUD completo em /api/products/sizes/{id}/
    """

    queryset = ProductSize.objects.all()
    serializer_class = ProductSizeSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'



class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet para produtos
    GET /api/products/products/ - Lista todos os produtos (público)
    POST /api/products/products/ - Cria produto (admin)
    GET /api/products/products/{slug}/ - Detalhes de um produto (público)
    PUT /api/products/products/{slug}/ - Atualiza produto (admin)
    DELETE /api/products/products/{slug}/ - Deleta produto (admin)
    POST /api/products/products/{slug}/variants/ - Cria variante (admin)
    POST /api/products/products/{slug}/sizes/ - Cria tamanho direto (admin)
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_permissions(self):
        """
        Permite leitura pública, mas requer autenticação para escrita
        """
        if self.action in ['list', 'retrieve', 'by_category']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Para listagem pública, mostra apenas produtos ativos
        Para admins, mostra todos
        """
        queryset = super().get_queryset()
        
        # Filtrar por categoria se fornecido
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Para listagem pública, mostrar apenas ativos
        if self.action == 'list' and not self.request.user.is_authenticated:
            queryset = queryset.filter(is_active=True)
        
        return queryset.select_related('category').prefetch_related(
            'variants__sizes',
            'sizes'
        )

    @action(detail=False, methods=['get'], url_path='by-category/(?P<category_slug>[^/.]+)')
    def by_category(self, request, category_slug=None):
        """Retorna produtos de uma categoria específica"""
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        products = self.get_queryset().filter(category=category, is_active=True)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='variants')
    def create_variant(self, request, slug=None):
        """Cria uma variante para o produto"""
        from .models import ProductVariant
        from .serializers import ProductVariantSerializer
        
        product = self.get_object()
        
        variant_data = {
            'product': product.id,
            'name': request.data.get('name'),
            'description': request.data.get('description', ''),
        }
        
        serializer = ProductVariantSerializer(data=variant_data, context={'request': request})
        if serializer.is_valid():
            variant = serializer.save()
            
            # Upload de imagem da variante se fornecido
            if 'image' in request.FILES:
                variant.image = request.FILES['image']
                variant.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='sizes')
    def create_size(self, request, slug=None):
        """Cria um tamanho direto do produto (sem variante)"""
        from .models import ProductSize
        from .serializers import ProductSizeSerializer
        
        product = self.get_object()
        
        if 'image' not in request.FILES:
            return Response(
                {'error': 'Imagem é obrigatória'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        size_data = {
            'product': product.id,
            'variant': None,  # Tamanho direto do produto
            'size_label': request.data.get('size_label'),
            'image': request.FILES['image'],
        }
        
        serializer = ProductSizeSerializer(data=size_data, context={'request': request})
        if serializer.is_valid():
            size = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductVariantViewSet(viewsets.ModelViewSet):
    """
    ViewSet para variantes de produtos
    - GET /api/products/variants/            (lista todas as variantes)
    - GET /api/products/variants/{id}/       (detalhe)
    - POST /api/products/variants/           (cria variante)
    - PUT/PATCH /api/products/variants/{id}/ (atualiza)
    - DELETE /api/products/variants/{id}/    (remove)
    - POST /api/products/variants/{id}/sizes/ (cria tamanho para a variante)
    """

    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @action(detail=True, methods=['post'], url_path='sizes')
    def create_size(self, request, id=None):
        """Cria um tamanho para a variante"""
        variant = self.get_object()

        if 'image' not in request.FILES:
            return Response(
                {'error': 'Imagem é obrigatória'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        size_data = {
            'product': None,  # Tamanho da variante, não do produto
            'variant': variant.id,
            'size_label': request.data.get('size_label'),
            'image': request.FILES['image'],
        }

        serializer = ProductSizeSerializer(data=size_data, context={'request': request})
        if serializer.is_valid():
            size = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductSizeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para tamanhos de produtos e variantes
    - CRUD completo em /api/products/sizes/{id}/
    """

    queryset = ProductSize.objects.all()
    serializer_class = ProductSizeSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'



class ProductViewSet(viewsets.ModelViewSet):
    """
    ViewSet para produtos
    GET /api/products/products/ - Lista todos os produtos (público)
    POST /api/products/products/ - Cria produto (admin)
    GET /api/products/products/{slug}/ - Detalhes de um produto (público)
    PUT /api/products/products/{slug}/ - Atualiza produto (admin)
    DELETE /api/products/products/{slug}/ - Deleta produto (admin)
    POST /api/products/products/{slug}/variants/ - Cria variante (admin)
    POST /api/products/products/{slug}/sizes/ - Cria tamanho direto (admin)
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    lookup_field = 'slug'
    parser_classes = [JSONParser, MultiPartParser, FormParser]

    def get_permissions(self):
        """
        Permite leitura pública, mas requer autenticação para escrita
        """
        if self.action in ['list', 'retrieve', 'by_category']:
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_queryset(self):
        """
        Para listagem pública, mostra apenas produtos ativos
        Para admins, mostra todos
        """
        queryset = super().get_queryset()
        
        # Filtrar por categoria se fornecido
        category_slug = self.request.query_params.get('category', None)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Para listagem pública, mostrar apenas ativos
        if self.action == 'list' and not self.request.user.is_authenticated:
            queryset = queryset.filter(is_active=True)
        
        return queryset.select_related('category').prefetch_related(
            'variants__sizes',
            'sizes'
        )

    @action(detail=False, methods=['get'], url_path='by-category/(?P<category_slug>[^/.]+)')
    def by_category(self, request, category_slug=None):
        """Retorna produtos de uma categoria específica"""
        category = get_object_or_404(Category, slug=category_slug, is_active=True)
        products = self.get_queryset().filter(category=category, is_active=True)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], url_path='variants')
    def create_variant(self, request, slug=None):
        """Cria uma variante para o produto"""
        from .models import ProductVariant
        from .serializers import ProductVariantSerializer
        
        product = self.get_object()
        
        variant_data = {
            'product': product.id,
            'name': request.data.get('name'),
            'description': request.data.get('description', ''),
        }
        
        serializer = ProductVariantSerializer(data=variant_data, context={'request': request})
        if serializer.is_valid():
            variant = serializer.save()
            
            # Upload de imagem da variante se fornecido
            if 'image' in request.FILES:
                variant.image = request.FILES['image']
                variant.save()
            
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], url_path='sizes')
    def create_size(self, request, slug=None):
        """Cria um tamanho direto do produto (sem variante)"""
        from .models import ProductSize
        from .serializers import ProductSizeSerializer
        
        product = self.get_object()
        
        if 'image' not in request.FILES:
            return Response(
                {'error': 'Imagem é obrigatória'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        size_data = {
            'product': product.id,
            'variant': None,  # Tamanho direto do produto
            'size_label': request.data.get('size_label'),
            'image': request.FILES['image'],
        }
        
        serializer = ProductSizeSerializer(data=size_data, context={'request': request})
        if serializer.is_valid():
            size = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductVariantViewSet(viewsets.ModelViewSet):
    """
    ViewSet para variantes de produtos
    - GET /api/products/variants/            (lista todas as variantes)
    - GET /api/products/variants/{id}/       (detalhe)
    - POST /api/products/variants/           (cria variante)
    - PUT/PATCH /api/products/variants/{id}/ (atualiza)
    - DELETE /api/products/variants/{id}/    (remove)
    - POST /api/products/variants/{id}/sizes/ (cria tamanho para a variante)
    """

    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'

    @action(detail=True, methods=['post'], url_path='sizes')
    def create_size(self, request, id=None):
        """Cria um tamanho para a variante"""
        variant = self.get_object()

        if 'image' not in request.FILES:
            return Response(
                {'error': 'Imagem é obrigatória'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        size_data = {
            'product': None,  # Tamanho da variante, não do produto
            'variant': variant.id,
            'size_label': request.data.get('size_label'),
            'image': request.FILES['image'],
        }

        serializer = ProductSizeSerializer(data=size_data, context={'request': request})
        if serializer.is_valid():
            size = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductSizeViewSet(viewsets.ModelViewSet):
    """
    ViewSet para tamanhos de produtos e variantes
    - CRUD completo em /api/products/sizes/{id}/
    """

    queryset = ProductSize.objects.all()
    serializer_class = ProductSizeSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'id'


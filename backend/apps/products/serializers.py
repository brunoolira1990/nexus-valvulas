from rest_framework import serializers
from .models import Category, Product, ProductVariant, ProductSize


class ProductSizeSerializer(serializers.ModelSerializer):
    """Serializer para tamanhos - permite criação e retorna size_label e URL da imagem"""
    image_url = serializers.SerializerMethodField()
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), required=False, allow_null=True)
    variant = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all(), required=False, allow_null=True)
    
    class Meta:
        model = ProductSize
        fields = ['id', 'size_label', 'image', 'image_url', 'product', 'variant', 'order']
        read_only_fields = ['id', 'image_url']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProductVariantSerializer(serializers.ModelSerializer):
    """Serializer para variantes com seus tamanhos aninhados"""
    sizes = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all())
    image = serializers.ImageField(required=False, allow_null=True)
    # Lista completa de tamanhos com IDs (para painel admin)
    sizes_detail = ProductSizeSerializer(many=True, read_only=True, source='sizes')
    
    class Meta:
        model = ProductVariant
        fields = ['id', 'name', 'description', 'image', 'image_url', 'product', 'order', 'sizes', 'sizes_detail']
        read_only_fields = ['id', 'image_url', 'sizes', 'sizes_detail']
    
    def get_sizes(self, obj):
        """Retorna sizes como Record/Dict: { "1/2": "url", "1": "url" }"""
        sizes = obj.sizes.all().order_by('order', 'size_label')
        return {
            size.size_label: self._get_image_url(size)
            for size in sizes
        }
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def _get_image_url(self, size_obj):
        """Helper para obter URL da imagem do tamanho"""
        if size_obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(size_obj.image.url)
            return size_obj.image.url
        return None


class ProductSerializer(serializers.ModelSerializer):
    """Serializer principal do produto - formata conforme o frontend espera"""
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_slug = serializers.CharField(source='category.slug', read_only=True)
    image_url = serializers.SerializerMethodField()
    variants = ProductVariantSerializer(many=True, read_only=True)
    sizes = serializers.SerializerMethodField()
    # Lista completa de tamanhos com IDs (para painel admin)
    sizes_detail = ProductSizeSerializer(many=True, read_only=True, source='sizes')
    product_type = serializers.SerializerMethodField()
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())
    slug = serializers.SlugField(required=False, allow_blank=True)
    image = serializers.ImageField(required=False, allow_null=True)
    description = serializers.CharField(required=False, allow_blank=True)
    specifications = serializers.JSONField(required=False, allow_null=True)
    
    class Meta:
        model = Product
        fields = [
            'id',
            'title',
            'slug',
            'description',
            'image',
            'image_url',
            'category',
            'category_name',
            'category_slug',
            'specifications',
            'applications',
            'standards',
            'variants',
            'sizes',
            'sizes_detail',
            'product_type',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'image_url', 'category_name', 'category_slug', 'variants', 'sizes', 'product_type']
    
    def get_image_url(self, obj):
        """Retorna URL da imagem principal"""
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_sizes(self, obj):
        """
        Retorna sizes como Record/Dict quando produto NÃO tem variantes
        Formato: { "1/2": "url", "1": "url" }
        """
        if obj.has_variants:
            # Se tem variantes, sizes vem dentro das variantes
            return {}
        
        # Sizes diretos do produto (Cenário Intermediário)
        sizes = obj.sizes.filter(variant__isnull=True).order_by('order', 'size_label')
        request = self.context.get('request')
        
        return {
            size.size_label: (
                request.build_absolute_uri(size.image.url) if request and size.image
                else (size.image.url if size.image else None)
            )
            for size in sizes
        }
    
    def get_product_type(self, obj):
        """Retorna o tipo do produto: 'complex', 'intermediate', 'simple'"""
        if obj.has_variants:
            return 'complex'
        elif obj.has_sizes_only:
            return 'intermediate'
        else:
            return 'simple'


class CategorySerializer(serializers.ModelSerializer):
    """Serializer para categorias"""
    image_url = serializers.SerializerMethodField()
    products_count = serializers.SerializerMethodField()
    slug = serializers.SlugField(required=False, allow_blank=True)
    
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'image_url',
            'products_count',
            'is_active',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'image_url', 'products_count']
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None
    
    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()


class CategoryWithProductsSerializer(serializers.ModelSerializer):
    """Serializer de categoria com produtos aninhados"""
    products = ProductSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = [
            'id',
            'name',
            'slug',
            'description',
            'image_url',
            'products',
            'is_active',
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

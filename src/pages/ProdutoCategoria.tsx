import { useParams, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Image as ImageIcon, Loader2 } from "lucide-react";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { getCategoryBySlug, getProducts } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  product_type: 'simple' | 'intermediate' | 'complex';
  variants?: Array<{
    id: number;
    name: string;
    sizes?: Record<string, string>;
  }>;
  sizes?: Record<string, string>;
}

export default function ProdutoCategoria() {
  const { categoria } = useParams<{ categoria: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!categoria) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryData, productsData] = await Promise.all([
          getCategoryBySlug(categoria),
          getProducts(categoria)
        ]);
        setCategory(categoryData);
        setProducts(productsData);
      } catch (err) {
        console.error('Erro ao buscar dados:', err);
        setError('Erro ao carregar dados. Tente novamente mais tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoria]);

  if (!categoria) {
    return <Navigate to="/produtos" replace />;
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando...</span>
        </div>
      </Layout>
    );
  }

  if (error || !category) {
    return <Navigate to="/produtos" replace />;
  }

  // Função auxiliar para obter imagem de exibição do produto
  const getProductDisplayImage = (product: Product): string | undefined => {
    if (product.image_url) return product.image_url;
    if (product.variants && product.variants.length > 0) {
      const firstVariant = product.variants[0];
      if (firstVariant.sizes) {
        const sizes = Object.values(firstVariant.sizes);
        return sizes[0];
      }
    }
    if (product.sizes) {
      const sizes = Object.values(product.sizes);
      return sizes[0];
    }
    return undefined;
  };

  // Função auxiliar para contar variações
  const getProductVariationsCount = (product: Product): number => {
    if (product.product_type === 'complex' && product.variants) {
      return product.variants.reduce((total, variant) => {
        return total + (variant.sizes ? Object.keys(variant.sizes).length : 0);
      }, 0);
    }
    if (product.product_type === 'intermediate' && product.sizes) {
      return Object.keys(product.sizes).length;
    }
    return 0;
  };

  return (
    <Layout>
      <SEO
        title={`${category.name} - Nexus Válvulas | Produtos Industriais`}
        description={category.description || `Explore nossa linha de ${category.name.toLowerCase()}.`}
        keywords={`${category.name.toLowerCase()}, válvulas industriais, produtos industriais`}
      />
      
      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {category.name}
            </h1>
            {category.description && (
              <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </section>
      
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <BreadcrumbStandard 
            items={[
              { label: "Produtos", href: "/produtos" },
              { label: category.name }
            ]}
          />
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              asChild
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Link to="/produtos">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar às Categorias
              </Link>
            </Button>
          </div>
          
          {products.length === 0 ? (
            <ScrollAnimation animation="fade-up">
              <div className="text-center py-12">
                <ImageIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Nenhum produto encontrado</h2>
                <p className="text-muted-foreground">
                  Esta categoria ainda não possui produtos cadastrados.
                </p>
              </div>
            </ScrollAnimation>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, index) => {
                // Usa função auxiliar para obter imagem de exibição
                const displayImage = getProductDisplayImage(product);
                const variationsCount = getProductVariationsCount(product);

                return (
                  <ScrollAnimation 
                    key={product.id} 
                    animation="fade-up" 
                    delay={(index % 3) * 100}
                  >
                    <Link 
                      to={`/produtos/${category.slug}/${product.slug}`}
                      className="block no-underline text-inherit"
                    >
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                        <div className="aspect-video rounded-t-lg overflow-hidden bg-white relative">
                          {displayImage ? (
                            <img
                              src={displayImage}
                              alt={product.title}
                              className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                              onError={(e) => {
                                // Mostra placeholder quando imagem falha
                                const target = e.currentTarget;
                                target.style.display = 'none';
                                const placeholder = target.nextElementSibling as HTMLElement;
                                if (placeholder) {
                                  placeholder.style.display = 'flex';
                                }
                              }}
                            />
                          ) : null}
                          <div 
                            className={`w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center ${displayImage ? 'absolute inset-0' : ''}`}
                            style={{ display: displayImage ? 'none' : 'flex' }}
                          >
                            <ImageIcon className="h-16 w-16 text-primary" />
                          </div>
                        </div>
                        <CardHeader>
                          <CardTitle className="group-hover:text-accent transition-colors">
                            {product.title}
                          </CardTitle>
                          {product.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">
                              {variationsCount > 0 
                                ? `${variationsCount} ${variationsCount === 1 ? 'variação' : 'variações'}` 
                                : 'Disponível'}
                            </Badge>
                            <span className="text-accent hover:text-accent/80 font-medium text-sm">
                              Ver detalhes →
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </ScrollAnimation>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}

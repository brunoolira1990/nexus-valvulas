import { useParams, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts, useCategories } from "@/hooks/useSupabaseData";
import { PageLoader } from "@/components/PageLoader";

const ProdutoCategoria = () => {
  const { categoria } = useParams<{ categoria: string }>();
  const { categories } = useCategories();
  const { products, loading, error } = useProducts(categoria);

  const currentCategory = categories.find(cat => cat.slug === categoria);

  if (loading) {
    return <PageLoader />;
  }

  if (!currentCategory) {
    return <Navigate to="/produtos" replace />;
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Erro ao carregar produtos</h1>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${currentCategory.name} - Nexus Válvulas | Produtos Industriais`}
        description={`Explore nossa linha de ${currentCategory.name.toLowerCase()}. ${currentCategory.description || 'Produtos de alta qualidade para aplicações industriais.'}`}
        keywords={`${currentCategory.name.toLowerCase()}, válvulas industriais, produtos industriais`}
      />
      
      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-16">
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
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentCategory.name}
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              {currentCategory.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Nenhum produto encontrado</h2>
              <p className="text-muted-foreground">
                Esta categoria ainda não possui produtos cadastrados.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((produto) => (
                <Card key={produto.id} className="group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video rounded-t-lg overflow-hidden">
                    {produto.images && produto.images.length > 0 ? (
                      <img
                        src={produto.images[0].url}
                        alt={produto.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                        <Package className="h-16 w-16 text-primary" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="group-hover:text-accent transition-colors">
                      {produto.title}
                    </CardTitle>
                    <CardDescription>
                      {produto.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        Industrial
                      </Badge>
                      <Link 
                        to={`/produtos/${categoria}/${produto.slug}`}
                        className="text-accent hover:text-accent/80 font-medium"
                      >
                        Ver detalhes →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProdutoCategoria;
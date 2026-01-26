import { useParams, Link, Navigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Image as ImageIcon } from "lucide-react";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { getCategoryBySlug, getProductDisplayImage, getProductVariationsCount, type ProductCategory, type ProductType } from "@/mocks/products";

export default function ProdutoCategoria() {
  const { categoria } = useParams<{ categoria: string }>();
  
  if (!categoria) {
    return <Navigate to="/produtos" replace />;
  }

  const category = getCategoryBySlug(categoria);

  if (!category) {
    return <Navigate to="/produtos" replace />;
  }

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
          
          {category.types.length === 0 ? (
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
              {category.types.map((productType, index) => {
                // Usa função auxiliar para obter imagem de exibição
                const displayImage = getProductDisplayImage(productType);

                return (
                  <ScrollAnimation 
                    key={productType.id} 
                    animation="fade-up" 
                    delay={(index % 3) * 100}
                  >
                    <Link 
                      to={`/produtos/${category.slug}/${productType.slug}`}
                      className="block no-underline text-inherit"
                    >
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                        <div className="aspect-video rounded-t-lg overflow-hidden bg-white relative">
                          {displayImage ? (
                            <img
                              src={displayImage}
                              alt={productType.name}
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
                            {productType.name}
                          </CardTitle>
                          {productType.description && (
                            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                              {productType.description}
                            </p>
                          )}
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">
                              {productType.variants 
                                ? `${productType.variants.length} ${productType.variants.length === 1 ? 'tipo' : 'tipos'}` 
                                : productType.sizes 
                                ? `${productType.sizes.length} ${productType.sizes.length === 1 ? 'tamanho' : 'tamanhos'}` 
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

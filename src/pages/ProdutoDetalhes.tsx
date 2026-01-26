import { useParams, Navigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Download, Mail } from "lucide-react";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ProductGallery } from "@/components/products/ProductGallery";
import { VariantSelector } from "@/components/products/VariantSelector";
import { ProductSpecs } from "@/components/products/ProductSpecs";
import { useProductVariants } from "@/hooks/useProductVariants";
import { getProductTypeBySlug, getCategoryBySlug } from "@/mocks/products";

export default function ProdutoDetalhes() {
  const { categoria, produto } = useParams<{ categoria: string; produto: string }>();
  
  if (!categoria || !produto) {
    return <Navigate to="/produtos" replace />;
  }

  const category = getCategoryBySlug(categoria);
  const product = getProductTypeBySlug(categoria, produto);

  if (!category || !product) {
    return <Navigate to="/produtos" replace />;
  }

  const {
    selectedType,
    selectedSize,
    availableImages,
    typeOptions,
    sizeOptions,
    selectedVariant,
    selectedSizeData,
    setSelectedType,
    setSelectedSize,
    hasVariants,
    hasSizesOnly,
  } = useProductVariants(product);

  // Metadados para SEO
  const seoTitle = `${product.name}${selectedSize ? ` ${selectedSize}` : ""} - ${category.name} | Nexus Válvulas`;
  const seoDescription = product.description || `Conheça ${product.name}, parte da linha ${category.name} da Nexus Válvulas.`;
  const seoImage = availableImages[0] || product.image;

  return (
    <Layout>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={`${product.name}, ${category.name}, válvulas industriais, ${selectedType || ""}`}
        image={seoImage}
        canonical={`/produtos/${categoria}/${produto}`}
      />

      {/* Header Section */}
      <section className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {product.name}
            </h1>
            {product.description && (
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-3xl mx-auto">
                {product.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-muted/30 py-3 border-b">
        <div className="container mx-auto px-4">
          <BreadcrumbStandard
            items={[
              { label: "Home", href: "/" },
              { label: "Produtos", href: "/produtos" },
              { label: category.name, href: `/produtos/${category.slug}` },
              { label: product.name },
            ]}
          />
        </div>
      </section>

      {/* Product Details */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Botão Voltar */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/produtos/${category.slug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para {category.name}
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Galeria de Imagens */}
            <div>
              <ProductGallery images={availableImages} productName={product.name} />
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              {/* Título e Categoria */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-sm">
                  {category.name}
                </Badge>
                  {selectedType && (
                    <Badge variant="outline" className="text-sm">
                      {selectedType}
                    </Badge>
                  )}
                  {selectedSize && (
                    <Badge variant="outline" className="text-sm">
                      {selectedSize}
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{product.name}</h2>
                {product.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              <Separator />

              {/* Seletores de Variação */}
              {hasVariants && (
                <VariantSelector
                  label="Material"
                  value={selectedType}
                  options={typeOptions}
                  onChange={setSelectedType}
                  variant="radio"
                />
              )}

              {(hasVariants || hasSizesOnly) && (
                <VariantSelector
                  label="Tamanho"
                  value={selectedSize}
                  options={sizeOptions}
                  onChange={setSelectedSize}
                  variant="radio"
                />
              )}

              {/* Descrição da Variante/Size Selecionada */}
              {(selectedVariant?.description || selectedSizeData?.description) && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      {selectedVariant?.description || selectedSizeData?.description}
                    </p>
                  </CardContent>
                </Card>
              )}

              <Separator />

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex-1" asChild>
                  <Link to="/contato">
                    <Mail className="h-4 w-4 mr-2" />
                    Solicitar Cotação
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="flex-1" asChild>
                  <Link to="/contato">
                    <FileText className="h-4 w-4 mr-2" />
                    Mais Informações
                  </Link>
                </Button>
              </div>

              {/* Tabs de Informações */}
              <Tabs defaultValue="specs" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="specs">Especificações</TabsTrigger>
                  <TabsTrigger value="description">Descrição</TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="mt-4">
                  <ProductSpecs
                    specifications={product.specifications}
                    applications={product.applications}
                    standards={product.standards}
                    selectedVariant={{
                      type: selectedType || undefined,
                      size: selectedSize || undefined,
                    }}
                  />
                </TabsContent>

                <TabsContent value="description" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      {product.description ? (
                        <div className="prose prose-sm max-w-none">
                          <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                            {product.description}
                          </p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground">
                          Descrição detalhada em breve.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Precisa de ajuda para escolher o produto ideal?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe técnica está pronta para auxiliar você na seleção do produto
              mais adequado para sua aplicação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contato">Falar com Especialista</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/blog">Ver Artigos Técnicos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

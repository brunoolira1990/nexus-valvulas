import { useParams, Navigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, Image as ImageIcon } from "lucide-react";
import { useProduct } from "@/hooks/useSupabaseData";
import { PageLoader } from "@/components/PageLoader";
import { useState } from "react";

const ProdutoDetalhes = () => {
  const { categoria, produto } = useParams<{ categoria: string; produto: string }>();
  const { product, variants, loading, error } = useProduct(produto || '');
  const [selectedImage, setSelectedImage] = useState(0);

  if (loading) {
    return <PageLoader />;
  }

  if (error || !product) {
    return <Navigate to="/produtos" replace />;
  }

  const images = product.images || [];
  const pdfs = product.pdfs || [];

  return (
    <Layout>
      <SEO
        title={`${product.title} - Nexus Válvulas | Detalhes do Produto`}
        description={product.description || `Especificações técnicas e detalhes do produto ${product.title}.`}
        keywords={`${product.title}, válvulas industriais, especificações técnicas`}
      />
      
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/produtos" className="text-accent hover:underline">Produtos</Link>
            <span className="text-muted-foreground">/</span>
            <Link to={`/produtos/${categoria}`} className="text-accent hover:underline">
              {product.category?.name}
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground">{product.title}</span>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to={`/produtos/${categoria}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar à Categoria
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {images.length > 0 ? (
                <>
                  <div className="aspect-square rounded-lg overflow-hidden border">
                    <img src={images[selectedImage]} alt={product.title} className="w-full h-full object-cover" />
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedImage(index)}
                          className={`aspect-square rounded border overflow-hidden ${selectedImage === index ? 'ring-2 ring-accent' : ''}`}
                        >
                          <img src={image} alt={`${product.title} - Imagem ${index + 1}`} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-square rounded-lg border bg-muted flex items-center justify-center">
                  <ImageIcon className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
                <Badge variant="secondary" className="mb-4">{product.category?.name}</Badge>
                {product.description && (
                  <p className="text-lg text-muted-foreground">{product.description}</p>
                )}
              </div>

              {pdfs.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold">Downloads</h3>
                  <div className="space-y-2">
                    {pdfs.map((pdf, index) => (
                      <Button key={index} variant="outline" size="sm" asChild className="w-full justify-start">
                        <a href={pdf} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Catálogo Técnico {index + 1}
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {variants.length > 0 && (
            <div className="mt-16">
              <Tabs defaultValue="specifications" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="specifications">Especificações</TabsTrigger>
                  <TabsTrigger value="variants">Variações</TabsTrigger>
                </TabsList>
                
                <TabsContent value="specifications" className="space-y-6">
                  <div className="grid gap-6">
                    {variants.map((variant) => (
                      <Card key={variant.id}>
                        <CardHeader>
                          <CardTitle>{variant.type} {variant.size && `- ${variant.size}`}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {variant.specifications && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              {Object.entries(variant.specifications).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="font-medium">{key}:</span>
                                  <span>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="variants" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {variants.map((variant) => (
                      <Card key={variant.id} className="text-center">
                        <CardHeader>
                          <CardTitle className="text-lg">{variant.type}</CardTitle>
                          {variant.size && <CardDescription>Tamanho: {variant.size}</CardDescription>}
                        </CardHeader>
                        {variant.drawing_url && (
                          <CardContent>
                            <img src={variant.drawing_url} alt={`${variant.type} ${variant.size}`} className="w-full h-32 object-contain" />
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProdutoDetalhes;
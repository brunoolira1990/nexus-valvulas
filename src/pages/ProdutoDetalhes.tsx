import { useParams, Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, FileText, Download, Mail, Loader2 } from "lucide-react";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ProductGallery } from "@/components/products/ProductGallery";
import { VariantSelector } from "@/components/products/VariantSelector";
import { ProductSpecs } from "@/components/products/ProductSpecs";
import { useProductSelection } from "@/hooks/useProductSelection";
import { getProductBySlug, getCategoryBySlug } from "@/lib/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
}

interface ProductVariant {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  sizes?: Record<string, string>;
}

interface Product {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url?: string;
  product_type: "simple" | "intermediate" | "complex";
  variants?: ProductVariant[];
  sizes?: Record<string, string>;
  specifications?: Record<string, string>;
  applications?: string[];
  standards?: string[];
  category_name?: string;
  category_slug?: string;
}

function ProdutoDetalhesContent({
  categoria,
  produtoSlug,
  category,
  product,
}: {
  categoria: string;
  produtoSlug: string;
  category: Category;
  product: Product;
}) {
  // Converter produto da API para o formato esperado pelo hook
  const productForHook: any = {
    id: product.id.toString(),
    title: product.title,
    slug: product.slug,
    description: product.description,
    image: product.image_url,
    variants: product.variants?.map((v) => ({
      id: v.id.toString(),
      name: v.name,
      description: v.description,
      singleImage: v.image_url,
      sizes: v.sizes,
    })),
    sizes: product.sizes,
    specifications: product.specifications,
    applications: product.applications,
    standards: product.standards,
  };

  const {
    selectedVariantId,
    selectedSize,
    currentImage,
    productType,
    availableVariants,
    availableSizes,
    setSelectedVariant,
    setSelectedSize,
    selectedVariant,
    hasVariants,
    hasSizes,
    isSimple,
  } = useProductSelection(productForHook);

  // Preparar opções para os seletores
  const typeOptions = availableVariants.map(v => ({
    value: v.id,
    label: v.name,
    description: v.description
  }));

  const sizeOptions = availableSizes.map(size => ({
    value: size,
    label: size
  }));

  const images = currentImage ? [currentImage] : [];

  // Metadados para SEO
  const seoTitle = `${product.title}${
    selectedSize ? ` ${selectedSize}` : ""
  } - ${category.name} | Nexus Válvulas`;
  const seoDescription =
    product.description ||
    `Conheça ${product.title}, parte da linha ${category.name} da Nexus Válvulas.`;
  const seoImage = currentImage || product.image_url;

  return (
    <Layout>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords={`${product.title}, ${category.name}, válvulas industriais, ${selectedVariant?.name || ""}`}
        image={seoImage}
        canonical={`/produtos/${categoria}/${produtoSlug}`}
      />

      {/* Header Section */}
      <section className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {product.title}
            </h1>
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
              { label: product.title },
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
              <ProductGallery images={images} productName={product.title} />
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              {/* Título e Categoria */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-sm">
                  {category.name}
                </Badge>
                  {selectedVariant && (
                    <Badge variant="outline" className="text-sm">
                      {selectedVariant.name}
                    </Badge>
                  )}
                  {selectedSize && (
                    <Badge variant="outline" className="text-sm">
                      {selectedSize}
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">{product.title}</h2>
              {product.description && (
                  <p className="text-muted-foreground leading-relaxed">
                    {product.description}
                  </p>
                )}
              </div>

              <Separator />

              {/* Seletores de Variação */}
              {hasVariants && (
                <div className="space-y-2">
                  <Label htmlFor="variant-select">Tipo</Label>
                  <Select
                    value={selectedVariantId || ""}
                    onValueChange={(value) => setSelectedVariant(value)}
                  >
                    <SelectTrigger id="variant-select">
                      <SelectValue placeholder="Selecione o tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Só mostra tamanhos se:
                  - produto intermediário (sem variantes), OU
                  - produto complexo com uma variante selecionada */}
              {hasSizes && (!hasVariants || (hasVariants && selectedVariantId)) && (
                <VariantSelector
                  label="Tamanho"
                  value={selectedSize || ""}
                  options={sizeOptions}
                  onChange={setSelectedSize}
                  variant="radio"
                />
              )}

              {/* Descrição da Variante Selecionada */}
              {selectedVariant?.description && (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">
                      {selectedVariant.description}
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

              {/* Especificações */}
              <div className="w-full">
                <ProductSpecs
                  specifications={product.specifications}
                  applications={product.applications}
                  standards={product.standards}
                  selectedVariant={{
                    type: selectedVariant?.name || undefined,
                    size: selectedSize || undefined,
                  }}
                />
              </div>
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

export default function ProdutoDetalhes() {
  const { categoria, produto } = useParams<{ categoria: string; produto: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoria || !produto) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoryData, productData] = await Promise.all([
          getCategoryBySlug(categoria),
          getProductBySlug(produto),
        ]);
        setCategory(categoryData);
        setProduct(productData);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Produto não encontrado.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [categoria, produto]);

  if (!categoria || !produto) {
    return <Navigate to="/produtos" replace />;
  }

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Carregando produto...</span>
        </div>
      </Layout>
    );
  }

  if (error || !category || !product) {
    return <Navigate to="/produtos" replace />;
  }

  return (
    <ProdutoDetalhesContent
      categoria={categoria}
      produtoSlug={produto}
      category={category}
      product={product}
    />
  );
}

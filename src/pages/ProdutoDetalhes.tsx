import { useParams, Navigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Image as ImageIcon } from "lucide-react";
import { useProduct } from "@/hooks/useSupabaseData";
import { PageLoader } from "@/components/PageLoader";
import { useEffect, useMemo, useState } from "react";

const ProdutoDetalhes = () => {
  const { categoria, produto } = useParams<{ categoria: string; produto: string }>();
  const { product, variants, loading, error } = useProduct(produto || '');
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Debug logs (removidos para evitar problemas de performance)

  const images = (product?.images || []).map(img => img.url);
  const pdfs = (product?.pdfs || []).map(pdf => pdf.url);

  const typeOptions = useMemo(() => {
    const unique = Array.from(new Set((variants || []).map(v => v.type)));
    return unique;
  }, [variants]);

  // Helper para converter tamanhos em polegadas (ex: 1/2", 3/4", 1 1/2", 1") para número
  const parseInchesToNumber = (size: string): number => {
    if (!size) return Number.MAX_VALUE;
    const cleaned = size.replace(/\"/g, '"').replace(/"/g, '').trim();
    const parseFraction = (text: string): number => {
      const [num, den] = text.split('/') as [string, string | undefined];
      const n = parseFloat(num);
      const d = den ? parseFloat(den) : 1;
      if (!d || isNaN(n)) return NaN;
      return n / d;
    };
    if (cleaned.includes(' ')) {
      const [whole, frac] = cleaned.split(' ');
      const wholeNum = parseFloat(whole);
      const fracNum = parseFraction(frac || '0/1');
      return (isNaN(wholeNum) ? 0 : wholeNum) + (isNaN(fracNum) ? 0 : fracNum);
    }
    if (cleaned.includes('/')) {
      return parseFraction(cleaned);
    }
    const n = parseFloat(cleaned);
    return isNaN(n) ? Number.MAX_VALUE : n;
  };

  const sizeOptions = useMemo(() => {
    if (!selectedType) return [] as string[];
    const forType = (variants || []).filter(v => v.type === selectedType);
    const unique = Array.from(new Set(forType.map(v => v.size)));
    return unique.sort((a, b) => parseInchesToNumber(a) - parseInchesToNumber(b));
  }, [variants, selectedType]);

  const selectedVariant = useMemo(() => {
    if (!selectedType || !selectedSize) return null as any;
    return (variants || []).find(v => v.type === selectedType && v.size === selectedSize) || null;
  }, [variants, selectedType, selectedSize]);

  useEffect(() => {
    if ((variants || []).length === 0) return;
    // Define seleção inicial apenas uma vez
    if (!selectedType) {
      const firstType = (variants || [])[0]?.type || null;
      setSelectedType(firstType);
    }
  }, [variants]);

  useEffect(() => {
    if (!selectedType) return;
    const sizes = (variants || []).filter(v => v.type === selectedType).map(v => v.size);
    if (sizes.length > 0 && !sizes.includes(selectedSize || '')) {
      // Seleciona o menor tamanho por padrão (após ordenação)
      const sorted = Array.from(new Set(sizes)).sort((a, b) => parseInchesToNumber(a) - parseInchesToNumber(b));
      setSelectedSize(sorted[0]);
    }
  }, [selectedType]);

  return (
    <Layout>
      {loading ? (
        <PageLoader />
      ) : (error || !product) ? (
        <Navigate to="/produtos" replace />
      ) : (
        <>
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

          {/* Seletor de Variantes */}
          {variants && variants.length > 0 && (
            <div className="mb-8 p-6 bg-muted/30 rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Selecione a Variante</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Tipo</label>
                  <Select value={selectedType || undefined} onValueChange={(val) => setSelectedType(val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {typeOptions.map(t => (
                        <SelectItem key={t} value={t}>{t}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Tamanho</label>
                  <div className="flex flex-wrap gap-2">
                    {sizeOptions.length > 0 ? (
                      sizeOptions.map(size => (
                        <Button
                          key={size}
                          type="button"
                          variant={selectedSize === size ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </Button>
                      ))
                    ) : (
                      <span className="text-sm text-muted-foreground">Selecione um tipo para ver os tamanhos</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-4">
              {/* Imagem principal - mostra variante selecionada ou galeria normal */}
              {selectedVariant?.drawing_url ? (
                <div className="aspect-square rounded-lg overflow-hidden border">
                  <img 
                    src={selectedVariant.drawing_url} 
                    alt={`${selectedVariant.type} ${selectedVariant.size}`} 
                    className="w-full h-full object-contain bg-white" 
                  />
                </div>
              ) : images.length > 0 ? (
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
        </div>
      </section>
      </>
      )}
    </Layout>
  );
};
export default ProdutoDetalhes;

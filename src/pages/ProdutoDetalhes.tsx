import { useState, useEffect, useMemo } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Image as ImageIcon } from "lucide-react";
import { PageLoader } from "@/components/PageLoader";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ScrollAnimation } from "@/components/ScrollAnimation";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const ProdutoDetalhes = () => {
  const { categoria, produto } = useParams<{ categoria: string; produto: string }>();
  const [product, setProduct] = useState<any>(null);
  const [variants, setVariants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_BASE}/products/${produto}`);
        if (!res.ok) throw new Error('Erro ao buscar produto');
        const data = await res.json();
        setProduct(data.product || null);
        setVariants(data.variants || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    if (produto) {
      fetchProduct();
    }
  }, [produto]);

  const images = useMemo(() => (product?.images || []).map((img: any) => img.url), [product]);
  const pdfs = useMemo(() => (product?.pdfs || []).map((pdf: any) => pdf.url), [product]);

  const typeOptions = useMemo(() => {
    const unique = Array.from(new Set((variants || []).map((v: any) => v.type)));
    return unique as string[];
  }, [variants]);

  // Helper para converter tamanhos em polegadas para ordenação (suporta "1/2", "1 1/2", "1.1/4", "2 x 3")
  const parseInchesToNumber = (size: string): number => {
    if (!size) return Number.MAX_VALUE;

    // Trata formato "A x B" (ou "A X B"): usa o menor lado para ordenação primária
    if (size.includes('x') || size.includes('X')) {
      const parts = size.split(/x|X/).map(s => s.trim());
      const nums = parts.map(p => parseInchesToNumber(p));
      return Math.min(...nums);
    }

    // Remove aspas/com aspas curvas e espaços desnecessários
    const cleanedRaw = size.replace(/[""''”]/g, '').trim();

    // Normaliza padrões como "1.1/4" para "1 1/4"
    const cleaned = cleanedRaw.replace(/(\d+)\.(\d+)\/(\d+)/g, (_m, a, b, c) => `${a} ${b}/${c}`);

    // Tenta decimal direto (ex: "1.25")
    const directNum = parseFloat(cleaned);
    if (!isNaN(directNum) && !cleaned.includes('/') && !cleaned.includes(' ')) {
      return directNum;
    }

    const parseFraction = (text: string): number => {
      const parts = text.split('/');
      if (parts.length !== 2) return NaN;
      const num = parseFloat(parts[0]);
      const den = parseFloat(parts[1]);
      if (isNaN(num) || isNaN(den) || den === 0) return NaN;
      return num / den;
    };

    // Número misto (ex: "1 1/2")
    if (cleaned.includes(' ')) {
      const parts = cleaned.split(' ');
      if (parts.length === 2) {
        const wholeNum = parseFloat(parts[0]);
        const fracNum = parseFraction(parts[1]);
        if (!isNaN(wholeNum) && !isNaN(fracNum)) {
          return wholeNum + fracNum;
        }
      }
    }

    // Fração simples (ex: "1/2")
    if (cleaned.includes('/') && !cleaned.includes(' ')) {
      const fracNum = parseFraction(cleaned);
      if (!isNaN(fracNum)) return fracNum;
    }

    return Number.MAX_VALUE;
  };

  const sizeOptions = useMemo(() => {
    if (!selectedType) return [] as string[];
    const forType = (variants || []).filter((v: any) => v.type === selectedType);
    // Usa a ordenação por position primariamente, fallback para ordenação numérica
    const sortedVariants = forType.sort((a: any, b: any) => {
      if (a.position && b.position) {
        return a.position - b.position;
      }
      return parseInchesToNumber(a.size) - parseInchesToNumber(b.size);
    });
    return sortedVariants.map((v: any) => v.size);
  }, [variants, selectedType]);

  const selectedVariant = useMemo(() => {
    if (!selectedType || !selectedSize) return null;
    return (variants || []).find((v: any) => v.type === selectedType && v.size === selectedSize) || null;
  }, [variants, selectedType, selectedSize]);

  // Modal simples para "Pedir Cotação"
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: '', email: '', phone: '', message: '' });

  const submitQuote = async () => {
    if (!product) return;
    const payload = {
      productId: product.id,
      variantType: selectedType,
      variantSize: selectedSize,
      name: quoteForm.name,
      email: quoteForm.email,
      phone: quoteForm.phone,
      message: quoteForm.message,
    };
    try {
      const res = await fetch(`${API_BASE}/quotes`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error('Falha ao enviar cotação');
      setQuoteOpen(false);
      setQuoteForm({ name: '', email: '', phone: '', message: '' });
      alert('Cotação enviada com sucesso!');
    } catch (e) {
      alert('Erro ao enviar cotação');
    }
  };

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
    const sizes = (variants || []).filter((v: any) => v.type === selectedType).map((v: any) => v.size);
    if (sizes.length > 0 && !sizes.includes(selectedSize || '')) {
      // Seleciona o menor tamanho por padrão (após ordenação)
      const sorted = Array.from(new Set(sizes)).sort((a, b) => parseInchesToNumber(a) - parseInchesToNumber(b));
      setSelectedSize(sorted[0] as string);
    }
  }, [selectedType, variants, selectedSize]);

  // Função para gerar JSON-LD do produto
  const generateProductSchema = () => {
    if (!product) return null;
    
    return {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.title,
      "description": product.description,
      "category": product.category?.name,
      "offers": {
        "@type": "Offer",
        "availability": "InStock",
        "priceCurrency": "BRL"
      }
    };
  };

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
        description={product.description || `Especificações técnicas e detalhes do produto ${product.title}. Soluções industriais de alta qualidade.`}
        keywords={`${product.title}, válvulas industriais, especificações técnicas, ${product.category?.name || ''}, conexões industriais`}
        canonical={`/produtos/${categoria}/${produto}`}
      />
      
      {/* Schema.org para SEO */}
      <script type="application/ld+json">
        {JSON.stringify(generateProductSchema())}
      </script>
      
      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {product.title}
            </h1>
          </div>
        </div>
      </section>
      
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <BreadcrumbStandard 
            items={[
              { label: "Produtos", href: "/produtos" },
              { label: product.category?.name || "", href: `/produtos/${categoria}` },
              { label: product.title }
            ]}
          />
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
            <ScrollAnimation animation="fade-up" className="mb-8 p-6 bg-muted/30 rounded-lg">
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
            </ScrollAnimation>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollAnimation animation="fade-right" duration={800}>
              <div className="space-y-4">
                {/* Imagem principal - mostra variante selecionada ou galeria normal */}
                {selectedVariant?.drawing_url ? (
                  <div className="aspect-square rounded-lg overflow-hidden border">
                    <img 
                      src={selectedVariant.drawing_url} 
                      alt={`Desenho técnico ${selectedVariant.type} ${selectedVariant.size}`} 
                      className="w-full h-full object-contain bg-white" 
                      loading="lazy"
                    />
                  </div>
                ) : images.length > 0 ? (
                  <>
                    <div className="aspect-square rounded-lg overflow-hidden border">
                      <img src={images[selectedImage]} alt={product.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    {images.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {images.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`aspect-square rounded border overflow-hidden ${selectedImage === index ? 'ring-2 ring-accent' : ''}`}
                            aria-label={`Ver imagem ${index + 1}`}
                          >
                            <img src={image} alt={`${product.title} - Imagem ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
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
            </ScrollAnimation>

            <ScrollAnimation animation="fade-left" duration={800}>
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

                <div className="pt-2">
                  <Button size="sm" onClick={() => setQuoteOpen(true)}>Pedir Cotação</Button>
                </div>
                
                {/* Related Products CTA */}
                <div className="pt-8 border-t">
                  <h3 className="text-lg font-semibold mb-4">Precisa de ajuda na escolha?</h3>
                  <p className="text-muted-foreground mb-4">
                    Nossa equipe técnica pode ajudar você a selecionar o produto ideal para sua aplicação.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link to="/contato">
                      Solicitar Consultoria Técnica
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
      {quoteOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg p-6 w-full max-w-md shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Pedir Cotação</h3>
            <div className="space-y-3">
              <div className="text-sm text-muted-foreground">
                Produto: <span className="text-foreground font-medium">{product.title}</span>
                {selectedType && selectedSize ? (
                  <> — {selectedType} • {selectedSize}</>
                ) : null}
              </div>
              <div>
                <label className="block text-sm mb-1">Nome</label>
                <input className="w-full border rounded px-3 py-2" value={quoteForm.name} onChange={(e) => setQuoteForm(v => ({ ...v, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input type="email" className="w-full border rounded px-3 py-2" value={quoteForm.email} onChange={(e) => setQuoteForm(v => ({ ...v, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Telefone</label>
                <input className="w-full border rounded px-3 py-2" value={quoteForm.phone} onChange={(e) => setQuoteForm(v => ({ ...v, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm mb-1">Mensagem</label>
                <textarea className="w-full border rounded px-3 py-2" rows={4} value={quoteForm.message} onChange={(e) => setQuoteForm(v => ({ ...v, message: e.target.value }))} />
              </div>
            </div>
            <div className="mt-4 flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={() => setQuoteOpen(false)}>Cancelar</Button>
              <Button size="sm" onClick={submitQuote}>Enviar</Button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </Layout>
  );
};
export default ProdutoDetalhes;
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Loader2 } from "lucide-react";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { getCategories } from "@/lib/api";

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image_url?: string;
  products_count?: number;
}

/** Ordem de prioridade das categorias na página de produtos */
const CATEGORY_ORDER: Record<string, number> = {
  "valvulas-industriais": 1,
  tubos: 2,
  conexoes: 3,
  "conexoes-tubulares": 3,
  flanges: 4,
  "combate-a-incendio": 5,
  acessorios: 6,
  diversas: 7,
  diversos: 7,
};

/** Fallback: fotos estáticas por slug quando a API não retorna imagem */
const CATEGORY_IMAGE_FALLBACK: Record<string, string> = {
  "valvulas-industriais": "/imagens/valvulas.png",
  tubos: "/imagens/tubos.png",
  conexoes: "/imagens/conexoes.png",
  "conexoes-tubulares": "/imagens/conexoes.png",
  flanges: "/imagens/flanges.png",
  "combate-a-incendio": "/imagens/incendio.png",
  acessorios: "/imagens/acessorios.png",
  diversas: "/imagens/diversos.png",
  diversos: "/imagens/diversos.png",
};

function sortCategoriesByPriority(cats: Category[]): Category[] {
  return [...cats].sort((a, b) => {
    const orderA = CATEGORY_ORDER[a.slug] ?? 999;
    const orderB = CATEGORY_ORDER[b.slug] ?? 999;
    return orderA - orderB;
  });
}

function getCategoryImage(cat: Category): string | undefined {
  return cat.image_url ?? CATEGORY_IMAGE_FALLBACK[cat.slug];
}

export default function Produtos() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(sortCategoriesByPriority(data));
      } catch (err) {
        console.error("Erro ao buscar categorias:", err);
        setError("Erro ao carregar categorias. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Layout>
      <SEO
        title="Catálogo de Produtos - Nexus Válvulas | Válvulas Industriais"
        description="Explore nosso catálogo completo de válvulas industriais, conexões, flanges e acessórios. Soluções para química, refinarias, siderúrgicas e mais. Qualidade e durabilidade garantidas."
        keywords="válvulas industriais, catálogo produtos, válvulas esfera, válvulas gaveta, válvulas globo, válvulas retenção, conexões industriais, flanges"
        canonical="/produtos"
      />

      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nossos Produtos</h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Oferecemos uma linha completa de válvulas industriais para atender às mais diversas
              necessidades do setor industrial
            </p>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <BreadcrumbStandard items={[{ label: "Home", href: "/" }, { label: "Produtos" }]} />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Carregando categorias...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-16">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Nenhuma categoria encontrada</h2>
              <p className="text-muted-foreground">Ainda não há categorias cadastradas.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((categoria, index) => (
                <ScrollAnimation key={categoria.id} animation="fade-up" delay={index * 100}>
                  <Link
                    to={`/produtos/${categoria.slug}`}
                    className="block no-underline text-inherit"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer h-full overflow-hidden">
                      <div className="aspect-video w-full rounded-t-lg overflow-hidden bg-muted relative">
                        {getCategoryImage(categoria) ? (
                          <img
                            src={getCategoryImage(categoria)}
                            alt={`Imagem da categoria ${categoria.name}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                            onError={e => {
                              const target = e.currentTarget;
                              target.style.display = "none";
                              const placeholder = target.nextElementSibling as HTMLElement;
                              if (placeholder) {
                                placeholder.style.display = "flex";
                              }
                            }}
                          />
                        ) : null}
                        <div
                          className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-100 to-orange-100 flex items-center justify-center"
                          style={{ display: getCategoryImage(categoria) ? "none" : "flex" }}
                        >
                          <Package className="h-16 w-16 text-blue-600" />
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="group-hover:text-accent transition-colors text-orange-600 font-bold">
                          {categoria.name}
                        </CardTitle>
                        {categoria.description && (
                          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                            {categoria.description}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-orange-600 hover:text-orange-700 font-medium">
                            Ver produtos →
                          </span>
                          {categoria.products_count !== undefined && (
                            <Badge variant="secondary">
                              {categoria.products_count}{" "}
                              {categoria.products_count === 1 ? "produto" : "produtos"}
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </ScrollAnimation>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <ScrollAnimation animation="fade-up" className="mt-16 text-center">
            <div className="bg-muted/30 rounded-lg p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Não encontrou o que procurava?</h3>
              <p className="text-muted-foreground mb-6">
                Nossa equipe técnica pode ajudar você a encontrar a solução ideal para sua aplicação
                específica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  variant="default"
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <Link to="/contato">Solicitar Consultoria Técnica</Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 hover:bg-accent hover:text-accent-foreground"
                >
                  <Link to="/blog">Ler Artigos Técnicos</Link>
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </Layout>
  );
}

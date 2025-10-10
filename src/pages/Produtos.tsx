import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, ArrowRight, Package } from "lucide-react";
import { PageLoader } from "@/components/PageLoader";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ScrollAnimation } from "@/components/ScrollAnimation";

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export default function Produtos() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_BASE}/categories`);
        if (!res.ok) throw new Error('Erro ao buscar categorias');
        const data = await res.json();
        setCategories(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Erro ao carregar categorias</h1>
            <p className="text-muted-foreground">{error}</p>
            <div className="mt-6">
              <Link 
                to="/contato" 
                className="text-primary hover:underline font-medium"
              >
                Entre em contato conosco para obter assistência →
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nossos Produtos
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Oferecemos uma linha completa de válvulas industriais para atender às mais diversas 
              necessidades do setor industrial
            </p>
          </div>
        </div>
      </section>
      
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <BreadcrumbStandard 
            items={[
              { label: "Home", href: "/" },
              { label: "Produtos" }
            ]}
          />
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((categoria, index) => (
              <ScrollAnimation 
                key={categoria.id} 
                animation="fade-up" 
                delay={index * 100}
              >
                <Card className="group hover:shadow-lg transition-all duration-300">
                  <div className="aspect-video rounded-t-lg overflow-hidden bg-white">
                    {(categoria as any).image ? (
                      <div className="w-full h-full p-4 flex items-center justify-center">
                        <img 
                          src={(categoria as any).image} 
                          alt={`Imagem da categoria ${categoria.name}`}
                          className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-blue-100 to-orange-100 flex items-center justify-center">
                        <Package className="h-16 w-16 text-blue-600" />
                      </div>
                    )}
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
                      <Link 
                        to={`/produtos/${categoria.slug}`}
                        className="text-orange-600 hover:text-orange-700 font-medium"
                      >
                        Ver produtos →
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
          
          {/* CTA Section */}
          <ScrollAnimation animation="fade-up" className="mt-16 text-center">
            <div className="bg-muted/30 rounded-lg p-8 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Não encontrou o que procurava?</h3>
              <p className="text-muted-foreground mb-6">
                Nossa equipe técnica pode ajudar você a encontrar a solução ideal para sua aplicação específica.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/contato">
                    Solicitar Consultoria Técnica
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/blog">
                    Ler Artigos Técnicos
                  </Link>
                </Button>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </Layout>
  );
};

import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";
import { useCategories } from "@/hooks/useSupabaseData";
import { PageLoader } from "@/components/PageLoader";

const Produtos = () => {
  const { categories, loading, error } = useCategories();

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
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Produtos - Nexus Válvulas | Catálogo Completo de Válvulas Industriais"
        description="Explore nosso catálogo completo de válvulas industriais, conexões, flanges e acessórios. Soluções para química, refinarias, siderúrgicas e mais."
        keywords="válvulas industriais, catálogo produtos, válvulas esfera, válvulas gaveta, válvulas globo, válvulas retenção"
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

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((categoria) => (
              <Card key={categoria.id} className="group hover:shadow-lg transition-all duration-300">
                <div className="aspect-video rounded-t-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Package className="h-16 w-16 text-primary" />
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-accent transition-colors">
                    {categoria.name}
                  </CardTitle>
                  <CardDescription>
                    {categoria.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Link 
                      to={`/produtos/${categoria.slug}`}
                      className="text-accent hover:text-accent/80 font-medium"
                    >
                      Ver produtos →
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Produtos;
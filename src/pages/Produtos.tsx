import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Wrench, Settings, Gauge, Factory, Flame, Droplets } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Produtos = () => {
  const navigate = useNavigate();
  
  const categories = [
    {
      id: "valvulas-industriais",
      title: "Válvulas Industriais",
      description: "Ampla linha de válvulas para controle de fluxo, pressão e temperatura em aplicações industriais.",
      icon: Wrench,
      subcategories: ["Válvula Esfera", "Válvula Borboleta", "Válvula Gaveta", "Válvula Globo", "Válvula Agulha"]
    },
    {
      id: "conexoes",
      title: "Conexões",
      description: "Conexões roscadas e soldadas em diversos materiais para sistemas de tubulação industrial.",
      icon: Settings,
      subcategories: ["Conexões Roscadas", "Conexões Soldadas", "Conexões Forjadas", "Conexões de Aço Inox"]
    },
    {
      id: "flanges",
      title: "Flanges",
      description: "Flanges em aço carbono e inox para união de tubulações em alta pressão e temperatura.",
      icon: Gauge,
      subcategories: ["Flanges Slip-On", "Flanges Weld Neck", "Flanges Blind", "Flanges Socket Weld"]
    },
    {
      id: "tubos",
      title: "Tubos",
      description: "Tubos industriais sem costura e com costura para diversas aplicações e pressões.",
      icon: Factory,
      subcategories: ["Tubos Sem Costura", "Tubos Com Costura", "Tubos de Aço Inox", "Tubos Especiais"]
    },
    {
      id: "acessorios",
      title: "Acessórios",
      description: "Linha completa de acessórios para complementar sistemas de tubulação industrial.",
      icon: Settings,
      subcategories: ["Parafusos e Porcas", "Juntas e Vedações", "Suportes", "Instrumentação"]
    },
    {
      id: "combate-incendio",
      title: "Combate a Incêndio",
      description: "Equipamentos e acessórios especializados para sistemas de combate a incêndio.",
      icon: Flame,
      subcategories: ["Hidrantes", "Válvulas de Governo", "Sprinklers", "Conexões Fire"]
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/produtos/${categoryId}`);
  };

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Nossos Produtos
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
              Oferecemos uma linha completa de válvulas, conexões e acessórios industriais 
              para atender às mais diversas necessidades do setor industrial
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card 
                  key={category.id} 
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-accent"
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardHeader className="text-center">
                    <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors">
                      <IconComponent className="h-10 w-10 text-accent" />
                    </div>
                    <CardTitle className="group-hover:text-accent transition-colors text-xl">
                      {category.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-center text-base">
                      {category.description}
                    </CardDescription>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">Categorias:</h4>
                      <div className="flex flex-wrap gap-2">
                        {category.subcategories.slice(0, 3).map((sub, index) => (
                          <span 
                            key={index} 
                            className="text-xs bg-muted px-2 py-1 rounded-full"
                          >
                            {sub}
                          </span>
                        ))}
                        {category.subcategories.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{category.subcategories.length - 3} mais
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                      variant="outline"
                    >
                      Saiba Mais
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Nossa equipe técnica pode ajudar você a encontrar a solução ideal 
            para sua aplicação específica
          </p>
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={() => navigate('/contato')}
          >
            Entre em Contato
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Produtos;
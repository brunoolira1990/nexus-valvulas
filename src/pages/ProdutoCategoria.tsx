import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight } from "lucide-react";

const ProdutoCategoria = () => {
  const { categoria } = useParams();
  const navigate = useNavigate();

  // Mock data - em um app real, isso viria de uma API ou banco de dados
  const categoryData: Record<string, any> = {
    "valvulas-industriais": {
      title: "Válvulas Industriais",
      description: "Nossa linha completa de válvulas industriais oferece soluções confiáveis para controle de fluxo, pressão e temperatura em aplicações industriais críticas.",
      products: [
        {
          id: "valvula-esfera",
          name: "Válvula Esfera",
          description: "Válvulas esfera bipartidas e tripartidas para aplicações de alta pressão",
          image: "/api/placeholder/300/200",
          applications: ["Petróleo e Gás", "Química", "Água"],
          materials: ["Aço Carbono", "Aço Inox", "Bronze"]
        },
        {
          id: "valvula-borboleta",
          name: "Válvula Borboleta",
          description: "Válvulas borboleta wafer e lug para grandes diâmetros",
          image: "/api/placeholder/300/200",
          applications: ["Saneamento", "HVAC", "Alimentícia"],
          materials: ["Ferro Fundido", "Aço Inox", "PVC"]
        },
        {
          id: "valvula-gaveta",
          name: "Válvula Gaveta",
          description: "Válvulas gaveta para isolamento total de linha",
          image: "/api/placeholder/300/200",
          applications: ["Água", "Óleo", "Vapor"],
          materials: ["Ferro Fundido", "Aço Carbono", "Aço Inox"]
        },
        {
          id: "valvula-globo",
          name: "Válvula Globo",
          description: "Válvulas globo para controle preciso de fluxo",
          image: "/api/placeholder/300/200",
          applications: ["Vapor", "Condensado", "Ar Comprimido"],
          materials: ["Aço Carbono", "Aço Inox", "Bronze"]
        },
        {
          id: "valvula-agulha",
          name: "Válvula Agulha",
          description: "Válvulas agulha para controle fino de pequenos fluxos",
          image: "/api/placeholder/300/200",
          applications: ["Instrumentação", "Teste", "Amostragem"],
          materials: ["Aço Inox", "Monel", "Hasteloy"]
        },
        {
          id: "valvula-retencao",
          name: "Válvula Retenção",
          description: "Válvulas de retenção para prevenção de fluxo reverso",
          image: "/api/placeholder/300/200",
          applications: ["Bombeamento", "Compressores", "Sistemas"],
          materials: ["Ferro Fundido", "Aço Carbono", "Aço Inox"]
        }
      ]
    },
    // Adicionar outros dados de categoria aqui...
  };

  const currentCategory = categoryData[categoria || ""] || {
    title: "Categoria não encontrada",
    description: "",
    products: []
  };

  const handleProductClick = (productId: string) => {
    navigate(`/produtos/${categoria}/${productId}`);
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/produtos')}
            className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Produtos
          </Button>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {currentCategory.title}
            </h1>
            {currentCategory.description && (
              <p className="text-xl text-primary-foreground/80">
                {currentCategory.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {currentCategory.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentCategory.products.map((product) => (
                <Card 
                  key={product.id}
                  className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-accent"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-primary font-semibold">Imagem do Produto</span>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="group-hover:text-accent transition-colors">
                      {product.name}
                    </CardTitle>
                    <CardDescription>
                      {product.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Aplicações:</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.applications.map((app: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {app}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-sm mb-2">Materiais:</h4>
                      <div className="flex flex-wrap gap-1">
                        {product.materials.map((material: string, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <Button 
                      className="w-full group-hover:bg-accent group-hover:text-accent-foreground transition-colors"
                      variant="outline"
                    >
                      Ver Especificações
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">
                Categoria em desenvolvimento
              </h3>
              <p className="text-muted-foreground mb-8">
                Esta categoria de produtos está sendo preparada. Entre em contato para mais informações.
              </p>
              <Button onClick={() => navigate('/contato')}>
                Entre em Contato
              </Button>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ProdutoCategoria;
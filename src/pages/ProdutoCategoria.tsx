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
          image: "/imagens/valvulas-industriais/valvula_esfera.png",
          applications: ["Petróleo e Gás", "Química", "Água"],
          materials: ["Aço Carbono", "Aço Inox", "Bronze"]
        },
        {
          id: "valvula-borboleta",
          name: "Válvula Borboleta",
          description: "Válvulas borboleta wafer e lug para grandes diâmetros",
          image: "/imagens/valvulas-industriais/valvula_borboleta.png",
          applications: ["Saneamento", "HVAC", "Alimentícia"],
          materials: ["Ferro Fundido", "Aço Inox", "PVC"]
        },
        {
          id: "valvula-gaveta",
          name: "Válvula Gaveta",
          description: "Válvulas gaveta para isolamento total de linha",
          image: "/imagens/valvulas-industriais/valvula_gaveta.png",
          applications: ["Água", "Óleo", "Vapor"],
          materials: ["Ferro Fundido", "Aço Carbono", "Aço Inox"]
        },
        {
          id: "valvula-globo",
          name: "Válvula Globo",
          description: "Válvulas globo para controle preciso de fluxo",
          image: "/imagens/valvulas-industriais/valvula_globo.png",
          applications: ["Vapor", "Condensado", "Ar Comprimido"],
          materials: ["Aço Carbono", "Aço Inox", "Bronze"]
        },
        {
          id: "valvula-agulha",
          name: "Válvula Agulha",
          description: "Válvulas agulha para controle fino de pequenos fluxos",
          image: "/imagens/valvulas-industriais/valvula_agulha.png",
          applications: ["Instrumentação", "Teste", "Amostragem"],
          materials: ["Aço Inox", "Monel", "Hasteloy"]
        },
        {
          id: "valvula-retencao",
          name: "Válvula Retenção",
          description: "Válvulas de retenção para prevenção de fluxo reverso",
          image: "/imagens/valvulas-industriais/valvula_retencao.png",
          applications: ["Bombeamento", "Compressores", "Sistemas"],
          materials: ["Ferro Fundido", "Aço Carbono", "Aço Inox"]
        }
      ]
    },
    "flanges": {
      title: "Flanges",
      description: "Nossa linha completa de flanges industriais oferece soluções confiáveis para conexões de tubulações em aplicações industriais críticas, atendendo às principais normas técnicas.",
      products: [
        {
          id: "flange-com-pescoco",
          name: "Flange com Pescoço",
          description: "Flange projetado para transferir tensão para a tubulação, ideal para aplicações de alta pressão",
          image: "/imagens/flanges/flange_pescoco.png",
          applications: ["Petróleo e Gás", "Refinarias", "Petroquímicas"],
          materials: ["Aço Carbono", "Aço Inox", "Aço Liga"]
        },
        {
          id: "flange-roscado",
          name: "Flange Roscado", 
          description: "Flange de fácil montagem com rosca interna, ideal para aplicações de baixa pressão",
          image: "/imagens/flanges/flange_roscado.png",
          applications: ["Saneamento", "Água Industrial", "HVAC"],
          materials: ["Aço Carbono", "Aço Inox", "Ferro Fundido"]
        },
        {
          id: "flange-soquete",
          name: "Flange Soquete",
          description: "Flange soldado por encaixe, utilizado em quaisquer condições de pressão e temperatura",
          image: "/imagens/flanges/flange_soquete.png",
          applications: ["Química", "Petroquímica", "Alimentícia"],
          materials: ["Aço Inox", "Aço Carbono", "Aço Liga"]
        },
        {
          id: "flange-cego",
          name: "Flange Cego",
          description: "Flange sem furo central, usado para vedação de extremidades de tubulações",
          image: "/imagens/flanges/flange_cego.png",
          applications: ["Bloqueio", "Manutenção", "Teste"],
          materials: ["Aço Carbono", "Aço Inox", "Ferro Fundido"]
        },
        {
          id: "flange-lap-joint",
          name: "Flange Lap-Joint",
          description: "Flange solto utilizado com stub-end, permite rotação durante a montagem",
          image: "/imagens/flanges/flange_lap_joint.png",
          applications: ["Sistemas Móveis", "Alinhamento", "Manutenção"],
          materials: ["Aço Carbono", "Aço Inox", "Aço Liga"]
        },
        {
          id: "flange-sobreposto",
          name: "Flange Sobreposto",
          description: "Flange que desliza sobre a tubulação, soldado por solda de filete",
          image: "/imagens/flanges/flange_sobreposto.png",
          applications: ["Baixa Pressão", "Sistemas Temporários", "Reparos"],
          materials: ["Aço Carbono", "Aço Inox", "Ferro Fundido"]
        },
        {
          id: "flange-orificio",
          name: "Flange Orifício",
          description: "Flange com orifício calibrado para medição de vazão, mais utilizado pela indústria",
          image: "/imagens/flanges/flange_orificio.png",
          applications: ["Medição", "Instrumentação", "Controle"],
          materials: ["Aço Inox", "Aço Carbono", "Aço Liga"]
        },
        {
          id: "raquete-figura-8",
          name: "Raquete/Figura 8",
          description: "Flanges empregadas junto às válvulas de bloqueio para isolamento seguro",
          image: "/imagens/flanges/raquete_figura8.png",
          applications: ["Bloqueio", "Isolamento", "Segurança"],
          materials: ["Aço Carbono", "Aço Inox", "Aço Liga"]
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
                    <div className="w-full h-full flex items-center justify-center bg-white rounded-md">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-w-full max-h-full object-contain p-2"
                      />
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
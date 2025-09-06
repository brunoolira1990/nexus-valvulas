import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Download, ShoppingCart, Calculator } from "lucide-react";

interface ProductSpec {
  size: string;
  diameter_mm: number;
  passage_mm: number;
  weight_kg: number;
  length_mm: number;
  height_mm: number;
  drawing_url: string;
}

interface ProductModel {
  id: string;
  name: string;
  description: string;
  specifications: ProductSpec[];
}

const ProdutoDetalhes = () => {
  const { categoria, produto } = useParams();
  const navigate = useNavigate();
  const [selectedModel, setSelectedModel] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Mock data - seria carregado de uma API
  const productData: Record<string, any> = {
    "valvula-esfera": {
      name: "Válvula Esfera",
      category: "Válvulas Industriais",
      image: "/imagens/valvulas-industriais/valvula_esfera.png",
      description: "Válvulas esfera de alta performance para aplicações industriais exigentes. Disponível em configurações bipartidas e tripartidas, com diferentes classes de pressão e materiais.",
      features: [
        "Operação 1/4 de volta",
        "Vedação metal-metal ou soft seat",
        "Baixo torque de operação",
        "Manutenção facilitada",
        "Conformidade com normas API e ASME"
      ],
      applications: [
        "Petróleo e Gás",
        "Refinarias",
        "Petroquímicas",
        "Saneamento",
        "Água Industrial"
      ],
      models: [
        {
          id: "tripartida-300-pr",
          name: "Válvula Esfera Tripartida 300# Passagem Reduzida",
          specifications: [
            { size: '1/2"', drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr12.jpg" },
            { size: '3/4"', drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr34.jpg" },
            { size: '1"', drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr1.jpg" },
            { size: '1.1/4"', drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr114.jpg" },
            { size: '1.1/2"', drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr112.jpg" },
            { size: '2"', drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr2.jpg" },
            { size: '2.1/2"', drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr212.jpg" },
            { size: '3"', drawing_url: "/imagens/valvulas-industriais/esfera/tripartida300pr3.jpg" }
          ]
        }
      ]
    },
    "flange-com-pescoco": {
      name: "Flange com Pescoço",
      category: "Flanges",
      image: "/imagens/flanges/flange_pescoco.png",
      description: "Flanges com pescoço de alta qualidade para aplicações industriais. Disponível em diferentes classes de pressão e materiais, garantindo vedação perfeita e durabilidade.",
      features: [
        "Material de alta qualidade",
        "Conformidade com normas ASME e DIN",
        "Vedação perfeita",
        "Resistente à corrosão",
        "Facilidade de instalação"
      ],
      applications: [
        "Petróleo e Gás",
        "Refinarias", 
        "Petroquímicas",
        "Saneamento",
        "Água Industrial"
      ],
      models: [
        {
          id: "flange-pescoco-150",
          name: "Flange com Pescoço – 150 Libras",
          description: "Flange com pescoço padrão ASME 150 libras para aplicações de baixa pressão",
          specifications: [
            { size: '1/2"', drawing_url: "/imagens/flanges/pescoco/150lb_12.jpg" },
            { size: '3/4"', drawing_url: "/imagens/flanges/pescoco/150lb_34.jpg" },
            { size: '1"', drawing_url: "/imagens/flanges/pescoco/150lb_1.jpg" },
            { size: '1.1/4"', drawing_url: "/imagens/flanges/pescoco/150lb_114.jpg" },
            { size: '1.1/2"', drawing_url: "/imagens/flanges/pescoco/150lb_112.jpg" },
            { size: '2"', drawing_url: "/imagens/flanges/pescoco/150lb_2.jpg" },
            { size: '2.1/2"', drawing_url: "/imagens/flanges/pescoco/150lb_212.jpg" },
            { size: '3"', drawing_url: "/imagens/flanges/pescoco/150lb_3.jpg" },
            { size: '3.1/2"', drawing_url: "/imagens/flanges/pescoco/150lb_312.jpg" },
            { size: '4"', drawing_url: "/imagens/flanges/pescoco/150lb_4.jpg" },
            { size: '5"', drawing_url: "/imagens/flanges/pescoco/150lb_5.jpg" },
            { size: '6"', drawing_url: "/imagens/flanges/pescoco/150lb_6.jpg" },
            { size: '8"', drawing_url: "/imagens/flanges/pescoco/150lb_8.jpg" },
            { size: '10"', drawing_url: "/imagens/flanges/pescoco/150lb_10.jpg" },
            { size: '12"', drawing_url: "/imagens/flanges/pescoco/150lb_12_grande.jpg" },
            { size: '14"', drawing_url: "/imagens/flanges/pescoco/150lb_14.jpg" },
            { size: '16"', drawing_url: "/imagens/flanges/pescoco/150lb_16.jpg" },
            { size: '18"', drawing_url: "/imagens/flanges/pescoco/150lb_18.jpg" },
            { size: '20"', drawing_url: "/imagens/flanges/pescoco/150lb_20.jpg" },
            { size: '24"', drawing_url: "/imagens/flanges/pescoco/150lb_24.jpg" }
          ]
        },
        {
          id: "flange-pescoco-300",
          name: "Flange com Pescoço – 300 Libras",
          description: "Flange com pescoço padrão ASME 300 libras para aplicações de média pressão",
          specifications: [
            { size: '1/2"', drawing_url: "/imagens/flanges/pescoco/300lb_12.jpg" },
            { size: '3/4"', drawing_url: "/imagens/flanges/pescoco/300lb_34.jpg" },
            { size: '1"', drawing_url: "/imagens/flanges/pescoco/300lb_1.jpg" },
            { size: '1.1/4"', drawing_url: "/imagens/flanges/pescoco/300lb_114.jpg" },
            { size: '1.1/2"', drawing_url: "/imagens/flanges/pescoco/300lb_112.jpg" },
            { size: '2"', drawing_url: "/imagens/flanges/pescoco/300lb_2.jpg" },
            { size: '2.1/2"', drawing_url: "/imagens/flanges/pescoco/300lb_212.jpg" },
            { size: '3"', drawing_url: "/imagens/flanges/pescoco/300lb_3.jpg" },
            { size: '3.1/2"', drawing_url: "/imagens/flanges/pescoco/300lb_312.jpg" },
            { size: '4"', drawing_url: "/imagens/flanges/pescoco/300lb_4.jpg" },
            { size: '5"', drawing_url: "/imagens/flanges/pescoco/300lb_5.jpg" },
            { size: '6"', drawing_url: "/imagens/flanges/pescoco/300lb_6.jpg" },
            { size: '8"', drawing_url: "/imagens/flanges/pescoco/300lb_8.jpg" },
            { size: '10"', drawing_url: "/imagens/flanges/pescoco/300lb_10.jpg" },
            { size: '12"', drawing_url: "/imagens/flanges/pescoco/300lb_12_grande.jpg" },
            { size: '14"', drawing_url: "/imagens/flanges/pescoco/300lb_14.jpg" },
            { size: '16"', drawing_url: "/imagens/flanges/pescoco/300lb_16.jpg" },
            { size: '18"', drawing_url: "/imagens/flanges/pescoco/300lb_18.jpg" },
            { size: '20"', drawing_url: "/imagens/flanges/pescoco/300lb_20.jpg" },
            { size: '24"', drawing_url: "/imagens/flanges/pescoco/300lb_24.jpg" }
          ]
        }
      ]
    }
  };

  const currentProduct = productData[produto || ""] || {
    name: "Produto não encontrado",
    models: []
  };

  const selectedModelData = currentProduct.models?.find((m: ProductModel) => m.id === selectedModel);
  const selectedSpec = selectedModelData?.specifications.find((s: ProductSpec) => s.size === selectedSize);

  const handleAddToQuote = () => {
    // Aqui seria implementada a funcionalidade de adicionar ao orçamento
    console.log("Adicionado ao orçamento:", {
      product: currentProduct.name,
      model: selectedModelData?.name,
      size: selectedSize,
      spec: selectedSpec
    });
  };

  return (
    <Layout>
      {/* Header */}
      <section className="bg-primary text-primary-foreground py-8">
        <div className="container mx-auto px-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/produtos/${categoria}`)}
            className="text-primary-foreground hover:text-accent hover:bg-primary-foreground/10 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para {categoria?.replace('-', ' ')}
          </Button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {currentProduct.name}
              </h1>
              <p className="text-primary-foreground/80">
                {currentProduct.category}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Product Info */}
            <div className="space-y-6">
              {/* Product Images */}
              <Card>
                <CardContent className="p-6">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                    <img
                      src={currentProduct.image}
                      alt={currentProduct.name}
                      className="w-full h-full object-contain"
                    />
                  </div>                 
                </CardContent>
              </Card>

              {/* Product Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {currentProduct.description}
                  </p>
                  
                  {currentProduct.features && (
                    <div className="space-y-3">
                      <h4 className="font-semibold">Características:</h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {currentProduct.features.map((feature: string, index: number) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Applications */}
              {currentProduct.applications && (
                <Card>
                  <CardHeader>
                    <CardTitle>Aplicações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {currentProduct.applications.map((app: string, index: number) => (
                        <Badge key={index} variant="outline">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Right Column - Specifications */}
            <div className="space-y-6">
              {/* Model Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>Especificações Técnicas</CardTitle>
                  <CardDescription>
                    Selecione o modelo e tamanho para ver as especificações detalhadas
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Model Selector */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Modelo:</label>
                    <Select value={selectedModel} onValueChange={setSelectedModel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um modelo" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentProduct.models?.map((model: ProductModel) => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Size Selector */}
                  {selectedModelData && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Tamanho:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {selectedModelData.specifications.map((spec: ProductSpec) => (
                          <Button
                            key={spec.size}
                            variant={selectedSize === spec.size ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedSize(spec.size)}
                            className="text-xs"
                          >
                            {spec.size}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Technical Drawing and Specs */}
              {selectedSpec && (
                <Card>
                  <CardHeader className="flex justify-center items-center">
                    <CardTitle className="text-center">
                      {selectedSpec.size}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={selectedSpec.drawing_url}
                        alt={selectedSpec.size}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <Button variant="outline" size="sm" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Desenho (PDF)
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Add to Quote */}
              {selectedSpec && (
                <Card>
                  <CardContent className="p-6">
                    <Button 
                      onClick={handleAddToQuote}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Adicionar ao Orçamento
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProdutoDetalhes;
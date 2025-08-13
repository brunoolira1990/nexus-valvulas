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
          id: "tripartida-300",
          name: "Válvula Esfera Tripartida 300# Passagem Reduzida",
          description: "Válvula esfera tripartida classe 300# com passagem reduzida para aplicações de média pressão",
          specifications: [
            { size: "1/2\"", diameter_mm: 15, passage_mm: 12, weight_kg: 2.5, length_mm: 108, height_mm: 65, drawing_url: "/drawings/esfera-tripartida-300-half.svg" },
            { size: "3/4\"", diameter_mm: 20, passage_mm: 15, weight_kg: 3.2, length_mm: 117, height_mm: 70, drawing_url: "/drawings/esfera-tripartida-300-three-quarter.svg" },
            { size: "1\"", diameter_mm: 25, passage_mm: 20, weight_kg: 4.1, length_mm: 127, height_mm: 75, drawing_url: "/drawings/esfera-tripartida-300-one.svg" },
            { size: "1 1/4\"", diameter_mm: 32, passage_mm: 25, weight_kg: 5.8, length_mm: 140, height_mm: 85, drawing_url: "/drawings/esfera-tripartida-300-one-quarter.svg" },
            { size: "1 1/2\"", diameter_mm: 40, passage_mm: 32, weight_kg: 7.5, length_mm: 165, height_mm: 95, drawing_url: "/drawings/esfera-tripartida-300-one-half.svg" },
            { size: "2\"", diameter_mm: 50, passage_mm: 40, weight_kg: 11.2, length_mm: 178, height_mm: 105, drawing_url: "/drawings/esfera-tripartida-300-two.svg" }
          ]
        },
        {
          id: "tripartida-600",
          name: "Válvula Esfera Tripartida 600# Passagem Plena",
          description: "Válvula esfera tripartida classe 600# com passagem plena para aplicações de alta pressão",
          specifications: [
            { size: "1/2\"", diameter_mm: 15, passage_mm: 15, weight_kg: 3.2, length_mm: 108, height_mm: 70, drawing_url: "/drawings/esfera-tripartida-600-half.svg" },
            { size: "3/4\"", diameter_mm: 20, passage_mm: 20, weight_kg: 4.1, length_mm: 117, height_mm: 75, drawing_url: "/drawings/esfera-tripartida-600-three-quarter.svg" },
            { size: "1\"", diameter_mm: 25, passage_mm: 25, weight_kg: 5.5, length_mm: 127, height_mm: 80, drawing_url: "/drawings/esfera-tripartida-600-one.svg" },
            { size: "1 1/4\"", diameter_mm: 32, passage_mm: 32, weight_kg: 7.8, length_mm: 140, height_mm: 90, drawing_url: "/drawings/esfera-tripartida-600-one-quarter.svg" },
            { size: "1 1/2\"", diameter_mm: 40, passage_mm: 40, weight_kg: 10.2, length_mm: 165, height_mm: 100, drawing_url: "/drawings/esfera-tripartida-600-one-half.svg" },
            { size: "2\"", diameter_mm: 50, passage_mm: 50, weight_kg: 15.8, length_mm: 178, height_mm: 115, drawing_url: "/drawings/esfera-tripartida-600-two.svg" }
          ]
        },
        {
          id: "bipartida-150",
          name: "Válvula Esfera Bipartida 150# Passagem Reduzida",
          description: "Válvula esfera bipartida classe 150# com passagem reduzida para aplicações de baixa pressão",
          specifications: [
            { size: "1/2\"", diameter_mm: 15, passage_mm: 12, weight_kg: 1.8, length_mm: 95, height_mm: 60, drawing_url: "/drawings/esfera-bipartida-150-half.svg" },
            { size: "3/4\"", diameter_mm: 20, passage_mm: 15, weight_kg: 2.3, length_mm: 105, height_mm: 65, drawing_url: "/drawings/esfera-bipartida-150-three-quarter.svg" },
            { size: "1\"", diameter_mm: 25, passage_mm: 20, weight_kg: 3.0, length_mm: 115, height_mm: 70, drawing_url: "/drawings/esfera-bipartida-150-one.svg" },
            { size: "1 1/4\"", diameter_mm: 32, passage_mm: 25, weight_kg: 4.2, length_mm: 127, height_mm: 80, drawing_url: "/drawings/esfera-bipartida-150-one-quarter.svg" },
            { size: "1 1/2\"", diameter_mm: 40, passage_mm: 32, weight_kg: 5.5, length_mm: 152, height_mm: 90, drawing_url: "/drawings/esfera-bipartida-150-one-half.svg" },
            { size: "2\"", diameter_mm: 50, passage_mm: 40, weight_kg: 8.2, length_mm: 165, height_mm: 100, drawing_url: "/drawings/esfera-bipartida-150-two.svg" }
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
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                    <span className="text-muted-foreground">Imagem do Produto</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="aspect-square bg-muted rounded flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">{i}</span>
                      </div>
                    ))}
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

                  {/* Model Description */}
                  {selectedModelData && (
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        {selectedModelData.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Technical Drawing and Specs */}
              {selectedSpec && (
                <Card>
                  <CardHeader>
                    <CardTitle>Desenho Técnico - {selectedSpec.size}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="drawing" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="drawing">Desenho</TabsTrigger>
                        <TabsTrigger value="specs">Especificações</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="drawing" className="space-y-4">
                        <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <Calculator className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                            <p className="text-sm text-muted-foreground">
                              Desenho técnico para {selectedSpec.size}
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="mr-2 h-4 w-4" />
                          Baixar Desenho (PDF)
                        </Button>
                      </TabsContent>
                      
                      <TabsContent value="specs" className="space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Diâmetro:</span>
                              <span className="font-medium">{selectedSpec.diameter_mm} mm</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Passagem:</span>
                              <span className="font-medium">{selectedSpec.passage_mm} mm</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Peso:</span>
                              <span className="font-medium">{selectedSpec.weight_kg} kg</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Comprimento:</span>
                              <span className="font-medium">{selectedSpec.length_mm} mm</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Altura:</span>
                              <span className="font-medium">{selectedSpec.height_mm} mm</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Tamanho:</span>
                              <span className="font-medium">{selectedSpec.size}</span>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
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
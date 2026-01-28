import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ImageIcon, Mail, FileText, ArrowLeft } from "lucide-react";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ProductGallery } from "@/components/products/ProductGallery";
import { ProductSpecs } from "@/components/products/ProductSpecs";
import { 
  sphericalValvesTypes, 
  getValveTypeById, 
  getImageUrl,
  type ValveType 
} from "@/data/sphericalValves";
import { sortSizes } from "@/lib/sizeUtils";
import { cn } from "@/lib/utils";

export default function ValvulasEsfera() {
  // Estado: tipo selecionado (inicia vazio - usuário deve selecionar)
  const [selectedTypeId, setSelectedTypeId] = useState<string>("");
  
  // Estado: tamanho selecionado (default: primeiro tamanho do tipo selecionado)
  const selectedType = useMemo(() => 
    getValveTypeById(selectedTypeId), 
    [selectedTypeId]
  );

  const availableSizes = useMemo(() => {
    if (!selectedType) return [];
    const sizes = Object.keys(selectedType.sizes);
    return sortSizes(sizes); // Ordenar numericamente
  }, [selectedType]);

  const [selectedSize, setSelectedSize] = useState<string>("");

  // Atualizar tamanho quando tipo muda (apenas se houver tipo selecionado)
  useEffect(() => {
    if (selectedTypeId && availableSizes.length > 0) {
      setSelectedSize(availableSizes[0]);
    } else {
      setSelectedSize("");
    }
  }, [selectedTypeId, availableSizes]);

  // Imagem atual baseada na seleção (só mostra se houver tipo e tamanho selecionados)
  const currentImage = useMemo(() => {
    if (selectedTypeId && selectedSize) {
      return getImageUrl(selectedTypeId, selectedSize);
    }
    return undefined;
  }, [selectedTypeId, selectedSize]);

  const images = currentImage ? [currentImage] : [];

  // Metadados para SEO
  const seoTitle = `Válvula de Esfera${selectedType ? ` - ${selectedType.name}` : ""} | Nexus Válvulas`;
  const seoDescription = selectedType?.description || "Válvulas de esfera para controle de fluxo em sistemas industriais. Alta durabilidade e confiabilidade.";

  return (
    <Layout>
      <SEO
        title={seoTitle}
        description={seoDescription}
        keywords="válvula esfera, válvulas industriais, válvulas esfera tripartida, válvulas esfera monobloco, válvulas esfera wafer"
        canonical="/produtos/valvulas-industriais/valvula-esfera"
      />

      {/* Header Section */}
      <section className="bg-gradient-to-b from-primary to-primary/90 text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Válvula de Esfera
            </h1>            
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <section className="bg-muted/30 py-3 border-b">
        <div className="container mx-auto px-4">
          <BreadcrumbStandard
            items={[
              { label: "Home", href: "/" },
              { label: "Produtos", href: "/produtos" },
              { label: "Válvulas Industriais", href: "/produtos/valvulas-industriais" },
              { label: "Válvula de Esfera" },
            ]}
          />
        </div>
      </section>

      {/* Product Details */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Botão Voltar */}
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/produtos/valvulas-industriais">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar para Válvulas Industriais
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Galeria de Imagens - Só mostra se houver imagem */}
            <div>
              {images.length > 0 ? (
                <ProductGallery 
                  images={images} 
                  productName={selectedType?.name || "Válvula de Esfera"} 
                />
              ) : (
                <div className="aspect-square rounded-lg border-2 border-dashed border-muted flex items-center justify-center bg-muted/20">
                  <div className="text-center p-8">
                    <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Selecione um modelo e tamanho para visualizar a imagem
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Informações do Produto */}
            <div className="space-y-6">
              {/* Título e Badges */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-sm">
                    Válvulas Industriais
                  </Badge>
                  {selectedType && (
                    <Badge variant="outline" className="text-sm">
                      {selectedType.name}
                    </Badge>
                  )}
                  {selectedSize && (
                    <Badge variant="outline" className="text-sm">
                      {selectedSize}"
                    </Badge>
                  )}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  Válvula de Esfera
                </h2>
                {/* Descrição do produto no topo */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base mb-6">
                  A válvula esfera deve seu nome ao obturador esférico vazado, que permite a passagem do fluido quando está totalmente aberta e alinhada à tubulação. Quando fechada, o furo do obturador fica perpendicular ao fluxo, bloqueando a passagem. Esta válvula é ideal para situações que requerem abertura ou bloqueio rápido, graças à sua operação ágil. Ela oferece excelente estanqueidade, mesmo em condições de alta pressão, e apresenta uma perda de carga mínima.
                </p>
                {/* Descrição do tipo selecionado (se houver) */}
                {selectedType?.description && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg border-l-4 border-primary">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="font-semibold text-foreground">{selectedType.name}:</span>{" "}
                      {selectedType.description}
                    </p>
                  </div>
                )}
              </div>

              <Separator />

              {/* Seletor de Tipo - Dropdown */}
              <div className="space-y-3">
                <Label htmlFor="type-select" className="text-base font-semibold">
                  Selecione o Modelo/Tipo
                </Label>
                <Select
                  value={selectedTypeId}
                  onValueChange={(value) => {
                    setSelectedTypeId(value);
                    const type = getValveTypeById(value);
                    if (type) {
                      const sizes = sortSizes(Object.keys(type.sizes));
                      setSelectedSize(sizes[0] || "");
                    }
                  }}
                >
                  <SelectTrigger id="type-select" className="w-full h-12 text-base">
                    <SelectValue placeholder="Selecione uma opção..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sphericalValvesTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Seletor de Tamanho - Só aparece quando tipo está selecionado */}
              {selectedTypeId && availableSizes.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Tamanho</Label>
                  <RadioGroup 
                    value={selectedSize} 
                    onValueChange={setSelectedSize}
                  >
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {availableSizes.map((size) => (
                        <div
                          key={size}
                          className={cn(
                            "flex items-center space-x-2 p-3 rounded-lg border-2 transition-all cursor-pointer",
                            selectedSize === size
                              ? "border-primary bg-primary/5"
                              : "border-muted hover:border-primary/50"
                          )}
                          onClick={() => setSelectedSize(size)}
                        >
                          <RadioGroupItem value={size} id={size} />
                          <Label
                            htmlFor={size}
                            className="font-medium cursor-pointer flex-1"
                          >
                            {size}"
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              <Separator />

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="flex-1" asChild>
                  <Link to="/contato">
                    <Mail className="h-4 w-4 mr-2" />
                    Solicitar Cotação
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="flex-1" asChild>
                  <Link to="/contato">
                    <FileText className="h-4 w-4 mr-2" />
                    Mais Informações
                  </Link>
                </Button>
              </div>

              {/* Tabs de Informações */}
              <Tabs defaultValue="specs" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="specs">Especificações</TabsTrigger>
                  <TabsTrigger value="description">Descrição</TabsTrigger>
                </TabsList>

                <TabsContent value="specs" className="mt-4">
                  {/* Configuração Selecionada */}
                  <Card className="mb-4">
                    <CardHeader>
                      <CardTitle className="text-lg">Configuração Selecionada</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {selectedType && (
                        <div className="flex justify-between items-center py-2">
                          <span className="text-sm font-medium text-muted-foreground">Tipo:</span>
                          <span className="text-sm font-semibold">{selectedType.name}</span>
                        </div>
                      )}
                      {selectedSize && (
                        <>
                          {selectedType && <Separator />}
                          <div className="flex justify-between items-center py-2">
                            <span className="text-sm font-medium text-muted-foreground">Tamanho:</span>
                            <span className="text-sm font-semibold">{selectedSize}"</span>
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Especificações Técnicas (exemplo - pode ser expandido) */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Especificações Técnicas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-3">
                        <div className="flex justify-between items-start py-2 border-b last:border-0">
                          <dt className="text-sm font-medium text-muted-foreground pr-4">
                            Pressão Máxima:
                          </dt>
                          <dd className="text-sm font-semibold text-right flex-1">
                            Conforme tipo selecionado
                          </dd>
                        </div>
                        <div className="flex justify-between items-start py-2 border-b last:border-0">
                          <dt className="text-sm font-medium text-muted-foreground pr-4">
                            Temperatura:
                          </dt>
                          <dd className="text-sm font-semibold text-right flex-1">
                            -20°C a 200°C
                          </dd>
                        </div>
                        <div className="flex justify-between items-start py-2 border-b last:border-0">
                          <dt className="text-sm font-medium text-muted-foreground pr-4">
                            Tipo de Conexão:
                          </dt>
                          <dd className="text-sm font-semibold text-right flex-1">
                            Rosqueada / Flangeada
                          </dd>
                        </div>
                        <div className="flex justify-between items-start py-2 border-b last:border-0">
                          <dt className="text-sm font-medium text-muted-foreground pr-4">
                            Vedação:
                          </dt>
                          <dd className="text-sm font-semibold text-right flex-1">
                            Teflon (PTFE)
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="description" className="mt-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
                          {selectedType?.description || 
                            "Válvulas de esfera para controle de fluxo em sistemas industriais. Alta durabilidade e confiabilidade. Ideal para aplicações que exigem controle preciso e vedação hermética."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">
              Precisa de ajuda para escolher o produto ideal?
            </h3>
            <p className="text-muted-foreground mb-6">
              Nossa equipe técnica está pronta para auxiliar você na seleção do produto
              mais adequado para sua aplicação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/contato">Falar com Especialista</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/blog">Ver Artigos Técnicos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}


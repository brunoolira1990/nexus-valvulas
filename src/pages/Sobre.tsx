import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Award, Users, Target, Cog, Factory } from "lucide-react";

const Sobre = () => {
  const values = [
    {
      icon: Shield,
      title: "Qualidade",
      description: "Produtos certificados e testados para garantir máxima segurança e durabilidade em aplicações industriais críticas."
    },
    {
      icon: Clock,
      title: "Atendimento",
      description: "Suporte técnico especializado e atendimento personalizado para cada cliente, garantindo a solução ideal."
    },
    {
      icon: Award,
      title: "Entrega",
      description: "Logística eficiente e prazos cumpridos para manter sua operação funcionando sem interrupções."
    }
  ];

  const certifications = [
    "ISO 9001:2015",
    "API 6D",
    "ASME B16.34",
    "ABNT NBR",
    "CE Marking",
    "PED 2014/68/EU"
  ];

  const statistics = [
    { number: "20+", label: "Anos de Experiência" },
    { number: "500+", label: "Clientes Ativos" },
    { number: "10,000+", label: "Produtos Entregues" },
    { number: "50+", label: "Parceiros Certificados" }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre a Nexus
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Com mais de 20 anos de experiência no mercado, a Nexus é uma das principais 
              fornecedoras de válvulas e conexões industriais no Brasil, oferecendo soluções 
              confiáveis e inovadoras para os mais diversos setores industriais.
            </p>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-accent mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">Nossa História</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Fundada em 2004, a Nexus nasceu da visão de fornecer soluções completas 
                  em válvulas e conexões industriais para o mercado brasileiro. Iniciamos 
                  como uma pequena empresa familiar e crescemos para nos tornar uma das 
                  principais distribuidoras do setor.
                </p>
                <p>
                  Ao longo dos anos, desenvolvemos parcerias estratégicas com os principais 
                  fabricantes mundiais, permitindo-nos oferecer produtos de alta qualidade 
                  com suporte técnico especializado e preços competitivos.
                </p>
                <p>
                  Hoje, atendemos diversos segmentos industriais, desde pequenas empresas 
                  até grandes multinacionais, sempre mantendo nosso compromisso com a 
                  excelência no atendimento e qualidade dos produtos.
                </p>
              </div>
            </div>
            <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center">
                <Factory className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Imagem da empresa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader className="text-center">
                <Target className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Fornecer soluções completas em válvulas e conexões industriais, 
                  garantindo qualidade, segurança e eficiência para nossos clientes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Users className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center">
                  Ser reconhecida como a principal fornecedora de válvulas e conexões 
                  industriais no Brasil, referência em qualidade e inovação.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <Cog className="h-12 w-12 text-accent mx-auto mb-4" />
                <CardTitle>Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-muted-foreground text-center space-y-1">
                  <li>Qualidade e Excelência</li>
                  <li>Integridade e Transparência</li>
                  <li>Inovação Contínua</li>
                  <li>Foco no Cliente</li>
                  <li>Responsabilidade Social</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Our Differentials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossos Diferenciais</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              O que nos torna únicos no mercado de válvulas e conexões industriais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                      <IconComponent className="h-10 w-10 text-accent" />
                    </div>
                    <CardTitle>{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Certificações e Normas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nossos produtos atendem às principais normas e certificações internacionais
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, index) => (
              <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                {cert}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossa Equipe</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Profissionais especializados e experientes para atender suas necessidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Foto</span>
                </div>
                <h3 className="font-semibold mb-2">Equipe Técnica</h3>
                <p className="text-muted-foreground text-sm">
                  Engenheiros especializados em soluções industriais com mais de 15 anos de experiência
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Foto</span>
                </div>
                <h3 className="font-semibold mb-2">Equipe Comercial</h3>
                <p className="text-muted-foreground text-sm">
                  Consultores especializados em identificar as melhores soluções para cada aplicação
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="bg-muted rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-muted-foreground text-sm">Foto</span>
                </div>
                <h3 className="font-semibold mb-2">Suporte Técnico</h3>
                <p className="text-muted-foreground text-sm">
                  Atendimento especializado para suporte pós-venda e assistência técnica
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sobre;
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Award, Users, Target, Cog, Factory } from "lucide-react";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { Link } from "react-router-dom";

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
      <SEO
        title="Sobre a Nexus Válvulas | Nossa História e Valores"
        description="Conheça a história da Nexus Válvulas, empresa com mais de 20 anos de experiência em válvulas industriais. Nossa missão, visão, valores e certificações."
        keywords="sobre nós, história empresa, válvulas industriais, missão, visão, valores, certificações"
        canonical="/sobre"
      />
      
      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre a Nexus
            </h1>
          </div>
        </div>
      </section>
      
      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <BreadcrumbStandard 
            items={[
              { label: "Home", href: "/" },
              { label: "Sobre Nós" }
            ]}
          />
        </div>
      </section>

      {/* Statistics */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {statistics.map((stat, index) => (
              <ScrollAnimation 
                key={index} 
                animation="fade-up" 
                delay={index * 100}
              >
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent mb-2">{stat.number}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollAnimation animation="fade-right" duration={800}>
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
                <div className="pt-4">
                  <Button asChild>
                    <Link to="/produtos">
                      Conheça nossos produtos
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollAnimation>
            <ScrollAnimation animation="fade-left" duration={800}>
              <div className="bg-muted rounded-lg aspect-video overflow-hidden">
                <img
                  src="/imagens/nexus-faixada.png"
                  alt="Fachada da empresa Nexus Válvulas"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ScrollAnimation animation="fade-up">
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
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={200}>
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
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" delay={400}>
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
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Our Differentials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nossos Diferenciais</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              O que nos torna únicos no mercado de válvulas e conexões industriais
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <ScrollAnimation 
                  key={index} 
                  animation="fade-up" 
                  delay={index * 200}
                >
                  <Card className="text-center hover:shadow-lg transition-shadow">
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
                </ScrollAnimation>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <ScrollAnimation animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Certificações e Normas</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Nossos produtos atendem às principais normas e certificações internacionais
            </p>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up">
            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert, index) => (
                <Badge key={index} variant="outline" className="px-4 py-2 text-sm">
                  {cert}
                </Badge>
              ))}
            </div>
          </ScrollAnimation>
          
          {/* CTA Section */}
          <ScrollAnimation animation="fade-up" className="mt-12 text-center">
            <div className="bg-background rounded-lg p-8 max-w-3xl mx-auto border">
              <h3 className="text-2xl font-bold mb-4">Interessado em nossos produtos?</h3>
              <p className="text-muted-foreground mb-6">
                Solicite um orçamento personalizado com nossa equipe técnica especializada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/contato">
                    Solicitar Orçamento
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/produtos">
                    Ver Catálogo Completo
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

export default Sobre;
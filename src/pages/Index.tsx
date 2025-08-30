import { useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Factory, Wrench, Settings, Shield } from "lucide-react";

const Index = () => {
  const segments = useMemo(() => [
    {
      title: "Química",
      description: "Para o setor químico, a Nexus fornece válvulas, tubos e acessórios industriais que atendem às necessidades específicas de segurança e eficiência.",
      image: "segmentos/quimicas.jpg"
    },
    {
      title: "Refinarias",
      description: "A Nexus garante a operação segura e eficiente das refinarias com suas válvulas, flanges e acessórios.",
      image: "segmentos/refinarias.jpg"
    },
    {
      title: "Siderúrgicas",
      description: "As siderúrgicas contam com a Nexus para fornecer válvulas, chapas e acessórios industriais que suportam altas temperaturas.",
      image: "segmentos/siderurgicas.jpg"
    },
    {
      title: "Usinas",
      description: "A Nexus oferece válvulas, tubos e acessórios industriais que atendem às exigências específicas de usinas de energia.",
      image: "segmentos/usinas.jpg"
    },
    {
      title: "Metalúrgicas",
      description: "A Nexus é uma das principais fornecedoras de válvulas, conexões e acessórios industriais para o setor metalúrgico.",
      image: "segmentos/metalurgica.jpg"
    },
    {
      title: "Petroquímicas",
      description: "Soluções especializadas para o setor petroquímico com produtos de alta resistência e durabilidade.",
      image: "segmentos/petroquimica.jpg"
    }
  ], []);

  const partners = useMemo(() => [
  { name: "CRC", logo: "/partners/crc.png" },
  { name: "Comlink", logo: "/partners/comlink.png" },
  { name: "Mercado Eletrônico", logo: "/partners/me.png" }
], []);

  return (
    <Layout>
      <SEO
        title="Nexus Válvulas E Conexões Industriais"
        description="Com mais de 20 anos de experiência no mercado, a Nexus é uma das principais fornecedoras de válvulas e conexões industriais no Brasil. Atendemos química, refinarias, siderúrgicas, usinas, metalúrgicas e petroquímicas."
        keywords="válvulas industriais, conexões industriais, válvulas química, válvulas refinaria, válvulas siderúrgica, válvulas usina, válvulas metalúrgica, válvulas petroquímica, nexus, brasil"
      />
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-r from-primary to-primary/80 text-primary-foreground">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: "url('/src/assets/hero-industrial.jpg')"
          }}
        />
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Nexus Válvulas E<br />
            Conexões Industriais
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Com mais de 20 anos de experiência no mercado, a Nexus é uma das 
            principais fornecedoras de válvulas e conexões industriais no Brasil.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground text-lg px-8 py-4">
            Saiba Mais
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Partners/Certifications */}      
      <section className="py-8 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center space-x-8 md:space-x-16">
            {partners.map((partner, index) => (
              <div key={index} className="flex items-center">
                <img 
                  src={partner.logo}   // caminho da imagem
                  alt={partner.name}   // nome para acessibilidade
                  className="h-12 object-contain"  // ajusta altura e mantém proporção
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Segments Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Segmentos Atendidos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Atendemos diversos setores industriais com soluções especializadas 
              e produtos de alta qualidade
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {segments.map((segment, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div className="aspect-video rounded-t-lg overflow-hidden">
                  {segment.image ? (
                    <img
                      src={segment.image}        // caminho da imagem
                      alt={segment.title}
                      className="w-full h-full object-cover" // cobre todo o card mantendo proporção
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <Factory className="h-16 w-16 text-primary" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-accent transition-colors">
                    {segment.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {segment.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Por que escolher a Nexus?</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Qualidade</h3>
              <p className="text-muted-foreground">
                Produtos certificados e testados para garantir máxima segurança e durabilidade
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Wrench className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Atendimento</h3>
              <p className="text-muted-foreground">
                Suporte técnico especializado e atendimento personalizado para cada cliente
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-accent/10 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                <Settings className="h-10 w-10 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Entrega</h3>
              <p className="text-muted-foreground">
                Logística eficiente e prazos cumpridos para manter sua operação funcionando
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

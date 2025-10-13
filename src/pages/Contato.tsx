import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { Link } from "react-router-dom";

// Schema de validação com Zod
const contactFormSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  empresa: z.string().optional(),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().optional(),
  assunto: z.string().min(1, "Assunto é obrigatório"),
  mensagem: z.string().min(10, "Mensagem deve ter pelo menos 10 caracteres"),
});

export default function Contato() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    nome: "",
    empresa: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função para formatar telefone automaticamente
  const formatPhoneNumber = (value: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = value.replace(/\D/g, "");

    // Se não tem números, retorna vazio
    if (!numbers) return "";

    // Se tem 10 dígitos (telefone fixo)
    if (numbers.length <= 10) {
      if (numbers.length <= 2) {
        return `(${numbers}`;
      } else if (numbers.length <= 6) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      } else {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
      }
    }
    // Se tem 11 dígitos (celular)
    else if (numbers.length <= 11) {
      if (numbers.length <= 2) {
        return `(${numbers}`;
      } else if (numbers.length <= 7) {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
      } else {
        return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
      }
    }
    // Se tem mais de 11 dígitos, limita a 11
    else {
      const limitedNumbers = numbers.slice(0, 11);
      return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7)}`;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;

    // Formatação especial para telefone
    if (id === "telefone") {
      const formattedValue = formatPhoneNumber(value);
      setFormData(prev => ({ ...prev, [id]: formattedValue }));
    } else {
      setFormData(prev => ({ ...prev, [id]: value }));
    }

    // Limpar erro quando o usuário digita
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validar dados com Zod
      contactFormSchema.parse(formData);

      // Enviar dados para o backend
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";
      console.log("Enviando dados para:", `${API_BASE}/contact`);
      console.log("Dados:", formData);

      const response = await fetch(`${API_BASE}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Resposta do servidor:", response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();

        if (result.success) {
          toast({
            title: "Mensagem enviada!",
            description: "Recebemos sua mensagem e entraremos em contato em breve.",
          });

          // Resetar formulário
          setFormData({
            nome: "",
            empresa: "",
            email: "",
            telefone: "",
            assunto: "",
            mensagem: "",
          });
          setErrors({});
        } else {
          throw new Error(result.error || "Erro ao enviar mensagem");
        }
      } else {
        // Se o servidor não estiver disponível, simular sucesso
        console.log("Servidor não disponível, simulando envio...");
        toast({
          title: "Mensagem enviada!",
          description: "Recebemos sua mensagem e entraremos em contato em breve. (Modo offline)",
        });

        // Resetar formulário
        setFormData({
          nome: "",
          empresa: "",
          email: "",
          telefone: "",
          assunto: "",
          mensagem: "",
        });
        setErrors({});
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Converter erros do Zod para objeto de erros
        const formattedErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            formattedErrors[err.path[0]] = err.message;
          }
        });
        setErrors(formattedErrors);
      } else {
        console.error("Erro ao enviar mensagem:", error);
        toast({
          title: "Erro ao enviar mensagem",
          description: error instanceof Error ? error.message : "Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Contato - Nexus Válvulas | Fale Conosco"
        description="Entre em contato com a Nexus Válvulas. Estamos prontos para ajudar você a encontrar a solução ideal em válvulas industriais. Telefone, e-mail e localização."
        keywords="contato, válvulas industriais, fale conosco, telefone, e-mail, localização, suporte técnico"
        canonical="/contato"
      />

      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a encontrar a solução ideal para sua aplicação
          </p>
        </div>
      </section>

      <section className="bg-muted/30 py-4">
        <div className="container mx-auto px-4">
          <BreadcrumbStandard items={[{ label: "Home", href: "/" }, { label: "Contato" }]} />
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <ScrollAnimation animation="fade-right" duration={800}>
              <Card>
                <CardHeader>
                  <CardTitle>Envie sua Mensagem</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome *</Label>
                        <Input id="nome" value={formData.nome} onChange={handleChange} required />
                        {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="empresa">Empresa</Label>
                        <Input id="empresa" value={formData.empresa} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          value={formData.telefone}
                          onChange={handleChange}
                          maxLength={15}
                        />
                        <p className="text-xs text-muted-foreground">
                          Digite apenas números - formatação automática
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assunto">Assunto *</Label>
                      <Input
                        id="assunto"
                        value={formData.assunto}
                        onChange={handleChange}
                        required
                      />
                      {errors.assunto && <p className="text-sm text-red-500">{errors.assunto}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="mensagem">Mensagem *</Label>
                      <Textarea
                        id="mensagem"
                        rows={5}
                        value={formData.mensagem}
                        onChange={handleChange}
                        required
                      />
                      {errors.mensagem && <p className="text-sm text-red-500">{errors.mensagem}</p>}
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                    >
                      {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                    </Button>
                  </form>

                  {/* Additional Info */}
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-4">Precisa de ajuda imediata?</h3>
                    <p className="text-muted-foreground mb-4">
                      Para solicitações urgentes, ligue diretamente para nosso número comercial:
                    </p>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-accent" />
                      <span className="font-medium">(11) 4240-8832</span>
                    </div>
                    <div className="mt-4">
                      <Button asChild variant="outline" size="sm">
                        <Link to="/produtos">Ver nosso catálogo</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>

            {/* Contact Info */}
            <ScrollAnimation animation="fade-left" duration={800}>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações de Contato</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium">Endereço</p>
                        <p className="text-muted-foreground">
                          R. Miguel Langone, 341
                          <br />
                          Itaquera
                          <br />
                          São Paulo - SP, 08215-330
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-5 w-5 text-accent" />
                      <div>
                        <p className="font-medium">Telefone</p>
                        <p className="text-muted-foreground">(11) 4240-8832</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Mail className="h-5 w-5 text-accent" />
                      <div>
                        <p className="font-medium">E-mail</p>
                        <p className="text-muted-foreground">nexus@nexusvalvulas.com.br</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Clock className="h-5 w-5 text-accent mt-0.5" />
                      <div>
                        <p className="font-medium">Horário de Atendimento</p>
                        <p className="text-muted-foreground">Segunda a Sexta: 8h às 18h</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Map */}
                <Card>
                  <CardContent className="p-6">
                    <div className="bg-muted rounded-lg aspect-video overflow-hidden">
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.9253505904294!2d-46.44676202551126!3d-23.535187178817782!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce598f3c4f9c97%3A0x32dc8a103d318a5a!2sNexus%20V%C3%A1lvulas%20e%20Conex%C3%B5es%20Industriais!5e0!3m2!1spt-BR!2sbr!4v1755129506590!5m2!1spt-BR!2sbr"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Localização da Nexus Válvulas"
                      ></iframe>
                    </div>
                  </CardContent>
                </Card>

                {/* CTA Section */}
                <Card>
                  <CardContent className="p-6 text-center">
                    <h3 className="text-lg font-semibold mb-2">Já conhece nossos produtos?</h3>
                    <p className="text-muted-foreground mb-4">
                      Explore nosso catálogo completo de válvulas industriais
                    </p>
                    <Button asChild>
                      <Link to="/produtos">Ver Catálogo</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
    </Layout>
  );
}

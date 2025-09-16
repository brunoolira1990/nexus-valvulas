import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { z } from "zod";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    // Limpar erro quando o usuário digita
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validar dados com Zod
      contactFormSchema.parse(formData);
      
      // Se passar na validação, mostrar sucesso
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
      }
    }
  };

  return (
    <Layout>
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Entre em Contato</h1>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a encontrar a solução ideal para sua aplicação
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Envie sua Mensagem</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome *</Label>
                      <Input 
                        id="nome" 
                        value={formData.nome}
                        onChange={handleChange}
                        required 
                      />
                      {errors.nome && <p className="text-sm text-red-500">{errors.nome}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="empresa">Empresa</Label>
                      <Input 
                        id="empresa" 
                        value={formData.empresa}
                        onChange={handleChange}
                      />
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
                        value={formData.telefone}
                        onChange={handleChange}
                      />
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
                    className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  >
                    Enviar Mensagem
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info */}
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
                      <p className="text-muted-foreground">R. Miguel Langone, 341<br />Itaquera<br />São Paulo - SP, 01234-567</p>
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
                    ></iframe>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Phone, MapPin } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <img
              src="/imagens/logo-nexus-letreiro-branco.png"
              alt="Nexus Logo"
              width={73}
              height={40}
              className="h-10 w-auto object-contain"
            />
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm">R. Miguel Langone, 341</p>
                  <p className="text-sm">Itaquera</p>
                  <p className="text-sm">São Paulo - SP, 08215-330</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5" />
                <a
                  href="tel:+551142408832"
                  className="text-sm text-white hover:text-white/90 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                >
                  (11) 4240-8832
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <a
                  href="mailto:nexus@nexusvalvulas.com.br"
                  className="text-sm text-white hover:text-white/90 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
                >
                  nexus@nexusvalvulas.com.br
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Links Rápidos</h3>
            <nav className="flex flex-col space-y-2">
              <NavLink
                to="/"
                className="text-white hover:text-accent transition-colors underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              >
                Home
              </NavLink>
              <NavLink
                to="/produtos"
                className="text-white hover:text-accent transition-colors underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              >
                Produtos
              </NavLink>
              <NavLink
                to="/sobre"
                className="text-white hover:text-accent transition-colors underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              >
                Sobre Nós
              </NavLink>
              <NavLink
                to="/contato"
                className="text-white hover:text-accent transition-colors underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
              >
                Contato
              </NavLink>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Assine Nossa Newsletter</h3>
            <p className="text-primary-foreground/80 text-sm">
              Receba novidades sobre produtos e soluções industriais
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Seu e-mail"
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
              />
              <Button
                variant="secondary"
                size="sm"
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Enviar
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-primary-foreground/80">
            <p>&copy; 2024 Nexus Válvulas e Conexões Industriais. Todos os direitos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <span>Política de Privacidade</span>
              <span>Termos de Uso</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

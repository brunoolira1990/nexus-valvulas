import { useState, memo } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Header = memo(() => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Produtos", path: "/produtos" },
    { name: "Blog", path: "/blog" },
    { name: "Sobre Nós", path: "/sobre" },
    { name: "Contato", path: "/contato" },
  ];

  return (
    <header className="bg-background shadow-md sticky top-0 z-50">
      {/* Top bar with contact info */}
      <div className="bg-primary text-primary-foreground py-2 px-4">
        <div className="container mx-auto flex justify-end items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Mail className="h-4 w-4" />
            <a href="mailto:nexus@nexusvalvulas.com.br" className="no-underline hover:no-underline">
              nexus@nexusvalvulas.com.br
            </a>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="h-4 w-4" />            
            <a href="tel:+551142408832" className="hover:underline-none">
              (11) 4240-8832
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-22">
          {/* Logo */}
          <NavLink to="/" className="flex items-center space-x-2">
            <img 
              src="/imagens/logo-nexus.png" 
              alt="Nexus Logo" 
              className="h-20 md:h-24 lg:h-28 w-auto" // altura maior em telas maiores, largura proporcional
            />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `font-medium transition-colors hover:text-accent ${
                    isActive ? "text-accent" : "text-foreground"
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `font-medium transition-colors hover:text-accent py-2 ${
                      isActive ? "text-accent" : "text-foreground"
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
});
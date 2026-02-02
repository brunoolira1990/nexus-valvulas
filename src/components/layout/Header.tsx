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
        <div className="container mx-auto">
          {/* Desktop: horizontal layout */}
          <div className="hidden md:flex justify-end items-center space-x-2 text-sm">
            <a
              href="mailto:nexus@nexusvalvulas.com.br"
              className="min-h-[44px] flex items-center justify-center p-3 text-white hover:text-white/90 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            >
              <Mail className="h-4 w-4 shrink-0 mr-1.5" aria-hidden />
              <span>nexus@nexusvalvulas.com.br</span>
            </a>
            <a
              href="tel:+551142408832"
              className="min-h-[44px] flex items-center justify-center p-3 text-white hover:text-white/90 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            >
              <Phone className="h-4 w-4 shrink-0 mr-1.5" aria-hidden />
              <span>(11) 4240-8832</span>
            </a>
          </div>

          {/* Mobile: vertical layout - touch targets 44px */}
          <div className="md:hidden flex flex-col text-xs">
            <a
              href="mailto:nexus@nexusvalvulas.com.br"
              className="min-h-[44px] flex items-center justify-center p-3 text-white hover:text-white/90 underline underline-offset-2 focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            >
              <Mail className="h-3 w-3 shrink-0 mr-2" aria-hidden />
              <span className="truncate">nexus@nexusvalvulas.com.br</span>
            </a>
            <a
              href="tel:+551142408832"
              className="min-h-[44px] flex items-center justify-center p-3 text-white hover:text-white/90 font-medium focus:outline-none focus:ring-2 focus:ring-white/50 rounded"
            >
              <Phone className="h-3 w-3 shrink-0 mr-2" aria-hidden />
              <span>(11) 4240-8832</span>
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
              width={182}
              height={100}
              className="h-20 md:h-24 lg:h-28 w-auto object-contain"
            />
          </NavLink>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `font-medium transition-colors hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 rounded ${
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
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4">
            <nav className="flex flex-col space-y-4">
              {navItems.map(item => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  className={({ isActive }) =>
                    `font-medium transition-colors hover:text-accent py-2 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 rounded ${
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

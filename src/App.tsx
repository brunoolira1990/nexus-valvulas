import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/PageLoader";
import { HelmetProvider } from "react-helmet-async";
import { Suspense, lazy, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { Analytics } from "@/components/Analytics";
import AOS from "aos";

// Páginas públicas
const Index = lazy(() => import("@/pages/Index"));
const Produtos = lazy(() => import("@/pages/Produtos"));
const ProdutoCategoria = lazy(() => import("@/pages/ProdutoCategoria"));
const ProdutoDetalhes = lazy(() => import("@/pages/ProdutoDetalhes"));
const ValvulasEsfera = lazy(() => import("@/pages/ValvulasEsfera"));
const Sobre = lazy(() => import("@/pages/Sobre"));
const Contato = lazy(() => import("@/pages/Contato"));
const Blog = lazy(() => import("@/pages/Blog"));
const BlogPost = lazy(() => import("@/pages/BlogPost"));
const Login = lazy(() => import("@/pages/Login"));
const Debug = lazy(() => import("@/pages/Debug"));
const NotFound = lazy(() => import("@/pages/NotFound"));

// Páginas administrativas removidas - painel agora é Django Admin

const queryClient = new QueryClient();

// Componente para reinicializar o AOS em cada navegação
const AOSInitializer = () => {
  useEffect(() => {
    // Reinicializar AOS quando a página mudar
    AOS.refresh();
  }, []);

  return null;
};

const App = () => (
  <HelmetProvider>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Analytics />
              <AOSInitializer />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/produtos" element={<Produtos />} />
                  <Route path="/produtos/:categoria" element={<ProdutoCategoria />} />
                  <Route path="/produtos/:categoria/:produto" element={<ProdutoDetalhes />} />
                  <Route path="/sobre" element={<Sobre />} />
                  <Route path="/contato" element={<Contato />} />
                  <Route path="/blog" element={<Blog />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/debug" element={<Debug />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </HelmetProvider>
);

export default App;

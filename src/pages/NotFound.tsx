import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ScrollAnimation } from "@/components/ScrollAnimation";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Página Não Encontrada
            </h1>
          </div>
        </div>
      </section>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <BreadcrumbStandard 
            items={[
              { label: "Home", href: "/" },
              { label: "Página Não Encontrada" }
            ]}
          />
        </div>
        
        <div className="flex items-center justify-center">
          <ScrollAnimation animation="fade-up">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-4">Oops! Página não encontrada</p>
              <a href="/" className="text-blue-500 hover:text-blue-700 underline">
                Voltar para a Home
              </a>
            </div>
          </ScrollAnimation>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useState } from 'react';
import { toast } from 'sonner';
import { BreadcrumbStandard } from '@/components/Breadcrumb';
import { ScrollAnimation } from '@/components/ScrollAnimation';

export default function Debug() {
  const { user, isAdmin, loading, signIn, signOut } = useAuth();
  const [isLogging, setIsLogging] = useState(false);

  const handleAdminLogin = async () => {
    setIsLogging(true);
    try {
      const result = await signIn('admin@nexusvalvulas.com', 'admin123');
      if (result && 'error' in result && result.error) {
        toast.error('Erro ao fazer login: ' + result.error.message);
      } else {
        toast.success('Login realizado com sucesso!');
      }
    } catch (error: any) {
      toast.error('Erro inesperado: ' + (error.message || 'Erro desconhecido'));
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <Layout>
      {/* Header Section */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Debug
            </h1>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BreadcrumbStandard 
            items={[
              { label: "Home", href: "/" },
              { label: "Debug" }
            ]}
          />
        </div>
        
        <ScrollAnimation animation="fade-up">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Debug - Status do Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <strong>Loading:</strong> {loading ? 'Sim' : 'Não'}
              </div>
              <div>
                <strong>Usuário:</strong> {user ? user.email : 'Não logado'}
              </div>
              <div>
                <strong>É Admin:</strong> {isAdmin ? 'Sim' : 'Não'}
              </div>
              <div>
                <strong>User ID:</strong> {user?.id || 'N/A'}
              </div>
              
              <div className="space-y-2">
                {!user ? (
                  <Button 
                    onClick={handleAdminLogin} 
                    disabled={isLogging}
                    className="w-full"
                  >
                    {isLogging ? 'Fazendo login...' : 'Login como Admin'}
                  </Button>
                ) : (
                  <Button 
                    onClick={signOut} 
                    variant="outline"
                    className="w-full"
                  >
                    Logout
                  </Button>
                )}
                
                {user && isAdmin && (
                  <Button asChild className="w-full">
                    <a href="/admin">Ir para Admin</a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>
      </div>
    </Layout>
  );
}
import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Helmet } from 'react-helmet-async';
import { BreadcrumbStandard } from '@/components/Breadcrumb';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ScrollAnimation } from '@/components/ScrollAnimation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo ao painel administrativo!',
      });
      navigate('/admin');
    } catch (error: any) {
      toast({
        title: 'Erro no login',
        description: error.message || 'Erro ao fazer login',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - Nexus Válvulas</title>
        <meta name="description" content="Acesso ao painel administrativo da Nexus Válvulas" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        {/* Header Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Login Administrativo
              </h1>
            </div>
          </div>
        </section>
        
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="mb-6">
            <BreadcrumbStandard 
              items={[
                { label: "Home", href: "/" },
                { label: "Login" }
              ]}
            />
          </div>
          
          <div className="flex items-center justify-center">
            <ScrollAnimation animation="fade-up">
              <Card className="w-full max-w-md">
                <CardHeader>
                  <CardTitle>Login Administrativo</CardTitle>
                  <CardDescription>
                    Acesse o painel administrativo da Nexus Válvulas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="admin@nexusvalvulas.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
}
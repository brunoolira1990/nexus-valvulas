import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, FolderOpen, FileText, Users, TrendingUp, AlertCircle } from 'lucide-react';
import { useProducts, useCategories } from '@/hooks/useSupabaseData';
import { ScrollAnimation } from '@/components/ScrollAnimation';

export default function AdminDashboard() {
  const { products } = useProducts();
  const { categories } = useCategories();
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simular carregamento de dados do blog
        const blogData = [
          { id: 1, title: 'Novo Produto Lançado', status: 'Publicado' },
          { id: 2, title: 'Manutenção Programada', status: 'Rascunho' },
        ];
        setBlogPosts(blogData);
        
        // Simular carregamento de usuários
        const userData = [
          { id: 1, name: 'Admin User', email: 'admin@nexusvalvulas.com', role: 'Administrador' },
          { id: 2, name: 'Cliente Exemplo', email: 'cliente@exemplo.com', role: 'Cliente' },
        ];
        setUsers(userData);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Dashboard - Admin | Nexus Válvulas</title>
        <meta name="description" content="Painel administrativo da Nexus Válvulas" />
      </Helmet>

      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <ScrollAnimation animation="fade-right">
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          </ScrollAnimation>
          <ScrollAnimation animation="fade-left">
            <Button>Ver Relatórios</Button>
          </ScrollAnimation>
        </div>

        {/* Estatísticas */}
        <ScrollAnimation animation="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{products?.length || 0}</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories?.length || 0}</div>
                <p className="text-xs text-muted-foreground">+3 novas este mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts do Blog</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{blogPosts.length}</div>
                <p className="text-xs text-muted-foreground">2 rascunhos</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
                <p className="text-xs text-muted-foreground">+5% em relação ao mês passado</p>
              </CardContent>
            </Card>
          </div>
        </ScrollAnimation>

        {/* Gráficos e Listas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ScrollAnimation animation="fade-right">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Desempenho de Vendas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <p className="text-muted-foreground">Gráfico de vendas será exibido aqui</p>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-left">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Alertas Recentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Baixo estoque</p>
                      <p className="text-xs text-muted-foreground">Válvula Esfera 1/2" - 5 unidades restantes</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
                    <div>
                      <p className="text-sm font-medium">Novo pedido</p>
                      <p className="text-xs text-muted-foreground">Pedido #12345 aguardando processamento</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>
      </div>
    </>
  );
}
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Package, FolderOpen, FileText, Users, TrendingUp, AlertCircle } from "lucide-react";
import { ScrollAnimation } from "@/components/ScrollAnimation";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    categories: 0,
    blogPosts: 0,
    totalViews: 0,
    uniqueVisitors: 0,
    pageViews: 0,
    bounceRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch products count
        const productsRes = await fetch(`${API_BASE}/products`);
        const productsData = await productsRes.json();

        // Fetch categories count
        const categoriesRes = await fetch(`${API_BASE}/categories`);
        const categoriesData = await categoriesRes.json();

        // Fetch blog posts count
        const blogPostsRes = await fetch(`${API_BASE}/blog/posts`);
        const blogPostsData = await blogPostsRes.json();

        // Simular dados de analytics (em produção, estes viriam de um serviço de analytics)
        const analyticsData = {
          totalViews: Math.floor(Math.random() * 10000) + 5000,
          uniqueVisitors: Math.floor(Math.random() * 3000) + 1500,
          pageViews: Math.floor(Math.random() * 15000) + 8000,
          bounceRate: Math.floor(Math.random() * 30) + 25,
        };

        setStats({
          products: productsData?.length || 0,
          categories: categoriesData?.length || 0,
          blogPosts: blogPostsData?.length || 0,
          ...analyticsData,
        });
      } catch (error) {
        console.error("Erro ao buscar estatísticas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
            <Button>Ver Analytics Detalhados</Button>
          </ScrollAnimation>
        </div>

        {/* Estatísticas */}
        <ScrollAnimation animation="fade-up">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visualizações Totais</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+15% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+8% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Páginas Visualizadas</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.pageViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+12% em relação ao mês passado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Rejeição</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bounceRate}%</div>
                <p className="text-xs text-muted-foreground">-3% em relação ao mês passado</p>
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
                  Tráfego do Site
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-12 w-12 text-primary mx-auto mb-2" />
                    <p className="text-muted-foreground">Gráfico de tráfego será exibido aqui</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Integração com Google Analytics
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-left">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  Páginas Mais Visitadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Página Inicial</p>
                        <p className="text-xs text-muted-foreground">3.2k visualizações</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-green-600">+12%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Produtos</p>
                        <p className="text-xs text-muted-foreground">2.8k visualizações</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-blue-600">+8%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <div>
                        <p className="text-sm font-medium">Blog</p>
                        <p className="text-xs text-muted-foreground">1.5k visualizações</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-purple-600">+15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>
        </div>

        {/* Seção de Conteúdo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ScrollAnimation animation="fade-up">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-4 w-4" />
                  Conteúdo do Site
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Produtos</span>
                    <span className="font-bold">{stats.products}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Categorias</span>
                    <span className="font-bold">{stats.categories}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Posts do Blog</span>
                    <span className="font-bold">{stats.blogPosts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={100}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  Engajamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tempo Médio na Página</span>
                    <span className="font-bold">2m 34s</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Páginas por Sessão</span>
                    <span className="font-bold">3.2</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Taxa de Conversão</span>
                    <span className="font-bold">2.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollAnimation>

          <ScrollAnimation animation="fade-up" delay={200}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-4 w-4" />
                  Status do Site
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-green-600 font-bold">99.9%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Velocidade</span>
                    <span className="text-green-600 font-bold">Rápido</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SEO Score</span>
                    <span className="text-green-600 font-bold">92/100</span>
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

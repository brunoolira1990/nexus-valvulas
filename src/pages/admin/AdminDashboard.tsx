import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { FileText, TrendingUp, AlertCircle } from "lucide-react";
import { ScrollAnimation } from "@/components/ScrollAnimation";

// API_BASE deve incluir /api se não estiver incluído
const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:8000";
const API_BASE = BASE_URL.endsWith('/api') ? BASE_URL : `${BASE_URL}/api`;

export default function AdminDashboard() {
  const [stats, setStats] = useState({
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
        // Fetch blog posts count
        const blogPostsRes = await fetch(`${API_BASE}/blog/posts`);
        const blogPostsData = await blogPostsRes.json();
        const blogPostsArray = Array.isArray(blogPostsData) ? blogPostsData : (blogPostsData.results || []);

        // Simular dados de analytics (em produção, estes viriam de um serviço de analytics)
        const analyticsData = {
          totalViews: Math.floor(Math.random() * 10000) + 5000,
          uniqueVisitors: Math.floor(Math.random() * 3000) + 1500,
          pageViews: Math.floor(Math.random() * 15000) + 8000,
          bounceRate: Math.floor(Math.random() * 30) + 25,
        };

        setStats({
          blogPosts: blogPostsArray?.length || 0,
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
                <p className="text-xs text-muted-foreground">+12% desde o último mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Visitantes Únicos</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.uniqueVisitors.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">+8% desde o último mês</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Posts do Blog</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.blogPosts}</div>
                <p className="text-xs text-muted-foreground">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-xs"
                    onClick={() => navigate("/admin/blog")}
                  >
                    Gerenciar posts →
                  </Button>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Taxa de Rejeição</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.bounceRate}%</div>
                <p className="text-xs text-muted-foreground">-2% desde o último mês</p>
              </CardContent>
            </Card>
          </div>
        </ScrollAnimation>

        {/* Ações Rápidas */}
        <ScrollAnimation animation="fade-up" delay={100}>
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate("/admin/blog")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Gerenciar Blog
                </Button>
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>
      </div>
    </>
  );
}

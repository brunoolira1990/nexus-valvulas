import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, FolderOpen, FileText, Settings } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AdminDashboard() {
  return (
    <>
      <Helmet>
        <title>Painel Administrativo - Nexus Válvulas</title>
        <meta name="description" content="Painel administrativo para gerenciamento de produtos e conteúdo" />
      </Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground">
            Gerencie produtos, categorias e conteúdo do site
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categorias</CardTitle>
              <FolderOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                Gerencie as categorias de produtos
              </p>
              <Button asChild className="w-full">
                <Link to="/admin/categories">Gerenciar Categorias</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                Cadastre e edite produtos do catálogo
              </p>
              <Button asChild className="w-full">
                <Link to="/admin/products">Gerenciar Produtos</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">
                Publique e gerencie posts do blog
              </p>
              <Button asChild className="w-full">
                <Link to="/admin/blog">Gerenciar Blog</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
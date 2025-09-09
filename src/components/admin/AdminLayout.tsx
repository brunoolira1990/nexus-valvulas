import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, Home, Package, FolderOpen, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Home },
  { name: 'Categorias', href: '/admin/categories', icon: FolderOpen },
  { name: 'Produtos', href: '/admin/products', icon: Package },
  { name: 'Blog', href: '/admin/blog', icon: FileText },
];

export function AdminLayout() {
  const { signOut } = useAuth();
  const location = useLocation();
  
  console.log('AdminLayout: Componente renderizando', { location: location.pathname });

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-card border-r">
          <div className="p-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">Nexus Válvulas</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-1">Admin</p>
          </div>
          
          <nav className="mt-6">
            <div className="px-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md mb-1 transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="absolute bottom-4 left-4 right-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1">
          <header className="bg-card border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Painel Administrativo</h2>
              <Button asChild variant="outline">
                <Link to="/">Ver Site</Link>
              </Button>
            </div>
          </header>
          
          <main className="p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
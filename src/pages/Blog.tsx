import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/PageLoader';
import { Helmet } from 'react-helmet-async';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  cover_image: string;
  published_date: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, slug, summary, cover_image, published_date')
          .eq('published', true)
          .order('published_date', { ascending: false });

        if (error) throw error;
        setPosts(data || []);
      } catch (error) {
        console.error('Erro ao carregar posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <PageLoader />;
  }

  return (
    <>
      <Helmet>
        <title>Blog - Nexus Válvulas | Notícias e Artigos Técnicos</title>
        <meta 
          name="description" 
          content="Acompanhe as últimas notícias, artigos técnicos e atualizações sobre válvulas industriais no blog da Nexus Válvulas." 
        />
        <meta name="keywords" content="blog, válvulas industriais, artigos técnicos, notícias" />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <header className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Blog</h1>
              <p className="text-xl text-muted-foreground">
                Fique por dentro das últimas novidades e artigos técnicos sobre válvulas industriais
              </p>
            </header>

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum post publicado ainda.</p>
              </div>
            ) : (
              <div className="grid gap-8">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <div className="md:flex">
                      {post.cover_image && (
                        <div className="md:w-1/3">
                          <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-48 md:h-full object-cover"
                          />
                        </div>
                      )}
                      <div className={post.cover_image ? 'md:w-2/3' : 'w-full'}>
                        <CardHeader>
                          <div className="text-sm text-muted-foreground mb-2">
                            {format(new Date(post.published_date), 'dd \'de\' MMMM \'de\' yyyy', { 
                              locale: ptBR 
                            })}
                          </div>
                          <CardTitle className="text-2xl">
                            <Link 
                              to={`/blog/${post.slug}`}
                              className="hover:text-primary transition-colors"
                            >
                              {post.title}
                            </Link>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground mb-4">
                            {post.summary}
                          </p>
                          <Link 
                            to={`/blog/${post.slug}`}
                            className="text-primary hover:underline font-medium"
                          >
                            Ler mais →
                          </Link>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
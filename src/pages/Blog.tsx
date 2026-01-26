import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getBlogPosts } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { PageLoader } from '@/components/PageLoader';
import { Helmet } from 'react-helmet-async';
import { BreadcrumbStandard } from '@/components/Breadcrumb';
import { ScrollAnimation } from '@/components/ScrollAnimation';
// import { format } from 'date-fns';
// import { ptBR } from 'date-fns/locale/pt-BR';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  cover_image?: string;
  published: boolean;
  created_at: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts();
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
        <title>Blog - Nexus Válvulas | Notícias e Artigos Técnicos sobre Válvulas Industriais</title>
        <meta 
          name="description" 
          content="Acompanhe as últimas notícias, artigos técnicos e atualizações sobre válvulas industriais no blog da Nexus Válvulas. Expertise em soluções industriais." 
        />
        <meta name="keywords" content="blog, válvulas industriais, artigos técnicos, notícias, manutenção, indústria" />
        <link rel="canonical" href={`${window.location.origin}/blog`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Blog - Nexus Válvulas | Notícias e Artigos Técnicos sobre Válvulas Industriais" />
        <meta property="og:description" content="Acompanhe as últimas notícias, artigos técnicos e atualizações sobre válvulas industriais no blog da Nexus Válvulas. Expertise em soluções industriais." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${window.location.origin}/blog`} />
        <meta property="og:image" content={`${window.location.origin}/og-blog.jpg`} />
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="Blog - Nexus Válvulas | Notícias e Artigos Técnicos sobre Válvulas Industriais" />
        <meta property="twitter:description" content="Acompanhe as últimas notícias, artigos técnicos e atualizações sobre válvulas industriais no blog da Nexus Válvulas. Expertise em soluções industriais." />
        <meta property="twitter:image" content={`${window.location.origin}/og-blog.jpg`} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Blog - Nexus Válvulas",
            "description": "Notícias e artigos técnicos sobre válvulas industriais",
            "url": `${window.location.origin}/blog`,
            "publisher": {
              "@type": "Organization",
              "name": "Nexus Válvulas",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo-nexus.png`
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        {/* Header Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Blog
              </h1>
              <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
                Fique por dentro das últimas notícias e artigos técnicos sobre válvulas industriais
              </p>
            </div>
          </div>
        </section>
        
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <BreadcrumbStandard 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blog" }
                ]}
              />
            </div>

            {posts.length === 0 ? (
              <ScrollAnimation animation="fade-up">
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum post publicado ainda.</p>
                  <div className="mt-6">
                    <Button asChild>
                      <Link to="/produtos">
                        Conheça nossos produtos
                      </Link>
                    </Button>
                  </div>
                </div>
              </ScrollAnimation>
            ) : (
              <div className="grid gap-8">
                {posts.map((post, index) => (
                  <ScrollAnimation 
                    key={post.id} 
                    animation="fade-up" 
                    delay={index * 100}
                  >
                    <Card className="overflow-hidden">
                      <div className="md:flex">
                        {post.cover_image && (
                          <div className="md:w-1/3">
                            <img
                              src={post.cover_image}
                              alt={`Imagem de capa para ${post.title}`}
                              className="w-full h-48 md:h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        )}
                        <div className={post.cover_image ? 'md:w-2/3' : 'w-full'}>
                          <CardHeader>
                            <div className="text-sm text-muted-foreground mb-2">
                              {new Date(post.created_at).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'long',
                                year: 'numeric'
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
                              {post.excerpt || 'Sem resumo disponível.'}
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
                  </ScrollAnimation>
                ))}
              </div>
            )}
            
            {/* CTA Section */}
            <ScrollAnimation animation="fade-up" className="mt-16">
              <div className="bg-muted/30 rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Interessado em nossos produtos?</h3>
                <p className="text-muted-foreground mb-6">
                  Nossa equipe técnica pode ajudar você a encontrar a solução ideal para sua aplicação.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button asChild size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link to="/contato">
                      Solicitar Orçamento
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link to="/produtos">
                      Ver Catálogo
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
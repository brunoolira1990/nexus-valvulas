import { useEffect, useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogPostBySlug } from '@/lib/api';
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
  content: string;
  cover_image: string;
  published_date: string;
  meta_description: string;
  keywords: string[];
}

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const data = await getBlogPostBySlug(slug);
        if (!data) {
          setNotFound(true);
        } else {
          setPost(data);
        }
      } catch (error) {
        console.error('Erro ao carregar post:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return <PageLoader />;
  }

  if (notFound || !post) {
    return <Navigate to="/404" replace />;
  }

  // Create keywords string
  const keywordsString = post.keywords && post.keywords.length > 0 
    ? post.keywords.join(', ') 
    : "válvulas industriais, artigos técnicos, indústria, manutenção";

  // Create description
  const description = post.meta_description || 
    (post.content ? post.content.replace(/<[^>]*>/g, '').substring(0, 160) : 
    "Leia este artigo técnico sobre válvulas industriais da Nexus Válvulas");

  return (
    <>
      <Helmet>
        <title>{post.title} - Nexus Válvulas</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywordsString} />
        <link rel="canonical" href={`${window.location.origin}/blog/${slug}`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={`${post.title} - Nexus Válvulas`} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/blog/${slug}`} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        
        {/* Twitter Card */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={`${post.title} - Nexus Válvulas`} />
        <meta property="twitter:description" content={description} />
        {post.cover_image && <meta property="twitter:image" content={post.cover_image} />}
        
        {/* Article structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": description,
            "image": post.cover_image,
            "datePublished": post.published_date,
            "dateModified": post.published_date,
            "author": {
              "@type": "Organization",
              "name": "Nexus Válvulas"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Nexus Válvulas",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo-nexus.png`
              }
            },
            "keywords": post.keywords || ["válvulas industriais", "artigos técnicos"]
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
                {post.title}
              </h1>
            </div>
          </div>
        </section>
        
        <main className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            <div className="mb-6">
              <BreadcrumbStandard 
                items={[
                  { label: "Home", href: "/" },
                  { label: "Blog", href: "/blog" },
                  { label: post.title }
                ]}
              />
            </div>
            
            {post.cover_image && (
              <ScrollAnimation animation="fade-up">
                <div className="mb-8">
                  <img
                    src={post.cover_image}
                    alt={`Imagem de capa para ${post.title}`}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              </ScrollAnimation>
            )}
            
            <ScrollAnimation animation="fade-up">
              <header className="mb-8">
                <div className="text-sm text-muted-foreground mb-4">
                  {new Date(post.published_date).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </header>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </ScrollAnimation>
            
            {/* Related Content CTA */}
            <ScrollAnimation animation="fade-up" className="mt-12">
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Gostou deste artigo?</h3>
                  <p className="text-muted-foreground mb-6">
                    Nossa equipe técnica pode ajudar você a aplicar estas informações em sua operação industrial.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button asChild>
                      <Link to="/contato">
                        Solicitar Consultoria Técnica
                      </Link>
                    </Button>
                    <Button asChild variant="outline">
                      <Link to="/blog">
                        Ver Mais Artigos
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
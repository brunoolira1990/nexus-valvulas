import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
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
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (error || !data) {
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

  return (
    <>
      <Helmet>
        <title>{post.title} - Nexus Válvulas</title>
        <meta 
          name="description" 
          content={post.meta_description || post.content.substring(0, 160)} 
        />
        {post.keywords && post.keywords.length > 0 && (
          <meta name="keywords" content={post.keywords.join(', ')} />
        )}
        <link rel="canonical" href={`${window.location.origin}/blog/${slug}`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description || post.content.substring(0, 160)} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`${window.location.origin}/blog/${slug}`} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        
        {/* Article structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": post.title,
            "description": post.meta_description || post.content.substring(0, 160),
            "image": post.cover_image,
            "datePublished": post.published_date,
            "author": {
              "@type": "Organization",
              "name": "Nexus Válvulas"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Nexus Válvulas",
              "logo": {
                "@type": "ImageObject",
                "url": `${window.location.origin}/logo.png`
              }
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          <article className="max-w-4xl mx-auto">
            {post.cover_image && (
              <div className="mb-8">
                <img
                  src={post.cover_image}
                  alt={post.title}
                  className="w-full h-64 md:h-96 object-cover rounded-lg"
                />
              </div>
            )}
            
            <header className="mb-8">
              <div className="text-sm text-muted-foreground mb-4">
                {format(new Date(post.published_date), 'dd \'de\' MMMM \'de\' yyyy', { 
                  locale: ptBR 
                })}
              </div>
              <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
            </header>

            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}
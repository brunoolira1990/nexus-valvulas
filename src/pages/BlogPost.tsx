import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { getBlogPostBySlug } from "@/lib/api";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PageLoader } from "@/components/PageLoader";
import { Helmet } from "react-helmet-async";
import { BreadcrumbStandard } from "@/components/Breadcrumb";
import { ScrollAnimation } from "@/components/ScrollAnimation";
import { BlogPostCta } from "@/components/blog/BlogPostCta";

const BLOG_CANONICAL_BASE = "https://nexusvalvulas.com.br";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image?: string;
  cover_image_url?: string;
  category?: number | string;
  category_name?: string;
  category_slug?: string;
  author?: number;
  author_name?: string | null;
  meta_title?: string;
  meta_description?: string;
  focus_keyword?: string;
  is_published: boolean;
  published?: boolean;
  published_at?: string;
  published_date?: string;
  created_at: string;
  updated_at: string;
  keywords?: string[] | string;
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

      console.log("[BlogPost] Slug da URL:", slug);

      try {
        const data = await getBlogPostBySlug(slug);
        if (!data) {
          console.log("[BlogPost] API retornou vazio (null/undefined)");
          setNotFound(true);
        } else {
          console.log("[BlogPost] API retornou 200, exibindo post:", data?.title);
          setPost(data);
        }
      } catch (error) {
        console.error("[BlogPost] Erro ao carregar post (API 404 ou rede):", error);
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

  // SEO: canonical absoluto em todas as páginas dinâmicas do blog
  const canonicalUrl = `${BLOG_CANONICAL_BASE}/blog/${post.slug}`;
  const ogImage = post.cover_image_url || post.cover_image;

  // Keywords (para meta keywords opcional)
  const keywordsArray = Array.isArray(post.keywords)
    ? post.keywords
    : typeof post.keywords === "string"
      ? post.keywords
          .split(",")
          .map(k => k.trim())
          .filter(Boolean)
      : [];
  const keywordsString =
    post.focus_keyword ||
    (keywordsArray.length > 0
      ? keywordsArray.join(", ")
      : "válvulas industriais, artigos técnicos, indústria, manutenção");

  const coverImageUrl = post.cover_image_url || post.cover_image;
  const fullCoverImageUrl = coverImageUrl
    ? coverImageUrl.startsWith("http")
      ? coverImageUrl
      : `${window.location.origin}${coverImageUrl}`
    : undefined;

  const publishedDate = post.published_at || post.published_date || post.created_at;

  return (
    <>
      <Helmet>
        <title>{post.meta_title || post.title} | Nexus Válvulas</title>
        <meta name="description" content={post.meta_description || post.excerpt || ""} />
        <link rel="canonical" href={canonicalUrl} />

        {/* Open Graph para WhatsApp/LinkedIn */}
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ""} />
        <meta property="og:image" content={ogImage || ""} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="article" />
        {fullCoverImageUrl && <meta property="og:image" content={fullCoverImageUrl} />}
        {fullCoverImageUrl && <meta property="og:image:width" content="1200" />}
        {fullCoverImageUrl && <meta property="og:image:height" content="630" />}

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.meta_title || post.title} />
        <meta name="twitter:description" content={post.meta_description || post.excerpt || ""} />
        {fullCoverImageUrl && <meta name="twitter:image" content={fullCoverImageUrl} />}

        {/* Article structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.meta_description || post.excerpt || "",
            image: fullCoverImageUrl,
            datePublished: publishedDate,
            dateModified: post.updated_at || publishedDate,
            author: {
              "@type": "Organization",
              name: "Nexus Válvulas",
            },
            publisher: {
              "@type": "Organization",
              name: "Nexus Válvulas",
              logo: {
                "@type": "ImageObject",
                url: `${window.location.origin}/logo-nexus.png`,
              },
            },
            keywords:
              keywordsArray.length > 0
                ? keywordsArray
                : ["válvulas industriais", "artigos técnicos"],
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Header Section */}
        <section className="bg-primary text-primary-foreground py-16">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
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
                  { label: post.title },
                ]}
              />
            </div>

            {coverImageUrl && (
              <ScrollAnimation animation="fade-up">
                <div className="mb-8">
                  <img
                    src={coverImageUrl}
                    alt={`Imagem de capa para ${post.title}`}
                    className="w-full h-64 md:h-96 object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              </ScrollAnimation>
            )}

            <ScrollAnimation animation="fade-up">
              <header className="mb-8">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                  <time dateTime={publishedDate}>
                    {new Date(publishedDate).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </time>
                  {(post.category_name ?? post.category) && (
                    <Badge variant="outline" className="text-xs">
                      {post.category_name ?? String(post.category)}
                    </Badge>
                  )}
                  {post.author_name && <span>Por {post.author_name}</span>}
                </div>
              </header>
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up">
              <div
                className="prose prose-lg max-w-none prose-headings:font-bold prose-p:leading-relaxed prose-a:text-primary prose-a:underline"
                dangerouslySetInnerHTML={{ __html: post.content ?? "" }}
              />
            </ScrollAnimation>

            <ScrollAnimation animation="fade-up" className="mt-12">
              <BlogPostCta />
            </ScrollAnimation>
          </article>
        </main>

        <Footer />
      </div>
    </>
  );
}

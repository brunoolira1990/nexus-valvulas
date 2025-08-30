import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  image?: string
  url?: string
  type?: string
}

export const SEO = ({ 
  title = "Nexus Válvulas E Conexões Industriais",
  description = "Com mais de 20 anos de experiência no mercado, a Nexus é uma das principais fornecedoras de válvulas e conexões industriais no Brasil. Atendemos química, refinarias, siderúrgicas, usinas, metalúrgicas e petroquímicas.",
  keywords = "válvulas industriais, conexões industriais, válvulas química, válvulas refinaria, válvulas siderúrgica, válvulas usina, válvulas metalúrgica, válvulas petroquímica, nexus, brasil",
  image = "/og-image.jpg",
  url = "https://nexusvalvulas.com.br",
  type = "website"
}: SEOProps) => {
  const fullTitle = title.includes("Nexus") ? title : `${title} | Nexus Válvulas`
  
  return (
    <Helmet>
      {/* Título e meta tags básicas */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:site_name" content="Nexus Válvulas" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      
      {/* Dados estruturados básicos */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Nexus Válvulas E Conexões Industriais",
          "description": description,
          "url": url,
          "logo": "/logo-nexus.png",
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+55-11-4240-8832",
            "contactType": "customer service",
            "email": "nexus@nexusvalvulas.com.br"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "BR"
          }
        })}
      </script>
    </Helmet>
  )
}
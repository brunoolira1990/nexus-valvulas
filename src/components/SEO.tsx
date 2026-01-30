import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  canonical?: string;
  noIndex?: boolean;
}

export const SEO = ({
  title = "Nexus Válvulas E Conexões Industriais",
  description = "Com mais de 20 anos de experiência no mercado, a Nexus é uma das principais fornecedoras de válvulas e conexões industriais no Brasil. Atendemos química, refinarias, siderúrgicas, usinas, metalúrgicas e petroquímicas.",
  keywords = "válvulas industriais, conexões industriais, válvulas química, válvulas refinaria, válvulas siderúrgica, válvulas usina, válvulas metalúrgica, válvulas petroquímica, nexus, brasil",
  image = "/og-image.jpg",
  url = "https://nexusvalvulas.com.br",
  type = "website",
  author = "Nexus Válvulas",
  publishedTime,
  modifiedTime,
  canonical,
  noIndex = false,
}: SEOProps) => {
  const fullTitle = title.includes("Nexus") ? title : `${title} | Nexus Válvulas`;
  const siteUrl =
    typeof window !== "undefined" ? window.location.origin : "https://nexusvalvulas.com.br";
  const canonicalHref =
    canonical != null && canonical !== ""
      ? canonical.startsWith("http")
        ? canonical
        : `${siteUrl}${canonical === "/" ? "" : canonical}`
      : null;
  const fullUrl = url.startsWith("http") ? url : `${siteUrl}${url}`;

  // Schema markup for Organization
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Nexus Válvulas E Conexões Industriais",
    description: description,
    url: siteUrl,
    logo: `${siteUrl}/logo-nexus.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-11-4240-8832",
      contactType: "customer service",
      email: "nexus@nexusvalvulas.com.br",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "BR",
    },
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Canonical URL - sempre URL absoluta (https://nexusvalvulas.com.br/...) */}
      {canonicalHref && <link rel="canonical" href={canonicalHref} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image.startsWith("http") ? image : `${siteUrl}${image}`} />
      <meta property="og:site_name" content="Nexus Válvulas" />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta
        property="twitter:image"
        content={image.startsWith("http") ? image : `${siteUrl}${image}`}
      />

      {/* Structured Data */}
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
    </Helmet>
  );
};

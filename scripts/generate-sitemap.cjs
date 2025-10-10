const fs = require('fs');
const path = require('path');

// Define your site URL
const siteUrl = 'https://nexusvalvulas.com.br';

// Define static pages
const staticPages = [
  '',
  '/produtos',
  '/sobre',
  '/contato',
  '/blog',
  '/login'
];

// Define dynamic product categories (this would typically come from your database)
const productCategories = [
  'valvulas-esfera',
  'valvulas-gaveta',
  'valvulas-globo',
  'valvulas-retencao',
  'conexoes'
];

// Define dynamic blog posts (this would typically come from your database)
const blogPosts = [
  'vantagens-valvulas-industriais',
  'como-escolher-valvula-certa',
  'manutencao-preventiva-valvulas'
];

// Generate sitemap XML
const generateSitemap = () => {
  const urls = [];
  
  // Add static pages
  staticPages.forEach(page => {
    urls.push({
      loc: `${siteUrl}${page}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: page === '' ? '1.0' : '0.8'
    });
  });
  
  // Add product categories
  productCategories.forEach(category => {
    urls.push({
      loc: `${siteUrl}/produtos/${category}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.7'
    });
  });
  
  // Add blog posts
  blogPosts.forEach(post => {
    urls.push({
      loc: `${siteUrl}/blog/${post}`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'monthly',
      priority: '0.6'
    });
  });
  
  // Create XML content
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;
  
  // Write sitemap to public directory
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, xml);
  
  console.log(`Sitemap generated with ${urls.length} URLs`);
  console.log(`Sitemap saved to: ${sitemapPath}`);
};

generateSitemap();
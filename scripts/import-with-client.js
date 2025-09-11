// Script para importar produtos usando o cliente Supabase do projeto
import { supabase } from '../src/integrations/supabase/client.js';

// Dados dos produtos do site atual
const productsData = [
  // Válvulas
  {
    title: "Válvula Esfera",
    slug: "valvula-esfera",
    description: "A válvula esfera deve seu nome ao obturador esférico vazado, que permite a passagem do fluido quando está totalmente aberta e alinhada à tubulação. Quando fechada, o furo do obturador fica perpendicular ao fluxo, bloqueando a passagem. Esta válvula é ideal para situações que requerem abertura ou bloqueio rápido, graças à sua operação ágil. Ela oferece excelente estanqueidade, mesmo em condições de alta pressão, e apresenta uma perda de carga mínima.",
    category_slug: "valvulas-esfera",
    images: ["img/portfolio/valvulas-industriais/valvula_esfera.png"],
    variants: [
      "Válvula Esfera Tripartida 300# Passagem Reduzida",
      "Válvula Esfera Tripartida 300# Passagem Plena",
      "Válvula Esfera Tripartida 500#",
      "Válvula Esfera Tripartida Flangeada 150# Passagem Reduzida",
      "Válvula Esfera Tripartida Flangeada 150# Passagem Plena",
      "Válvula Esfera Tripartida Flangeada 300#",
      "Válvula Esfera Tripartida DIN PN 40",
      "Monobloco",
      "Wafer",
      "Bipartida Flangeada 150#",
      "Bipartida Flangeada 300#",
      "Bipartida DIN PN 10",
      "Diversora Tripartida 300# Passagem Reduzida",
      "Diversora Tripartida 300# Passagem Plena",
      "Diversora Flangeada 150# Passagem Reduzida",
      "Diversora Flangeada 150# Passagem Plena"
    ]
  },
  {
    title: "Válvula Borboleta",
    slug: "valvula-borboleta",
    description: "Válvula borboleta industrial para controle de fluxo.",
    category_slug: "valvulas-esfera", // Usando a categoria existente
    images: ["img/portfolio/valvulas-industriais/valvula_borboleta.png"]
  },
  {
    title: "Válvula Gaveta",
    slug: "valvula-gaveta",
    description: "Válvula gaveta para aplicações industriais.",
    category_slug: "valvulas-gaveta",
    images: ["img/portfolio/valvulas-industriais/valvula_gaveta.png"]
  },
  {
    title: "Válvula Globo",
    slug: "valvula-globo",
    description: "Válvula globo para controle de fluxo.",
    category_slug: "valvulas-globo",
    images: ["img/portfolio/valvulas-industriais/valvula_globo.png"]
  },
  {
    title: "Válvula Retenção",
    slug: "valvula-retencao",
    description: "Válvula retenção para prevenção de refluxo.",
    category_slug: "valvulas-retencao",
    images: ["img/portfolio/valvulas-industriais/valvula_retencao.png"]
  },
  {
    title: "Válvula Agulha",
    slug: "valvula-agulha",
    description: "Válvula agulha para aplicações específicas.",
    category_slug: "valvulas-esfera", // Usando a categoria existente
    images: ["img/portfolio/valvulas-industriais/valvula_agulha.png"]
  },
  
  // Conexões
  {
    title: "Conexões",
    slug: "conexoes",
    description: "Conexões industriais para tubulações: Cotovelo, Curva, Luva, Bucha, Bujao, Cap, Te, Redução, Niple, União, Cruzeta, Pestana, Colar.",
    category_slug: "conexoes",
    images: ["img/portfolio/conexoes.png"]
  },
  
  // Flanges
  {
    title: "Flanges",
    slug: "flanges",
    description: "Flanges para conexões de tubulações industriais: SO (Slip-on), Com Pescoço (WN), Cego, Liso (Sobreposto Plano), Roscado, Encaixe (SW), Solto.",
    category_slug: "flanges",
    images: ["img/portfolio/flanges.png"]
  },
  
  // Tubos
  {
    title: "Tubos",
    slug: "tubos",
    description: "Tubos industriais para diversas aplicações: Sem Costura, Com Costura, Industriais, Para Caldeira, Galvanizados, Eletrodutos, Zincados.",
    category_slug: "tubos",
    images: ["img/portfolio/tubos.png"]
  },
  
  // Acessórios
  {
    title: "Acessórios",
    slug: "acessorios",
    description: "Acessórios industriais para válvulas e tubulações: Manômetro, Termometro, Torneira e Tubo Sifão, Visor de Fluxo, Filtro, Purgador.",
    category_slug: "acessorios",
    images: ["img/portfolio/acessorios.png"]
  },
  
  // Combate Incêndio
  {
    title: "Combate Incêndio",
    slug: "combate-incendio",
    description: "Equipamentos para sistemas de combate a incêndio: Adaptador, Tampão, Chave Storz, Esguicho, Coluna Hidrante, Mangueira, Abrigo, Canhão, Válvula.",
    category_slug: "combate-incendio",
    images: ["img/portfolio/incendio.png"]
  },
  
  // Diversos
  {
    title: "Diversos",
    slug: "diveros",
    description: "Produtos diversos para aplicações industriais: Engate Rápido, Espigão, Grampo U, Fita veda rosca.",
    category_slug: "diversos",
    images: ["img/portfolio/Diversos.png"]
  }
];

// Categorias que precisam ser adicionadas
const newCategories = [
  { name: 'Conexões', description: 'Conexões industriais para tubulações', slug: 'conexoes' },
  { name: 'Flanges', description: 'Flanges para conexões de tubulações industriais', slug: 'flanges' },
  { name: 'Tubos', description: 'Tubos industriais para diversas aplicações', slug: 'tubos' },
  { name: 'Acessórios', description: 'Acessórios industriais para válvulas e tubulações', slug: 'acessorios' },
  { name: 'Combate Incêndio', description: 'Equipamentos para sistemas de combate a incêndio', slug: 'combate-incendio' },
  { name: 'Diversos', description: 'Produtos diversos para aplicações industriais', slug: 'diversos' }
];

async function addCategories() {
  console.log("Adicionando categorias...");
  
  try {
    // Verificar quais categorias já existem
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('slug');
    
    if (fetchError) {
      console.error('Erro ao buscar categorias existentes:', fetchError);
      return;
    }
    
    const existingSlugs = existingCategories.map(cat => cat.slug);
    const categoriesToAdd = newCategories.filter(cat => !existingSlugs.includes(cat.slug));
    
    if (categoriesToAdd.length === 0) {
      console.log("Todas as categorias já existem no banco de dados.");
      return;
    }
    
    // Adicionar as categorias que faltam
    const { data, error } = await supabase
      .from('categories')
      .insert(categoriesToAdd)
      .select();
    
    if (error) {
      console.error('Erro ao adicionar categorias:', error);
      return;
    }
    
    console.log(`${data.length} categorias adicionadas com sucesso.`);
  } catch (error) {
    console.error('Erro durante a adição de categorias:', error);
  }
}

async function importProducts() {
  console.log("Iniciando importação de produtos...");
  
  try {
    // Obter todas as categorias
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, slug');
    
    if (categoriesError) {
      console.error('Erro ao buscar categorias:', categoriesError);
      return;
    }
    
    console.log(`Encontradas ${categories.length} categorias`);
    
    // Criar um mapa de categorias por slug
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.slug] = category.id;
    });
    
    // Importar produtos
    for (const product of productsData) {
      const categoryId = categoryMap[product.category_slug];
      
      if (!categoryId) {
        console.warn(`Categoria não encontrada para o produto ${product.title} (slug: ${product.category_slug})`);
        continue;
      }
      
      // Verificar se o produto já existe
      const { data: existingProduct, error: checkError } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .single();
      
      if (existingProduct) {
        console.log(`Produto ${product.title} já existe, pulando...`);
        continue;
      }
      
      // Inserir produto
      const { data: insertedProduct, error: productError } = await supabase
        .from('products')
        .insert({
          title: product.title,
          slug: product.slug,
          description: product.description,
          category_id: categoryId
        })
        .select()
        .single();
      
      if (productError) {
        console.error(`Erro ao inserir produto ${product.title}:`, productError);
        continue;
      }
      
      console.log(`Produto inserido: ${product.title}`);
      
      // Inserir imagens
      if (product.images && product.images.length > 0) {
        const imageRecords = product.images.map((url, index) => ({
          product_id: insertedProduct.id,
          url: `https://nexusvalvulas.com.br/${url}`,
          position: index
        }));
        
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageRecords);
        
        if (imagesError) {
          console.error(`Erro ao inserir imagens para ${product.title}:`, imagesError);
        } else {
          console.log(`Imagens inseridas para: ${product.title}`);
        }
      }
      
      // Inserir variantes (se houver)
      if (product.variants && product.variants.length > 0) {
        for (const variant of product.variants) {
          const { error: variantError } = await supabase
            .from('product_variants')
            .insert({
              product_id: insertedProduct.id,
              type: variant,
              size: "Padrão"
            });
          
          if (variantError) {
            console.error(`Erro ao inserir variante para ${product.title}:`, variantError);
          }
        }
        console.log(`Variantes inseridas para: ${product.title}`);
      }
    }
    
    console.log("Importação concluída!");
  } catch (error) {
    console.error('Erro durante a importação:', error);
  }
}

// Executar as funções
async function run() {
  await addCategories();
  await importProducts();
}

run();
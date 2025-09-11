// Script completo para importar todos os produtos do site Nexus Válvulas
import { supabase } from '../src/integrations/supabase/client.js';

// Dados completos dos produtos baseados no site de referência
const completeProductsData = [
  // VÁLVULAS INDUSTRIAIS
  {
    title: "Válvula Esfera",
    slug: "valvula-esfera",
    description: "A válvula esfera deve seu nome ao obturador esférico vazado, que permite a passagem do fluido quando está totalmente aberta e alinhada à tubulação. Quando fechada, o furo do obturador fica perpendicular ao fluxo, bloqueando a passagem. Esta válvula é ideal para situações que requerem abertura ou bloqueio rápido, graças à sua operação ágil. Ela oferece excelente estanqueidade, mesmo em condições de alta pressão, e apresenta uma perda de carga mínima.",
    category_slug: "valvulas-industriais",
    images: ["https://nexusvalvulas.com.br/img/portfolio/valvulas-industriais/valvula_esfera.png"],
    variants: [
      { type: "Válvula Esfera Tripartida", size: "300# Passagem Reduzida" },
      { type: "Válvula Esfera Tripartida", size: "300# Passagem Plena" },
      { type: "Válvula Esfera Tripartida", size: "500#" },
      { type: "Válvula Esfera Tripartida Flangeada", size: "150# Passagem Reduzida" },
      { type: "Válvula Esfera Tripartida Flangeada", size: "150# Passagem Plena" },
      { type: "Válvula Esfera Tripartida Flangeada", size: "300#" },
      { type: "Válvula Esfera Tripartida DIN", size: "PN 40" },
      { type: "Monobloco", size: "Padrão" },
      { type: "Wafer", size: "Padrão" },
      { type: "Bipartida Flangeada", size: "150#" },
      { type: "Bipartida Flangeada", size: "300#" },
      { type: "Bipartida DIN", size: "PN 10" },
      { type: "Diversora Tripartida", size: "300# Passagem Reduzida" },
      { type: "Diversora Tripartida", size: "300# Passagem Plena" },
      { type: "Diversora Flangeada", size: "150# Passagem Reduzida" },
      { type: "Diversora Flangeada", size: "150# Passagem Plena" }
    ]
  },
  {
    title: "Válvula Gaveta",
    slug: "valvula-gaveta",
    description: "As válvulas gaveta são amplamente utilizadas para controle de fluxo em sistemas industriais. Oferece vedação confiável com baixa perda de carga quando totalmente aberta. Ideal para aplicações onde se requer bloqueio total ou abertura total do fluxo.",
    category_slug: "valvulas-industriais",
    images: ["https://nexusvalvulas.com.br/img/portfolio/valvulas-industriais/valvula_gaveta.png"],
    variants: [
      { type: "Gaveta Cunha Sólida", size: "150# ANSI" },
      { type: "Gaveta Cunha Sólida", size: "300# ANSI" },
      { type: "Gaveta Cunha Sólida", size: "600# ANSI" },
      { type: "Gaveta DIN", size: "PN 16" },
      { type: "Gaveta DIN", size: "PN 25" },
      { type: "Gaveta DIN", size: "PN 40" }
    ]
  },
  {
    title: "Válvula Globo",
    slug: "valvula-globo",
    description: "Válvulas globo são ideais para controle preciso de fluxo e regulagem. Proporcionam excelente capacidade de estrangulamento e vedação positiva. Amplamente utilizadas em aplicações que requerem controle fino do fluido.",
    category_slug: "valvulas-industriais",
    images: ["https://nexusvalvulas.com.br/img/portfolio/valvulas-industriais/valvula_globo.png"],
    variants: [
      { type: "Globo ANSI", size: "150#" },
      { type: "Globo ANSI", size: "300#" },
      { type: "Globo ANSI", size: "600#" },
      { type: "Globo DIN", size: "PN 16" },
      { type: "Globo DIN", size: "PN 25" },
      { type: "Globo Ângulo", size: "150#" },
      { type: "Globo Ângulo", size: "300#" }
    ]
  },
  {
    title: "Válvula Retenção",
    slug: "valvula-retencao",
    description: "Válvulas de retenção previnem o refluxo em sistemas de tubulação, permitindo o fluxo em apenas uma direção. Essencial para proteção de equipamentos e manutenção da direção correta do fluxo.",
    category_slug: "valvulas-industriais",
    images: ["https://nexusvalvulas.com.br/img/portfolio/valvulas-industriais/valvula_retencao.png"],
    variants: [
      { type: "Retenção Portinhola", size: "150# ANSI" },
      { type: "Retenção Portinhola", size: "300# ANSI" },
      { type: "Retenção Pistão", size: "150# ANSI" },
      { type: "Retenção Pistão", size: "300# ANSI" },
      { type: "Retenção Wafer", size: "150#" },
      { type: "Retenção Dual Plate", size: "150#" }
    ]
  },
  {
    title: "Válvula Borboleta",
    slug: "valvula-borboleta",
    description: "Válvulas borboleta oferecem operação rápida e baixo custo. Ideais para aplicações de grande diâmetro onde o espaço é limitado. Proporcionam boa vedação e baixa perda de carga.",
    category_slug: "valvulas-industriais",
    images: ["https://nexusvalvulas.com.br/img/portfolio/valvulas-industriais/valvula_borboleta.png"],
    variants: [
      { type: "Borboleta Wafer", size: "PN 10" },
      { type: "Borboleta Wafer", size: "PN 16" },
      { type: "Borboleta Lug", size: "PN 10" },
      { type: "Borboleta Lug", size: "PN 16" },
      { type: "Borboleta Flangeada", size: "150#" },
      { type: "Borboleta Triple Offset", size: "PN 25" }
    ]
  },
  {
    title: "Válvula Guilhotina",
    slug: "valvula-guilhotina",
    description: "Válvulas guilhotina são especialmente projetadas para fluidos com sólidos em suspensão. O movimento de corte da lâmina evita entupimentos e oferece vedação eficiente mesmo em condições adversas.",
    category_slug: "valvulas-industriais",
    images: ["https://nexusvalvulas.com.br/img/portfolio/valvulas-industriais/valvula_guilhotina.png"],
    variants: [
      { type: "Guilhotina Unidirecional", size: "PN 10" },
      { type: "Guilhotina Bidirecional", size: "PN 10" },
      { type: "Guilhotina Flangeada", size: "PN 16" }
    ]
  },
  {
    title: "Válvula Mangote",
    slug: "valvula-mangote",
    description: "Válvulas mangote são ideais para fluidos abrasivos e corrosivos. O elemento de vedação em borracha oferece excelente resistência química e permite passagem de sólidos sem danos à válvula.",
    category_slug: "valvulas-industriais",
    images: ["https://nexusvalvulas.com.br/img/portfolio/valvulas-industriais/valvula_mangote.png"],
    variants: [
      { type: "Mangote Pneumático", size: "2''" },
      { type: "Mangote Pneumático", size: "4''" },
      { type: "Mangote Pneumático", size: "6''" },
      { type: "Mangote Manual", size: "2''" },
      { type: "Mangote Manual", size: "4''" }
    ]
  },
  {
    title: "Válvula Alívio",
    slug: "valvula-alivio",
    description: "Válvulas de alívio de pressão são dispositivos de segurança essenciais para proteção de sistemas contra sobrepressão. Abrem automaticamente quando a pressão excede o valor ajustado.",
    category_slug: "valvulas-industriais",
    images: ["https://nexusvalvulas.com.br/img/portfolio/valvulas-industriais/valvula_alivio.png"],
    variants: [
      { type: "Alívio Mola", size: "1/2''" },
      { type: "Alívio Mola", size: "3/4''" },
      { type: "Alívio Mola", size: "1''" },
      { type: "Alívio Pilotada", size: "2''" },
      { type: "Alívio Pilotada", size: "3''" }
    ]
  },
  {
    title: "Válvula Diafragma",
    slug: "valvula-diafragma",
    description: "Válvulas diafragma oferecem vedação absoluta e são ideais para fluidos corrosivos e aplicações sanitárias. O diafragma flexível isola completamente o fluido do mecanismo da válvula.",
    category_slug: "valvulas-industriais",
    images: ["https://nexusvalvulas.com.br/img/portfolio/valvulas-industriais/valvula_diafragma.png"],
    variants: [
      { type: "Diafragma Weir", size: "1''" },
      { type: "Diafragma Weir", size: "2''" },
      { type: "Diafragma Straight-way", size: "1''" },
      { type: "Diafragma Straight-way", size: "2''" }
    ]
  },
  {
    title: "Válvula Agulha",
    slug: "valvula-agulha",
    description: "Válvulas agulha proporcionam controle muito preciso de fluxo através de um obturador cônico que se encaixa em um assento também cônico. Ideais para aplicações de alta pressão e controle fino.",
    category_slug: "valvulas-industriais",
    images: ["https://nexusvalvulas.com.br/img/portfolio/valvulas-industriais/valvula_agulha.png"],
    variants: [
      { type: "Agulha Roscada", size: "1/4''" },
      { type: "Agulha Roscada", size: "1/2''" },
      { type: "Agulha Roscada", size: "3/4''" },
      { type: "Agulha Flangeada", size: "1''" }
    ]
  },

  // CONEXÕES
  {
    title: "Cotovelo",
    slug: "cotovelo",
    description: "Conexões cotovelo para mudança de direção em tubulações industriais. Disponíveis em 45° e 90°, diversos materiais e padrões dimensionais.",
    category_slug: "conexoes",
    images: ["https://nexusvalvulas.com.br/img/portfolio/conexoes/cotovelo.png"],
    variants: [
      { type: "Cotovelo 90°", size: "1/2''" },
      { type: "Cotovelo 90°", size: "3/4''" },
      { type: "Cotovelo 90°", size: "1''" },
      { type: "Cotovelo 90°", size: "2''" },
      { type: "Cotovelo 45°", size: "1/2''" },
      { type: "Cotovelo 45°", size: "3/4''" },
      { type: "Cotovelo 45°", size: "1''" }
    ]
  },
  {
    title: "Curva",
    slug: "curva",
    description: "Conexões curva para mudanças suaves de direção em tubulações. Menor perda de carga comparado aos cotovelos, ideais para aplicações que requerem fluxo contínuo.",
    category_slug: "conexoes",
    images: ["https://nexusvalvulas.com.br/img/portfolio/conexoes/curva.png"],
    variants: [
      { type: "Curva 90°", size: "2''" },
      { type: "Curva 90°", size: "3''" },
      { type: "Curva 90°", size: "4''" },
      { type: "Curva 45°", size: "2''" },
      { type: "Curva 45°", size: "3''" }
    ]
  },
  {
    title: "Luva",
    slug: "luva",
    description: "Conexões luva para união de tubos de mesmo diâmetro. Permite fácil montagem e desmontagem para manutenção.",
    category_slug: "conexoes",
    images: ["https://nexusvalvulas.com.br/img/portfolio/conexoes/luva.png"],
    variants: [
      { type: "Luva Roscada", size: "1/2''" },
      { type: "Luva Roscada", size: "3/4''" },
      { type: "Luva Roscada", size: "1''" },
      { type: "Luva Soldada", size: "2''" },
      { type: "Luva Soldada", size: "3''" }
    ]
  },
  {
    title: "Te",
    slug: "te",
    description: "Conexões Tê para derivação em tubulações. Permite divisão ou junção de fluxos em sistemas de tubulação.",
    category_slug: "conexoes",
    images: ["https://nexusvalvulas.com.br/img/portfolio/conexoes/te.png"],
    variants: [
      { type: "Tê Igual", size: "1/2''" },
      { type: "Tê Igual", size: "3/4''" },
      { type: "Tê Igual", size: "1''" },
      { type: "Tê Redução", size: "1'' x 1/2''" },
      { type: "Tê Redução", size: "2'' x 1''" }
    ]
  },
  {
    title: "Redução",
    slug: "reducao",
    description: "Conexões redução para mudança de diâmetro em tubulações. Disponíveis concêntricas e excêntricas conforme a aplicação.",
    category_slug: "conexoes",
    images: ["https://nexusvalvulas.com.br/img/portfolio/conexoes/reducao.png"],
    variants: [
      { type: "Redução Concêntrica", size: "2'' x 1''" },
      { type: "Redução Concêntrica", size: "3'' x 2''" },
      { type: "Redução Excêntrica", size: "2'' x 1''" },
      { type: "Redução Excêntrica", size: "3'' x 2''" }
    ]
  },

  // FLANGES
  {
    title: "Flange SO (Slip-on)",
    slug: "flange-so",
    description: "Flanges Slip-on para conexões de tubulações. Fácil instalação, o tubo desliza através do flange antes da soldagem.",
    category_slug: "flanges",
    images: ["https://nexusvalvulas.com.br/img/portfolio/flanges/flange_so.png"],
    variants: [
      { type: "SO ANSI", size: "150# - 2''" },
      { type: "SO ANSI", size: "150# - 3''" },
      { type: "SO ANSI", size: "300# - 2''" },
      { type: "SO DIN", size: "PN 16 - 2''" }
    ]
  },
  {
    title: "Flange WN (Com Pescoço)",
    slug: "flange-wn",
    description: "Flanges com pescoço para aplicações de alta pressão. Oferece melhor resistência estrutural e vedação.",
    category_slug: "flanges",
    images: ["https://nexusvalvulas.com.br/img/portfolio/flanges/flange_wn.png"],
    variants: [
      { type: "WN ANSI", size: "150# - 2''" },
      { type: "WN ANSI", size: "300# - 2''" },
      { type: "WN ANSI", size: "600# - 2''" },
      { type: "WN DIN", size: "PN 25 - 2''" }
    ]
  },
  {
    title: "Flange Cego",
    slug: "flange-cego",
    description: "Flanges cegos para fechamento de extremidades de tubulações. Utilizados para vedação completa e facilitar manutenção.",
    category_slug: "flanges",
    images: ["https://nexusvalvulas.com.br/img/portfolio/flanges/flange_cego.png"],
    variants: [
      { type: "Cego ANSI", size: "150# - 2''" },
      { type: "Cego ANSI", size: "300# - 2''" },
      { type: "Cego DIN", size: "PN 16 - 2''" }
    ]
  },

  // TUBOS
  {
    title: "Tubo Sem Costura",
    slug: "tubo-sem-costura",
    description: "Tubos sem costura para aplicações de alta pressão. Fabricados por processo de extrusão, sem solda longitudinal.",
    category_slug: "tubos",
    images: ["https://nexusvalvulas.com.br/img/portfolio/tubos/tubo_sem_costura.png"],
    variants: [
      { type: "API 5L Gr.B", size: "2'' Sch 40" },
      { type: "API 5L Gr.B", size: "3'' Sch 40" },
      { type: "ASTM A106", size: "2'' Sch 80" },
      { type: "ASTM A106", size: "4'' Sch 40" }
    ]
  },
  {
    title: "Tubo Com Costura",
    slug: "tubo-com-costura",
    description: "Tubos com costura para aplicações gerais. Produzidos por soldagem longitudinal, adequados para pressões moderadas.",
    category_slug: "tubos",
    images: ["https://nexusvalvulas.com.br/img/portfolio/tubos/tubo_com_costura.png"],
    variants: [
      { type: "ASTM A53", size: "2'' Sch 40" },
      { type: "ASTM A53", size: "3'' Sch 40" },
      { type: "ASTM A53", size: "4'' Sch 40" }
    ]
  },

  // ACESSÓRIOS
  {
    title: "Manômetro",
    slug: "manometro",
    description: "Manômetros para medição de pressão em sistemas industriais. Disponíveis em diversos ranges e precisões.",
    category_slug: "acessorios",
    images: ["https://nexusvalvulas.com.br/img/portfolio/acessorios/manometro.png"],
    variants: [
      { type: "Manômetro Bourdon", size: "0-10 bar" },
      { type: "Manômetro Bourdon", size: "0-16 bar" },
      { type: "Manômetro Digital", size: "0-25 bar" }
    ]
  },
  {
    title: "Termômetro",
    slug: "termometro",
    description: "Termômetros industriais para monitoramento de temperatura. Diversos tipos e faixas de medição.",
    category_slug: "acessorios",
    images: ["https://nexusvalvulas.com.br/img/portfolio/acessorios/termometro.png"],
    variants: [
      { type: "Termômetro Bimetálico", size: "0-150°C" },
      { type: "Termômetro Digital", size: "0-200°C" }
    ]
  },
  {
    title: "Visor de Fluxo",
    slug: "visor-fluxo",
    description: "Visores de fluxo para verificação visual do fluido em tubulações. Permite monitoramento da presença e características do fluxo.",
    category_slug: "acessorios",
    images: ["https://nexusvalvulas.com.br/img/portfolio/acessorios/visor_fluxo.png"],
    variants: [
      { type: "Visor Simples", size: "2''" },
      { type: "Visor com Indicador", size: "2''" }
    ]
  },

  // COMBATE INCÊNDIO
  {
    title: "Hidrante",
    slug: "hidrante",
    description: "Hidrantes para sistemas de combate a incêndio. Equipamentos essenciais para prevenção e combate ao fogo em edificações.",
    category_slug: "combate-incendio",
    images: ["https://nexusvalvulas.com.br/img/portfolio/incendio/hidrante.png"],
    variants: [
      { type: "Hidrante Parede", size: "1,5''" },
      { type: "Hidrante Recalque", size: "2,5''" },
      { type: "Hidrante Coluna", size: "4''" }
    ]
  },
  {
    title: "Esguicho",
    slug: "esguicho",
    description: "Esguichos para sistemas de combate a incêndio. Permitem controle do jato d'água conforme a necessidade do combate.",
    category_slug: "combate-incendio",
    images: ["https://nexusvalvulas.com.br/img/portfolio/incendio/esguicho.png"],
    variants: [
      { type: "Esguicho Regulável", size: "1,5''" },
      { type: "Esguicho Neblina", size: "1,5''" }
    ]
  },
  {
    title: "Mangueira Incêndio",
    slug: "mangueira-incendio",
    description: "Mangueiras para sistemas de combate a incêndio. Resistentes à alta pressão e temperatura.",
    category_slug: "combate-incendio",
    images: ["https://nexusvalvulas.com.br/img/portfolio/incendio/mangueira.png"],
    variants: [
      { type: "Mangueira Tipo 1", size: "1,5'' x 15m" },
      { type: "Mangueira Tipo 2", size: "2,5'' x 15m" }
    ]
  },

  // DIVERSOS
  {
    title: "Engate Rápido",
    slug: "engate-rapido",
    description: "Engates rápidos para conexões temporárias. Permitem montagem e desmontagem rápida sem ferramentas.",
    category_slug: "diversos",
    images: ["https://nexusvalvulas.com.br/img/portfolio/diversos/engate_rapido.png"],
    variants: [
      { type: "Engate Pneumático", size: "1/4''" },
      { type: "Engate Hidráulico", size: "1/2''" }
    ]
  },
  {
    title: "Grampo U",
    slug: "grampo-u",
    description: "Grampos em U para fixação de tubulações. Proporcionam suporte seguro e permitem movimento térmico.",
    category_slug: "diversos",
    images: ["https://nexusvalvulas.com.br/img/portfolio/diversos/grampo_u.png"],
    variants: [
      { type: "Grampo U", size: "2''" },
      { type: "Grampo U", size: "3''" },
      { type: "Grampo U", size: "4''" }
    ]
  },
  {
    title: "Fita Veda Rosca",
    slug: "fita-veda-rosca",
    description: "Fita veda rosca para vedação de conexões roscadas. Produto essencial para vedação eficiente.",
    category_slug: "diversos",
    images: ["https://nexusvalvulas.com.br/img/portfolio/diversos/fita_veda_rosca.png"],
    variants: [
      { type: "Fita PTFE", size: "12mm x 5m" },
      { type: "Fita PTFE", size: "19mm x 10m" }
    ]
  }
];

// Categorias completas
const allCategories = [
  { name: 'Válvulas Industriais', description: 'Válvulas para controle de fluxo industrial: Gaveta, Globo, Esfera, Retenção, Borboleta, Guilhotina, Mangote, Alívio, Diafragma', slug: 'valvulas-industriais' },
  { name: 'Conexões', description: 'Conexões industriais para tubulações: Cotovelo, Curva, Luva, Bucha, Bujao, Cap, Te, Redução, Niple, União, Cruzeta, Pestana, Colar', slug: 'conexoes' },
  { name: 'Flanges', description: 'Flanges para conexões de tubulações industriais: SO (Slip-on), Com Pescoço (WN), Cego, Liso (Sobreposto Plano), Roscado, Encaixe (SW), Solto', slug: 'flanges' },
  { name: 'Tubos', description: 'Tubos industriais para diversas aplicações: Sem Costura, Com Costura, Industriais, Para Caldeira, Galvanizados, Eletrodutos, Zincados', slug: 'tubos' },
  { name: 'Acessórios', description: 'Acessórios industriais para válvulas e tubulações: Manômetro, Termometro, Torneira e Tubo Sifão, Visor de Fluxo, Filtro, Purgador', slug: 'acessorios' },
  { name: 'Combate Incêndio', description: 'Equipamentos para sistemas de combate a incêndio: Adaptador, Tampão, Chave Storz, Esguicho, Coluna Hidrante, Mangueira, Abrigo, Canhão, Válvula', slug: 'combate-incendio' },
  { name: 'Diversos', description: 'Produtos diversos para aplicações industriais: Engate Rápido, Espigão, Grampo U, Fita veda rosca', slug: 'diversos' }
];

async function addAllCategories() {
  console.log("🏗️ Verificando e adicionando categorias...");
  
  try {
    const { data: existingCategories, error: fetchError } = await supabase
      .from('categories')
      .select('slug');
    
    if (fetchError) {
      console.error('❌ Erro ao buscar categorias existentes:', fetchError);
      return false;
    }
    
    const existingSlugs = existingCategories.map(cat => cat.slug);
    const categoriesToAdd = allCategories.filter(cat => !existingSlugs.includes(cat.slug));
    
    if (categoriesToAdd.length === 0) {
      console.log("✅ Todas as categorias já existem.");
      return true;
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert(categoriesToAdd)
      .select();
    
    if (error) {
      console.error('❌ Erro ao adicionar categorias:', error);
      return false;
    }
    
    console.log(`✅ ${data.length} categorias adicionadas com sucesso.`);
    return true;
  } catch (error) {
    console.error('❌ Erro durante a adição de categorias:', error);
    return false;
  }
}

async function importAllProducts() {
  console.log("📦 Iniciando importação completa de produtos...");
  
  try {
    // Obter todas as categorias
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, slug');
    
    if (categoriesError) {
      console.error('❌ Erro ao buscar categorias:', categoriesError);
      return;
    }
    
    console.log(`📋 Encontradas ${categories.length} categorias`);
    
    // Criar mapa de categorias
    const categoryMap = {};
    categories.forEach(category => {
      categoryMap[category.slug] = category.id;
    });
    
    let importedCount = 0;
    let skippedCount = 0;
    
    // Importar cada produto
    for (const product of completeProductsData) {
      const categoryId = categoryMap[product.category_slug];
      
      if (!categoryId) {
        console.warn(`⚠️ Categoria não encontrada: ${product.category_slug} para produto ${product.title}`);
        continue;
      }
      
      // Verificar se produto já existe
      const { data: existingProduct } = await supabase
        .from('products')
        .select('id')
        .eq('slug', product.slug)
        .single();
      
      if (existingProduct) {
        console.log(`⏭️ Produto ${product.title} já existe, pulando...`);
        skippedCount++;
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
        console.error(`❌ Erro ao inserir produto ${product.title}:`, productError);
        continue;
      }
      
      console.log(`✅ Produto inserido: ${product.title}`);
      
      // Inserir imagens
      if (product.images && product.images.length > 0) {
        const imageRecords = product.images.map((url, index) => ({
          product_id: insertedProduct.id,
          url: url,
          position: index
        }));
        
        const { error: imagesError } = await supabase
          .from('product_images')
          .insert(imageRecords);
        
        if (imagesError) {
          console.error(`❌ Erro ao inserir imagens para ${product.title}:`, imagesError);
        } else {
          console.log(`🖼️ Imagens inseridas para: ${product.title}`);
        }
      }
      
      // Inserir variantes
      if (product.variants && product.variants.length > 0) {
        const variantRecords = product.variants.map(variant => ({
          product_id: insertedProduct.id,
          type: variant.type,
          size: variant.size || "Padrão",
          specifications: variant.specifications || null
        }));
        
        const { error: variantError } = await supabase
          .from('product_variants')
          .insert(variantRecords);
        
        if (variantError) {
          console.error(`❌ Erro ao inserir variantes para ${product.title}:`, variantError);
        } else {
          console.log(`🔧 ${product.variants.length} variantes inseridas para: ${product.title}`);
        }
      }
      
      importedCount++;
    }
    
    console.log(`\n🎉 Importação concluída!`);
    console.log(`📊 Resumo:`);
    console.log(`   • ${importedCount} produtos novos importados`);
    console.log(`   • ${skippedCount} produtos já existentes`);
    console.log(`   • ${completeProductsData.length} produtos processados`);
    
  } catch (error) {
    console.error('❌ Erro durante a importação:', error);
  }
}

// Executar importação completa
async function runCompleteImport() {
  console.log("🚀 Iniciando importação completa do catálogo Nexus Válvulas...\n");
  
  const categoriesSuccess = await addAllCategories();
  if (!categoriesSuccess) {
    console.error("❌ Falha ao adicionar categorias. Interrompendo importação.");
    return;
  }
  
  console.log(); // Linha em branco
  await importAllProducts();
  
  console.log("\n✨ Processo de importação completo finalizado!");
}

// Executar
runCompleteImport();
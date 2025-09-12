// Script para importar apenas as variantes da válvula esfera
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - usando as credenciais do seu projeto
const SUPABASE_URL = 'https://yyxhxbenjgzcoavzjltc.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eGh4YmVuamd6Y29hdnpqbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzM0OTcyNCwiZXhwIjoyMDcyOTI1NzI0fQ.BoiIvRdFvQCY-vf86EfXReylBPvd2KRUTlmLTqbary8';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Variantes da Válvula Esfera
const valveVariants = [
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
];

async function importValveVariants() {
  console.log("Iniciando importação das variantes da válvula esfera...");
  
  try {
    // Primeiro, vamos encontrar o produto "Válvula Esfera"
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('id')
      .ilike('title', '%esfera%')
      .single();

    if (productError) {
      console.error('Erro ao buscar produto:', productError);
      return;
    }

    if (!productData) {
      console.log('Produto "Válvula Esfera" não encontrado');
      return;
    }

    console.log('Produto encontrado:', productData.id);

    // Agora vamos inserir as variantes
    const variantRecords = valveVariants.map(variant => ({
      product_id: productData.id,
      type: variant.type,
      size: variant.size
    }));

    const { data, error } = await supabase
      .from('product_variants')
      .insert(variantRecords)
      .select();

    if (error) {
      console.error('Erro ao inserir variantes:', error);
      return;
    }

    console.log(`${data.length} variantes inseridas com sucesso!`);
    data.forEach((variant, index) => {
      console.log(`  ${index + 1}. ${variant.type} - ${variant.size}`);
    });
  } catch (error) {
    console.error('Erro durante a importação:', error);
  }
}

// Executar a função
importValveVariants();
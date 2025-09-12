// Script para verificar as variantes da válvula esfera
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - usando as credenciais do seu projeto
const SUPABASE_URL = 'https://yyxhxbenjgzcoavzjltc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eGh4YmVuamd6Y29hdnpqbHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDk3MjQsImV4cCI6MjA3MjkyNTcyNH0.BoiIvRdFvQCY-vf86EfXReylBPvd2KRUTlmLTqbary8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkValveVariants() {
  console.log("Verificando variantes da válvula esfera...");
  
  try {
    // Primeiro, vamos encontrar o produto "válvula esfera"
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .ilike('title', '%esfera%')
      .single();

    if (productError) {
      console.error('Erro ao buscar produto:', productError);
      return;
    }

    if (!productData) {
      console.log('Produto "válvula esfera" não encontrado');
      return;
    }

    console.log('Produto encontrado:', productData.title);
    console.log('ID do produto:', productData.id);

    // Agora vamos buscar as variantes desse produto
    const { data: variantsData, error: variantsError } = await supabase
      .from('product_variants')
      .select(`
        *,
        drawings:variant_drawings(url)
      `)
      .eq('product_id', productData.id);

    if (variantsError) {
      console.error('Erro ao buscar variantes:', variantsError);
      return;
    }

    console.log(`Encontradas ${variantsData.length} variantes:`);
    variantsData.forEach((variant, index) => {
      console.log(`\nVariante ${index + 1}:`);
      console.log(`  ID: ${variant.id}`);
      console.log(`  Tipo: ${variant.type}`);
      console.log(`  Tamanho: ${variant.size}`);
      console.log(`  Especificações:`, variant.specifications);
      console.log(`  Desenho:`, variant.drawings?.[0]?.url || 'Nenhum');
    });
  } catch (error) {
    console.error('Erro durante a verificação:', error);
  }
}

// Executar a função
checkValveVariants();
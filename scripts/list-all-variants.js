// Script para listar todas as variantes cadastradas
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - usando as credenciais do seu projeto
const SUPABASE_URL = 'https://yyxhxbenjgzcoavzjltc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eGh4YmVuamd6Y29hdnpqbHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDk3MjQsImV4cCI6MjA3MjkyNTcyNH0.BoiIvRdFvQCY-vf86EfXReylBPvd2KRUTlmLTqbary8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function listAllVariants() {
  console.log("Listando todas as variantes cadastradas...");
  
  try {
    // Buscar todas as variantes
    const { data: variantsData, error: variantsError } = await supabase
      .from('product_variants')
      .select(`
        *,
        drawings:variant_drawings(url),
        product:products(title)
      `)
      .order('product_id, type, size');

    if (variantsError) {
      console.error('Erro ao buscar variantes:', variantsError);
      return;
    }

    console.log(`Encontradas ${variantsData.length} variantes:`);
    variantsData.forEach((variant, index) => {
      console.log(`\nVariante ${index + 1}:`);
      console.log(`  ID: ${variant.id}`);
      console.log(`  Produto: ${variant.product?.title || variant.product_id}`);
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
listAllVariants();
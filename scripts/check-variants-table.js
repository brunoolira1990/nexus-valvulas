// Script para verificar a estrutura da tabela de variantes
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - usando as credenciais do seu projeto
const SUPABASE_URL = 'https://yyxhxbenjgzcoavzjltc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eGh4YmVuamd6Y29hdnpqbHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDk3MjQsImV4cCI6MjA3MjkyNTcyNH0.BoiIvRdFvQCY-vf86EfXReylBPvd2KRUTlmLTqbary8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function checkVariantsTable() {
  console.log("Verificando a estrutura da tabela de variantes...");
  
  try {
    // Verificar se a tabela product_variants existe e tem dados
    const { data, error, count } = await supabase
      .from('product_variants')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('Erro ao acessar a tabela product_variants:', error);
      return;
    }

    console.log(`Total de registros na tabela product_variants: ${count}`);
    
    if (data && data.length > 0) {
      console.log('Amostra dos dados:');
      data.slice(0, 3).forEach((variant, index) => {
        console.log(`\nRegistro ${index + 1}:`, variant);
      });
    } else {
      console.log('A tabela está vazia.');
    }
    
    // Verificar se a tabela variant_drawings existe e tem dados
    const { data: drawingsData, error: drawingsError, count: drawingsCount } = await supabase
      .from('variant_drawings')
      .select('*', { count: 'exact' });

    if (drawingsError) {
      console.error('Erro ao acessar a tabela variant_drawings:', drawingsError);
      return;
    }

    console.log(`\nTotal de registros na tabela variant_drawings: ${drawingsCount}`);
    
    if (drawingsData && drawingsData.length > 0) {
      console.log('Amostra dos dados de desenhos:');
      drawingsData.slice(0, 3).forEach((drawing, index) => {
        console.log(`\nRegistro ${index + 1}:`, drawing);
      });
    } else {
      console.log('A tabela de desenhos está vazia.');
    }
  } catch (error) {
    console.error('Erro durante a verificação:', error);
  }
}

// Executar a função
checkVariantsTable();
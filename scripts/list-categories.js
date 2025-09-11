// Script para listar categorias existentes
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - usando as credenciais do seu projeto
const SUPABASE_URL = 'https://yyxhxbenjgzcoavzjltc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eGh4YmVuamd6Y29hdnpqbHRjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNDk3MjQsImV4cCI6MjA3MjkyNTcyNH0.BoiIvRdFvQCY-vf86EfXReylBPvd2KRUTlmLTqbary8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function listCategories() {
  console.log("Buscando categorias...");
  
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*');
    
    if (error) {
      console.error('Erro ao buscar categorias:', error);
      return;
    }
    
    console.log(`Encontradas ${data.length} categorias:`);
    data.forEach(category => {
      console.log(`- ${category.name} (slug: ${category.slug})`);
    });
  } catch (error) {
    console.error('Erro durante a busca:', error);
  }
}

// Executar a função
listCategories();
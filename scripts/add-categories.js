// Script para adicionar categorias que estão faltando no banco de dados
import { createClient } from '@supabase/supabase-js';

// Configuração do Supabase - usando as credenciais do seu projeto
const SUPABASE_URL = 'https://yyxhxbenjgzcoavzjltc.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5eGh4YmVuamd6Y29hdnpqbHRjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NzM0OTcyNCwiZXhwIjoyMDcyOTI1NzI0fQ.BoiIvRdFvQCY-vf86EfXReylBPvd2KRUTlmLTqbary8';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

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
  console.log("Iniciando adição de categorias...");
  
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
    
    console.log(`${data.length} categorias adicionadas com sucesso:`, data.map(cat => cat.name));
  } catch (error) {
    console.error('Erro durante a adição de categorias:', error);
  }
}

// Executar a função
addCategories();
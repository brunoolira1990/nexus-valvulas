// scripts/clear-products-storage.js
// Uso: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente e rode: node scripts/clear-products-storage.js
// ATENÇÃO: este script apaga arquivos no bucket 'products' permanentemente. Use com cuidado.

const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = 'products';

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Erro: defina SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });

async function listAll(path = '') {
  const all = [];
  let page = 1;
  const per = 1000;
  while (true) {
    const { data, error } = await supabase.storage.from(BUCKET).list(path, { limit: per, offset: (page - 1) * per });
    if (error) throw error;
    if (!data || data.length === 0) break;

    for (const item of data) {
      if (item.type === 'file') {
        all.push((path ? path + '/' : '') + item.name);
      } else if (item.type === 'folder') {
        // recurse into folder
        const nested = await listAll((path ? path + '/' : '') + item.name);
        all.push(...nested);
      }
    }

    if (data.length < per) break;
    page++;
  }
  return all;
}

async function removeAll() {
  try {
    console.log('Listando arquivos...');
    const paths = await listAll('');
    if (paths.length === 0) {
      console.log('Bucket vazio. Nada a remover.');
      return;
    }

    console.log(`Encontrados ${paths.length} arquivos. Removendo...`);
    // Supabase remove() aceita até 1000 paths por chamada
    const BATCH = 1000;
    for (let i = 0; i < paths.length; i += BATCH) {
      const batch = paths.slice(i, i + BATCH);
      const { error } = await supabase.storage.from(BUCKET).remove(batch);
      if (error) throw error;
      console.log(`Removidos ${i + batch.length}/${paths.length}`);
    }

    console.log('Remoção concluída.');
  } catch (err) {
    console.error('Erro durante remoção:', err.message || err);
    process.exit(1);
  }
}

removeAll();

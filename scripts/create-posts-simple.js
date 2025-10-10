// Script simples para criar posts do blog
const posts = [
  {
    title: "Guia Completo de Válvulas Industriais: Tipos e Aplicações",
    slug: "guia-completo-valvulas-industriais-tipos-aplicacoes",
    content: `<h2>Introdução</h2>
<p>As válvulas industriais são componentes essenciais em sistemas de controle de fluidos, desempenhando um papel crucial na segurança, eficiência e controle de processos industriais.</p>

<h2>Tipos de Válvulas</h2>
<h3>Válvulas de Gaveta</h3>
<p>As válvulas de gaveta são ideais para aplicações que requerem fluxo linear e baixa perda de carga. São amplamente utilizadas em sistemas de água e óleo.</p>

<h3>Válvulas de Esfera</h3>
<p>Oferecem excelente vedação e são ideais para controle on/off. Sua operação rápida e confiável as torna populares em aplicações críticas.</p>

<h3>Válvulas de Borboleta</h3>
<p>Compactas e econômicas, são perfeitas para aplicações de grande diâmetro onde o espaço é limitado.</p>

<h2>Considerações de Seleção</h2>
<ul>
  <li>Pressão e temperatura de operação</li>
  <li>Tipo de fluido</li>
  <li>Requisitos de vedação</li>
  <li>Frequência de operação</li>
</ul>

<h2>Conclusão</h2>
<p>A seleção correta da válvula é fundamental para o sucesso de qualquer sistema industrial. Consulte sempre um especialista para garantir a melhor escolha para sua aplicação.</p>`,
    summary: "Descubra os principais tipos de válvulas industriais, suas aplicações e como escolher a válvula ideal para seu sistema.",
    cover_image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop",
    published: true,
    meta_description: "Guia completo sobre válvulas industriais: tipos, aplicações e critérios de seleção para sistemas de controle de fluidos.",
    keywords: ["válvulas industriais", "controle de fluidos", "sistemas industriais", "válvulas de gaveta", "válvulas de esfera"]
  },
  {
    title: "Manutenção Preventiva em Sistemas de Válvulas",
    slug: "manutencao-preventiva-sistemas-valvulas",
    content: `<h2>Importância da Manutenção Preventiva</h2>
<p>A manutenção preventiva é fundamental para garantir a confiabilidade e longevidade dos sistemas de válvulas industriais.</p>

<h2>Programa de Manutenção</h2>
<h3>Inspeção Visual</h3>
<p>Verificação regular de vazamentos, corrosão e desgaste dos componentes.</p>

<h3>Testes de Funcionamento</h3>
<p>Operação periódica das válvulas para verificar suavidade e tempo de resposta.</p>

<h3>Lubrificação</h3>
<p>Aplicação regular de lubrificantes adequados para cada tipo de válvula.</p>

<h2>Frequência de Manutenção</h2>
<ul>
  <li>Inspeção diária: válvulas críticas</li>
  <li>Inspeção semanal: válvulas principais</li>
  <li>Inspeção mensal: válvulas auxiliares</li>
  <li>Manutenção completa: semestral</li>
</ul>

<h2>Benefícios</h2>
<p>A manutenção preventiva reduz custos operacionais, aumenta a segurança e prolonga a vida útil dos equipamentos.</p>`,
    summary: "Aprenda como implementar um programa eficaz de manutenção preventiva para sistemas de válvulas industriais.",
    cover_image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=400&fit=crop",
    published: true,
    meta_description: "Guia de manutenção preventiva para válvulas industriais: cronograma, procedimentos e benefícios.",
    keywords: ["manutenção preventiva", "válvulas industriais", "manutenção industrial", "confiabilidade"]
  }
];

// Função para inserir posts via API
async function createPosts() {
  const API_BASE = 'http://localhost:4000';
  
  for (const post of posts) {
    try {
      const response = await fetch(`${API_BASE}/blog/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...post,
          published_date: new Date().toISOString()
        })
      });
      
      if (response.ok) {
        console.log('Post criado:', post.title);
      } else {
        console.error('Erro ao criar post:', post.title, await response.text());
      }
    } catch (error) {
      console.error('Erro ao criar post:', post.title, error);
    }
  }
}

createPosts();


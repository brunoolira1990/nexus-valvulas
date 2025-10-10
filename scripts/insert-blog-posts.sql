-- Inserir posts de exemplo no blog
INSERT INTO public.blog_posts (
  title, 
  slug, 
  content, 
  summary, 
  cover_image, 
  published, 
  published_date, 
  meta_description, 
  keywords
) VALUES 
(
  'Guia Completo de Válvulas Industriais: Tipos e Aplicações',
  'guia-completo-valvulas-industriais-tipos-aplicacoes',
  '<h2>Introdução</h2><p>As válvulas industriais são componentes essenciais em sistemas de controle de fluidos, desempenhando um papel crucial na segurança, eficiência e controle de processos industriais.</p><h2>Tipos de Válvulas</h2><h3>Válvulas de Gaveta</h3><p>As válvulas de gaveta são ideais para aplicações que requerem fluxo linear e baixa perda de carga. São amplamente utilizadas em sistemas de água e óleo.</p><h3>Válvulas de Esfera</h3><p>Oferecem excelente vedação e são ideais para controle on/off. Sua operação rápida e confiável as torna populares em aplicações críticas.</p><h3>Válvulas de Borboleta</h3><p>Compactas e econômicas, são perfeitas para aplicações de grande diâmetro onde o espaço é limitado.</p><h2>Considerações de Seleção</h2><ul><li>Pressão e temperatura de operação</li><li>Tipo de fluido</li><li>Requisitos de vedação</li><li>Frequência de operação</li></ul><h2>Conclusão</h2><p>A seleção correta da válvula é fundamental para o sucesso de qualquer sistema industrial. Consulte sempre um especialista para garantir a melhor escolha para sua aplicação.</p>',
  'Descubra os principais tipos de válvulas industriais, suas aplicações e como escolher a válvula ideal para seu sistema.',
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop',
  true,
  NOW(),
  'Guia completo sobre válvulas industriais: tipos, aplicações e critérios de seleção para sistemas de controle de fluidos.',
  ARRAY['válvulas industriais', 'controle de fluidos', 'sistemas industriais', 'válvulas de gaveta', 'válvulas de esfera']
),
(
  'Manutenção Preventiva em Sistemas de Válvulas',
  'manutencao-preventiva-sistemas-valvulas',
  '<h2>Importância da Manutenção Preventiva</h2><p>A manutenção preventiva é fundamental para garantir a confiabilidade e longevidade dos sistemas de válvulas industriais.</p><h2>Programa de Manutenção</h2><h3>Inspeção Visual</h3><p>Verificação regular de vazamentos, corrosão e desgaste dos componentes.</p><h3>Testes de Funcionamento</h3><p>Operação periódica das válvulas para verificar suavidade e tempo de resposta.</p><h3>Lubrificação</h3><p>Aplicação regular de lubrificantes adequados para cada tipo de válvula.</p><h2>Frequência de Manutenção</h2><ul><li>Inspeção diária: válvulas críticas</li><li>Inspeção semanal: válvulas principais</li><li>Inspeção mensal: válvulas auxiliares</li><li>Manutenção completa: semestral</li></ul><h2>Benefícios</h2><p>A manutenção preventiva reduz custos operacionais, aumenta a segurança e prolonga a vida útil dos equipamentos.</p>',
  'Aprenda como implementar um programa eficaz de manutenção preventiva para sistemas de válvulas industriais.',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=400&fit=crop',
  true,
  NOW(),
  'Guia de manutenção preventiva para válvulas industriais: cronograma, procedimentos e benefícios.',
  ARRAY['manutenção preventiva', 'válvulas industriais', 'manutenção industrial', 'confiabilidade']
),
(
  'Tendências em Automação de Válvulas Industriais',
  'tendencias-automacao-valvulas-industriais',
  '<h2>Evolução da Automação</h2><p>A indústria 4.0 está revolucionando o controle de válvulas com tecnologias avançadas de automação e monitoramento.</p><h2>Principais Tendências</h2><h3>Válvulas Inteligentes</h3><p>Sensores integrados e comunicação digital para monitoramento em tempo real.</p><h3>IoT e Conectividade</h3><p>Integração com sistemas de gestão e análise de dados para otimização de processos.</p><h3>Atuadores Inteligentes</h3><p>Controle preciso e diagnóstico avançado de falhas.</p><h2>Benefícios da Automação</h2><ul><li>Redução de custos operacionais</li><li>Maior precisão no controle</li><li>Diagnóstico preventivo</li><li>Integração com sistemas de gestão</li></ul><h2>Futuro da Automação</h2><p>A inteligência artificial e machine learning estão abrindo novas possibilidades para otimização automática de processos.</p>',
  'Explore as principais tendências em automação de válvulas industriais e como a tecnologia está transformando o setor.',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
  true,
  NOW(),
  'Tendências em automação de válvulas industriais: IoT, válvulas inteligentes e indústria 4.0.',
  ARRAY['automação industrial', 'válvulas inteligentes', 'IoT', 'indústria 4.0', 'tecnologia industrial']
),
(
  'Segurança em Sistemas de Válvulas: Normas e Práticas',
  'seguranca-sistemas-valvulas-normas-praticas',
  '<h2>Importância da Segurança</h2><p>A segurança em sistemas de válvulas é fundamental para proteger trabalhadores, equipamentos e o meio ambiente.</p><h2>Normas de Segurança</h2><h3>NR-12</h3><p>Norma regulamentadora que estabelece requisitos mínimos para segurança em máquinas e equipamentos.</p><h3>ISO 9001</h3><p>Sistema de gestão da qualidade que inclui procedimentos de segurança.</p><h3>ASME B16.34</h3><p>Padrão americano para válvulas de aço fundido e forjado.</p><h2>Práticas de Segurança</h2><ul><li>Bloqueio e etiquetagem (LOTO)</li><li>Pressurização adequada</li><li>Uso de EPIs</li><li>Treinamento de operadores</li></ul><h2>Inspeção e Testes</h2><p>Testes regulares de pressão, vazamento e funcionamento são essenciais para garantir a segurança.</p><h2>Conclusão</h2><p>A segurança deve ser sempre a prioridade em qualquer operação com válvulas industriais.</p>',
  'Conheça as principais normas de segurança e práticas recomendadas para sistemas de válvulas industriais.',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=800&h=400&fit=crop',
  true,
  NOW(),
  'Normas de segurança para válvulas industriais: NR-12, ISO 9001, práticas de segurança e inspeção.',
  ARRAY['segurança industrial', 'normas de segurança', 'válvulas industriais', 'NR-12', 'ISO 9001']
),
(
  'Sustentabilidade na Indústria de Válvulas',
  'sustentabilidade-industria-valvulas',
  '<h2>Sustentabilidade Industrial</h2><p>A indústria de válvulas está cada vez mais focada em práticas sustentáveis e eficiência energética.</p><h2>Materiais Sustentáveis</h2><h3>Aços Reciclados</h3><p>Uso de aços com alto teor de material reciclado para reduzir impacto ambiental.</p><h3>Revestimentos Ecológicos</h3><p>Tratamentos de superfície que reduzem o uso de produtos químicos agressivos.</p><h2>Eficiência Energética</h2><p>Válvulas com menor perda de carga e atuadores de baixo consumo energético.</p><h2>Certificações Ambientais</h2><ul><li>ISO 14001 - Gestão Ambiental</li><li>Certificação LEED</li><li>Conformidade com regulamentações ambientais</li></ul><h2>Economia Circular</h2><p>Programas de recondicionamento e reciclagem de válvulas usadas.</p><h2>Futuro Sustentável</h2><p>A inovação contínua em materiais e processos está criando um futuro mais sustentável para a indústria.</p>',
  'Descubra como a indústria de válvulas está se tornando mais sustentável com novos materiais e práticas ecológicas.',
  'https://images.unsplash.com/photo-1542601906990-b06d3b784695?w=800&h=400&fit=crop',
  true,
  NOW(),
  'Sustentabilidade na indústria de válvulas: materiais ecológicos, eficiência energética e economia circular.',
  ARRAY['sustentabilidade', 'válvulas ecológicas', 'eficiência energética', 'economia circular', 'ISO 14001']
);


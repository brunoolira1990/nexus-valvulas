# Checklist de Verificação Pré-Produção - Nexus Válvulas

## 📋 Lista de Verificação Completa

### 🔧 Configuração do Ambiente

- [ ] **Backend**
  - [ ] Variáveis de ambiente configuradas (.env.production)
  - [ ] Conexão com PostgreSQL verificada
  - [ ] JWT_SECRET alterado para valor forte
  - [ ] PUBLIC_URL configurada corretamente
  - [ ] Porta configurada (padrão 4000)

- [ ] **Frontend**
  - [ ] Variáveis de ambiente configuradas (.env.production)
  - [ ] VITE_API_BASE apontando para API em produção
  - [ ] Build de produção gerado com `npm run build:prod`

- [ ] **Banco de Dados**
  - [ ] PostgreSQL instalado e rodando
  - [ ] Banco de dados criado
  - [ ] Migrações do Prisma aplicadas
  - [ ] Credenciais de acesso configuradas
  - [ ] Backup do banco de dados existente

### 🌐 Servidor e Infraestrutura

- [ ] **Nginx/Apache**
  - [ ] Configuração de servidor web criada
  - [ ] SSL/TLS configurado (Let's Encrypt)
  - [ ] Redirecionamento HTTP para HTTPS
  - [ ] Headers de segurança configurados
  - [ ] Compressão gzip/brotli habilitada
  - [ ] Cache configurado para assets estáticos

- [ ] **Domínios**
  - [ ] DNS configurado corretamente
  - [ ] Registros A/CNAME criados
  - [ ] Subdomínios configurados (api.nexusvalvulas.com.br)

- [ ] **Firewall e Segurança**
  - [ ] Portas necessárias abertas (80, 443, 4000)
  - [ ] Firewall configurado
  - [ ] Fail2ban ou similar instalado
  - [ ] SSH configurado com chave

### 🚀 Deployment

- [ ] **Backend**
  - [ ] Código atualizado no servidor
  - [ ] Dependências instaladas (`npm install --production`)
  - [ ] Prisma client gerado (`npx prisma generate`)
  - [ ] Migrações aplicadas (`npx prisma migrate deploy`)
  - [ ] Aplicação iniciada com PM2
  - [ ] PM2 configurado para reiniciar automaticamente

- [ ] **Frontend**
  - [ ] Build de produção gerado
  - [ ] Arquivos estáticos copiados para diretório web
  - [ ] Permissões de arquivos configuradas

### 🔍 Testes

- [ ] **Funcionalidade**
  - [ ] Navegação entre páginas
  - [ ] Formulário de contato
  - [ ] Visualização de produtos
  - [ ] Visualização de blog posts
  - [ ] Funcionalidades administrativas
  - [ ] Upload de imagens/arquivos

- [ ] **Performance**
  - [ ] Tempo de carregamento < 3 segundos
  - [ ] Core Web Vitals aprovados
  - [ ] Otimização de imagens
  - [ ] Compressão de assets

- [ ] **Responsividade**
  - [ ] Layout em dispositivos móveis
  - [ ] Touch targets apropriados
  - [ ] Navegação em mobile

- [ ] **SEO**
  - [ ] Meta tags corretas
  - [ ] Open Graph e Twitter Cards
  - [ ] Sitemap.xml acessível
  - [ ] Robots.txt configurado
  - [ ] URLs canônicas

### 🛡️ Segurança

- [ ] **Aplicação**
  - [ ] JWT_SECRET forte configurado
  - [ ] Cabeçalhos de segurança (CSP, X-Frame-Options, etc.)
  - [ ] Rate limiting implementado
  - [ ] Validação de entrada em formulários
  - [ ] Proteção contra CSRF

- [ ] **Servidor**
  - [ ] Atualizações de segurança aplicadas
  - [ ] Usuário não-root para aplicação
  - [ ] Permissões restritas em arquivos sensíveis
  - [ ] Logs configurados

### 📊 Monitoramento

- [ ] **Logs**
  - [ ] Sistema de logs configurado
  - [ ] Rotação de logs configurada
  - [ ] Monitoramento de erros configurado

- [ ] **Analytics**
  - [ ] Google Analytics configurado
  - [ ] Web Vitals configurado
  - [ ] Monitoramento de uptime

- [ ] **Alertas**
  - [ ] Alertas de erro configurados
  - [ ] Alertas de performance configurados
  - [ ] Notificações de downtime

### 📝 Documentação

- [ ] **Processos**
  - [ ] Documentação de deployment atualizada
  - [ ] Procedimentos de backup documentados
  - [ ] Plano de rollback criado

- [ ] **Acesso**
  - [ ] Credenciais de produção armazenadas com segurança
  - [ ] Acesso a servidores documentado
  - [ ] Contatos de suporte técnico

### 🆘 Contingência

- [ ] **Backup**
  - [ ] Backup automático do banco de dados
  - [ ] Backup dos arquivos da aplicação
  - [ ] Backup dos arquivos estáticos

- [ ] **Plano B**
  - [ ] Procedimento de rollback documentado
  - [ ] Contatos de emergência
  - [ ] Provedor de hosting alternativo (se necessário)

## ✅ Verificação Final

Antes de ir para produção, execute todos os testes abaixo:

### Testes Automatizados
- [ ] `npm run build:prod` (sem erros)
- [ ] `npm run lint` (sem erros)
- [ ] `npm run test:run` (se houver testes)

### Testes Manuais
- [ ] Acessar site em diferentes navegadores
- [ ] Testar todas as páginas principais
- [ ] Testar formulários
- [ ] Verificar carregamento de imagens
- [ ] Testar funcionalidades administrativas

### Testes de Performance
- [ ] Google PageSpeed Insights > 90
- [ ] Lighthouse performance > 90
- [ ] Tempo de carregamento < 3 segundos

### Testes de Segurança
- [ ] SSL Labs A+ rating
- [ ] Headers de segurança verificados
- [ ] Vulnerabilidades conhecidas verificadas

## 🚨 Go Live

Quando todos os itens acima estiverem marcados:

1. [ ] Fazer backup completo do ambiente atual
2. [ ] Atualizar DNS para apontar para novo servidor
3. [ ] Monitorar de perto nas primeiras 24 horas
4. [ ] Verificar analytics e monitoramento
5. [ ] Documentar qualquer problema encontrado

## 📞 Suporte

Para suporte durante o deployment, entre em contato com a equipe de desenvolvimento.
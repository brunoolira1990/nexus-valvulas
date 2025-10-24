# 🚀 Guia Git - Nexus Válvulas Windows 11 Pro

## 📋 Status Atual do Projeto

O projeto já está conectado ao Git e tem várias modificações e arquivos novos para serem commitados.

### 📁 Arquivos Novos Criados
- `DATABASE-GUIDE.md` - Guia do banco de dados
- `Dockerfile.frontend.windows` - Frontend Docker para Windows
- `README-WINDOWS-PRODUCTION.md` - Documentação de produção
- `backend/Dockerfile.windows` - Backend Docker para Windows
- `backend/prisma/migrations/20241219000000_init_postgresql/` - Migração PostgreSQL
- `backend/prisma/schema-postgresql.prisma` - Schema Prisma PostgreSQL
- `backup-database.ps1` - Script de backup do banco
- `deploy-windows.ps1` - Script de deploy
- `docker-compose.windows-prod.yml` - Compose para Windows
- `env.windows.production` - Variáveis de ambiente Windows
- `generate-ssl.ps1` - Gerador de certificados SSL
- `manage-windows.ps1` - Gerenciador de containers
- `monitoring/` - Configurações de monitoramento
- `nginx-frontend-windows.conf` - Configuração Nginx frontend
- `nginx/nginx-windows.conf` - Configuração Nginx principal
- `postgresql.conf` - Configuração PostgreSQL
- `setup-database.ps1` - Script de configuração do banco
- `setup-windows.ps1` - Script de configuração inicial

### 📝 Arquivos Modificados
- `backend/src/index.js` - Modificações no backend

---

## 🚀 Comandos para Subir para o Git

### 1️⃣ Adicionar Todos os Arquivos
```powershell
# Adicionar todos os arquivos novos e modificados
git add .

# Ou adicionar arquivos específicos
git add DATABASE-GUIDE.md README-WINDOWS-PRODUCTION.md
git add docker-compose.windows-prod.yml
git add backend/Dockerfile.windows
git add *.ps1
git add nginx/
git add monitoring/
```

### 2️⃣ Verificar o que será commitado
```powershell
# Ver status dos arquivos
git status

# Ver diferenças dos arquivos modificados
git diff backend/src/index.js
```

### 3️⃣ Fazer Commit
```powershell
# Commit com mensagem descritiva
git commit -m "feat: Adiciona configuração completa para Windows 11 Pro

- Configuração Docker otimizada para Windows
- Scripts PowerShell para deploy e gerenciamento
- Configuração PostgreSQL com migrações
- Sistema de backup e restore
- Documentação completa de produção
- Configurações Nginx otimizadas
- Monitoramento com Prometheus
- Certificados SSL para desenvolvimento local"
```

### 4️⃣ Push para o Repositório
```powershell
# Push para a branch main
git push origin main

# Ou push para uma nova branch
git checkout -b feature/windows-production-setup
git push origin feature/windows-production-setup
```

---

## 🌿 Estratégias de Branch

### Branch Principal
- `main` - Branch principal de produção

### Branches de Desenvolvimento
- `develop` - Branch de desenvolvimento
- `feature/nome-da-feature` - Novas funcionalidades
- `hotfix/nome-do-fix` - Correções urgentes
- `release/versao` - Preparação de releases

### Exemplo de Workflow
```powershell
# Criar branch para nova feature
git checkout -b feature/windows-production-setup

# Fazer commits
git add .
git commit -m "feat: Adiciona configuração Windows"

# Push da branch
git push origin feature/windows-production-setup

# Criar Pull Request no GitHub
# Após aprovação, merge para main
```

---

## 📝 Convenções de Commit

### Formato
```
tipo(escopo): descrição

Corpo da mensagem (opcional)

Rodapé (opcional)
```

### Tipos de Commit
- `feat` - Nova funcionalidade
- `fix` - Correção de bug
- `docs` - Documentação
- `style` - Formatação, sem mudança de código
- `refactor` - Refatoração de código
- `test` - Adição de testes
- `chore` - Tarefas de manutenção
- `ci` - Mudanças em CI/CD
- `build` - Mudanças no sistema de build

### Exemplos
```powershell
git commit -m "feat(docker): Adiciona configuração Windows 11 Pro"
git commit -m "fix(database): Corrige migração PostgreSQL"
git commit -m "docs: Adiciona guia de produção Windows"
git commit -m "chore: Atualiza dependências do projeto"
```

---

## 🔧 Configurações Git Recomendadas

### Configuração Global
```powershell
# Configurar usuário
git config --global user.name "Bruno Lira"
git config --global user.email "seu-email@exemplo.com"

# Configurar editor
git config --global core.editor "code --wait"

# Configurar merge tool
git config --global merge.tool vscode

# Configurar branch padrão
git config --global init.defaultBranch main

# Configurar autocrlf para Windows
git config --global core.autocrlf true
```

### Configuração do Projeto
```powershell
# Configurar branch principal
git config branch.main.remote origin
git config branch.main.merge refs/heads/main

# Configurar pull strategy
git config pull.rebase false
```

---

## 📋 .gitignore Atualizado

Verificar se o `.gitignore` inclui:

```gitignore
# Dependências
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/
.next/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output/

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Docker
.dockerignore

# Database
*.db
*.sqlite
*.sqlite3

# Backup files
backup/
*.backup

# SSL certificates (desenvolvimento)
ssl/
*.pem
*.key
*.crt

# Data directories
data/
uploads/

# Logs específicos
logs/
*.log

# Temporary files
tmp/
temp/
```

---

## 🔄 Workflow de Desenvolvimento

### 1. Clone do Repositório
```powershell
git clone https://github.com/seu-usuario/nexus-valvulas.git
cd nexus-valvulas
```

### 2. Configuração Inicial
```powershell
# Instalar dependências
npm install
cd backend && npm install && cd ..

# Configurar ambiente
cp env.example env.windows.production
# Editar env.windows.production com suas configurações
```

### 3. Desenvolvimento
```powershell
# Criar branch para feature
git checkout -b feature/nova-funcionalidade

# Fazer alterações
# ... código ...

# Commit das alterações
git add .
git commit -m "feat: Adiciona nova funcionalidade"

# Push da branch
git push origin feature/nova-funcionalidade
```

### 4. Pull Request
1. Ir para GitHub
2. Criar Pull Request
3. Revisar código
4. Merge após aprovação

---

## 🚨 Comandos de Emergência

### Desfazer Último Commit
```powershell
# Desfazer commit mantendo alterações
git reset --soft HEAD~1

# Desfazer commit removendo alterações
git reset --hard HEAD~1
```

### Desfazer Alterações Não Commitadas
```powershell
# Desfazer alterações em arquivo específico
git checkout -- arquivo.js

# Desfazer todas as alterações
git checkout -- .
```

### Recuperar Arquivo Deletado
```powershell
# Ver histórico de commits
git log --oneline

# Recuperar arquivo de commit específico
git checkout commit-hash -- arquivo.js
```

### Forçar Push (CUIDADO!)
```powershell
# Apenas se necessário e com certeza
git push --force origin main
```

---

## 📊 Comandos Úteis

### Visualizar Histórico
```powershell
# Histórico simples
git log --oneline

# Histórico com gráfico
git log --graph --oneline --all

# Histórico de arquivo específico
git log -- arquivo.js
```

### Comparar Branches
```powershell
# Diferenças entre branches
git diff main..develop

# Arquivos diferentes entre branches
git diff --name-only main..develop
```

### Stash (Salvar Temporariamente)
```powershell
# Salvar alterações temporariamente
git stash

# Listar stashes
git stash list

# Aplicar último stash
git stash pop

# Aplicar stash específico
git stash apply stash@{0}
```

---

## 🔐 Segurança

### Nunca Commitar
- Senhas e tokens
- Chaves privadas
- Dados sensíveis
- Arquivos de configuração com credenciais

### Sempre Commitar
- Código fonte
- Documentação
- Configurações de exemplo
- Scripts de build
- Testes

---

## 📞 Suporte Git

### Recursos Úteis
- [Git Documentation](https://git-scm.com/doc)
- [GitHub Docs](https://docs.github.com/)
- [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/)

### Comandos de Ajuda
```powershell
# Ajuda geral
git help

# Ajuda de comando específico
git help commit
git help push
git help pull
```

---

**🎉 Projeto pronto para ser commitado e enviado para o Git!**
# Guia Rápido - Banco de Dados PostgreSQL - Nexus Válvulas Windows 11 Pro

## 🚀 Configuração Inicial do Banco

### 1. Primeiro Deploy (Configuração Completa)
```powershell
# Execute como Administrador
.\setup-database.ps1 -Action setup
```

Este comando irá:
- ✅ Aguardar o banco ficar pronto
- ✅ Criar o banco de dados `nexus_valvulas`
- ✅ Executar todas as migrações do Prisma
- ✅ Gerar o cliente Prisma
- ✅ Criar dados iniciais (usuário admin, categorias, produtos de exemplo)

### 2. Apenas Criar o Banco
```powershell
.\setup-database.ps1 -Action create
```

### 3. Apenas Executar Migrações
```powershell
.\setup-database.ps1 -Action migrate
```

### 4. Apenas Criar Dados Iniciais
```powershell
.\setup-database.ps1 -Action seed
```

## 🔄 Gerenciamento do Banco

### Resetar Banco (CUIDADO!)
```powershell
# ⚠️ Isso apaga TODOS os dados!
.\setup-database.ps1 -Action reset
```

### Ver Informações do Banco
```powershell
.\setup-database.ps1 -Action info
```

## 💾 Backup e Restore

### Fazer Backup
```powershell
# Backup automático com timestamp
.\backup-database.ps1 -Action backup

# Backup com nome específico
.\backup-database.ps1 -Action backup -BackupName "backup_antes_atualizacao"
```

### Listar Backups Disponíveis
```powershell
.\backup-database.ps1 -Action list
```

### Restaurar Backup
```powershell
# ⚠️ Isso apaga os dados atuais!
.\backup-database.ps1 -Action restore -BackupName "nexus_backup_20241219_143022"
```

### Limpar Backups Antigos
```powershell
# Manter apenas últimos 30 dias (padrão)
.\backup-database.ps1 -Action clean

# Manter apenas últimos 7 dias
.\backup-database.ps1 -Action clean -RetentionDays 7
```

## 🔧 Comandos Docker Diretos

### Acessar Banco via psql
```powershell
# Conectar ao banco
docker exec -it nexus-database-win psql -U nexus_user -d nexus_valvulas

# Comandos úteis no psql:
# \l                    - Listar bancos
# \dt                   - Listar tabelas
# \d tabela            - Descrever tabela
# \q                   - Sair
```

### Executar Comandos SQL
```powershell
# Executar arquivo SQL
docker exec -i nexus-database-win psql -U nexus_user -d nexus_valvulas < arquivo.sql

# Executar comando SQL direto
docker exec nexus-database-win psql -U nexus_user -d nexus_valvulas -c "SELECT COUNT(*) FROM \"User\";"
```

### Prisma Commands
```powershell
# Gerar cliente Prisma
docker exec nexus-backend-win npx prisma generate

# Ver status das migrações
docker exec nexus-backend-win npx prisma migrate status

# Executar migrações pendentes
docker exec nexus-backend-win npx prisma migrate deploy

# Resetar banco (Prisma)
docker exec nexus-backend-win npx prisma migrate reset

# Abrir Prisma Studio
docker exec nexus-backend-win npx prisma studio
```

## 📊 Monitoramento

### Ver Logs do Banco
```powershell
# Logs em tempo real
docker logs nexus-database-win -f

# Últimas 100 linhas
docker logs nexus-database-win --tail=100
```

### Verificar Status do Container
```powershell
# Status do container
docker inspect nexus-database-win | Select-String -Pattern "Status"

# Uso de recursos
docker stats nexus-database-win --no-stream
```

### Verificar Conexões
```powershell
# Testar conectividade
docker exec nexus-database-win pg_isready -U nexus_user -d nexus_valvulas

# Ver conexões ativas
docker exec nexus-database-win psql -U nexus_user -d nexus_valvulas -c "SELECT * FROM pg_stat_activity;"
```

## 🗂️ Estrutura do Banco

### Tabelas Principais
- **User** - Usuários do sistema
- **Category** - Categorias de produtos
- **Product** - Produtos
- **Variant** - Variações dos produtos
- **Quote** - Solicitações de orçamento
- **BlogPost** - Posts do blog
- **ContactMessage** - Mensagens de contato

### Usuário Administrador Padrão
- **Email**: admin@nexusvalvulas.com.br
- **Senha**: admin123
- **Role**: ADMIN

## 🚨 Solução de Problemas

### Banco não conecta
```powershell
# Verificar se container está rodando
docker ps | findstr nexus-database-win

# Reiniciar container
docker restart nexus-database-win

# Verificar logs
docker logs nexus-database-win
```

### Erro de migração
```powershell
# Verificar status
docker exec nexus-backend-win npx prisma migrate status

# Resetar migrações (CUIDADO!)
docker exec nexus-backend-win npx prisma migrate reset --force
```

### Banco corrompido
```powershell
# Restaurar do último backup
.\backup-database.ps1 -Action restore -BackupName "ultimo_backup_valido"

# Ou resetar completamente
.\setup-database.ps1 -Action reset
```

### Problemas de performance
```powershell
# Verificar queries lentas
docker exec nexus-database-win psql -U nexus_user -d nexus_valvulas -c "
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;"

# Verificar tamanho do banco
docker exec nexus-database-win psql -U nexus_user -d nexus_valvulas -c "
SELECT pg_size_pretty(pg_database_size('nexus_valvulas'));"
```

## 📈 Otimizações Recomendadas

### Configurações PostgreSQL
- **shared_buffers**: 256MB
- **effective_cache_size**: 1GB
- **work_mem**: 4MB
- **maintenance_work_mem**: 64MB

### Índices Importantes
- Email do usuário (único)
- Slug das categorias (único)
- Slug dos produtos (único)
- Slug dos posts do blog (único)

### Backup Automático
Configure no Task Scheduler do Windows para executar diariamente:
```powershell
.\backup-database.ps1 -Action backup
```

## 🔐 Segurança

### Alterar Senhas Padrão
1. Edite `env.windows.production`
2. Altere `POSTGRES_PASSWORD`
3. Reinicie os containers:
```powershell
.\manage-windows.ps1 -Action restart
```

### Backup de Segurança
- Faça backup antes de atualizações importantes
- Mantenha backups em local seguro
- Teste restores periodicamente

---

**💡 Dica**: Sempre faça backup antes de operações que podem alterar dados!

**📞 Suporte**: Para problemas específicos, consulte os logs e a documentação completa.
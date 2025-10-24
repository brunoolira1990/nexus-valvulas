# Script PowerShell para Configuração do Banco PostgreSQL - Nexus Válvulas Windows 11 Pro
# Execute como Administrador

param(
    [string]$Action = "setup",
    [string]$DatabaseName = "nexus_valvulas",
    [string]$Username = "nexus_user",
    [string]$Password = "",
    [switch]$Force = $false,
    [switch]$SkipSeed = $false
)

# Configurações
$ProjectName = "nexus-valvulas-win"
$ComposeFile = "docker-compose.windows-prod.yml"
$BackendDir = ".\backend"
$PrismaDir = "$BackendDir\prisma"

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"
$Cyan = "Cyan"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Test-DockerRunning {
    try {
        docker version | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

function Test-ContainerRunning {
    param([string]$ContainerName)
    
    try {
        $status = docker inspect --format='{{.State.Status}}' $ContainerName 2>$null
        return $status -eq "running"
    }
    catch {
        return $false
    }
}

function Wait-ForDatabase {
    Write-ColorOutput "Aguardando banco de dados ficar pronto..." $Blue
    
    $maxAttempts = 30
    $attempt = 0
    
    do {
        Start-Sleep -Seconds 2
        $attempt++
        
        try {
            $result = docker exec nexus-database-win pg_isready -U $Username -d $DatabaseName 2>$null
            if ($LASTEXITCODE -eq 0) {
                Write-ColorOutput "✓ Banco de dados está pronto!" $Green
                return $true
            }
        }
        catch {
            # Continua tentando
        }
        
        Write-ColorOutput "Tentativa $attempt/$maxAttempts..." $Yellow
        
    } while ($attempt -lt $maxAttempts)
    
    Write-ColorOutput "✗ Timeout aguardando banco de dados" $Red
    return $false
}

function Create-Database {
    Write-ColorOutput "Criando banco de dados '$DatabaseName'..." $Blue
    
    try {
        # Verificar se o banco já existe
        $dbExists = docker exec nexus-database-win psql -U $Username -lqt | cut -d \| -f 1 | grep -w $DatabaseName
        
        if ($dbExists -and !$Force) {
            Write-ColorOutput "⚠️  Banco '$DatabaseName' já existe. Use -Force para recriar." $Yellow
            return $true
        }
        
        if ($dbExists -and $Force) {
            Write-ColorOutput "Removendo banco existente..." $Yellow
            docker exec nexus-database-win psql -U $Username -c "DROP DATABASE IF EXISTS $DatabaseName;"
        }
        
        # Criar banco de dados
        docker exec nexus-database-win psql -U $Username -c "CREATE DATABASE $DatabaseName;"
        
        Write-ColorOutput "✓ Banco de dados '$DatabaseName' criado com sucesso!" $Green
        return $true
    }
    catch {
        Write-ColorOutput "✗ Erro ao criar banco de dados: $($_.Exception.Message)" $Red
        return $false
    }
}

function Run-PrismaMigrations {
    Write-ColorOutput "Executando migrações do Prisma..." $Blue
    
    try {
        # Navegar para o diretório do backend
        Push-Location $BackendDir
        
        # Gerar cliente Prisma
        Write-ColorOutput "Gerando cliente Prisma..." $Yellow
        docker exec nexus-backend-win npx prisma generate
        
        # Executar migrações
        Write-ColorOutput "Executando migrações..." $Yellow
        docker exec nexus-backend-win npx prisma migrate deploy
        
        # Verificar status das migrações
        Write-ColorOutput "Verificando status das migrações..." $Yellow
        docker exec nexus-backend-win npx prisma migrate status
        
        Pop-Location
        
        Write-ColorOutput "✓ Migrações executadas com sucesso!" $Green
        return $true
    }
    catch {
        Write-ColorOutput "✗ Erro ao executar migrações: $($_.Exception.Message)" $Red
        Pop-Location
        return $false
    }
}

function Create-SeedData {
    if ($SkipSeed) {
        Write-ColorOutput "Seed de dados pulado conforme solicitado." $Yellow
        return $true
    }
    
    Write-ColorOutput "Criando dados iniciais..." $Blue
    
    try {
        # Criar arquivo de seed se não existir
        $seedFile = "$BackendDir\prisma\seed.js"
        if (!(Test-Path $seedFile)) {
            Write-ColorOutput "Criando arquivo de seed..." $Yellow
            Create-SeedFile
        }
        
        # Executar seed
        Write-ColorOutput "Executando seed..." $Yellow
        docker exec nexus-backend-win node prisma/seed.js
        
        Write-ColorOutput "✓ Dados iniciais criados com sucesso!" $Green
        return $true
    }
    catch {
        Write-ColorOutput "✗ Erro ao criar dados iniciais: $($_.Exception.Message)" $Red
        return $false
    }
}

function Create-SeedFile {
    $seedContent = @"
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');
    
    try {
        // Criar usuário administrador
        const adminPassword = await bcrypt.hash('admin123', 10);
        const admin = await prisma.user.upsert({
            where: { email: 'admin@nexusvalvulas.com.br' },
            update: {},
            create: {
                email: 'admin@nexusvalvulas.com.br',
                password: adminPassword,
                name: 'Administrador',
                role: 'ADMIN'
            }
        });
        console.log('✓ Usuário administrador criado:', admin.email);
        
        // Criar categorias de exemplo
        const categories = [
            {
                name: 'Válvulas de Controle',
                slug: 'valvulas-controle',
                description: 'Válvulas de controle para aplicações industriais'
            },
            {
                name: 'Válvulas de Segurança',
                slug: 'valvulas-seguranca',
                description: 'Válvulas de segurança para proteção de equipamentos'
            },
            {
                name: 'Válvulas de Retenção',
                slug: 'valvulas-retencao',
                description: 'Válvulas de retenção para controle de fluxo'
            }
        ];
        
        for (const categoryData of categories) {
            const category = await prisma.category.upsert({
                where: { slug: categoryData.slug },
                update: {},
                create: categoryData
            });
            console.log('✓ Categoria criada:', category.name);
        }
        
        // Criar produtos de exemplo
        const products = [
            {
                title: 'Válvula de Controle Pneumática',
                slug: 'valvula-controle-pneumatica',
                description: 'Válvula de controle pneumática para aplicações industriais',
                categorySlug: 'valvulas-controle'
            },
            {
                title: 'Válvula de Segurança Alívio',
                slug: 'valvula-seguranca-alivio',
                description: 'Válvula de segurança para alívio de pressão',
                categorySlug: 'valvulas-seguranca'
            }
        ];
        
        for (const productData of products) {
            const category = await prisma.category.findUnique({
                where: { slug: productData.categorySlug }
            });
            
            if (category) {
                const product = await prisma.product.upsert({
                    where: { slug: productData.slug },
                    update: {},
                    create: {
                        title: productData.title,
                        slug: productData.slug,
                        description: productData.description,
                        categoryId: category.id
                    }
                });
                console.log('✓ Produto criado:', product.title);
            }
        }
        
        // Criar post de blog de exemplo
        const blogPost = await prisma.blogPost.upsert({
            where: { slug: 'bem-vindo-nexus-valvulas' },
            update: {},
            create: {
                title: 'Bem-vindo à Nexus Válvulas',
                slug: 'bem-vindo-nexus-valvulas',
                content: 'Bem-vindo ao nosso site! Aqui você encontrará informações sobre nossos produtos e serviços.',
                summary: 'Post de boas-vindas da Nexus Válvulas',
                published: true,
                published_date: new Date(),
                meta_description: 'Bem-vindo à Nexus Válvulas - especialistas em válvulas industriais',
                keywords: ['válvulas', 'industria', 'controle', 'segurança']
            }
        });
        console.log('✓ Post de blog criado:', blogPost.title);
        
        console.log('🎉 Seed concluído com sucesso!');
        
    } catch (error) {
        console.error('❌ Erro durante o seed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
"@
    
    Set-Content -Path "$BackendDir\prisma\seed.js" -Value $seedContent
}

function Show-DatabaseInfo {
    Write-ColorOutput "`n=== INFORMAÇÕES DO BANCO DE DADOS ===" $Blue
    
    try {
        # Informações da conexão
        Write-ColorOutput "`n📊 Conexão:" $Yellow
        Write-ColorOutput "  Host: localhost" $White
        Write-ColorOutput "  Porta: 5432" $White
        Write-ColorOutput "  Banco: $DatabaseName" $White
        Write-ColorOutput "  Usuário: $Username" $White
        
        # Estatísticas do banco
        Write-ColorOutput "`n📈 Estatísticas:" $Yellow
        $stats = docker exec nexus-database-win psql -U $Username -d $DatabaseName -c "
            SELECT 
                schemaname,
                tablename,
                n_tup_ins as inserts,
                n_tup_upd as updates,
                n_tup_del as deletes
            FROM pg_stat_user_tables 
            ORDER BY schemaname, tablename;
        " 2>$null
        
        if ($stats) {
            Write-ColorOutput $stats $White
        }
        
        # Usuários criados
        Write-ColorOutput "`n👥 Usuários:" $Yellow
        $users = docker exec nexus-backend-win npx prisma db execute --stdin <<< "SELECT email, name, role FROM \"User\";" 2>$null
        if ($users) {
            Write-ColorOutput $users $White
        }
        
    }
    catch {
        Write-ColorOutput "Erro ao obter informações do banco: $($_.Exception.Message)" $Red
    }
}

function Reset-Database {
    Write-ColorOutput "⚠️  ATENÇÃO: Isso irá APAGAR todos os dados do banco!" $Red
    $confirm = Read-Host "Digite 'CONFIRMAR' para continuar"
    
    if ($confirm -ne "CONFIRMAR") {
        Write-ColorOutput "Operação cancelada." $Yellow
        return
    }
    
    Write-ColorOutput "Resetando banco de dados..." $Blue
    
    try {
        # Parar containers
        docker-compose -f $ComposeFile -p $ProjectName stop backend
        
        # Remover volumes do banco
        docker volume rm nexus-valvulas-win_postgres_data_win
        
        # Reiniciar containers
        docker-compose -f $ComposeFile -p $ProjectName up -d database
        
        # Aguardar banco ficar pronto
        Wait-ForDatabase
        
        # Recriar banco
        Create-Database
        
        # Executar migrações
        Run-PrismaMigrations
        
        # Criar dados iniciais
        Create-SeedData
        
        # Reiniciar backend
        docker-compose -f $ComposeFile -p $ProjectName up -d backend
        
        Write-ColorOutput "✓ Banco de dados resetado com sucesso!" $Green
        
    }
    catch {
        Write-ColorOutput "✗ Erro ao resetar banco: $($_.Exception.Message)" $Red
    }
}

function Show-Help {
    Write-ColorOutput "=== CONFIGURADOR DE BANCO POSTGRESQL - NEXUS VÁLVULAS ===" $Blue
    Write-ColorOutput ""
    Write-ColorOutput "Uso: .\setup-database.ps1 -Action <ação> [opções]" $Yellow
    Write-ColorOutput ""
    Write-ColorOutput "Ações disponíveis:" $Green
    Write-ColorOutput "  setup    - Configuração completa do banco (padrão)" $White
    Write-ColorOutput "  create   - Criar apenas o banco de dados" $White
    Write-ColorOutput "  migrate  - Executar apenas as migrações" $White
    Write-ColorOutput "  seed     - Executar apenas o seed de dados" $White
    Write-ColorOutput "  reset    - Resetar completamente o banco" $White
    Write-ColorOutput "  info     - Mostrar informações do banco" $White
    Write-ColorOutput ""
    Write-ColorOutput "Opções:" $Green
    Write-ColorOutput "  -DatabaseName <nome> - Nome do banco (padrão: nexus_valvulas)" $White
    Write-ColorOutput "  -Username <user>     - Usuário do banco (padrão: nexus_user)" $White
    Write-ColorOutput "  -Password <senha>    - Senha do banco" $White
    Write-ColorOutput "  -Force               - Forçar recriação do banco" $White
    Write-ColorOutput "  -SkipSeed            - Pular criação de dados iniciais" $White
    Write-ColorOutput ""
    Write-ColorOutput "Exemplos:" $Green
    Write-ColorOutput "  .\setup-database.ps1 -Action setup" $White
    Write-ColorOutput "  .\setup-database.ps1 -Action create -Force" $White
    Write-ColorOutput "  .\setup-database.ps1 -Action reset" $White
}

# Função principal
function Main {
    Write-ColorOutput "=== CONFIGURADOR DE BANCO POSTGRESQL - NEXUS VÁLVULAS ===" $Blue
    Write-ColorOutput "Ação: $Action" $Yellow
    Write-ColorOutput "Banco: $DatabaseName" $Yellow
    Write-ColorOutput "Usuário: $Username" $Yellow
    
    # Verificações iniciais
    if (!(Test-Administrator)) {
        Write-ColorOutput "❌ Este script deve ser executado como Administrador!" $Red
        exit 1
    }
    
    if (!(Test-DockerRunning)) {
        Write-ColorOutput "❌ Docker não está rodando!" $Red
        exit 1
    }
    
    if (!(Test-ContainerRunning "nexus-database-win")) {
        Write-ColorOutput "❌ Container do banco não está rodando!" $Red
        Write-ColorOutput "Execute primeiro: .\deploy-windows.ps1" $Yellow
        exit 1
    }
    
    # Executar ação solicitada
    switch ($Action.ToLower()) {
        "setup" {
            Write-ColorOutput "`n🚀 Configuração completa do banco de dados..." $Blue
            
            if (!(Wait-ForDatabase)) { exit 1 }
            if (!(Create-Database)) { exit 1 }
            if (!(Run-PrismaMigrations)) { exit 1 }
            if (!(Create-SeedData)) { exit 1 }
            
            Write-ColorOutput "`n✅ CONFIGURAÇÃO COMPLETA!" $Green
            Show-DatabaseInfo
        }
        
        "create" {
            Write-ColorOutput "`n📊 Criando banco de dados..." $Blue
            if (!(Wait-ForDatabase)) { exit 1 }
            if (!(Create-Database)) { exit 1 }
        }
        
        "migrate" {
            Write-ColorOutput "`n🔄 Executando migrações..." $Blue
            if (!(Run-PrismaMigrations)) { exit 1 }
        }
        
        "seed" {
            Write-ColorOutput "`n🌱 Executando seed..." $Blue
            if (!(Create-SeedData)) { exit 1 }
        }
        
        "reset" {
            Reset-Database
        }
        
        "info" {
            Show-DatabaseInfo
        }
        
        default {
            Show-Help
        }
    }
}

# Executar função principal
Main
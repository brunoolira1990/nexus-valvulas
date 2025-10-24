# Script PowerShell para Deploy em Produção - Nexus Válvulas Windows 11 Pro
# Execute como Administrador

param(
    [string]$Environment = "production",
    [switch]$SkipBuild = $false,
    [switch]$SkipBackup = $false,
    [switch]$Force = $false
)

# Configurações
$ProjectName = "nexus-valvulas-win"
$ComposeFile = "docker-compose.windows-prod.yml"
$EnvFile = "env.windows.production"
$BackupDir = ".\backup"
$DataDir = ".\data"

# Cores para output
$Red = "Red"
$Green = "Green"
$Yellow = "Yellow"
$Blue = "Blue"

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

function Test-DockerComposeFile {
    if (Test-Path $ComposeFile) {
        return $true
    }
    else {
        Write-ColorOutput "Arquivo $ComposeFile não encontrado!" $Red
        return $false
    }
}

function Test-EnvFile {
    if (Test-Path $EnvFile) {
        return $true
    }
    else {
        Write-ColorOutput "Arquivo $EnvFile não encontrado!" $Red
        return $false
    }
}

function Create-Directories {
    Write-ColorOutput "Criando diretórios necessários..." $Blue
    
    $directories = @(
        "$DataDir\postgres",
        "$DataDir\uploads",
        "$DataDir\logs",
        "$DataDir\nginx-logs",
        "$DataDir\nginx-cache",
        "$DataDir\redis",
        "$DataDir\prometheus",
        "$BackupDir"
    )
    
    foreach ($dir in $directories) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-ColorOutput "Criado: $dir" $Green
        }
        else {
            Write-ColorOutput "Já existe: $dir" $Yellow
        }
    }
}

function Backup-Database {
    if ($SkipBackup) {
        Write-ColorOutput "Backup pulado conforme solicitado." $Yellow
        return
    }
    
    Write-ColorOutput "Fazendo backup do banco de dados..." $Blue
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "$BackupDir\nexus_backup_$timestamp.sql"
    
    try {
        docker exec nexus-database-win pg_dump -U nexus_user -d nexus_valvulas > $backupFile
        Write-ColorOutput "Backup criado: $backupFile" $Green
    }
    catch {
        Write-ColorOutput "Erro ao criar backup: $($_.Exception.Message)" $Red
    }
}

function Stop-Containers {
    Write-ColorOutput "Parando containers existentes..." $Blue
    
    try {
        docker-compose -f $ComposeFile -p $ProjectName down
        Write-ColorOutput "Containers parados com sucesso." $Green
    }
    catch {
        Write-ColorOutput "Erro ao parar containers: $($_.Exception.Message)" $Red
    }
}

function Build-Images {
    if ($SkipBuild) {
        Write-ColorOutput "Build pulado conforme solicitado." $Yellow
        return
    }
    
    Write-ColorOutput "Construindo imagens Docker..." $Blue
    
    try {
        docker-compose -f $ComposeFile -p $ProjectName build --no-cache
        Write-ColorOutput "Imagens construídas com sucesso." $Green
    }
    catch {
        Write-ColorOutput "Erro ao construir imagens: $($_.Exception.Message)" $Red
        exit 1
    }
}

function Start-Containers {
    Write-ColorOutput "Iniciando containers..." $Blue
    
    try {
        docker-compose -f $ComposeFile -p $ProjectName up -d
        Write-ColorOutput "Containers iniciados com sucesso." $Green
    }
    catch {
        Write-ColorOutput "Erro ao iniciar containers: $($_.Exception.Message)" $Red
        exit 1
    }
}

function Wait-ForServices {
    Write-ColorOutput "Aguardando serviços ficarem prontos..." $Blue
    
    $services = @("nexus-database-win", "nexus-backend-win", "nexus-frontend-win", "nexus-nginx-win")
    
    foreach ($service in $services) {
        Write-ColorOutput "Aguardando $service..." $Yellow
        $maxAttempts = 30
        $attempt = 0
        
        do {
            Start-Sleep -Seconds 2
            $attempt++
            $status = docker inspect --format='{{.State.Health.Status}}' $service 2>$null
            
            if ($status -eq "healthy") {
                Write-ColorOutput "$service está saudável!" $Green
                break
            }
            elseif ($attempt -eq $maxAttempts) {
                Write-ColorOutput "$service não ficou saudável após $maxAttempts tentativas." $Red
            }
        } while ($attempt -lt $maxAttempts -and $status -ne "healthy")
    }
}

function Show-Status {
    Write-ColorOutput "`n=== STATUS DOS CONTAINERS ===" $Blue
    docker-compose -f $ComposeFile -p $ProjectName ps
    
    Write-ColorOutput "`n=== LOGS DOS SERVIÇOS ===" $Blue
    Write-ColorOutput "Para ver logs em tempo real, execute:" $Yellow
    Write-ColorOutput "docker-compose -f $ComposeFile -p $ProjectName logs -f" $Yellow
    
    Write-ColorOutput "`n=== ACESSO À APLICAÇÃO ===" $Blue
    Write-ColorOutput "Frontend: http://localhost" $Green
    Write-ColorOutput "Backend API: http://localhost/api" $Green
    Write-ColorOutput "Prometheus: http://localhost:9090" $Green
}

function Cleanup-OldImages {
    Write-ColorOutput "Limpando imagens antigas..." $Blue
    
    try {
        docker image prune -f
        Write-ColorOutput "Imagens antigas removidas." $Green
    }
    catch {
        Write-ColorOutput "Erro ao limpar imagens: $($_.Exception.Message)" $Red
    }
}

# Função principal
function Main {
    Write-ColorOutput "=== NEXUS VÁLVULAS - DEPLOY WINDOWS 11 PRO ===" $Blue
    Write-ColorOutput "Ambiente: $Environment" $Yellow
    Write-ColorOutput "Arquivo Compose: $ComposeFile" $Yellow
    Write-ColorOutput "Arquivo Env: $EnvFile" $Yellow
    
    # Verificações iniciais
    if (!(Test-Administrator)) {
        Write-ColorOutput "Este script deve ser executado como Administrador!" $Red
        exit 1
    }
    
    if (!(Test-DockerRunning)) {
        Write-ColorOutput "Docker não está rodando! Inicie o Docker Desktop." $Red
        exit 1
    }
    
    if (!(Test-DockerComposeFile)) {
        Write-ColorOutput "Arquivo docker-compose não encontrado!" $Red
        exit 1
    }
    
    if (!(Test-EnvFile)) {
        Write-ColorOutput "Arquivo de ambiente não encontrado!" $Red
        exit 1
    }
    
    # Execução do deploy
    try {
        Create-Directories
        Backup-Database
        Stop-Containers
        Build-Images
        Start-Containers
        Wait-ForServices
        Cleanup-OldImages
        Show-Status
        
        Write-ColorOutput "`n=== DEPLOY CONCLUÍDO COM SUCESSO! ===" $Green
    }
    catch {
        Write-ColorOutput "Erro durante o deploy: $($_.Exception.Message)" $Red
        exit 1
    }
}

# Executar função principal
Main
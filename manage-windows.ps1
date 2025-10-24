# Script PowerShell para Gerenciamento de Containers - Nexus Válvulas Windows 11 Pro
# Execute como Administrador

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("start", "stop", "restart", "status", "logs", "clean", "backup", "restore")]
    [string]$Action,
    
    [string]$Service = "",
    [switch]$Follow = $false
)

# Configurações
$ProjectName = "nexus-valvulas-win"
$ComposeFile = "docker-compose.windows-prod.yml"
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

function Start-Services {
    Write-ColorOutput "Iniciando serviços..." $Blue
    
    try {
        if ($Service) {
            docker-compose -f $ComposeFile -p $ProjectName up -d $Service
            Write-ColorOutput "Serviço $Service iniciado." $Green
        }
        else {
            docker-compose -f $ComposeFile -p $ProjectName up -d
            Write-ColorOutput "Todos os serviços iniciados." $Green
        }
    }
    catch {
        Write-ColorOutput "Erro ao iniciar serviços: $($_.Exception.Message)" $Red
    }
}

function Stop-Services {
    Write-ColorOutput "Parando serviços..." $Blue
    
    try {
        if ($Service) {
            docker-compose -f $ComposeFile -p $ProjectName stop $Service
            Write-ColorOutput "Serviço $Service parado." $Green
        }
        else {
            docker-compose -f $ComposeFile -p $ProjectName down
            Write-ColorOutput "Todos os serviços parados." $Green
        }
    }
    catch {
        Write-ColorOutput "Erro ao parar serviços: $($_.Exception.Message)" $Red
    }
}

function Restart-Services {
    Write-ColorOutput "Reiniciando serviços..." $Blue
    
    try {
        if ($Service) {
            docker-compose -f $ComposeFile -p $ProjectName restart $Service
            Write-ColorOutput "Serviço $Service reiniciado." $Green
        }
        else {
            docker-compose -f $ComposeFile -p $ProjectName restart
            Write-ColorOutput "Todos os serviços reiniciados." $Green
        }
    }
    catch {
        Write-ColorOutput "Erro ao reiniciar serviços: $($_.Exception.Message)" $Red
    }
}

function Show-Status {
    Write-ColorOutput "=== STATUS DOS CONTAINERS ===" $Blue
    docker-compose -f $ComposeFile -p $ProjectName ps
    
    Write-ColorOutput "`n=== USO DE RECURSOS ===" $Blue
    docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
    
    Write-ColorOutput "`n=== VOLUMES ===" $Blue
    docker volume ls --filter name=$ProjectName
    
    Write-ColorOutput "`n=== REDES ===" $Blue
    docker network ls --filter name=$ProjectName
}

function Show-Logs {
    Write-ColorOutput "Exibindo logs..." $Blue
    
    try {
        if ($Service) {
            if ($Follow) {
                docker-compose -f $ComposeFile -p $ProjectName logs -f $Service
            }
            else {
                docker-compose -f $ComposeFile -p $ProjectName logs --tail=100 $Service
            }
        }
        else {
            if ($Follow) {
                docker-compose -f $ComposeFile -p $ProjectName logs -f
            }
            else {
                docker-compose -f $ComposeFile -p $ProjectName logs --tail=50
            }
        }
    }
    catch {
        Write-ColorOutput "Erro ao exibir logs: $($_.Exception.Message)" $Red
    }
}

function Clean-System {
    Write-ColorOutput "Limpando sistema Docker..." $Blue
    
    try {
        # Parar todos os containers
        docker-compose -f $ComposeFile -p $ProjectName down
        
        # Remover containers órfãos
        docker container prune -f
        
        # Remover imagens não utilizadas
        docker image prune -f
        
        # Remover volumes não utilizados
        docker volume prune -f
        
        # Remover redes não utilizadas
        docker network prune -f
        
        Write-ColorOutput "Sistema limpo com sucesso." $Green
    }
    catch {
        Write-ColorOutput "Erro ao limpar sistema: $($_.Exception.Message)" $Red
    }
}

function Backup-Database {
    Write-ColorOutput "Fazendo backup do banco de dados..." $Blue
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "$BackupDir\nexus_backup_$timestamp.sql"
    
    try {
        # Criar diretório de backup se não existir
        if (!(Test-Path $BackupDir)) {
            New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
        }
        
        # Fazer backup
        docker exec nexus-database-win pg_dump -U nexus_user -d nexus_valvulas > $backupFile
        
        Write-ColorOutput "Backup criado: $backupFile" $Green
        
        # Comprimir backup
        Compress-Archive -Path $backupFile -DestinationPath "$backupFile.zip" -Force
        Remove-Item $backupFile
        Write-ColorOutput "Backup comprimido: $backupFile.zip" $Green
    }
    catch {
        Write-ColorOutput "Erro ao criar backup: $($_.Exception.Message)" $Red
    }
}

function Restore-Database {
    Write-ColorOutput "Restaurando banco de dados..." $Blue
    
    # Listar backups disponíveis
    $backups = Get-ChildItem -Path $BackupDir -Filter "*.zip" | Sort-Object LastWriteTime -Descending
    
    if ($backups.Count -eq 0) {
        Write-ColorOutput "Nenhum backup encontrado em $BackupDir" $Red
        return
    }
    
    Write-ColorOutput "Backups disponíveis:" $Yellow
    for ($i = 0; $i -lt $backups.Count; $i++) {
        Write-ColorOutput "$i - $($backups[$i].Name)" $Yellow
    }
    
    $choice = Read-Host "Escolha o número do backup para restaurar"
    
    if ($choice -match '^\d+$' -and $choice -ge 0 -and $choice -lt $backups.Count) {
        $selectedBackup = $backups[$choice]
        $tempFile = "$env:TEMP\restore_$($selectedBackup.BaseName).sql"
        
        try {
            # Extrair backup
            Expand-Archive -Path $selectedBackup.FullName -DestinationPath $env:TEMP -Force
            
            # Restaurar banco
            docker exec -i nexus-database-win psql -U nexus_user -d nexus_valvulas < $tempFile
            
            Write-ColorOutput "Banco de dados restaurado com sucesso." $Green
            
            # Limpar arquivo temporário
            Remove-Item $tempFile -Force
        }
        catch {
            Write-ColorOutput "Erro ao restaurar banco: $($_.Exception.Message)" $Red
        }
    }
    else {
        Write-ColorOutput "Escolha inválida." $Red
    }
}

function Show-Help {
    Write-ColorOutput "=== NEXUS VÁLVULAS - GERENCIADOR DE CONTAINERS ===" $Blue
    Write-ColorOutput ""
    Write-ColorOutput "Uso: .\manage-windows.ps1 -Action <ação> [-Service <serviço>] [-Follow]" $Yellow
    Write-ColorOutput ""
    Write-ColorOutput "Ações disponíveis:" $Green
    Write-ColorOutput "  start    - Iniciar serviços" $White
    Write-ColorOutput "  stop     - Parar serviços" $White
    Write-ColorOutput "  restart  - Reiniciar serviços" $White
    Write-ColorOutput "  status   - Mostrar status dos containers" $White
    Write-ColorOutput "  logs     - Mostrar logs dos serviços" $White
    Write-ColorOutput "  clean    - Limpar sistema Docker" $White
    Write-ColorOutput "  backup   - Fazer backup do banco de dados" $White
    Write-ColorOutput "  restore  - Restaurar banco de dados" $White
    Write-ColorOutput ""
    Write-ColorOutput "Parâmetros opcionais:" $Green
    Write-ColorOutput "  -Service <nome> - Especificar serviço específico" $White
    Write-ColorOutput "  -Follow         - Seguir logs em tempo real" $White
    Write-ColorOutput ""
    Write-ColorOutput "Exemplos:" $Green
    Write-ColorOutput "  .\manage-windows.ps1 -Action start" $White
    Write-ColorOutput "  .\manage-windows.ps1 -Action logs -Service backend -Follow" $White
    Write-ColorOutput "  .\manage-windows.ps1 -Action restart -Service frontend" $White
}

# Função principal
function Main {
    if (!(Test-Administrator)) {
        Write-ColorOutput "Este script deve ser executado como Administrador!" $Red
        exit 1
    }
    
    switch ($Action) {
        "start" { Start-Services }
        "stop" { Stop-Services }
        "restart" { Restart-Services }
        "status" { Show-Status }
        "logs" { Show-Logs }
        "clean" { Clean-System }
        "backup" { Backup-Database }
        "restore" { Restore-Database }
        default { Show-Help }
    }
}

# Executar função principal
Main
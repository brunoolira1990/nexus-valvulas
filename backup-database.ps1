# Script PowerShell para Backup e Restore do PostgreSQL - Nexus Válvulas Windows 11 Pro
# Execute como Administrador

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("backup", "restore", "list", "clean")]
    [string]$Action,
    
    [string]$BackupName = "",
    [string]$DatabaseName = "nexus_valvulas",
    [string]$Username = "nexus_user",
    [int]$RetentionDays = 30,
    [switch]$Compress = $true,
    [switch]$Force = $false
)

# Configurações
$BackupDir = ".\backup"
$ContainerName = "nexus-database-win"
$ProjectName = "nexus-valvulas-win"

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

function Test-ContainerRunning {
    try {
        $status = docker inspect --format='{{.State.Status}}' $ContainerName 2>$null
        return $status -eq "running"
    }
    catch {
        return $false
    }
}

function Create-BackupDirectory {
    if (!(Test-Path $BackupDir)) {
        New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
        Write-ColorOutput "✓ Diretório de backup criado: $BackupDir" $Green
    }
}

function Get-BackupFileName {
    param([string]$Name = "")
    
    if ($Name) {
        return $Name
    }
    
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    return "nexus_backup_$timestamp"
}

function Backup-Database {
    Write-ColorOutput "`n💾 Fazendo backup do banco de dados..." $Blue
    
    $backupName = Get-BackupFileName -Name $BackupName
    $backupFile = "$BackupDir\$backupName.sql"
    $compressedFile = "$backupFile.zip"
    
    try {
        # Criar diretório de backup
        Create-BackupDirectory
        
        # Verificar se arquivo já existe
        if ((Test-Path $backupFile) -or (Test-Path $compressedFile)) {
            if (!$Force) {
                Write-ColorOutput "⚠️  Arquivo de backup já existe: $backupName" $Yellow
                $overwrite = Read-Host "Deseja sobrescrever? (s/n)"
                if ($overwrite -ne "s" -and $overwrite -ne "S") {
                    Write-ColorOutput "Backup cancelado." $Yellow
                    return
                }
            }
        }
        
        # Fazer backup usando pg_dump
        Write-ColorOutput "Executando pg_dump..." $Yellow
        docker exec $ContainerName pg_dump -U $Username -d $DatabaseName --verbose --no-password > $backupFile
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✓ Backup SQL criado: $backupFile" $Green
            
            # Comprimir backup se solicitado
            if ($Compress) {
                Write-ColorOutput "Comprimindo backup..." $Yellow
                Compress-Archive -Path $backupFile -DestinationPath $compressedFile -Force
                Remove-Item $backupFile -Force
                Write-ColorOutput "✓ Backup comprimido: $compressedFile" $Green
            }
            
            # Mostrar informações do backup
            $backupSize = if ($Compress) { (Get-Item $compressedFile).Length } else { (Get-Item $backupFile).Length }
            $backupSizeMB = [math]::Round($backupSize / 1MB, 2)
            Write-ColorOutput "📊 Tamanho do backup: $backupSizeMB MB" $Cyan
            
            # Criar arquivo de metadados
            $metadata = @{
                backup_name = $backupName
                database = $DatabaseName
                username = $Username
                timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                size_mb = $backupSizeMB
                compressed = $Compress
            }
            
            $metadataFile = if ($Compress) { "$BackupDir\$backupName.meta.json" } else { "$BackupDir\$backupName.meta.json" }
            $metadata | ConvertTo-Json | Set-Content $metadataFile
            
            Write-ColorOutput "✓ Backup concluído com sucesso!" $Green
        }
        else {
            Write-ColorOutput "✗ Erro ao criar backup" $Red
        }
    }
    catch {
        Write-ColorOutput "✗ Erro durante backup: $($_.Exception.Message)" $Red
    }
}

function Restore-Database {
    Write-ColorOutput "`n🔄 Restaurando banco de dados..." $Blue
    
    if (!$BackupName) {
        Write-ColorOutput "❌ Nome do backup é obrigatório para restore" $Red
        Write-ColorOutput "Use: .\backup-database.ps1 -Action restore -BackupName <nome>" $Yellow
        return
    }
    
    $backupFile = "$BackupDir\$BackupName.sql"
    $compressedFile = "$BackupDir\$BackupName.zip"
    
    # Verificar se arquivo existe
    if (Test-Path $compressedFile) {
        Write-ColorOutput "Arquivo comprimido encontrado. Extraindo..." $Yellow
        Expand-Archive -Path $compressedFile -DestinationPath $BackupDir -Force
        $backupFile = "$BackupDir\$BackupName.sql"
    }
    
    if (!(Test-Path $backupFile)) {
        Write-ColorOutput "❌ Arquivo de backup não encontrado: $BackupName" $Red
        Write-ColorOutput "Use -Action list para ver backups disponíveis" $Yellow
        return
    }
    
    try {
        # Confirmar restore
        if (!$Force) {
            Write-ColorOutput "⚠️  ATENÇÃO: Isso irá APAGAR todos os dados atuais do banco!" $Red
            $confirm = Read-Host "Digite 'CONFIRMAR' para continuar"
            if ($confirm -ne "CONFIRMAR") {
                Write-ColorOutput "Restore cancelado." $Yellow
                return
            }
        }
        
        # Parar aplicação temporariamente
        Write-ColorOutput "Parando aplicação..." $Yellow
        docker-compose -f docker-compose.windows-prod.yml -p $ProjectName stop backend
        
        # Restaurar banco
        Write-ColorOutput "Executando restore..." $Yellow
        docker exec -i $ContainerName psql -U $Username -d $DatabaseName < $backupFile
        
        if ($LASTEXITCODE -eq 0) {
            Write-ColorOutput "✓ Banco de dados restaurado com sucesso!" $Green
            
            # Reiniciar aplicação
            Write-ColorOutput "Reiniciando aplicação..." $Yellow
            docker-compose -f docker-compose.windows-prod.yml -p $ProjectName up -d backend
            
            Write-ColorOutput "✓ Aplicação reiniciada!" $Green
        }
        else {
            Write-ColorOutput "✗ Erro ao restaurar banco" $Red
        }
        
        # Limpar arquivo temporário se foi extraído
        if (Test-Path $compressedFile) {
            Remove-Item $backupFile -Force
        }
    }
    catch {
        Write-ColorOutput "✗ Erro durante restore: $($_.Exception.Message)" $Red
    }
}

function List-Backups {
    Write-ColorOutput "`n📋 Listando backups disponíveis..." $Blue
    
    Create-BackupDirectory
    
    $backups = Get-ChildItem -Path $BackupDir -Filter "*.zip" | Sort-Object LastWriteTime -Descending
    
    if ($backups.Count -eq 0) {
        Write-ColorOutput "Nenhum backup encontrado." $Yellow
        return
    }
    
    Write-ColorOutput "`nBackups encontrados:" $Green
    Write-ColorOutput ("{0,-30} {1,-20} {2,-10} {3}" -f "Nome", "Data", "Tamanho", "Comprimido") $Cyan
    Write-ColorOutput ("-" * 70) $Cyan
    
    foreach ($backup in $backups) {
        $name = $backup.BaseName
        $date = $backup.LastWriteTime.ToString("yyyy-MM-dd HH:mm")
        $size = [math]::Round($backup.Length / 1MB, 2)
        $compressed = "Sim"
        
        # Verificar se tem metadados
        $metadataFile = "$BackupDir\$name.meta.json"
        if (Test-Path $metadataFile) {
            try {
                $metadata = Get-Content $metadataFile | ConvertFrom-Json
                $date = $metadata.timestamp
                $size = $metadata.size_mb
                $compressed = if ($metadata.compressed) { "Sim" } else { "Não" }
            }
            catch {
                # Usar dados do arquivo se metadata não estiver disponível
            }
        }
        
        Write-ColorOutput ("{0,-30} {1,-20} {2,-10} {3}" -f $name, $date, "$size MB", $compressed) $White
    }
    
    Write-ColorOutput "`nTotal de backups: $($backups.Count)" $Cyan
}

function Clean-OldBackups {
    Write-ColorOutput "`n🧹 Limpando backups antigos..." $Blue
    
    Create-BackupDirectory
    
    $cutoffDate = (Get-Date).AddDays(-$RetentionDays)
    $oldBackups = Get-ChildItem -Path $BackupDir -Filter "*.zip" | Where-Object { $_.LastWriteTime -lt $cutoffDate }
    
    if ($oldBackups.Count -eq 0) {
        Write-ColorOutput "Nenhum backup antigo encontrado." $Yellow
        return
    }
    
    Write-ColorOutput "Backups antigos encontrados (mais de $RetentionDays dias):" $Yellow
    foreach ($backup in $oldBackups) {
        Write-ColorOutput "  • $($backup.Name) - $($backup.LastWriteTime)" $White
    }
    
    if (!$Force) {
        $confirm = Read-Host "`nDeseja remover estes backups? (s/n)"
        if ($confirm -ne "s" -and $confirm -ne "S") {
            Write-ColorOutput "Limpeza cancelada." $Yellow
            return
        }
    }
    
    $removedCount = 0
    foreach ($backup in $oldBackups) {
        try {
            Remove-Item $backup.FullName -Force
            Write-ColorOutput "✓ Removido: $($backup.Name)" $Green
            $removedCount++
            
            # Remover arquivo de metadados se existir
            $metadataFile = "$BackupDir\$($backup.BaseName).meta.json"
            if (Test-Path $metadataFile) {
                Remove-Item $metadataFile -Force
            }
        }
        catch {
            Write-ColorOutput "✗ Erro ao remover: $($backup.Name)" $Red
        }
    }
    
    Write-ColorOutput "`n✓ Limpeza concluída! $removedCount backups removidos." $Green
}

function Show-Help {
    Write-ColorOutput "=== BACKUP E RESTORE POSTGRESQL - NEXUS VÁLVULAS ===" $Blue
    Write-ColorOutput ""
    Write-ColorOutput "Uso: .\backup-database.ps1 -Action <ação> [opções]" $Yellow
    Write-ColorOutput ""
    Write-ColorOutput "Ações disponíveis:" $Green
    Write-ColorOutput "  backup  - Fazer backup do banco" $White
    Write-ColorOutput "  restore - Restaurar banco de dados" $White
    Write-ColorOutput "  list    - Listar backups disponíveis" $White
    Write-ColorOutput "  clean   - Limpar backups antigos" $White
    Write-ColorOutput ""
    Write-ColorOutput "Opções:" $Green
    Write-ColorOutput "  -BackupName <nome>    - Nome do backup (para restore)" $White
    Write-ColorOutput "  -DatabaseName <nome> - Nome do banco (padrão: nexus_valvulas)" $White
    Write-ColorOutput "  -Username <user>     - Usuário do banco (padrão: nexus_user)" $White
    Write-ColorOutput "  -RetentionDays <dias> - Dias para manter backups (padrão: 30)" $White
    Write-ColorOutput "  -Compress            - Comprimir backup (padrão: true)" $White
    Write-ColorOutput "  -Force               - Forçar operação sem confirmação" $White
    Write-ColorOutput ""
    Write-ColorOutput "Exemplos:" $Green
    Write-ColorOutput "  .\backup-database.ps1 -Action backup" $White
    Write-ColorOutput "  .\backup-database.ps1 -Action restore -BackupName nexus_backup_20241219_143022" $White
    Write-ColorOutput "  .\backup-database.ps1 -Action list" $White
    Write-ColorOutput "  .\backup-database.ps1 -Action clean -RetentionDays 7" $White
}

# Função principal
function Main {
    Write-ColorOutput "=== BACKUP E RESTORE POSTGRESQL - NEXUS VÁLVULAS ===" $Blue
    Write-ColorOutput "Ação: $Action" $Yellow
    Write-ColorOutput "Banco: $DatabaseName" $Yellow
    Write-ColorOutput "Usuário: $Username" $Yellow
    
    # Verificações iniciais
    if (!(Test-Administrator)) {
        Write-ColorOutput "❌ Este script deve ser executado como Administrador!" $Red
        exit 1
    }
    
    if (!(Test-ContainerRunning)) {
        Write-ColorOutput "❌ Container do banco não está rodando!" $Red
        Write-ColorOutput "Execute primeiro: .\deploy-windows.ps1" $Yellow
        exit 1
    }
    
    # Executar ação solicitada
    switch ($Action.ToLower()) {
        "backup" {
            Backup-Database
        }
        
        "restore" {
            Restore-Database
        }
        
        "list" {
            List-Backups
        }
        
        "clean" {
            Clean-OldBackups
        }
        
        default {
            Show-Help
        }
    }
}

# Executar função principal
Main
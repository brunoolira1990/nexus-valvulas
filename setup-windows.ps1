# Script PowerShell para Configuração Inicial - Nexus Válvulas Windows 11 Pro
# Execute como Administrador para configuração inicial completa

param(
    [switch]$SkipDockerCheck = $false,
    [switch]$SkipDirectoryCreation = $false,
    [switch]$SkipEnvSetup = $false
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
$Cyan = "Cyan"

function Write-ColorOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Write-Banner {
    Write-ColorOutput "`n" $White
    Write-ColorOutput "╔══════════════════════════════════════════════════════════════╗" $Cyan
    Write-ColorOutput "║                                                              ║" $Cyan
    Write-ColorOutput "║           NEXUS VÁLVULAS - CONFIGURAÇÃO INICIAL              ║" $Cyan
    Write-ColorOutput "║                    WINDOWS 11 PRO                            ║" $Cyan
    Write-ColorOutput "║                                                              ║" $Cyan
    Write-ColorOutput "╚══════════════════════════════════════════════════════════════╝" $Cyan
    Write-ColorOutput "`n" $White
}

function Test-Administrator {
    $currentUser = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($currentUser)
    return $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
}

function Test-DockerDesktop {
    try {
        $dockerVersion = docker version --format "{{.Server.Version}}" 2>$null
        if ($dockerVersion) {
            Write-ColorOutput "✓ Docker Desktop encontrado (versão: $dockerVersion)" $Green
            return $true
        }
        else {
            Write-ColorOutput "✗ Docker Desktop não encontrado ou não está rodando" $Red
            return $false
        }
    }
    catch {
        Write-ColorOutput "✗ Erro ao verificar Docker Desktop: $($_.Exception.Message)" $Red
        return $false
    }
}

function Test-WSL2 {
    try {
        $wslVersion = wsl --list --verbose 2>$null
        if ($wslVersion -match "2") {
            Write-ColorOutput "✓ WSL 2 está habilitado" $Green
            return $true
        }
        else {
            Write-ColorOutput "✗ WSL 2 não está habilitado" $Red
            return $false
        }
    }
    catch {
        Write-ColorOutput "✗ Erro ao verificar WSL 2: $($_.Exception.Message)" $Red
        return $false
    }
}

function Install-DockerDesktop {
    Write-ColorOutput "`n📥 Instalando Docker Desktop..." $Blue
    
    $dockerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"
    $installerPath = "$env:TEMP\DockerDesktopInstaller.exe"
    
    try {
        Write-ColorOutput "Baixando Docker Desktop..." $Yellow
        Invoke-WebRequest -Uri $dockerUrl -OutFile $installerPath
        
        Write-ColorOutput "Executando instalador..." $Yellow
        Start-Process -FilePath $installerPath -ArgumentList "install", "--quiet" -Wait
        
        Write-ColorOutput "✓ Docker Desktop instalado com sucesso!" $Green
        Write-ColorOutput "⚠️  Reinicie o computador e execute este script novamente." $Yellow
        
        Remove-Item $installerPath -Force
        return $true
    }
    catch {
        Write-ColorOutput "✗ Erro ao instalar Docker Desktop: $($_.Exception.Message)" $Red
        return $false
    }
}

function Create-Directories {
    Write-ColorOutput "`n📁 Criando estrutura de diretórios..." $Blue
    
    $directories = @(
        "$DataDir\postgres",
        "$DataDir\uploads",
        "$DataDir\logs",
        "$DataDir\nginx-logs",
        "$DataDir\nginx-cache",
        "$DataDir\redis",
        "$DataDir\prometheus",
        "$BackupDir",
        ".\monitoring",
        ".\ssl"
    )
    
    foreach ($dir in $directories) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-ColorOutput "✓ Criado: $dir" $Green
        }
        else {
            Write-ColorOutput "• Já existe: $dir" $Yellow
        }
    }
}

function Setup-EnvironmentFile {
    Write-ColorOutput "`n⚙️  Configurando arquivo de ambiente..." $Blue
    
    if (!(Test-Path $EnvFile)) {
        Write-ColorOutput "✗ Arquivo $EnvFile não encontrado!" $Red
        return $false
    }
    
    # Gerar senhas seguras
    $postgresPassword = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
    $jwtSecret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 64 | % {[char]$_})
    
    # Atualizar arquivo de ambiente
    $envContent = Get-Content $EnvFile -Raw
    $envContent = $envContent -replace "POSTGRES_PASSWORD=.*", "POSTGRES_PASSWORD=$postgresPassword"
    $envContent = $envContent -replace "JWT_SECRET=.*", "JWT_SECRET=$jwtSecret"
    Set-Content -Path $EnvFile -Value $envContent
    
    Write-ColorOutput "✓ Senhas geradas automaticamente" $Green
    Write-ColorOutput "⚠️  Configure suas credenciais de email no arquivo $EnvFile" $Yellow
    
    return $true
}

function Test-SystemResources {
    Write-ColorOutput "`n💻 Verificando recursos do sistema..." $Blue
    
    # Verificar RAM
    $ram = Get-WmiObject -Class Win32_ComputerSystem | Select-Object -ExpandProperty TotalPhysicalMemory
    $ramGB = [math]::Round($ram / 1GB, 2)
    
    if ($ramGB -ge 8) {
        Write-ColorOutput "✓ RAM: $ramGB GB (suficiente)" $Green
    }
    else {
        Write-ColorOutput "⚠️  RAM: $ramGB GB (recomendado: 8GB+)" $Yellow
    }
    
    # Verificar CPU
    $cpu = Get-WmiObject -Class Win32_Processor | Select-Object -ExpandProperty NumberOfCores
    if ($cpu -ge 4) {
        Write-ColorOutput "✓ CPU: $cpu cores (suficiente)" $Green
    }
    else {
        Write-ColorOutput "⚠️  CPU: $cpu cores (recomendado: 4+)" $Yellow
    }
    
    # Verificar espaço em disco
    $disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='C:'" | Select-Object -ExpandProperty FreeSpace
    $diskGB = [math]::Round($disk / 1GB, 2)
    
    if ($diskGB -ge 50) {
        Write-ColorOutput "✓ Espaço em disco: $diskGB GB (suficiente)" $Green
    }
    else {
        Write-ColorOutput "⚠️  Espaço em disco: $diskGB GB (recomendado: 50GB+)" $Yellow
    }
}

function Show-NextSteps {
    Write-ColorOutput "`n🚀 PRÓXIMOS PASSOS:" $Blue
    Write-ColorOutput "`n1. Configure suas credenciais de email no arquivo $EnvFile" $Yellow
    Write-ColorOutput "2. Execute o deploy:" $Yellow
    Write-ColorOutput "   .\deploy-windows.ps1" $Cyan
    Write-ColorOutput "`n3. Acesse a aplicação:" $Yellow
    Write-ColorOutput "   Frontend: http://localhost" $Cyan
    Write-ColorOutput "   Backend: http://localhost/api" $Cyan
    Write-ColorOutput "   Prometheus: http://localhost:9090" $Cyan
    Write-ColorOutput "`n4. Para gerenciar os serviços:" $Yellow
    Write-ColorOutput "   .\manage-windows.ps1 -Action status" $Cyan
    Write-ColorOutput "`n5. Para fazer backup:" $Yellow
    Write-ColorOutput "   .\manage-windows.ps1 -Action backup" $Cyan
}

function Show-Troubleshooting {
    Write-ColorOutput "`n🔧 SOLUÇÃO DE PROBLEMAS:" $Blue
    Write-ColorOutput "`n• Docker não inicia:" $Yellow
    Write-ColorOutput "  - Verifique se WSL 2 está habilitado" $White
    Write-ColorOutput "  - Reinicie o Docker Desktop" $White
    Write-ColorOutput "`n• Containers não sobem:" $Yellow
    Write-ColorOutput "  - Verifique logs: docker-compose logs" $White
    Write-ColorOutput "  - Verifique recursos disponíveis" $White
    Write-ColorOutput "`n• Problemas de performance:" $Yellow
    Write-ColorOutput "  - Ajuste recursos no Docker Desktop" $White
    Write-ColorOutput "  - Verifique uso de RAM/CPU" $White
    Write-ColorOutput "`n• Para mais ajuda, consulte: README-WINDOWS-PRODUCTION.md" $Cyan
}

# Função principal
function Main {
    Write-Banner
    
    # Verificar se é administrador
    if (!(Test-Administrator)) {
        Write-ColorOutput "❌ Este script deve ser executado como Administrador!" $Red
        Write-ColorOutput "Clique com botão direito no PowerShell e selecione 'Executar como administrador'" $Yellow
        exit 1
    }
    
    # Verificar recursos do sistema
    Test-SystemResources
    
    # Verificar Docker Desktop
    if (!$SkipDockerCheck) {
        if (!(Test-DockerDesktop)) {
            $install = Read-Host "Docker Desktop não encontrado. Deseja instalar automaticamente? (s/n)"
            if ($install -eq "s" -or $install -eq "S") {
                if (Install-DockerDesktop) {
                    Write-ColorOutput "`n⚠️  Reinicie o computador e execute este script novamente." $Yellow
                    exit 0
                }
            }
            else {
                Write-ColorOutput "`n📥 Baixe e instale o Docker Desktop de: https://www.docker.com/products/docker-desktop" $Blue
                exit 1
            }
        }
        
        # Verificar WSL 2
        if (!(Test-WSL2)) {
            Write-ColorOutput "`n⚠️  WSL 2 não está habilitado. Execute:" $Yellow
            Write-ColorOutput "wsl --install" $Cyan
            Write-ColorOutput "wsl --set-default-version 2" $Cyan
            exit 1
        }
    }
    
    # Criar diretórios
    if (!$SkipDirectoryCreation) {
        Create-Directories
    }
    
    # Configurar arquivo de ambiente
    if (!$SkipEnvSetup) {
        Setup-EnvironmentFile
    }
    
    # Verificar arquivos necessários
    $requiredFiles = @($ComposeFile, $EnvFile, "Dockerfile.frontend.windows", "backend/Dockerfile.windows")
    $missingFiles = @()
    
    foreach ($file in $requiredFiles) {
        if (!(Test-Path $file)) {
            $missingFiles += $file
        }
    }
    
    if ($missingFiles.Count -gt 0) {
        Write-ColorOutput "`n❌ Arquivos necessários não encontrados:" $Red
        foreach ($file in $missingFiles) {
            Write-ColorOutput "  • $file" $Red
        }
        Write-ColorOutput "`nCertifique-se de que todos os arquivos de configuração estão presentes." $Yellow
        exit 1
    }
    
    Write-ColorOutput "`n✅ CONFIGURAÇÃO INICIAL CONCLUÍDA!" $Green
    Show-NextSteps
    Show-Troubleshooting
    
    Write-ColorOutput "`n🎉 Sistema pronto para deploy!" $Green
}

# Executar função principal
Main
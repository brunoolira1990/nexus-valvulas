# Script PowerShell para Commit e Push - Nexus Válvulas
# Execute como Administrador

param(
    [string]$Message = "",
    [string]$Branch = "main",
    [switch]$Force = $false,
    [switch]$SkipCommit = $false
)

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

function Test-GitRepository {
    try {
        git status | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

function Show-GitStatus {
    Write-ColorOutput "`n📊 Status do Git:" $Blue
    git status --short
}

function Add-Files {
    Write-ColorOutput "`n📁 Adicionando arquivos ao Git..." $Blue
    
    try {
        git add .
        Write-ColorOutput "✓ Arquivos adicionados com sucesso!" $Green
        return $true
    }
    catch {
        Write-ColorOutput "✗ Erro ao adicionar arquivos: $($_.Exception.Message)" $Red
        return $false
    }
}

function Create-Commit {
    param([string]$CommitMessage)
    
    Write-ColorOutput "`n💾 Criando commit..." $Blue
    
    try {
        git commit -m $CommitMessage
        Write-ColorOutput "✓ Commit criado com sucesso!" $Green
        return $true
    }
    catch {
        Write-ColorOutput "✗ Erro ao criar commit: $($_.Exception.Message)" $Red
        return $false
    }
}

function Push-Changes {
    param([string]$TargetBranch)
    
    Write-ColorOutput "`n🚀 Enviando para o repositório remoto..." $Blue
    
    try {
        if ($Force) {
            git push --force origin $TargetBranch
        }
        else {
            git push origin $TargetBranch
        }
        Write-ColorOutput "✓ Push realizado com sucesso!" $Green
        return $true
    }
    catch {
        Write-ColorOutput "✗ Erro ao fazer push: $($_.Exception.Message)" $Red
        return $false
    }
}

function Show-CommitHistory {
    Write-ColorOutput "`n📜 Últimos commits:" $Blue
    git log --oneline -5
}

function Show-RemoteInfo {
    Write-ColorOutput "`n🌐 Informações do repositório remoto:" $Blue
    git remote -v
}

function Create-DefaultMessage {
    return @"
feat: Adiciona configuração completa para Windows 11 Pro

- Configuração Docker otimizada para Windows
- Scripts PowerShell para deploy e gerenciamento  
- Configuração PostgreSQL com migrações
- Sistema de backup e restore
- Documentação completa de produção
- Configurações Nginx otimizadas
- Monitoramento com Prometheus
- Certificados SSL para desenvolvimento local
- Guias de uso e troubleshooting

Arquivos adicionados:
- docker-compose.windows-prod.yml
- Dockerfile.frontend.windows
- backend/Dockerfile.windows
- Scripts PowerShell (*.ps1)
- Configurações Nginx
- Documentação completa
- Configurações de monitoramento
"@
}

function Show-Help {
    Write-ColorOutput "=== COMMIT E PUSH - NEXUS VÁLVULAS ===" $Blue
    Write-ColorOutput ""
    Write-ColorOutput "Uso: .\git-commit.ps1 [opções]" $Yellow
    Write-ColorOutput ""
    Write-ColorOutput "Opções:" $Green
    Write-ColorOutput "  -Message <texto>     - Mensagem personalizada do commit" $White
    Write-ColorOutput "  -Branch <nome>      - Branch de destino (padrão: main)" $White
    Write-ColorOutput "  -Force              - Forçar push (sobrescrever remoto)" $White
    Write-ColorOutput "  -SkipCommit         - Pular commit, apenas push" $White
    Write-ColorOutput ""
    Write-ColorOutput "Exemplos:" $Green
    Write-ColorOutput "  .\git-commit.ps1" $White
    Write-ColorOutput "  .\git-commit.ps1 -Message 'fix: Corrige bug no backend'" $White
    Write-ColorOutput "  .\git-commit.ps1 -Branch develop" $White
    Write-ColorOutput "  .\git-commit.ps1 -Force" $White
}

# Função principal
function Main {
    Write-ColorOutput "=== COMMIT E PUSH - NEXUS VÁLVULAS ===" $Blue
    Write-ColorOutput "Branch: $Branch" $Yellow
    
    # Verificar se é repositório Git
    if (!(Test-GitRepository)) {
        Write-ColorOutput "❌ Não é um repositório Git!" $Red
        Write-ColorOutput "Execute: git init" $Yellow
        exit 1
    }
    
    # Mostrar status atual
    Show-GitStatus
    
    # Mostrar informações do repositório
    Show-RemoteInfo
    
    # Adicionar arquivos
    if (!(Add-Files)) {
        exit 1
    }
    
    # Criar commit se não foi pulado
    if (!$SkipCommit) {
        $commitMessage = if ($Message) { $Message } else { Create-DefaultMessage }
        
        if (!(Create-Commit -CommitMessage $commitMessage)) {
            exit 1
        }
    }
    
    # Fazer push
    if (!(Push-Changes -TargetBranch $Branch)) {
        exit 1
    }
    
    # Mostrar histórico
    Show-CommitHistory
    
    Write-ColorOutput "`n✅ OPERAÇÃO CONCLUÍDA COM SUCESSO!" $Green
    Write-ColorOutput "`n🌐 Acesse o repositório para ver as alterações." $Cyan
}

# Executar função principal
Main
# Script PowerShell para Gerar Certificados SSL Locais - Windows 11 Pro
# Execute como Administrador

param(
    [string]$Domain = "localhost",
    [string]$OutputDir = ".\ssl"
)

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

function Install-OpenSSL {
    Write-ColorOutput "Instalando OpenSSL..." $Blue
    
    try {
        # Verificar se Chocolatey está instalado
        if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
            Write-ColorOutput "Instalando Chocolatey..." $Yellow
            Set-ExecutionPolicy Bypass -Scope Process -Force
            [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
            iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
        }
        
        # Instalar OpenSSL
        choco install openssl -y
        
        Write-ColorOutput "✓ OpenSSL instalado com sucesso!" $Green
        return $true
    }
    catch {
        Write-ColorOutput "✗ Erro ao instalar OpenSSL: $($_.Exception.Message)" $Red
        return $false
    }
}

function Generate-SSLCertificate {
    Write-ColorOutput "Gerando certificados SSL para $Domain..." $Blue
    
    # Criar diretório de saída
    if (!(Test-Path $OutputDir)) {
        New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
    }
    
    # Configuração do certificado
    $configContent = @"
[req]
default_bits = 2048
prompt = no
distinguished_name = req_distinguished_name
req_extensions = v3_req

[req_distinguished_name]
C=BR
ST=Sao Paulo
L=Sao Paulo
O=Nexus Valvulas
OU=IT Department
CN=$Domain

[v3_req]
basicConstraints = CA:FALSE
keyUsage = nonRepudiation, digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = $Domain
DNS.2 = *.$Domain
DNS.3 = localhost
IP.1 = 127.0.0.1
IP.2 = ::1
"@
    
    $configFile = "$OutputDir\ssl.conf"
    Set-Content -Path $configFile -Value $configContent
    
    try {
        # Gerar chave privada
        Write-ColorOutput "Gerando chave privada..." $Yellow
        & openssl genrsa -out "$OutputDir\key.pem" 2048
        
        # Gerar certificado
        Write-ColorOutput "Gerando certificado..." $Yellow
        & openssl req -new -x509 -key "$OutputDir\key.pem" -out "$OutputDir\cert.pem" -days 365 -config $configFile -extensions v3_req
        
        # Gerar certificado combinado
        Write-ColorOutput "Gerando certificado combinado..." $Yellow
        Get-Content "$OutputDir\cert.pem", "$OutputDir\key.pem" | Set-Content "$OutputDir\fullchain.pem"
        
        # Limpar arquivo de configuração
        Remove-Item $configFile -Force
        
        Write-ColorOutput "✓ Certificados SSL gerados com sucesso!" $Green
        Write-ColorOutput "  • cert.pem - Certificado público" $Green
        Write-ColorOutput "  • key.pem - Chave privada" $Green
        Write-ColorOutput "  • fullchain.pem - Certificado combinado" $Green
        
        return $true
    }
    catch {
        Write-ColorOutput "✗ Erro ao gerar certificados: $($_.Exception.Message)" $Red
        return $false
    }
}

function Install-Certificate {
    Write-ColorOutput "Instalando certificado no Windows..." $Blue
    
    try {
        # Instalar certificado no repositório de autoridades de certificação raiz
        $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2("$OutputDir\cert.pem")
        $store = New-Object System.Security.Cryptography.X509Certificates.X509Store([System.Security.Cryptography.X509Certificates.StoreName]::Root, [System.Security.Cryptography.X509Certificates.StoreLocation]::LocalMachine)
        $store.Open([System.Security.Cryptography.X509Certificates.OpenFlags]::ReadWrite)
        $store.Add($cert)
        $store.Close()
        
        Write-ColorOutput "✓ Certificado instalado no Windows!" $Green
        return $true
    }
    catch {
        Write-ColorOutput "✗ Erro ao instalar certificado: $($_.Exception.Message)" $Red
        return $false
    }
}

function Show-Usage {
    Write-ColorOutput "`n=== USO DO CERTIFICADO SSL ===" $Blue
    Write-ColorOutput "`nPara usar HTTPS localmente:" $Yellow
    Write-ColorOutput "1. Configure o Nginx para usar os certificados" $White
    Write-ColorOutput "2. Acesse: https://$Domain" $White
    Write-ColorOutput "3. Aceite o aviso de segurança (certificado auto-assinado)" $White
    Write-ColorOutput "`nArquivos gerados:" $Yellow
    Write-ColorOutput "• $OutputDir\cert.pem - Certificado público" $White
    Write-ColorOutput "• $OutputDir\key.pem - Chave privada" $White
    Write-ColorOutput "• $OutputDir\fullchain.pem - Certificado combinado" $White
    Write-ColorOutput "`n⚠️  IMPORTANTE: Este é um certificado auto-assinado para desenvolvimento local apenas!" $Yellow
}

# Função principal
function Main {
    Write-ColorOutput "=== GERADOR DE CERTIFICADOS SSL - NEXUS VÁLVULAS ===" $Blue
    Write-ColorOutput "Domínio: $Domain" $Yellow
    Write-ColorOutput "Diretório de saída: $OutputDir" $Yellow
    
    # Verificar se é administrador
    if (!(Test-Administrator)) {
        Write-ColorOutput "❌ Este script deve ser executado como Administrador!" $Red
        exit 1
    }
    
    # Verificar se OpenSSL está disponível
    if (!(Get-Command openssl -ErrorAction SilentlyContinue)) {
        Write-ColorOutput "OpenSSL não encontrado. Instalando..." $Yellow
        if (!(Install-OpenSSL)) {
            Write-ColorOutput "❌ Falha ao instalar OpenSSL" $Red
            exit 1
        }
    }
    
    # Gerar certificados
    if (Generate-SSLCertificate) {
        # Instalar certificado
        Install-Certificate
        
        Write-ColorOutput "`n✅ CERTIFICADOS SSL GERADOS COM SUCESSO!" $Green
        Show-Usage
    }
    else {
        Write-ColorOutput "`n❌ Falha ao gerar certificados SSL" $Red
        exit 1
    }
}

# Executar função principal
Main
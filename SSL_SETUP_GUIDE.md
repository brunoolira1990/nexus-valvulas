# 🔐 Guia Completo de Configuração SSL - Nexus Válvulas

## 📋 Visão Geral

Este guia fornece instruções completas para configurar SSL/TLS para o projeto Nexus Válvulas usando Certbot (Let's Encrypt) em um servidor Ubuntu com Docker, **sem parar os containers**.

## 🎯 Objetivos

- ✅ Configurar SSL para `nexusvalvulas.com.br` e `www.nexusvalvulas.com.br`
- ✅ Usar Certbot com método webroot
- ✅ Não parar containers Docker durante a configuração
- ✅ Configurar renovação automática
- ✅ Otimizar configuração Nginx para SSL

## 🏗️ Arquitetura

```
Internet → Nginx (HTTPS) → Frontend + Backend
                ↓
        ┌─────────────────┐
        │   Nginx SSL    │ ← Certificados Let's Encrypt
        │   (Port 443)   │
        └─────────────────┘
                ↓
    ┌─────────────┬─────────────┐
    │  Frontend   │   Backend   │
    │  (React)    │  (Node.js) │
    └─────────────┴─────────────┘
```

## 📦 Scripts Disponíveis

### 1. **`setup-ssl-complete.sh`** - Script Master
- Orquestra todo o processo
- Verificações automáticas
- Configuração completa

### 2. **`setup-ssl.sh`** - Configuração SSL
- Instala Certbot
- Solicita certificados
- Configura renovação automática

### 3. **`configure-nginx-ssl.sh`** - Configuração Nginx
- Atualiza configuração Nginx
- Configura SSL/TLS
- Reinicia container

## 🚀 Como Usar

### **Configuração Completa (Recomendado)**

```bash
# 1. Navegar para o diretório do projeto
cd /home/nexusvalvulas.com.br/public_html

# 2. Executar configuração completa
sudo ./setup-ssl-complete.sh
```

### **Configuração Passo a Passo**

```bash
# 1. Apenas SSL
sudo ./setup-ssl.sh

# 2. Configurar Nginx
./configure-nginx-ssl.sh

# 3. Verificar
./setup-ssl-complete.sh verify
```

### **Comandos de Manutenção**

```bash
# Renovar certificado
sudo ./setup-ssl.sh renew

# Verificar certificado
sudo ./setup-ssl.sh verify

# Ver status
./setup-ssl-complete.sh status
```

## 🔧 Configuração Detalhada

### **1. Pré-requisitos**

- ✅ Servidor Ubuntu com Docker
- ✅ Domínios apontando para o servidor
- ✅ Container Nginx rodando
- ✅ Acesso root/sudo

### **2. Estrutura de Diretórios**

```
/home/nexusvalvulas.com.br/public_html/
├── ssl/                          # Certificados SSL
│   ├── fullchain.pem            # Certificado completo
│   └── privkey.pem              # Chave privada
├── nginx/
│   └── nginx-production.conf     # Configuração Nginx
├── dist/                        # Webroot para Certbot
├── setup-ssl-complete.sh        # Script master
├── setup-ssl.sh                 # Script SSL
└── configure-nginx-ssl.sh       # Script Nginx
```

### **3. Configuração SSL**

#### **Certificados Let's Encrypt:**
- **Domínios**: `nexusvalvulas.com.br`, `www.nexusvalvulas.com.br`
- **Método**: Standalone (temporário)
- **Renovação**: Automática via cron
- **Localização**: `/home/nexusvalvulas.com.br/public_html/ssl/`

#### **Permissões:**
```bash
chown root:root /home/nexusvalvulas.com.br/public_html/ssl/*.pem
chmod 600 /home/nexusvalvulas.com.br/public_html/ssl/*.pem
```

### **4. Configuração Nginx**

#### **Redirecionamento HTTP → HTTPS:**
```nginx
server {
    listen 80;
    server_name nexusvalvulas.com.br www.nexusvalvulas.com.br;
    return 301 https://$server_name$request_uri;
}
```

#### **Configuração HTTPS:**
```nginx
server {
    listen 443 ssl http2;
    server_name nexusvalvulas.com.br www.nexusvalvulas.com.br;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # Configurações SSL otimizadas
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_session_tickets off;
}
```

## 🔍 Verificações e Troubleshooting

### **1. Verificar Certificados**

```bash
# Verificar certificado
openssl x509 -in /home/nexusvalvulas.com.br/public_html/ssl/fullchain.pem -text -noout

# Verificar datas de validade
openssl x509 -in /home/nexusvalvulas.com.br/public_html/ssl/fullchain.pem -noout -dates
```

### **2. Verificar HTTPS**

```bash
# Testar HTTPS
curl -I https://nexusvalvulas.com.br
curl -I https://www.nexusvalvulas.com.br

# Verificar redirecionamento
curl -I http://nexusvalvulas.com.br
```

### **3. Verificar Container**

```bash
# Status do container
docker ps | grep nexus-nginx

# Logs do container
docker logs nexus-nginx

# Reiniciar container
docker restart nexus-nginx
```

### **4. Verificar Renovação**

```bash
# Testar renovação
sudo certbot renew --dry-run

# Verificar cron
sudo crontab -l | grep certbot
```

## 🚨 Problemas Comuns

### **1. Certificado não encontrado**
```bash
# Verificar se certificados existem
ls -la /home/nexusvalvulas.com.br/public_html/ssl/

# Re-executar configuração SSL
sudo ./setup-ssl.sh
```

### **2. Container não inicia**
```bash
# Verificar logs
docker logs nexus-nginx

# Verificar configuração Nginx
nginx -t -c /home/nexusvalvulas.com.br/public_html/nginx/nginx-production.conf
```

### **3. HTTPS não funciona**
```bash
# Verificar se porta 443 está aberta
sudo netstat -tulpn | grep :443

# Verificar firewall
sudo ufw status
sudo ufw allow 443
```

### **4. Renovação falha**
```bash
# Verificar logs do Certbot
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Renovar manualmente
sudo certbot renew --force-renewal
```

## 📊 Monitoramento

### **1. Logs Importantes**

```bash
# Logs do Nginx
docker logs nexus-nginx

# Logs do Certbot
sudo tail -f /var/log/letsencrypt/letsencrypt.log

# Logs do sistema
sudo tail -f /var/log/syslog | grep certbot
```

### **2. Comandos de Monitoramento**

```bash
# Status geral
./setup-ssl-complete.sh status

# Verificar certificado
sudo ./setup-ssl.sh verify

# Testar HTTPS
curl -I https://nexusvalvulas.com.br
```

### **3. Renovação Automática**

```bash
# Verificar configuração de renovação
sudo cat /etc/cron.d/certbot-nexus

# Testar renovação
sudo certbot renew --dry-run
```

## 🔄 Renovação Automática

### **Configuração Cron:**
```bash
# Renovação automática configurada em:
/etc/cron.d/certbot-nexus

# Executa diariamente às 2:00 AM
0 2 * * * root certbot renew --quiet --post-hook "cp /etc/letsencrypt/live/nexusvalvulas.com.br/fullchain.pem /home/nexusvalvulas.com.br/public_html/ssl/ && cp /etc/letsencrypt/live/nexusvalvulas.com.br/privkey.pem /home/nexusvalvulas.com.br/public_html/ssl/ && chown root:root /home/nexusvalvulas.com.br/public_html/ssl/*.pem && chmod 600 /home/nexusvalvulas.com.br/public_html/ssl/*.pem && docker restart nexus-nginx"
```

## 🎯 Resultado Final

### **Antes:**
- ❌ Sem SSL/HTTPS
- ❌ HTTP não seguro
- ❌ Sem renovação automática
- ❌ Configuração manual

### **Depois:**
- ✅ **HTTPS obrigatório** com redirecionamento automático
- ✅ **Certificados válidos** Let's Encrypt
- ✅ **Renovação automática** configurada
- ✅ **Configuração otimizada** para produção
- ✅ **Headers de segurança** completos
- ✅ **Monitoramento** e logs

## 📞 Suporte

### **Comandos de Emergência:**

```bash
# Parar tudo
docker-compose -f docker-compose.production-server.yml down

# Restaurar configuração
cp nginx/nginx-production.conf.backup.* nginx/nginx-production.conf
docker restart nexus-nginx

# Reconfigurar SSL
sudo ./setup-ssl-complete.sh
```

### **Logs de Debug:**

```bash
# Logs detalhados
docker logs nexus-nginx -f
sudo tail -f /var/log/letsencrypt/letsencrypt.log
sudo tail -f /var/log/nginx/error.log
```

---

**🎉 SSL configurado com sucesso!**

**Domínios seguros:**
- https://nexusvalvulas.com.br
- https://www.nexusvalvulas.com.br

**Status:** ✅ Pronto para produção com SSL/TLS

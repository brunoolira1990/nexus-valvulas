# Configuração de Subdomínio no Ubuntu Server

Este guia explica como configurar o subdomínio `api.nexusvalvulas.com.br` para seu servidor Ubuntu.

## 📋 Pré-requisitos

- Servidor Ubuntu Server configurado
- Nginx instalado
- Acesso root ou sudo
- Domínio principal registrado (nexusvalvulas.com.br)

## 🌐 1. Configuração DNS

### Registrar o Subdomínio

Adicione um registro DNS para o subdomínio no painel do seu registrador:

```
Tipo: A
Nome: api
Valor: [SEU_IP_SERVIDOR]
TTL: 3600 (1 hora)
```

Exemplo:
```
api.nexusvalvulas.com.br.  IN  A  203.0.113.1
```

### Verificar Propagação

```bash
# Verificar se o DNS está resolvendo corretamente
nslookup api.nexusvalvulas.com.br
dig api.nexusvalvulas.com.br
```

## 🔐 2. Configuração SSL para Subdomínio

### Usando Let's Encrypt (Certbot)

Instale o Certbot se ainda não estiver instalado:

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

Obtenha certificados SSL para ambos os domínios:

```bash
# Certificado para domínio principal e www
sudo certbot --nginx -d nexusvalvulas.com.br -d www.nexusvalvulas.com.br

# Certificado para subdomínio API
sudo certbot --nginx -d api.nexusvalvulas.com.br
```

## 🛠️ 3. Configuração do Nginx

A configuração do Nginx já foi atualizada no arquivo [nginx.conf](file:///c%3A/Users/Bruno/Documents/nexus-valvulas/nginx.conf) para suportar o subdomínio separado.

### Recarregar Configuração

```bash
# Testar a configuração
sudo nginx -t

# Recarregar Nginx
sudo systemctl reload nginx

# Ou reiniciar se necessário
sudo systemctl restart nginx
```

## 🔧 4. Verificação

### Testar Acesso ao Subdomínio

```bash
# Testar acesso HTTP
curl -I http://api.nexusvalvulas.com.br

# Testar acesso HTTPS
curl -I https://api.nexusvalvulas.com.br

# Testar endpoint de health check (se disponível)
curl https://api.nexusvalvulas.com.br/health
```

### Verificar Status do Nginx

```bash
# Verificar status do serviço
sudo systemctl status nginx

# Verificar portas em uso
sudo netstat -tlnp | grep :80
sudo netstat -tlnp | grep :443
```

## 📊 5. Monitoramento

### Logs do Nginx

```bash
# Logs de acesso do frontend
sudo tail -f /var/log/nginx/access.log

# Logs de erro do frontend
sudo tail -f /var/log/nginx/error.log

# Se quiser separar logs por servidor, adicione nas configurações:
# access_log /var/log/nginx/api_access.log main;
# error_log /var/log/nginx/api_error.log;
```

## 🔒 6. Segurança Adicional

### Configurar Firewall (UFW)

```bash
# Permitir HTTP e HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Verificar status
sudo ufw status
```

### Headers de Segurança

A configuração do Nginx já inclui headers de segurança importantes:
- X-Frame-Options
- X-XSS-Protection
- X-Content-Type-Options
- Strict-Transport-Security
- Content-Security-Policy

## 🆘 Troubleshooting

### Problemas Comuns

1. **DNS não resolvendo**
   - Verifique se o registro DNS foi criado corretamente
   - Aguarde o tempo de propagação (até 24 horas)
   - Use `dig` para verificar a resolução

2. **Certificado SSL não válido**
   - Verifique se o Certbot foi executado para o subdomínio
   - Renove certificados se expirados: `sudo certbot renew`

3. **Nginx não carregando**
   - Verifique sintaxe: `sudo nginx -t`
   - Verifique logs de erro: `sudo tail -f /var/log/nginx/error.log`

4. **Aplicação não respondendo**
   - Verifique se o backend está rodando: `pm2 list`
   - Verifique logs do backend: `pm2 logs`

### Comandos Úteis

```bash
# Reiniciar serviços
sudo systemctl restart nginx
pm2 restart nexus-backend

# Verificar processos
ps aux | grep nginx
pm2 list

# Testar conectividade
ping api.nexusvalvulas.com.br
telnet api.nexusvalvulas.com.br 443
```

## 📈 Manutenção

### Renovação de Certificados

```bash
# Testar renovação
sudo certbot renew --dry-run

# Configurar renovação automática (já configurada pelo Certbot)
sudo crontab -l
```

### Backup de Configuração

```bash
# Backup da configuração do Nginx
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Backup dos certificados SSL
sudo tar -czf ssl-backup-$(date +%Y%m%d).tar.gz /etc/letsencrypt/
```

## 📞 Suporte

Para suporte adicional com a configuração do subdomínio, entre em contato com a equipe de desenvolvimento.
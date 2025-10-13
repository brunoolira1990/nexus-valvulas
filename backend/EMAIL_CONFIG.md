# Configuração de Email - Nexus Válvulas

## Variáveis de Ambiente (.env)

```env
# Servidor SMTP da Nexus Válvulas
SMTP_HOST=mail.nexusvalvulas.com.br
SMTP_PORT=587
SMTP_SECURE=false
SMTP_TLS=true
SMTP_USER=site@nexusvalvulas.com.br
SMTP_PASS=Nexus@Site

# Email de destino para mensagens de contato
CONTACT_EMAIL=nexus@nexusvalvulas.com.br
```

## Configurações do Servidor

- **Host**: mail.nexusvalvulas.com.br
- **Porta**: 587 (TLS)
- **Segurança**: TLS (não SSL)
- **Autenticação**: site@nexusvalvulas.com.br
- **Senha**: Nexus@Site

## Funcionamento

1. **Email para empresa**: Enviado para `nexus@nexusvalvulas.com.br`
2. **Email de confirmação**: Enviado para o cliente
3. **Remetente**: site@nexusvalvulas.com.br
4. **Armazenamento**: Banco de dados PostgreSQL

## Teste

Para testar a configuração, envie um formulário de contato e verifique:
- Recebimento do email na empresa
- Confirmação enviada ao cliente
- Registro no banco de dados

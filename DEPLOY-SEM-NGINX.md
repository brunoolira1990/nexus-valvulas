# Deploy do Nexus Válvulas sem Nginx

Esta documentação explica como implantar o site Nexus Válvulas sem usar Nginx, fazendo com que o próprio backend sirva os arquivos do frontend.

## Arquitetura

```
[Client] ← HTTP → [Backend Node.js/Express] → [Frontend (React)]
                                    ↓
                              [Backend API]
                                    ↓
                              [PostgreSQL]
```

## Processo de Deploy

### 1. Build do Frontend

```bash
npm run build:prod
```

Este comando gera os arquivos otimizados na pasta `dist/`.

### 2. Deploy do Backend

O backend foi configurado para servir os arquivos do frontend quando está em modo de produção (`NODE_ENV=production`).

### 3. Iniciar o Serviço

#### No Linux (com PM2):
```bash
# Instalar PM2 se não estiver instalado
npm install -g pm2

# Iniciar o backend
pm2 start backend/src/index.js --name nexus-backend

# Configurar para iniciar automaticamente após reinicialização
pm2 startup
pm2 save
```

#### No Linux (com systemd):
```bash
# Copiar o arquivo de serviço
sudo cp nexus-backend.service /etc/systemd/system/

# Editar o caminho do WorkingDirectory no arquivo de serviço
sudo nano /etc/systemd/system/nexus-backend.service

# Recarregar systemd e iniciar o serviço
sudo systemctl daemon-reload
sudo systemctl enable nexus-backend
sudo systemctl start nexus-backend
```

#### No Windows:
```powershell
# Executar o script de deploy
.\deploy-simple.ps1
```

## Variáveis de Ambiente Necessárias

Certifique-se de que as seguintes variáveis estão configuradas:

```bash
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public
JWT_SECRET=sua_chave_secreta_forte_aqui
PUBLIC_URL=http://seu-dominio.com
```

## Verificação

Após o deploy, verifique se:

1. O backend está rodando: `http://localhost:4000/api/test`
2. O frontend está sendo servido: `http://localhost:4000/`
3. O manifest.json está acessível: `http://localhost:4000/manifest.json`

## Vantagens desta Abordagem

- Elimina a complexidade do Nginx
- Menos componentes para gerenciar
- Configuração mais simples
- Menos pontos de falha

## Desvantagens

- O Node.js não é tão otimizado quanto o Nginx para servir arquivos estáticos
- Menos opções de cache avançado
- Menos recursos de segurança embutidos

## Troubleshooting

### Problemas com MIME Types

Se encontrar erros de MIME type, verifique se o arquivo `dist/manifest.json` existe e se está sendo servido com o tipo correto.

### Problemas com Rotas do React Router

Se as rotas do React Router não estiverem funcionando, verifique se a rota catch-all (`app.get('*')`) está configurada corretamente no backend.

### Problemas de Performance

Para melhorar a performance, o backend já está configurado para servir arquivos estáticos com cache de um ano:

```javascript
app.use(express.static(frontendDistPath, {
  maxAge: '1y',
  etag: false
}));
```
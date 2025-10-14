/**
 * Script para atualizar a configuração do Nginx com cabeçalhos CORS adequados
 * para o domínio do frontend.
 */

const fs = require('fs');
const path = require('path');

// Caminho para o arquivo de configuração do Nginx
const nginxConfPath = path.join(__dirname, '..', '..', 'nginx.conf');

// Verificar se o arquivo existe
if (!fs.existsSync(nginxConfPath)) {
  console.error('Arquivo nginx.conf não encontrado em:', nginxConfPath);
  process.exit(1);
}

// Ler o conteúdo atual do arquivo
let nginxConf = fs.readFileSync(nginxConfPath, 'utf8');

// Adicionar cabeçalhos CORS ao bloco do servidor API
const corsHeaders = `
        # Configuração CORS para permitir acesso do frontend
        add_header Access-Control-Allow-Origin "https://nexusvalvulas.com.br" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, Authorization" always;
        add_header Access-Control-Allow-Credentials "true" always;

        # Tratar requisições OPTIONS (preflight)
        if ($request_method = 'OPTIONS') {
            add_header Access-Control-Allow-Origin "https://nexusvalvulas.com.br";
            add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
            add_header Access-Control-Allow-Headers "Content-Type, Authorization";
            add_header Access-Control-Allow-Credentials "true";
            add_header Access-Control-Max-Age 1728000;
            add_header Content-Type 'text/plain; charset=utf-8';
            add_header Content-Length 0;
            return 204;
        }
`;

// Localizar o bloco do servidor API e inserir os cabeçalhos CORS
const apiServerRegex = /(server\s*\{\s*listen\s*443\s*ssl\s*http2;\s*server_name\s*api\.nexusvalvulas\.com\.br;[^}]*?)add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;/s;
if (apiServerRegex.test(nginxConf)) {
  nginxConf = nginxConf.replace(
    apiServerRegex,
    `$1add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;${corsHeaders}`
  );
  
  // Escrever o arquivo atualizado
  fs.writeFileSync(nginxConfPath, nginxConf, 'utf8');
  console.log('Configuração do Nginx atualizada com sucesso com cabeçalhos CORS!');
} else {
  console.error('Não foi possível encontrar o bloco do servidor API no arquivo nginx.conf');
  process.exit(1);
}
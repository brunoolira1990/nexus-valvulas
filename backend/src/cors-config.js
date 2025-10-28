// Configuração de CORS
// Resolve problemas de CORS entre frontend e backend

const cors = require('cors');

// Configuração de CORS para ambiente de produção
const corsOptions = {
  origin: function (origin, callback) {
    // Permitir requisições sem origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    // Lista de origens permitidas
    const allowedOrigins = [
      'http://localhost',
      'http://localhost:3000',
      'http://localhost:80',
      'https://nexusvalvulas.com.br',
      'https://www.nexusvalvulas.com.br',
      // Adicionar outros domínios conforme necessário
    ];
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware de CORS
const corsMiddleware = cors(corsOptions);

// Middleware para tratar preflight requests
const handlePreflight = (req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Max-Age', '1728000');
    res.status(200).end();
    return;
  }
  next();
};

module.exports = {
  corsMiddleware,
  handlePreflight,
  corsOptions
};
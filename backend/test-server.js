const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ 
    message: 'Servidor funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Contact form endpoint (simplified)
app.post('/contact', async (req, res) => {
  try {
    console.log('Recebida requisição de contato:', req.body);
    
    const { nome, empresa, email, telefone, assunto, mensagem } = req.body;
    
    // Validação básica
    if (!nome || !email || !assunto || !mensagem) {
      console.log('Campos obrigatórios ausentes');
      return res.status(400).json({ 
        error: 'Campos obrigatórios: nome, email, assunto e mensagem' 
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Email inválido:', email);
      return res.status(400).json({ error: 'E-mail inválido' });
    }

    const contactData = {
      nome,
      empresa: empresa || '',
      email,
      telefone: telefone || '',
      assunto,
      mensagem
    };

    console.log('Dados do contato preparados:', contactData);

    // Simular envio de email (sem SMTP por enquanto)
    console.log('Simulando envio de email...');
    
    // Simular sucesso
    res.json({ 
      success: true, 
      message: 'Mensagem enviada com sucesso! (modo teste)',
      data: contactData
    });
    
  } catch (err) {
    console.error('Erro no endpoint de contato:', err);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: err.message 
    });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor de teste rodando em http://localhost:${PORT}`);
  console.log('Teste: http://localhost:4000/test');
});

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

// Contact form endpoint (simplified - no database, no email)
app.post('/contact', async (req, res) => {
  try {
    console.log('=== NOVA REQUISIÇÃO DE CONTATO ===');
    console.log('Headers:', req.headers);
    console.log('Body:', req.body);
    
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

    // Enviar email real
    console.log('Enviando email real...');
    
    try {
      const nodemailer = require('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: 'mail.nexusvalvulas.com.br',
        port: 587,
        secure: false,
        auth: {
          user: 'site@nexusvalvulas.com.br',
          pass: 'Nexus@Site'
        }
      });

      // Email para empresa
      const emailResult = await transporter.sendMail({
        from: '"Nexus Válvulas" <site@nexusvalvulas.com.br>',
        to: 'nexus@nexusvalvulas.com.br',
        subject: `Nova mensagem de contato - ${contactData.assunto}`,
        replyTo: contactData.email,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
              Nova Mensagem de Contato
            </h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e293b; margin-top: 0;">Informações do Cliente</h3>
              <p><strong>Nome:</strong> ${contactData.nome}</p>
              ${contactData.empresa ? `<p><strong>Empresa:</strong> ${contactData.empresa}</p>` : ''}
              <p><strong>E-mail:</strong> ${contactData.email}</p>
              ${contactData.telefone ? `<p><strong>Telefone:</strong> ${contactData.telefone}</p>` : ''}
            </div>
            
            <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1e293b; margin-top: 0;">Mensagem</h3>
              <p><strong>Assunto:</strong> ${contactData.assunto}</p>
              <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
                ${contactData.mensagem.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #166534;">
                <strong>Data do envio:</strong> ${new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        `
      });

      console.log('✅ Email enviado com sucesso! Message ID:', emailResult.messageId);
      
      res.json({ 
        success: true, 
        message: 'Mensagem enviada com sucesso!',
        messageId: emailResult.messageId
      });
      
    } catch (emailError) {
      console.error('❌ Erro ao enviar email:', emailError.message);
      res.status(500).json({ 
        error: 'Erro ao enviar email',
        details: emailError.message 
      });
    }
    
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
  console.log(`Servidor simplificado rodando em http://localhost:${PORT}`);
  console.log('Teste: http://localhost:4000/test');
});

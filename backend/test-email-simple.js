const nodemailer = require('nodemailer');

async function testEmail() {
  console.log('Testando configuração de email...');
  
  // Configuração do transporter
  const transporter = nodemailer.createTransport({
    host: 'mail.nexusvalvulas.com.br',
    port: 587,
    secure: false,
    auth: {
      user: 'site@nexusvalvulas.com.br',
      pass: 'Nexus@Site'
    }
  });

  try {
    // Verificar conexão
    console.log('Verificando conexão SMTP...');
    await transporter.verify();
    console.log('✅ Conexão SMTP OK!');

    // Enviar email de teste
    console.log('Enviando email de teste...');
    const result = await transporter.sendMail({
      from: 'site@nexusvalvulas.com.br',
      to: 'nexus@nexusvalvulas.com.br',
      subject: 'Teste de Email - Nexus Válvulas',
      html: `
        <h2>Teste de Email</h2>
        <p>Este é um email de teste enviado em ${new Date().toLocaleString('pt-BR')}</p>
        <p>Se você recebeu este email, a configuração está funcionando!</p>
      `
    });

    console.log('✅ Email enviado com sucesso!');
    console.log('Message ID:', result.messageId);
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
    console.error('Detalhes:', error);
  }
}

testEmail();

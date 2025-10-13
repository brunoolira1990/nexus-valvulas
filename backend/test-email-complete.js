const nodemailer = require('nodemailer');

async function testCompleteEmail() {
  console.log('Enviando email de teste completo...');
  
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
    const result = await transporter.sendMail({
      from: '"Nexus Válvulas" <site@nexusvalvulas.com.br>',
      to: 'nexus@nexusvalvulas.com.br',
      subject: 'TESTE - Nova mensagem de contato - Teste de Sistema',
      replyTo: 'teste@exemplo.com',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            TESTE - Nova Mensagem de Contato
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Informações do Cliente</h3>
            <p><strong>Nome:</strong> Cliente Teste</p>
            <p><strong>Empresa:</strong> Empresa Teste Ltda</p>
            <p><strong>E-mail:</strong> teste@exemplo.com</p>
            <p><strong>Telefone:</strong> (11) 99999-9999</p>
          </div>
          
          <div style="background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #1e293b; margin-top: 0;">Mensagem</h3>
            <p><strong>Assunto:</strong> Teste de Sistema</p>
            <div style="background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #2563eb;">
              Esta é uma mensagem de teste para verificar se o sistema de email está funcionando corretamente.
              <br><br>
              Se você recebeu este email, o formulário de contato está funcionando perfeitamente!
            </div>
          </div>
          
          <div style="background-color: #dcfce7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; color: #166534;">
              <strong>Data do envio:</strong> ${new Date().toLocaleString('pt-BR')}
            </p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
          <p style="color: #64748b; font-size: 14px; text-align: center;">
            Esta mensagem foi enviada através do formulário de contato do site Nexus Válvulas
          </p>
        </div>
      `
    });

    console.log('✅ Email de teste enviado com sucesso!');
    console.log('Message ID:', result.messageId);
    console.log('📧 Verifique a caixa de entrada de: nexus@nexusvalvulas.com.br');
    console.log('📧 Se não encontrar, verifique a pasta de SPAM');
    
  } catch (error) {
    console.error('❌ Erro ao enviar email:', error.message);
  }
}

testCompleteEmail();

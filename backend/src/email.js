const nodemailer = require('nodemailer');

// Configuração do transporter de email
const createTransporter = () => {
  const config = {
    host: process.env.SMTP_HOST || 'mail.nexusvalvulas.com.br',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER || 'site@nexusvalvulas.com.br',
      pass: process.env.SMTP_PASS || 'Nexus@Site'
    }
  };

  // Configurações adicionais para diferentes provedores
  if (process.env.SMTP_TLS === 'true') {
    config.tls = {
      rejectUnauthorized: false
    };
  }

  if (process.env.SMTP_SSL === 'true') {
    config.secure = true;
  }

  return nodemailer.createTransport(config);
};

// Função para enviar email de contato
const sendContactEmail = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    // Verificar se o transporter foi criado
    if (!transporter) {
      throw new Error('Falha ao criar transporter de email');
    }
    
  const mailOptions = {
    from: `"Nexus Válvulas" <${process.env.SMTP_USER || 'site@nexusvalvulas.com.br'}>`,
    to: process.env.CONTACT_EMAIL || 'nexus@nexusvalvulas.com.br',
    subject: `Nova mensagem de contato - ${contactData.assunto}`,
    replyTo: contactData.email,
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nova Mensagem de Contato - Nexus Válvulas</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header com Logo e Cores da Empresa -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px 40px; text-align: center;">
            <div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; display: inline-block;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                NEXUS VÁLVULAS
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px; font-weight: 300;">
                Válvulas e Conexões Industriais
              </p>
            </div>
          </div>

          <!-- Título Principal -->
          <div style="padding: 40px 40px 20px 40px; text-align: center;">
            <h2 style="color: #1e40af; margin: 0; font-size: 24px; font-weight: 600;">
              📧 Nova Mensagem de Contato
            </h2>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 16px;">
              Recebida através do formulário do site
            </p>
          </div>

          <!-- Informações do Cliente -->
          <div style="margin: 0 40px 30px 40px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); border-radius: 12px; padding: 30px; border-left: 5px solid #3b82f6;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <div style="background-color: #3b82f6; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-right: 15px;">
                👤
              </div>
              <h3 style="color: #1e40af; margin: 0; font-size: 20px; font-weight: 600;">
                Informações do Cliente
              </h3>
            </div>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div>
                  <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Nome</p>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${contactData.nome}</p>
                </div>
                ${contactData.empresa ? `
                <div>
                  <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Empresa</p>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${contactData.empresa}</p>
                </div>
                ` : ''}
                <div>
                  <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">E-mail</p>
                  <p style="margin: 0; color: #3b82f6; font-size: 16px; font-weight: 600; text-decoration: none;">
                    <a href="mailto:${contactData.email}" style="color: #3b82f6; text-decoration: none;">${contactData.email}</a>
                  </p>
                </div>
                ${contactData.telefone ? `
                <div>
                  <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Telefone</p>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${contactData.telefone}</p>
                </div>
                ` : ''}
              </div>
            </div>
          </div>

          <!-- Mensagem -->
          <div style="margin: 0 40px 30px 40px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 30px; border-left: 5px solid #f59e0b;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <div style="background-color: #f59e0b; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-right: 15px;">
                💬
              </div>
              <h3 style="color: #92400e; margin: 0; font-size: 20px; font-weight: 600;">
                Mensagem Recebida
              </h3>
            </div>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 25px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              <div style="margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Assunto</p>
                <p style="margin: 0; color: #1e293b; font-size: 18px; font-weight: 600; background-color: #f8fafc; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b;">
                  ${contactData.assunto}
                </p>
              </div>
              
              <div>
                <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Conteúdo da Mensagem</p>
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; line-height: 1.6;">
                  <p style="margin: 0; color: #1e293b; font-size: 16px; white-space: pre-wrap;">${contactData.mensagem.replace(/\n/g, '\n')}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Informações Técnicas -->
          <div style="margin: 0 40px 40px 40px; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 12px; padding: 25px; border-left: 5px solid #22c55e;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
              <div style="display: flex; align-items: center;">
                <div style="background-color: #22c55e; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; margin-right: 15px;">
                  ⏰
                </div>
                <div>
                  <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Data do Envio</p>
                  <p style="margin: 0; color: #1e293b; font-size: 16px; font-weight: 600;">${new Date().toLocaleString('pt-BR')}</p>
                </div>
              </div>
              <div style="text-align: right;">
                <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Status</p>
                <p style="margin: 0; color: #22c55e; font-size: 16px; font-weight: 600;">✅ Recebida</p>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1e293b; padding: 30px 40px; text-align: center;">
            <div style="border-top: 1px solid #374151; padding-top: 20px;">
              <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">
                Esta mensagem foi enviada através do formulário de contato do site
              </p>
              <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: 600;">
                🌐 Nexus Válvulas e Conexões Industriais
              </p>
              <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px;">
                R. Miguel Langone, 341 - Itaquera - São Paulo/SP | (11) 4240-8832
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email enviado com sucesso:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return { success: false, error: error.message };
  }
};

// Função para enviar confirmação para o cliente
const sendConfirmationEmail = async (contactData) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.SMTP_USER || 'site@nexusvalvulas.com.br',
    to: contactData.email,
    subject: 'Confirmação de recebimento - Nexus Válvulas',
    html: `
      <!DOCTYPE html>
      <html lang="pt-BR">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Confirmação de Recebimento - Nexus Válvulas</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header com Logo -->
          <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px 40px; text-align: center;">
            <div style="background-color: rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px; display: inline-block;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                NEXUS VÁLVULAS
              </h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 14px; font-weight: 300;">
                Válvulas e Conexões Industriais
              </p>
            </div>
          </div>

          <!-- Mensagem de Confirmação -->
          <div style="padding: 40px 40px 20px 40px; text-align: center;">
            <div style="background-color: #dcfce7; border-radius: 50%; width: 80px; height: 80px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px auto;">
              <span style="font-size: 40px;">✅</span>
            </div>
            <h2 style="color: #1e40af; margin: 0; font-size: 24px; font-weight: 600;">
              Mensagem Recebida com Sucesso!
            </h2>
            <p style="color: #64748b; margin: 10px 0 0 0; font-size: 16px;">
              Obrigado pelo seu contato, ${contactData.nome}
            </p>
          </div>

          <!-- Mensagem Principal -->
          <div style="margin: 0 40px 30px 40px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; padding: 30px; border-left: 5px solid #0ea5e9;">
            <div style="text-align: center; margin-bottom: 25px;">
              <h3 style="color: #0c4a6e; margin: 0; font-size: 20px; font-weight: 600;">
                📧 Sua mensagem foi recebida
              </h3>
            </div>
            
            <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Olá <strong>${contactData.nome}</strong>,
            </p>
            
            <p style="color: #1e293b; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Recebemos sua mensagem e agradecemos pelo contato. Nossa equipe técnica analisará sua solicitação e retornará em breve com as informações solicitadas.
            </p>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              <h4 style="color: #0c4a6e; margin: 0 0 15px 0; font-size: 16px; font-weight: 600;">📋 Resumo da sua mensagem:</h4>
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">Assunto</p>
              <p style="margin: 0 0 15px 0; color: #1e293b; font-size: 16px; font-weight: 600; background-color: #f8fafc; padding: 10px; border-radius: 6px; border-left: 4px solid #0ea5e9;">
                ${contactData.assunto}
              </p>
              <div style="background-color: #f8fafc; padding: 15px; border-radius: 6px; border-left: 4px solid #3b82f6;">
                <p style="margin: 0; color: #1e293b; font-size: 15px; line-height: 1.5; white-space: pre-wrap;">${contactData.mensagem.replace(/\n/g, '\n')}</p>
              </div>
            </div>
          </div>

          <!-- Próximos Passos -->
          <div style="margin: 0 40px 30px 40px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 30px; border-left: 5px solid #f59e0b;">
            <div style="display: flex; align-items: center; margin-bottom: 20px;">
              <div style="background-color: #f59e0b; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 18px; margin-right: 15px;">
                ⏱️
              </div>
              <h3 style="color: #92400e; margin: 0; font-size: 20px; font-weight: 600;">
                Próximos Passos
              </h3>
            </div>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              <ul style="margin: 0; padding-left: 20px; color: #1e293b; font-size: 15px; line-height: 1.6;">
                <li style="margin-bottom: 10px;">Nossa equipe técnica analisará sua solicitação</li>
                <li style="margin-bottom: 10px;">Retornaremos em até 24 horas úteis</li>
                <li style="margin-bottom: 10px;">Enviaremos orçamento ou informações técnicas detalhadas</li>
                <li>Para dúvidas urgentes, entre em contato pelo telefone</li>
              </ul>
            </div>
          </div>

          <!-- Contato Urgente -->
          <div style="margin: 0 40px 40px 40px; background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%); border-radius: 12px; padding: 25px; border-left: 5px solid #ef4444;">
            <div style="display: flex; align-items: center; margin-bottom: 15px;">
              <div style="background-color: #ef4444; color: white; width: 35px; height: 35px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 16px; margin-right: 15px;">
                🚨
              </div>
              <h4 style="color: #dc2626; margin: 0; font-size: 18px; font-weight: 600;">
                Precisa de ajuda imediata?
              </h4>
            </div>
            
            <div style="background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);">
              <p style="margin: 0 0 15px 0; color: #1e293b; font-size: 15px;">
                Para solicitações urgentes, entre em contato conosco diretamente:
              </p>
              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;">
                <div style="display: flex; align-items: center;">
                  <span style="background-color: #dc2626; color: white; padding: 8px 12px; border-radius: 6px; font-weight: bold; margin-right: 10px;">📞</span>
                  <span style="color: #1e293b; font-size: 16px; font-weight: 600;">(11) 4240-8832</span>
                </div>
                <div style="display: flex; align-items: center;">
                  <span style="background-color: #dc2626; color: white; padding: 8px 12px; border-radius: 6px; font-weight: bold; margin-right: 10px;">✉️</span>
                  <span style="color: #1e293b; font-size: 16px; font-weight: 600;">nexus@nexusvalvulas.com.br</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #1e293b; padding: 30px 40px; text-align: center;">
            <div style="border-top: 1px solid #374151; padding-top: 20px;">
              <p style="color: #94a3b8; margin: 0 0 10px 0; font-size: 14px;">
                Obrigado por escolher a Nexus Válvulas
              </p>
              <p style="color: #ffffff; margin: 0; font-size: 16px; font-weight: 600;">
                🌐 Nexus Válvulas e Conexões Industriais
              </p>
              <p style="color: #94a3b8; margin: 5px 0 0 0; font-size: 12px;">
                R. Miguel Langone, 341 - Itaquera - São Paulo/SP | (11) 4240-8832
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('Email de confirmação enviado:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Erro ao enviar email de confirmação:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactEmail,
  sendConfirmationEmail
};

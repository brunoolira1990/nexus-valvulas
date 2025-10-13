const fetch = require('node-fetch');

async function testConnection() {
  try {
    console.log('Testando conexão com o servidor...');
    
    const response = await fetch('http://localhost:4000/test');
    const data = await response.json();
    
    console.log('✅ Servidor funcionando:', data);
    
    // Testar endpoint de contato
    console.log('\nTestando endpoint de contato...');
    const contactResponse = await fetch('http://localhost:4000/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: 'Teste',
        email: 'teste@exemplo.com',
        assunto: 'Teste',
        mensagem: 'Mensagem de teste'
      })
    });
    
    const contactData = await contactResponse.json();
    console.log('✅ Endpoint de contato:', contactData);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testConnection();

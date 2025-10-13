const fetch = require('node-fetch');

async function testContactEndpoint() {
  try {
    console.log('Testando endpoint de contato...');
    
    const response = await fetch('http://localhost:4000/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome: 'Teste Site',
        email: 'teste@exemplo.com',
        assunto: 'Teste do Site',
        mensagem: 'Testando se o formulário do site funciona'
      })
    });
    
    const result = await response.json();
    
    console.log('Status:', response.status);
    console.log('Resposta:', result);
    
    if (response.ok) {
      console.log('✅ Endpoint de contato funcionando!');
    } else {
      console.log('❌ Erro no endpoint:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
  }
}

testContactEndpoint();

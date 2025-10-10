const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    // Create a test file
    const testContent = 'test image content';
    fs.writeFileSync('test-image.txt', testContent);
    
    const form = new FormData();
    form.append('cover_image', fs.createReadStream('test-image.txt'));
    
    console.log('Testing upload to http://localhost:4000/blog/upload-test');
    
    const response = await fetch('http://localhost:4000/blog/upload-test', {
      method: 'POST',
      body: form
    });
    
    console.log('Response status:', response.status);
    const result = await response.text();
    console.log('Response:', result);
    
    // Clean up
    fs.unlinkSync('test-image.txt');
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testUpload();



const fs = require('fs');
const path = require('path');

async function runTests() {
  console.log('--- TESTING REGISTER ---');
  let res = await fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '0123456789',
      insuranceCode: 'BH123456'
    })
  });
  let data = await res.json();
  const cookie = res.headers.get('set-cookie');
  console.log('Register Response:', res.status, data);

  console.log('\n--- TESTING KÊ KHAI UPLOAD ---');
  const formData = new FormData();
  formData.append('bankOwner', 'NGUYEN VAN A');
  formData.append('bankAccount', '123456789');
  formData.append('bankName', 'Vietcombank');
  
  // Fake file
  const fileBlob = new Blob(['fake image data'], { type: 'image/jpeg' });
  formData.append('portrait', fileBlob, 'portrait.jpg');

  res = await fetch('http://localhost:3000/api/ke-khai', {
    method: 'POST',
    headers: {
      'Cookie': cookie ? cookie.split(';')[0] : ''
    },
    body: formData
  });
  data = await res.json();
  console.log('Ke Khai Response:', res.status, data);

}

runTests().catch(console.error);

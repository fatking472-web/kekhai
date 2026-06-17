const http = require('http');

http.get({
  hostname: 'localhost',
  port: 80,
  path: '/api/admin/users',
  headers: {
    // We can't easily authenticate as admin here without a session cookie, but let's see if server is running
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('BODY:', data.substring(0, 200)));
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});

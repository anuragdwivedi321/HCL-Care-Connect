const http = require('http');

function post(path, body) {
  return new Promise((resolve) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 8085,
      path: path,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, res => {
      let b = '';
      res.on('data', c => b += c);
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(b) }));
    });
    req.write(data);
    req.end();
  });
}

async function test() {
  console.log('=== Testing Flexible Authentication for Devansh Dubey ===\n');

  // 1. Register Devansh
  const reg = await post('/api/auth/register', {
    fullName: 'Devansh Dubey',
    username: 'devansh.dubey',
    email: 'devansh@careconnect.org',
    password: 'Password@123',
    role: 'ROLE_DOCTOR',
    specialization: 'General Medicine'
  });
  console.log('Register Status:', reg.status, '| Username in DB:', reg.body.username);

  // 2. Login using Full Name with space: "Devansh Dubey"
  const l1 = await post('/api/auth/login', { username: 'Devansh Dubey', password: 'Password@123' });
  console.log('Login with "Devansh Dubey":', l1.status, '| Logged In As:', l1.body.fullName, '| Role:', l1.body.role);

  // 3. Login using dot username: "devansh.dubey"
  const l2 = await post('/api/auth/login', { username: 'devansh.dubey', password: 'Password@123' });
  console.log('Login with "devansh.dubey":', l2.status, '| Logged In As:', l2.body.fullName);

  // 4. Login using email: "devansh@careconnect.org"
  const l3 = await post('/api/auth/login', { username: 'devansh@careconnect.org', password: 'Password@123' });
  console.log('Login with email:', l3.status, '| Logged In As:', l3.body.fullName);
}

test();

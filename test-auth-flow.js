const http = require('http');

function post(path, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const req = http.request({
      hostname: 'localhost',
      port: 8085,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    }, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(responseBody) });
        } catch (e) {
          resolve({ status: res.statusCode, body: responseBody });
        }
      });
    });
    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('=== CareConnect Auth & Database Verification ===\n');

  // Test 1: Non-existent user login
  console.log('1. Testing Login with non-existent user: unknown.doctor');
  const res1 = await post('/api/auth/login', { username: 'unknown.doctor', password: 'Password@123' });
  console.log('Status:', res1.status);
  console.log('Response:', res1.body);
  if (res1.status === 404 && res1.body.error === 'USER_NOT_FOUND') {
    console.log('✅ PASS: Correctly blocked entry and suggested Sign Up!\n');
  } else {
    console.log('❌ FAIL: Expected 404 USER_NOT_FOUND\n');
  }

  // Test 2: Register a new Doctor
  const newDoctor = {
    fullName: 'Dr. Anurag Kashyap',
    username: 'dr.anurag',
    email: 'anurag@hospital.org',
    password: 'Doctor@123',
    role: 'ROLE_DOCTOR',
    specialization: 'Cardiology',
    licenseNumber: 'DOC-9921'
  };
  console.log('2. Registering new Doctor:', newDoctor.username);
  const res2 = await post('/api/auth/register', newDoctor);
  console.log('Status:', res2.status);
  console.log('Response:', res2.body);
  if (res2.status === 200 && res2.body.username === 'dr.anurag') {
    console.log('✅ PASS: Successfully added to database!\n');
  } else {
    console.log('❌ FAIL: Failed to register doctor\n');
  }

  // Test 3: Login with newly registered doctor
  console.log('3. Logging in with newly registered doctor: dr.anurag');
  const res3 = await post('/api/auth/login', { username: 'dr.anurag', password: 'Doctor@123' });
  console.log('Status:', res3.status);
  console.log('Role:', res3.body.role, '| Token length:', res3.body.token ? res3.body.token.length : 0);
  if (res3.status === 200 && res3.body.token) {
    console.log('✅ PASS: Database validated credentials and generated JWT!\n');
  } else {
    console.log('❌ FAIL: Could not login newly registered user\n');
  }

  // Test 4: Register a new Patient (auto-generates patient record)
  const newPatient = {
    fullName: 'Suman Rao',
    username: 'patient.suman',
    email: 'suman@example.com',
    password: 'Patient@123',
    role: 'ROLE_PATIENT'
  };
  console.log('4. Registering new Patient:', newPatient.username);
  const res4 = await post('/api/auth/register', newPatient);
  console.log('Status:', res4.status);
  console.log('Response:', res4.body);
  if (res4.status === 200 && res4.body.username === 'patient.suman') {
    console.log('✅ PASS: Patient registered in database!\n');
  } else {
    console.log('❌ FAIL: Failed to register patient\n');
  }

  // Test 5: Login with newly registered patient
  console.log('5. Logging in with newly registered patient: patient.suman');
  const res5 = await post('/api/auth/login', { username: 'patient.suman', password: 'Patient@123' });
  console.log('Status:', res5.status);
  console.log('Role:', res5.body.role, '| PatientId:', res5.body.patientId);
  if (res5.status === 200 && res5.body.role === 'ROLE_PATIENT' && res5.body.patientId) {
    console.log('✅ PASS: Patient login succeeded with linked Patient entity in database!\n');
  } else {
    console.log('❌ FAIL: Could not login patient\n');
  }
}

runTests().catch(console.error);

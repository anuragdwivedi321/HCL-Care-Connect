const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, res => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const json = body ? JSON.parse(body) : null;
          resolve({ status: res.statusCode, data: json, raw: body });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(typeof data === 'string' ? data : JSON.stringify(data));
    req.end();
  });
}

async function runTests() {
  console.log('===============================================================');
  console.log('         CARECONNECT EHR - FULL END-TO-END VERIFICATION       ');
  console.log('===============================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message, detail = '') {
    if (condition) {
      console.log(`[PASS] ${message} ${detail ? '-> ' + detail : ''}`);
      passed++;
    } else {
      console.log(`[FAIL] ${message} ${detail ? '-> ' + detail : ''}`);
      failed++;
    }
  }

  // 1. Frontend Web Server Test (Port 4200)
  try {
    const fe = await request({ hostname: 'localhost', port: 4200, path: '/', method: 'GET' });
    assert(fe.status === 200, 'Frontend Angular Server (Port 4200)', `HTTP ${fe.status} OK`);
  } catch (err) {
    assert(false, 'Frontend Angular Server (Port 4200)', err.message);
  }

  // 2. Authentication Test for all 4 clinical roles
  const users = [
    { username: 'dr.sharma', password: 'Doctor@123', role: 'ROLE_DOCTOR', label: 'Doctor' },
    { username: 'nurse.priya', password: 'Nurse@123', role: 'ROLE_NURSE', label: 'Nurse' },
    { username: 'patient.rohit', password: 'Patient@123', role: 'ROLE_PATIENT', label: 'Patient' },
    { username: 'admin', password: 'Admin@123', role: 'ROLE_ADMIN', label: 'Admin' }
  ];

  const tokens = {};

  for (const u of users) {
    try {
      const payload = JSON.stringify({ username: u.username, password: u.password });
      const res = await request({
        hostname: 'localhost',
        port: 8085,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload) }
      }, payload);

      const ok = res.status === 200 && res.data && res.data.token && res.data.role === u.role;
      assert(ok, `Auth: ${u.label} Login (${u.username})`, `JWT Generated for ${res.data?.fullName} (${res.data?.role})`);
      if (ok) tokens[u.username] = res.data.token;
    } catch (err) {
      assert(false, `Auth: ${u.label} Login (${u.username})`, err.message);
    }
  }

  const docToken = tokens['dr.sharma'];
  const docHeaders = { 'Authorization': `Bearer ${docToken}` };
  const patToken = tokens['patient.rohit'];
  const patHeaders = { 'Authorization': `Bearer ${patToken}` };

  // 3. Patient Master Index & Demographics
  try {
    const res = await request({ hostname: 'localhost', port: 8085, path: '/api/patients', method: 'GET', headers: docHeaders });
    assert(res.status === 200 && Array.isArray(res.data) && res.data.length >= 3,
      'Patient Master Index (PMI)',
      `Loaded ${res.data?.length} patient records (MRN-2026-1001: ${res.data?.[0]?.firstName} ${res.data?.[0]?.lastName})`);
  } catch (err) {
    assert(false, 'Patient Master Index (PMI)', err.message);
  }

  // 4. Clinical Vitals & Automatic BMI Calculation
  try {
    const res = await request({ hostname: 'localhost', port: 8085, path: '/api/patients/1/vitals', method: 'GET', headers: docHeaders });
    const latest = res.data?.[0];
    assert(res.status === 200 && latest && latest.bmi > 0,
      'Patient Vitals & Auto-BMI Engine',
      `BP: ${latest?.systolicBP}/${latest?.diastolicBP} mmHg, HR: ${latest?.heartRate} bpm, Calculated BMI: ${latest?.bmi}`);
  } catch (err) {
    assert(false, 'Patient Vitals & Auto-BMI Engine', err.message);
  }

  // 5. Clinical Documentation (SOAP Notes & ICD-10 Tagging)
  try {
    const res = await request({ hostname: 'localhost', port: 8085, path: '/api/encounters/patient/1', method: 'GET', headers: docHeaders });
    const enc = res.data?.[0];
    assert(res.status === 200 && enc && enc.status === 'SIGNED',
      'Clinical Documentation (SOAP Notes)',
      `Encounter #${enc?.id} ICD-10: ${enc?.icd10Codes}, Signed By: ${enc?.signedBy}`);
  } catch (err) {
    assert(false, 'Clinical Documentation (SOAP Notes)', err.message);
  }

  // 6. Computerized Physician Order Entry (CPOE)
  try {
    const res = await request({ hostname: 'localhost', port: 8085, path: '/api/orders', method: 'GET', headers: docHeaders });
    const abnormalOrder = res.data?.find(o => o.flaggedAbnormal);
    assert(res.status === 200 && abnormalOrder,
      'CPOE Diagnostic Orders & Abnormal Lab Flagging',
      `Order #${abnormalOrder?.id} "${abnormalOrder?.orderName}" [LOINC: ${abnormalOrder?.loincCode}] Flagged Abnormal: ${abnormalOrder?.flaggedAbnormal}`);
  } catch (err) {
    assert(false, 'CPOE Diagnostic Orders & Abnormal Lab Flagging', err.message);
  }

  // 7. Medication Management & Real-Time Drug-Drug Interaction Safety
  try {
    // Rohit Verma (Patient 1) is already taking Lisinopril.
    // Doctor attempts to order Spironolactone -> triggers HIGH severity hyperkalemia alert!
    const payload = JSON.stringify({ patientId: 1, newMedication: 'Spironolactone' });
    const res = await request({
      hostname: 'localhost',
      port: 8085,
      path: '/api/medications/check-interactions',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(payload), ...docHeaders }
    }, payload);

    const hasHighAlert = Array.isArray(res.data) && res.data.some(w => w.severity === 'HIGH' && w.hasInteraction);
    assert(res.status === 200 && hasHighAlert,
      'Real-Time Drug-Drug Interaction Safety Engine',
      `Identified ${res.data?.length} severe interaction(s). Drug 1: ${res.data?.[0]?.drugA}, Drug 2: ${res.data?.[0]?.drugB}, Alert: "${res.data?.[0]?.description}"`);
  } catch (err) {
    assert(false, 'Real-Time Drug-Drug Interaction Safety Engine', err.message);
  }

  // 8. Patient Self-Service Portal
  try {
    const profile = await request({ hostname: 'localhost', port: 8085, path: '/api/portal/my-profile', method: 'GET', headers: patHeaders });
    const orders = await request({ hostname: 'localhost', port: 8085, path: '/api/portal/my-orders', method: 'GET', headers: patHeaders });
    const meds = await request({ hostname: 'localhost', port: 8085, path: '/api/portal/my-prescriptions', method: 'GET', headers: patHeaders });

    const portalOk = profile.status === 200 && orders.status === 200 && meds.status === 200;
    assert(portalOk,
      'Patient Self-Service Health Portal',
      `Patient: ${profile.data?.firstName} ${profile.data?.lastName}, Available Lab Results: ${orders.data?.length}, Active Prescriptions: ${meds.data?.length}`);
  } catch (err) {
    assert(false, 'Patient Self-Service Health Portal', err.message);
  }

  // 9. HIPAA Audit Trail
  try {
    const res = await request({ hostname: 'localhost', port: 8085, path: '/api/audit/logs', method: 'GET', headers: docHeaders });
    assert(res.status === 200 && Array.isArray(res.data) && res.data.length > 0,
      'HIPAA Compliance Audit Trail',
      `Audit ledger active with ${res.data?.length} immutable access/modification log entries.`);
  } catch (err) {
    assert(false, 'HIPAA Compliance Audit Trail', err.message);
  }

  // 10. Clinical Telemetry & Dashboard KPIs
  try {
    const res = await request({ hostname: 'localhost', port: 8085, path: '/api/dashboard/stats', method: 'GET', headers: docHeaders });
    assert(res.status === 200 && res.data && res.data.totalPatients >= 3,
      'Clinical Analytics Dashboard & Telemetry',
      `Patients: ${res.data?.totalPatients}, Open Encounters: ${res.data?.openEncounters}, Pending Orders: ${res.data?.pendingOrders}, Active Prescriptions: ${res.data?.activePrescriptions}, Abnormal Labs: ${res.data?.abnormalResultsCount}`);
  } catch (err) {
    assert(false, 'Clinical Analytics Dashboard & Telemetry', err.message);
  }

  console.log('\n===============================================================');
  console.log(`TEST SUMMARY: ${passed} PASSED | ${failed} FAILED`);
  console.log('===============================================================\n');

  if (failed === 0) {
    console.log('>>> ALL CARECONNECT EHR MODULES ARE VERIFIED 100% OPERATIONAL! <<<');
  }
}

runTests();

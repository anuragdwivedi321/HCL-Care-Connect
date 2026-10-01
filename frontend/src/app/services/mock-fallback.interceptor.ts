import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';
import {
  INITIAL_MOCK_PATIENTS,
  INITIAL_MOCK_VITALS,
  INITIAL_MOCK_ENCOUNTERS,
  INITIAL_MOCK_ORDERS,
  INITIAL_MOCK_PRESCRIPTIONS,
  INITIAL_MOCK_STATS,
  INITIAL_MOCK_AUDIT_LOGS
} from './mock-data';
import {
  AuthResponse,
  Role,
  InteractionCheckResult,
  DashboardStats,
  Patient,
  VitalSign,
  ClinicalEncounter,
  MedicalOrder,
  Prescription,
  AuditLog
} from '../models/ehr.models';

const STORAGE_KEY_USERS = 'careconnect_registered_users';
const STORAGE_KEY_PATIENTS = 'careconnect_mock_patients';
const STORAGE_KEY_VITALS = 'careconnect_mock_vitals';
const STORAGE_KEY_ENCOUNTERS = 'careconnect_mock_encounters';
const STORAGE_KEY_ORDERS = 'careconnect_mock_orders';
const STORAGE_KEY_PRESCRIPTIONS = 'careconnect_mock_prescriptions';
const STORAGE_KEY_AUDIT = 'careconnect_mock_audit_logs';

interface StoredUser {
  id: number;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: Role;
  patientId?: number;
  specialization?: string;
  licenseNumber?: string;
}

const DEFAULT_USERS: StoredUser[] = [
  {
    id: 7,
    username: 'priyank',
    password: 'Password@123',
    fullName: 'Dr. Priyank',
    email: 'priyank132021@gmail.com',
    role: 'ROLE_DOCTOR',
    specialization: 'General Physician',
    licenseNumber: 'DOC-PRIYANK-2026'
  },
  {
    id: 1,
    username: 'admin',
    password: 'Admin@123',
    fullName: 'System Administrator',
    email: 'admin@careconnect.io',
    role: 'ROLE_ADMIN'
  },
  {
    id: 2,
    username: 'dr.sharma',
    password: 'Doctor@123',
    fullName: 'Dr. Rajesh Sharma, MD',
    email: 'rsharma@careconnect.io',
    role: 'ROLE_DOCTOR',
    specialization: 'Cardiology',
    licenseNumber: 'MCI-CARD-44109'
  },
  {
    id: 3,
    username: 'dr.patel',
    password: 'Doctor@123',
    fullName: 'Dr. Sneha Patel, MD',
    email: 'spatel@careconnect.io',
    role: 'ROLE_DOCTOR',
    specialization: 'Internal Medicine',
    licenseNumber: 'MCI-INT-55291'
  },
  {
    id: 4,
    username: 'nurse.priya',
    password: 'Nurse@123',
    fullName: 'Nurse Priya Nair, BSN',
    email: 'pnair@careconnect.io',
    role: 'ROLE_NURSE',
    licenseNumber: 'INC-RN-88123'
  },
  {
    id: 5,
    username: 'patient.rohit',
    password: 'Patient@123',
    fullName: 'Rohit Verma',
    email: 'rohit.verma@example.com',
    role: 'ROLE_PATIENT',
    patientId: 1
  },
  {
    id: 6,
    username: 'patient.ananya',
    password: 'Patient@123',
    fullName: 'Ananya Deshmukh',
    email: 'ananya.d@example.com',
    role: 'ROLE_PATIENT',
    patientId: 2
  }
];

function getStored<T>(key: string, fallback: T): T {
  const data = localStorage.getItem(key);
  if (!data) {
    localStorage.setItem(key, JSON.stringify(fallback));
    return fallback;
  }
  try {
    return JSON.parse(data) as T;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

function appendAuditLog(
  action: string,
  entityName: string,
  entityId: number,
  details: string,
  performedBy?: string,
  userRole?: string
): void {
  try {
    const logs = getStored<AuditLog[]>(STORAGE_KEY_AUDIT, INITIAL_MOCK_AUDIT_LOGS);
    let operator = performedBy;
    let role = userRole;

    if (!operator) {
      const uStr = localStorage.getItem('careconnect_user');
      if (uStr) {
        const uObj = JSON.parse(uStr);
        operator = uObj.username || uObj.fullName || 'system';
        role = uObj.role || 'ROLE_DOCTOR';
      } else {
        operator = 'dr.sharma';
        role = 'ROLE_DOCTOR';
      }
    }

    const newLog: AuditLog = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      performedBy: operator || 'operator',
      userRole: (role as Role) || 'ROLE_DOCTOR',
      action,
      entityName,
      entityId,
      details,
      ipAddress: '127.0.0.1'
    };

    logs.unshift(newLog);
    setStored(STORAGE_KEY_AUDIT, logs.slice(0, 100)); // maintain latest 100 logs
  } catch (err) {
    console.warn('Could not append audit log', err);
  }
}

export const mockFallbackInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // If network error (status 0: Mixed Content, PNA blocked, server offline, or failed to fetch):
      if (err.status === 0 || err.status === 504 || err.message?.includes('Failed to fetch')) {
        return handleMock(req);
      }
      return throwError(() => err);
    })
  );
};

function handleMock(req: any) {
  const url: string = req.url;
  const method: string = req.method;

  // ==============================================================
  // 1. AUTHENTICATION & USER MANAGEMENT
  // ==============================================================

  // POST /api/auth/login
  if (url.includes('/api/auth/login') && method === 'POST') {
    const body = req.body || {};
    const inputUser = (body.username || '').trim().toLowerCase();
    const inputPass = body.password || '';

    const users = getStored<StoredUser[]>(STORAGE_KEY_USERS, DEFAULT_USERS);

    // Find user by username or email or full name (case-insensitive)
    const foundUser = users.find(u => 
      u.username.toLowerCase() === inputUser ||
      u.email.toLowerCase() === inputUser ||
      u.fullName.toLowerCase() === inputUser ||
      u.username.toLowerCase() === inputUser.replace(/\s+/g, '.')
    );

    // If user does not exist in database:
    if (!foundUser) {
      return throwError(() => new HttpErrorResponse({
        status: 404,
        error: {
          error: 'USER_NOT_FOUND',
          message: `User '${body.username}' is not registered in database. Please Sign Up first!`
        }
      }));
    }

    // If user exists, but password is wrong:
    if (foundUser.password !== inputPass) {
      return throwError(() => new HttpErrorResponse({
        status: 401,
        error: {
          error: 'BAD_CREDENTIALS',
          message: 'Incorrect password! If you forgot it, click "Reset Password" below.'
        }
      }));
    }

    // Successful Login
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      type: 'Bearer',
      id: foundUser.id,
      username: foundUser.username,
      fullName: foundUser.fullName,
      email: foundUser.email,
      role: foundUser.role,
      patientId: foundUser.patientId
    };

    appendAuditLog('LOGIN', 'User', foundUser.id, `User ${foundUser.username} (${foundUser.role}) signed in successfully`, foundUser.username, foundUser.role);

    return of(new HttpResponse({ status: 200, body: mockResponse }));
  }

  // POST /api/auth/register
  if (url.includes('/api/auth/register') && method === 'POST') {
    const body = req.body || {};
    const regUsername = (body.username || '').trim().toLowerCase().replace(/\s+/g, '.');
    const regEmail = (body.email || '').trim().toLowerCase();

    const users = getStored<StoredUser[]>(STORAGE_KEY_USERS, DEFAULT_USERS);

    // Check duplicate username
    if (users.some(u => u.username.toLowerCase() === regUsername)) {
      return throwError(() => new HttpErrorResponse({
        status: 400,
        error: {
          error: 'BAD_REQUEST',
          message: `Username '${regUsername}' is already taken`
        }
      }));
    }

    // Check duplicate email
    if (users.some(u => u.email.toLowerCase() === regEmail)) {
      return throwError(() => new HttpErrorResponse({
        status: 400,
        error: {
          error: 'BAD_REQUEST',
          message: `Email '${regEmail}' is already registered`
        }
      }));
    }

    let assignedPatientId: number | undefined = undefined;
    if (body.role === 'ROLE_PATIENT') {
      assignedPatientId = Date.now();
      // Also register a patient demographic record so the patient portal works immediately!
      const patients = getStored<Patient[]>(STORAGE_KEY_PATIENTS, INITIAL_MOCK_PATIENTS);
      const names = (body.fullName || regUsername).split(' ');
      const newPat: Patient = {
        id: assignedPatientId,
        mrn: `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: names[0] || regUsername,
        lastName: names.slice(1).join(' ') || '',
        dateOfBirth: '1995-01-01',
        gender: 'Male',
        bloodGroup: 'B+',
        email: regEmail,
        phone: '+91 98765 00000',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560001',
        allergies: 'None Known (NKDA)',
        chronicConditions: 'None',
        createdAt: new Date().toISOString()
      };
      patients.unshift(newPat);
      setStored(STORAGE_KEY_PATIENTS, patients);
    }

    // Save new user
    const newUser: StoredUser = {
      id: Date.now(),
      username: regUsername,
      password: body.password,
      fullName: body.fullName || regUsername,
      email: regEmail,
      role: body.role || 'ROLE_DOCTOR',
      specialization: body.specialization,
      licenseNumber: body.licenseNumber,
      patientId: assignedPatientId
    };

    users.push(newUser);
    setStored(STORAGE_KEY_USERS, users);

    appendAuditLog('REGISTER', 'User', newUser.id, `New user account created: ${newUser.username} (${newUser.role})`, newUser.username, newUser.role);

    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      type: 'Bearer',
      id: newUser.id,
      username: newUser.username,
      fullName: newUser.fullName,
      email: newUser.email,
      role: newUser.role,
      patientId: newUser.patientId
    };

    return of(new HttpResponse({ status: 200, body: mockResponse }));
  }

  // POST /api/auth/reset-password
  if (url.includes('/api/auth/reset-password') && method === 'POST') {
    const body = req.body || {};
    const username = (body.username || '').trim().toLowerCase();
    const newPassword = body.newPassword;

    const users = getStored<StoredUser[]>(STORAGE_KEY_USERS, DEFAULT_USERS);
    const user = users.find(u => u.username.toLowerCase() === username || u.email.toLowerCase() === username);

    if (!user) {
      return throwError(() => new HttpErrorResponse({
        status: 404,
        error: { message: `Username '${username}' not found in database` }
      }));
    }

    user.password = newPassword;
    setStored(STORAGE_KEY_USERS, users);

    appendAuditLog('RESET_PASSWORD', 'User', user.id, `Password was reset for user ${user.username}`, user.username, user.role);

    return of(new HttpResponse({ status: 200, body: { message: 'Password updated successfully!' } }));
  }

  // ==============================================================
  // 2. DASHBOARD STATS
  // ==============================================================
  if (url.includes('/api/dashboard/stats')) {
    const patients = getStored<Patient[]>(STORAGE_KEY_PATIENTS, INITIAL_MOCK_PATIENTS);
    const encounters = getStored<ClinicalEncounter[]>(STORAGE_KEY_ENCOUNTERS, INITIAL_MOCK_ENCOUNTERS);
    const orders = getStored<MedicalOrder[]>(STORAGE_KEY_ORDERS, INITIAL_MOCK_ORDERS);
    const prescriptions = getStored<Prescription[]>(STORAGE_KEY_PRESCRIPTIONS, INITIAL_MOCK_PRESCRIPTIONS);

    const stats: DashboardStats = {
      totalPatients: patients.length,
      openEncounters: encounters.length,
      pendingOrders: orders.filter(o => o.status === 'PENDING').length,
      activePrescriptions: prescriptions.filter(p => p.status === 'ACTIVE').length,
      abnormalResultsCount: orders.filter(o => o.flaggedAbnormal).length
    };
    return of(new HttpResponse({ status: 200, body: stats }));
  }

  // ==============================================================
  // 3. PATIENTS & VITALS
  // ==============================================================
  if (url.includes('/api/patients')) {
    const patients = getStored<Patient[]>(STORAGE_KEY_PATIENTS, INITIAL_MOCK_PATIENTS);
    const vitals = getStored<VitalSign[]>(STORAGE_KEY_VITALS, INITIAL_MOCK_VITALS);

    // GET or POST /api/patients/:id/vitals
    if (url.includes('/vitals')) {
      const match = url.match(/\/patients\/(\d+)\/vitals/);
      const pId = match ? parseInt(match[1]) : 1;

      if (method === 'POST') {
        const newVitals: VitalSign = {
          ...req.body,
          id: Date.now(),
          patientId: pId,
          recordedAt: new Date().toISOString(),
          recordedBy: req.body.recordedBy || 'Nurse Priya'
        };
        const allVitals = [newVitals, ...vitals];
        setStored(STORAGE_KEY_VITALS, allVitals);

        appendAuditLog('RECORD_VITALS', 'VitalSign', newVitals.id!, `Logged BP ${newVitals.systolicBP}/${newVitals.diastolicBP}, BMI ${newVitals.bmi} for Patient #${pId}`);

        return of(new HttpResponse({ status: 201, body: newVitals }));
      }

      // GET /api/patients/:id/vitals
      const patientVitals = vitals.filter(v => v.patientId === pId);
      return of(new HttpResponse({ status: 200, body: patientVitals }));
    }

    // GET /api/patients/:id
    const idMatch = url.match(/\/patients\/(\d+)$/);
    if (idMatch && method === 'GET') {
      const pId = parseInt(idMatch[1]);
      const found = patients.find(p => p.id === pId) || patients[0];
      return of(new HttpResponse({ status: 200, body: found }));
    }

    // PUT /api/patients/:id
    if (idMatch && method === 'PUT') {
      const pId = parseInt(idMatch[1]);
      const idx = patients.findIndex(p => p.id === pId);
      if (idx >= 0) {
        patients[idx] = { ...patients[idx], ...req.body, updatedAt: new Date().toISOString() };
        setStored(STORAGE_KEY_PATIENTS, patients);
        appendAuditLog('UPDATE_PATIENT', 'Patient', pId, `Updated demographics for ${patients[idx].firstName} ${patients[idx].lastName}`);
        return of(new HttpResponse({ status: 200, body: patients[idx] }));
      }
    }

    // POST /api/patients
    if (method === 'POST') {
      const newP: Patient = {
        ...req.body,
        id: Date.now(),
        mrn: `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      patients.unshift(newP);
      setStored(STORAGE_KEY_PATIENTS, patients);

      appendAuditLog('CREATE_PATIENT', 'Patient', newP.id!, `Registered new patient ${newP.firstName} ${newP.lastName} with MRN ${newP.mrn}`);

      return of(new HttpResponse({ status: 201, body: newP }));
    }

    // GET /api/patients (supports query parameter)
    let result = [...patients];
    try {
      const urlObj = new URL(url, 'http://localhost');
      const q = (urlObj.searchParams.get('query') || '').trim().toLowerCase();
      if (q) {
        result = result.filter(p =>
          p.firstName.toLowerCase().includes(q) ||
          p.lastName.toLowerCase().includes(q) ||
          (p.mrn && p.mrn.toLowerCase().includes(q)) ||
          (p.phone && p.phone.includes(q)) ||
          (p.city && p.city.toLowerCase().includes(q))
        );
      }
    } catch {}

    return of(new HttpResponse({ status: 200, body: result }));
  }

  // ==============================================================
  // 4. CLINICAL DOCUMENTATION / SOAP ENCOUNTERS
  // ==============================================================
  if (url.includes('/api/encounters')) {
    const encounters = getStored<ClinicalEncounter[]>(STORAGE_KEY_ENCOUNTERS, INITIAL_MOCK_ENCOUNTERS);

    // PUT /api/encounters/:id/sign
    if (url.includes('/sign')) {
      const idMatch = url.match(/\/encounters\/(\d+)\/sign/);
      const encId = idMatch ? parseInt(idMatch[1]) : 1;
      const enc = encounters.find(e => e.id === encId);
      if (enc) {
        enc.status = 'SIGNED';
        enc.signedAt = new Date().toISOString();
        enc.signedBy = 'Dr. Priyank';
        setStored(STORAGE_KEY_ENCOUNTERS, encounters);
        appendAuditLog('SIGN_SOAP', 'ClinicalEncounter', encId, `Digitally signed & locked SOAP encounter #${encId}`);
      }
      return of(new HttpResponse({ status: 200, body: enc || encounters[0] }));
    }

    // GET /api/encounters/patient/:patientId
    const patientEncMatch = url.match(/\/encounters\/patient\/(\d+)/);
    if (patientEncMatch && method === 'GET') {
      const pId = parseInt(patientEncMatch[1]);
      const filtered = encounters.filter(e => e.patientId === pId);
      return of(new HttpResponse({ status: 200, body: filtered }));
    }

    // GET /api/encounters/:id
    const singleEncMatch = url.match(/\/encounters\/(\d+)$/);
    if (singleEncMatch && method === 'GET') {
      const encId = parseInt(singleEncMatch[1]);
      const found = encounters.find(e => e.id === encId) || encounters[0];
      return of(new HttpResponse({ status: 200, body: found }));
    }

    // POST /api/encounters
    if (method === 'POST') {
      const newEnc: ClinicalEncounter = {
        ...req.body,
        id: Date.now(),
        encounterDate: new Date().toISOString(),
        status: req.body.status || 'SIGNED',
        signedAt: new Date().toISOString(),
        signedBy: 'Dr. Priyank'
      };
      encounters.unshift(newEnc);
      setStored(STORAGE_KEY_ENCOUNTERS, encounters);

      appendAuditLog('CREATE_SOAP', 'ClinicalEncounter', newEnc.id!, `Documented clinical encounter for Patient #${newEnc.patientId} (CC: ${newEnc.chiefComplaint})`);

      return of(new HttpResponse({ status: 201, body: newEnc }));
    }

    return of(new HttpResponse({ status: 200, body: encounters }));
  }

  // ==============================================================
  // 5. CPOE ORDERS
  // ==============================================================
  if (url.includes('/api/orders')) {
    const orders = getStored<MedicalOrder[]>(STORAGE_KEY_ORDERS, INITIAL_MOCK_ORDERS);

    // PATCH /api/orders/:id/status
    if (url.includes('/status')) {
      const idMatch = url.match(/\/orders\/(\d+)\/status/);
      const ordId = idMatch ? parseInt(idMatch[1]) : 1;
      const ord = orders.find(o => o.id === ordId);
      if (ord) {
        Object.assign(ord, req.body, { completedAt: new Date().toISOString() });
        setStored(STORAGE_KEY_ORDERS, orders);
        appendAuditLog('UPDATE_ORDER_RESULT', 'MedicalOrder', ordId, `Reported results for order #${ordId} (${ord.orderName}) - Status: ${ord.status}`);
      }
      return of(new HttpResponse({ status: 200, body: ord || orders[0] }));
    }

    // GET /api/orders/patient/:patientId
    const patientOrdMatch = url.match(/\/orders\/patient\/(\d+)/);
    if (patientOrdMatch && method === 'GET') {
      const pId = parseInt(patientOrdMatch[1]);
      const filtered = orders.filter(o => o.patientId === pId);
      return of(new HttpResponse({ status: 200, body: filtered }));
    }

    // POST /api/orders
    if (method === 'POST') {
      const newOrd: MedicalOrder = {
        ...req.body,
        id: Date.now(),
        orderedAt: new Date().toISOString(),
        status: 'PENDING'
      };
      orders.unshift(newOrd);
      setStored(STORAGE_KEY_ORDERS, orders);

      appendAuditLog('CPOE_ORDER', 'MedicalOrder', newOrd.id!, `Requisitioned ${newOrd.orderType} order: ${newOrd.orderName} (Priority: ${newOrd.priority}) for Patient #${newOrd.patientId}`);

      return of(new HttpResponse({ status: 201, body: newOrd }));
    }

    // GET /api/orders (supports ?status=)
    let filteredOrders = [...orders];
    try {
      const urlObj = new URL(url, 'http://localhost');
      const st = urlObj.searchParams.get('status');
      if (st && st !== 'ALL') {
        filteredOrders = filteredOrders.filter(o => o.status === st);
      }
    } catch {}

    return of(new HttpResponse({ status: 200, body: filteredOrders }));
  }

  // ==============================================================
  // 6. MEDICATIONS & DRUG-DRUG INTERACTIONS
  // ==============================================================
  if (url.includes('/api/medications')) {
    // POST /api/medications/check-interactions
    if (url.includes('/check-interactions')) {
      const body = req.body || {};
      const med = (body.newMedication || '').toLowerCase();
      const results: InteractionCheckResult[] = [];

      if (med.includes('aspirin') || med.includes('warfarin')) {
        results.push({
          hasInteraction: true,
          drugA: 'Warfarin',
          drugB: 'Aspirin',
          severity: 'HIGH',
          description: 'Concurrent use significantly increases risk of major gastrointestinal and systemic hemorrhage.',
          clinicalRecommendation: 'Avoid combination unless specifically indicated (e.g. mechanical heart valve); close INR monitoring mandatory.'
        });
      }
      if (med.includes('spironolactone') || med.includes('lisinopril')) {
        results.push({
          hasInteraction: true,
          drugA: 'Lisinopril',
          drugB: 'Spironolactone',
          severity: 'HIGH',
          description: 'Concurrent ACE inhibitor and potassium-sparing diuretic can cause severe, life-threatening hyperkalemia.',
          clinicalRecommendation: 'Monitor serum potassium and renal function within 1 week of co-administration.'
        });
      }
      if (med.includes('metformin') && (med.includes('contrast') || med.includes('iodine'))) {
        results.push({
          hasInteraction: true,
          drugA: 'Metformin',
          drugB: 'Iodinated Contrast',
          severity: 'HIGH',
          description: 'Intravascular administration of iodinated radiocontrast agents in patients on Metformin can lead to acute renal failure and fatal lactic acidosis.',
          clinicalRecommendation: 'Withhold Metformin 48 hours prior to and 48 hours post procedure until renal function is re-verified.'
        });
      }
      if (med.includes('clopidogrel') && med.includes('omeprazole')) {
        results.push({
          hasInteraction: true,
          drugA: 'Clopidogrel',
          drugB: 'Omeprazole',
          severity: 'MODERATE',
          description: 'Omeprazole inhibits CYP2C19, significantly reducing active antiplatelet metabolite formation of Clopidogrel.',
          clinicalRecommendation: 'Substitute with Pantoprazole or H2 blocker to preserve antiplatelet efficacy.'
        });
      }
      if (med.includes('simvastatin') && med.includes('amiodarone')) {
        results.push({
          hasInteraction: true,
          drugA: 'Simvastatin',
          drugB: 'Amiodarone',
          severity: 'HIGH',
          description: 'Amiodarone inhibits CYP3A4 metabolism of Simvastatin, leading to toxic systemic levels and severe rhabdomyolysis.',
          clinicalRecommendation: 'Do not exceed Simvastatin 20mg daily, or switch to Rosuvastatin/Atorvastatin.'
        });
      }

      return of(new HttpResponse({ status: 200, body: results }));
    }

    const prescriptions = getStored<Prescription[]>(STORAGE_KEY_PRESCRIPTIONS, INITIAL_MOCK_PRESCRIPTIONS);

    // PUT /api/medications/:id/discontinue
    if (url.includes('/discontinue')) {
      const idMatch = url.match(/\/medications\/(\d+)\/discontinue/);
      const rxId = idMatch ? parseInt(idMatch[1]) : 1;
      const rx = prescriptions.find(p => p.id === rxId);
      if (rx) {
        rx.status = 'DISCONTINUED';
        setStored(STORAGE_KEY_PRESCRIPTIONS, prescriptions);
        appendAuditLog('DISCONTINUE_MEDICATION', 'Prescription', rxId, `Discontinued medication ${rx.medicationName} for Patient #${rx.patientId}`);
      }
      return of(new HttpResponse({ status: 200, body: rx || prescriptions[0] }));
    }

    // GET /api/medications/patient/:patientId
    const patientMedMatch = url.match(/\/medications\/patient\/(\d+)/);
    if (patientMedMatch && method === 'GET') {
      const pId = parseInt(patientMedMatch[1]);
      let patientRx = prescriptions.filter(p => p.patientId === pId);

      try {
        const urlObj = new URL(url, 'http://localhost');
        const activeOnly = urlObj.searchParams.get('activeOnly') === 'true';
        if (activeOnly) {
          patientRx = patientRx.filter(p => p.status === 'ACTIVE');
        }
      } catch {}

      return of(new HttpResponse({ status: 200, body: patientRx }));
    }

    // POST /api/medications
    if (method === 'POST') {
      const newRx: Prescription = {
        ...req.body,
        id: Date.now(),
        prescribedAt: new Date().toISOString().split('T')[0],
        status: 'ACTIVE'
      };
      prescriptions.unshift(newRx);
      setStored(STORAGE_KEY_PRESCRIPTIONS, prescriptions);

      appendAuditLog('PRESCRIBE_MEDICATION', 'Prescription', newRx.id!, `E-Prescribed ${newRx.medicationName} (${newRx.dosage}, ${newRx.frequency}) for Patient #${newRx.patientId}`);

      return of(new HttpResponse({ status: 201, body: newRx }));
    }

    return of(new HttpResponse({ status: 200, body: prescriptions }));
  }

  // ==============================================================
  // 7. PATIENT PORTAL (SELF-SERVICE)
  // ==============================================================
  if (url.includes('/api/portal')) {
    let selfPatientId = 1;
    try {
      const uStr = localStorage.getItem('careconnect_user');
      if (uStr) {
        const uObj = JSON.parse(uStr);
        if (uObj.patientId) {
          selfPatientId = uObj.patientId;
        }
      }
    } catch {}

    const patients = getStored<Patient[]>(STORAGE_KEY_PATIENTS, INITIAL_MOCK_PATIENTS);
    const vitals = getStored<VitalSign[]>(STORAGE_KEY_VITALS, INITIAL_MOCK_VITALS);
    const encounters = getStored<ClinicalEncounter[]>(STORAGE_KEY_ENCOUNTERS, INITIAL_MOCK_ENCOUNTERS);
    const orders = getStored<MedicalOrder[]>(STORAGE_KEY_ORDERS, INITIAL_MOCK_ORDERS);
    const prescriptions = getStored<Prescription[]>(STORAGE_KEY_PRESCRIPTIONS, INITIAL_MOCK_PRESCRIPTIONS);

    if (url.includes('/my-profile')) {
      const myPat = patients.find(p => p.id === selfPatientId) || patients[0];
      return of(new HttpResponse({ status: 200, body: myPat }));
    }
    if (url.includes('/my-vitals')) {
      const myVitals = vitals.filter(v => v.patientId === selfPatientId);
      return of(new HttpResponse({ status: 200, body: myVitals }));
    }
    if (url.includes('/my-encounters')) {
      const myEnc = encounters.filter(e => e.patientId === selfPatientId);
      return of(new HttpResponse({ status: 200, body: myEnc }));
    }
    if (url.includes('/my-orders')) {
      const myOrd = orders.filter(o => o.patientId === selfPatientId);
      return of(new HttpResponse({ status: 200, body: myOrd }));
    }
    if (url.includes('/my-prescriptions')) {
      const myRx = prescriptions.filter(p => p.patientId === selfPatientId);
      return of(new HttpResponse({ status: 200, body: myRx }));
    }
  }

  // ==============================================================
  // 8. AUDIT LOGS
  // ==============================================================
  if (url.includes('/api/audit/logs')) {
    const logs = getStored<AuditLog[]>(STORAGE_KEY_AUDIT, INITIAL_MOCK_AUDIT_LOGS);
    let result = [...logs];

    try {
      const urlObj = new URL(url, 'http://localhost');
      const entity = urlObj.searchParams.get('entityName');
      const eId = urlObj.searchParams.get('entityId');

      if (entity) {
        result = result.filter(l => l.entityName.toLowerCase() === entity.toLowerCase());
      }
      if (eId) {
        const numId = parseInt(eId);
        result = result.filter(l => l.entityId === numId);
      }
    } catch {}

    return of(new HttpResponse({ status: 200, body: result }));
  }

  return of(new HttpResponse({ status: 200, body: [] }));
}

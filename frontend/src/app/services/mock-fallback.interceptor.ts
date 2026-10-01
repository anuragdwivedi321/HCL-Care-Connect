import { HttpInterceptorFn, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { catchError, of, throwError } from 'rxjs';
import {
  INITIAL_MOCK_PATIENTS,
  INITIAL_MOCK_VITALS,
  INITIAL_MOCK_ENCOUNTERS,
  INITIAL_MOCK_ORDERS,
  INITIAL_MOCK_PRESCRIPTIONS,
  INITIAL_MOCK_STATS
} from './mock-data';
import { AuthResponse, Role, InteractionCheckResult, DashboardStats } from '../models/ehr.models';

const STORAGE_KEY_PATIENTS = 'careconnect_mock_patients';
const STORAGE_KEY_VITALS = 'careconnect_mock_vitals';
const STORAGE_KEY_ENCOUNTERS = 'careconnect_mock_encounters';
const STORAGE_KEY_ORDERS = 'careconnect_mock_orders';
const STORAGE_KEY_PRESCRIPTIONS = 'careconnect_mock_prescriptions';

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

export const mockFallbackInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      // If network error (status 0: Mixed Content, PNA blocked, server offline, or failed to fetch):
      if (err.status === 0 || err.status === 504 || err.message?.includes('Failed to fetch')) {
        console.warn(`[CareConnect Fallback] Backend unreachable (${err.message}). Using local demo engine for: ${req.url}`);
        return handleMock(req);
      }
      return throwError(() => err);
    })
  );
};

function handleMock(req: any) {
  const url = req.url;
  const method = req.method;

  // 1. AUTH: Login
  if (url.includes('/api/auth/login') && method === 'POST') {
    const body = req.body || {};
    const inputUser = (body.username || 'priyank').trim();
    let role: Role = 'ROLE_DOCTOR';
    let fullName = 'Dr. Priyank';

    const lower = inputUser.toLowerCase();
    if (lower.includes('admin')) {
      role = 'ROLE_ADMIN';
      fullName = 'System Administrator';
    } else if (lower.includes('nurse')) {
      role = 'ROLE_NURSE';
      fullName = 'Nurse Priya Nair, BSN';
    } else if (lower.includes('patient') || lower.includes('rohit')) {
      role = 'ROLE_PATIENT';
      fullName = 'Rohit Verma';
    } else if (lower.includes('sharma')) {
      role = 'ROLE_DOCTOR';
      fullName = 'Dr. Rajesh Sharma, MD';
    } else if (lower.includes('priyank')) {
      role = 'ROLE_DOCTOR';
      fullName = 'Dr. Priyank';
    } else {
      fullName = inputUser.charAt(0).toUpperCase() + inputUser.slice(1);
    }

    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      type: 'Bearer',
      id: 7,
      username: inputUser,
      fullName: fullName,
      email: `${lower.replace(/\s+/g, '.')}@careconnect.io`,
      role: role,
      patientId: role === 'ROLE_PATIENT' ? 1 : undefined
    };

    return of(new HttpResponse({ status: 200, body: mockResponse }));
  }

  // 2. AUTH: Register
  if (url.includes('/api/auth/register') && method === 'POST') {
    const body = req.body || {};
    const mockResponse: AuthResponse = {
      token: 'mock-jwt-token-' + Date.now(),
      type: 'Bearer',
      id: 99,
      username: body.username || 'new.user',
      fullName: body.fullName || 'New User',
      email: body.email || 'user@example.com',
      role: body.role || 'ROLE_DOCTOR',
      patientId: body.patientId
    };
    return of(new HttpResponse({ status: 200, body: mockResponse }));
  }

  // 3. AUTH: Reset Password
  if (url.includes('/api/auth/reset-password') && method === 'POST') {
    return of(new HttpResponse({ status: 200, body: { message: 'Password updated successfully!' } }));
  }

  // 4. DASHBOARD STATS
  if (url.includes('/api/dashboard/stats')) {
    const patients = getStored(STORAGE_KEY_PATIENTS, INITIAL_MOCK_PATIENTS);
    const stats: DashboardStats = {
      ...INITIAL_MOCK_STATS,
      totalPatients: patients.length
    };
    return of(new HttpResponse({ status: 200, body: stats }));
  }

  // 5. PATIENTS
  if (url.includes('/api/patients')) {
    const patients = getStored(STORAGE_KEY_PATIENTS, INITIAL_MOCK_PATIENTS);

    // GET /api/patients/:id/vitals
    if (url.includes('/vitals')) {
      const match = url.match(/\/patients\/(\d+)\/vitals/);
      const pId = match ? parseInt(match[1]) : 1;
      const vitals = getStored(STORAGE_KEY_VITALS, INITIAL_MOCK_VITALS).filter(v => v.patientId === pId);

      if (method === 'POST') {
        const newVitals = { ...req.body, id: Date.now(), patientId: pId, recordedAt: new Date().toISOString() };
        const allVitals = [...getStored(STORAGE_KEY_VITALS, INITIAL_MOCK_VITALS), newVitals];
        setStored(STORAGE_KEY_VITALS, allVitals);
        return of(new HttpResponse({ status: 201, body: newVitals }));
      }
      return of(new HttpResponse({ status: 200, body: vitals }));
    }

    // GET /api/patients/:id
    const idMatch = url.match(/\/patients\/(\d+)$/);
    if (idMatch && method === 'GET') {
      const pId = parseInt(idMatch[1]);
      const found = patients.find(p => p.id === pId) || patients[0];
      return of(new HttpResponse({ status: 200, body: found }));
    }

    // POST /api/patients
    if (method === 'POST') {
      const newP = {
        ...req.body,
        id: Date.now(),
        mrn: `MRN-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString()
      };
      patients.unshift(newP);
      setStored(STORAGE_KEY_PATIENTS, patients);
      return of(new HttpResponse({ status: 201, body: newP }));
    }

    // GET /api/patients
    return of(new HttpResponse({ status: 200, body: patients }));
  }

  // 6. ENCOUNTERS
  if (url.includes('/api/encounters')) {
    const encounters = getStored(STORAGE_KEY_ENCOUNTERS, INITIAL_MOCK_ENCOUNTERS);

    if (url.includes('/sign')) {
      const idMatch = url.match(/\/encounters\/(\d+)\/sign/);
      const encId = idMatch ? parseInt(idMatch[1]) : 1;
      const enc = encounters.find(e => e.id === encId);
      if (enc) {
        enc.status = 'SIGNED';
        enc.signedAt = new Date().toISOString();
        enc.signedBy = 'Dr. Priyank';
        setStored(STORAGE_KEY_ENCOUNTERS, encounters);
      }
      return of(new HttpResponse({ status: 200, body: enc || encounters[0] }));
    }

    if (method === 'POST') {
      const newEnc = {
        ...req.body,
        id: Date.now(),
        encounterDate: new Date().toISOString(),
        status: 'SIGNED',
        signedAt: new Date().toISOString(),
        signedBy: 'Dr. Priyank'
      };
      encounters.unshift(newEnc);
      setStored(STORAGE_KEY_ENCOUNTERS, encounters);
      return of(new HttpResponse({ status: 201, body: newEnc }));
    }

    return of(new HttpResponse({ status: 200, body: encounters }));
  }

  // 7. ORDERS
  if (url.includes('/api/orders')) {
    const orders = getStored(STORAGE_KEY_ORDERS, INITIAL_MOCK_ORDERS);

    if (method === 'POST') {
      const newOrd = {
        ...req.body,
        id: Date.now(),
        orderedAt: new Date().toISOString(),
        status: 'PENDING'
      };
      orders.unshift(newOrd);
      setStored(STORAGE_KEY_ORDERS, orders);
      return of(new HttpResponse({ status: 201, body: newOrd }));
    }

    if (method === 'PATCH' && url.includes('/status')) {
      const idMatch = url.match(/\/orders\/(\d+)\/status/);
      const ordId = idMatch ? parseInt(idMatch[1]) : 1;
      const ord = orders.find(o => o.id === ordId);
      if (ord) {
        Object.assign(ord, req.body, { completedAt: new Date().toISOString() });
        setStored(STORAGE_KEY_ORDERS, orders);
      }
      return of(new HttpResponse({ status: 200, body: ord || orders[0] }));
    }

    return of(new HttpResponse({ status: 200, body: orders }));
  }

  // 8. MEDICATIONS & DRUG INTERACTIONS
  if (url.includes('/api/medications')) {
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
          description: 'Concurrent use significantly increases risk of major gastrointestinal and systemic bleeding.',
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
      return of(new HttpResponse({ status: 200, body: results }));
    }

    const prescriptions = getStored(STORAGE_KEY_PRESCRIPTIONS, INITIAL_MOCK_PRESCRIPTIONS);

    if (method === 'POST') {
      const newRx = {
        ...req.body,
        id: Date.now(),
        prescribedAt: new Date().toISOString().split('T')[0],
        status: 'ACTIVE'
      };
      prescriptions.unshift(newRx);
      setStored(STORAGE_KEY_PRESCRIPTIONS, prescriptions);
      return of(new HttpResponse({ status: 201, body: newRx }));
    }

    if (url.includes('/discontinue')) {
      const idMatch = url.match(/\/medications\/(\d+)\/discontinue/);
      const rxId = idMatch ? parseInt(idMatch[1]) : 1;
      const rx = prescriptions.find(p => p.id === rxId);
      if (rx) {
        rx.status = 'DISCONTINUED';
        setStored(STORAGE_KEY_PRESCRIPTIONS, prescriptions);
      }
      return of(new HttpResponse({ status: 200, body: rx || prescriptions[0] }));
    }

    return of(new HttpResponse({ status: 200, body: prescriptions }));
  }

  // 9. PORTAL
  if (url.includes('/api/portal')) {
    if (url.includes('/my-profile')) {
      const patients = getStored(STORAGE_KEY_PATIENTS, INITIAL_MOCK_PATIENTS);
      return of(new HttpResponse({ status: 200, body: patients[0] }));
    }
    if (url.includes('/my-vitals')) {
      const vitals = getStored(STORAGE_KEY_VITALS, INITIAL_MOCK_VITALS).filter(v => v.patientId === 1);
      return of(new HttpResponse({ status: 200, body: vitals }));
    }
    if (url.includes('/my-encounters')) {
      const encounters = getStored(STORAGE_KEY_ENCOUNTERS, INITIAL_MOCK_ENCOUNTERS).filter(e => e.patientId === 1);
      return of(new HttpResponse({ status: 200, body: encounters }));
    }
    if (url.includes('/my-orders')) {
      const orders = getStored(STORAGE_KEY_ORDERS, INITIAL_MOCK_ORDERS).filter(o => o.patientId === 1);
      return of(new HttpResponse({ status: 200, body: orders }));
    }
    if (url.includes('/my-prescriptions')) {
      const prescriptions = getStored(STORAGE_KEY_PRESCRIPTIONS, INITIAL_MOCK_PRESCRIPTIONS).filter(p => p.patientId === 1);
      return of(new HttpResponse({ status: 200, body: prescriptions }));
    }
  }

  // 10. AUDIT LOGS
  if (url.includes('/api/audit/logs')) {
    const logs = [
      {
        id: 1,
        timestamp: new Date().toISOString(),
        performedBy: 'priyank',
        userRole: 'ROLE_DOCTOR',
        action: 'LOGIN',
        entityName: 'User',
        entityId: 7,
        details: 'Doctor Priyank logged in to clinical workstation',
        ipAddress: '127.0.0.1'
      }
    ];
    return of(new HttpResponse({ status: 200, body: logs }));
  }

  // Default Fallback
  return of(new HttpResponse({ status: 200, body: [] }));
}

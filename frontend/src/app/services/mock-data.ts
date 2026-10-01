import { Patient, VitalSign, ClinicalEncounter, MedicalOrder, Prescription, DashboardStats, AuditLog } from '../models/ehr.models';

export const INITIAL_MOCK_PATIENTS: Patient[] = [
  {
    id: 1,
    mrn: 'MRN-2026-1001',
    firstName: 'Rohit',
    lastName: 'Verma',
    dateOfBirth: '1982-05-14',
    gender: 'Male',
    bloodGroup: 'B+',
    phone: '+91 98765 43210',
    email: 'rohit.verma@example.com',
    address: 'Flat 402, Lotus Towers, Sector 62',
    city: 'Noida',
    state: 'Uttar Pradesh',
    postalCode: '201301',
    emergencyContactName: 'Pooja Verma',
    emergencyContactPhone: '+91 98765 43211',
    emergencyContactRelationship: 'Spouse',
    allergies: 'Penicillin, Sulfa Drugs',
    chronicConditions: 'Type 2 Diabetes, Hypertension',
    insuranceProvider: 'Star Health Insurance',
    policyNumber: 'SH-POL-884920',
    createdAt: '2026-09-15T10:00:00Z',
    updatedAt: '2026-09-30T14:30:00Z'
  },
  {
    id: 2,
    mrn: 'MRN-2026-1002',
    firstName: 'Ananya',
    lastName: 'Deshmukh',
    dateOfBirth: '1990-11-23',
    gender: 'Female',
    bloodGroup: 'O+',
    phone: '+91 91234 56789',
    email: 'ananya.d@example.com',
    address: 'B-12, Green Park Extension',
    city: 'New Delhi',
    state: 'Delhi',
    postalCode: '110016',
    emergencyContactName: 'Kunal Deshmukh',
    emergencyContactPhone: '+91 91234 56780',
    emergencyContactRelationship: 'Brother',
    allergies: 'Aspirin, NSAIDs',
    chronicConditions: 'Asthma, Allergic Rhinitis',
    insuranceProvider: 'HDFC ERGO Health',
    policyNumber: 'HDFC-MED-339210',
    createdAt: '2026-09-18T11:20:00Z',
    updatedAt: '2026-09-30T16:45:00Z'
  },
  {
    id: 3,
    mrn: 'MRN-2026-1003',
    firstName: 'Vikram',
    lastName: 'Malhotra',
    dateOfBirth: '1975-03-08',
    gender: 'Male',
    bloodGroup: 'A+',
    phone: '+91 99887 76655',
    email: 'vikram.m@example.com',
    address: '15, Indiranagar 100ft Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    emergencyContactName: 'Sunita Malhotra',
    emergencyContactPhone: '+91 99887 76650',
    emergencyContactRelationship: 'Spouse',
    allergies: 'None Known (NKDA)',
    chronicConditions: 'Coronary Artery Disease, Dyslipidemia',
    insuranceProvider: 'Care Health Insurance',
    policyNumber: 'CARE-EXP-772019',
    createdAt: '2026-09-20T09:15:00Z',
    updatedAt: '2026-10-01T08:10:00Z'
  }
];

export const INITIAL_MOCK_VITALS: VitalSign[] = [
  {
    id: 1,
    patientId: 1,
    recordedAt: '2026-09-30T09:30:00Z',
    systolicBP: 138,
    diastolicBP: 88,
    heartRate: 78,
    respiratoryRate: 16,
    temperature: 98.6,
    oxygenSaturation: 98,
    heightCm: 175,
    weightKg: 82,
    bmi: 26.8,
    recordedBy: 'Nurse Priya',
    notes: 'Mild hypertension noted. Patient advised on sodium restriction.'
  },
  {
    id: 2,
    patientId: 2,
    recordedAt: '2026-09-30T11:15:00Z',
    systolicBP: 118,
    diastolicBP: 76,
    heartRate: 72,
    respiratoryRate: 18,
    temperature: 98.4,
    oxygenSaturation: 99,
    heightCm: 162,
    weightKg: 58,
    bmi: 22.1,
    recordedBy: 'Nurse Priya',
    notes: 'Normal healthy vitals flowsheet.'
  }
];

export const INITIAL_MOCK_ENCOUNTERS: ClinicalEncounter[] = [
  {
    id: 1,
    patientId: 1,
    providerId: 7,
    providerName: 'Dr. Priyank (General Physician)',
    encounterDate: '2026-09-30T10:00:00Z',
    encounterType: 'OUTPATIENT',
    chiefComplaint: 'Follow-up for Hypertension & Diabetic control',
    soapSubjective: 'Patient reports mild occasional headaches in the morning. Denies chest pain or shortness of breath. Taking Metformin regularly.',
    soapObjective: 'BP 138/88 mmHg, HR 78 bpm regular. CVS: S1 S2 heard. RS: Clear. Abdomen: Soft, non-tender. Feet: Normal sensation.',
    soapAssessment: '1. Essential Hypertension (ICD-10 I10) - suboptimally controlled. 2. Type 2 Diabetes Mellitus (ICD-10 E11.9).',
    soapPlan: 'Continue Metformin 500mg BD. Order HbA1c and Serum Creatinine. Advised low salt diet and daily 30 min walking.',
    icd10Codes: 'I10, E11.9',
    status: 'SIGNED',
    signedAt: '2026-09-30T10:30:00Z',
    signedBy: 'Dr. Priyank'
  }
];

export const INITIAL_MOCK_ORDERS: MedicalOrder[] = [
  {
    id: 1,
    patientId: 1,
    providerId: 7,
    orderType: 'LAB',
    orderName: 'Glycated Hemoglobin (HbA1c)',
    loincCode: '4548-4',
    priority: 'ROUTINE',
    clinicalIndication: 'Routine 3-month diabetic monitoring',
    status: 'COMPLETED',
    orderedAt: '2026-09-28T09:00:00Z',
    completedAt: '2026-09-29T14:00:00Z',
    resultNotes: 'HbA1c: 6.8% (Good Glycemic Control)',
    normalRange: '4.0 - 5.6% (Non-Diabetic), < 7.0% (Target)',
    flaggedAbnormal: true
  },
  {
    id: 2,
    patientId: 1,
    providerId: 7,
    orderType: 'LAB',
    orderName: 'Lipid Profile Panel',
    loincCode: '57698-3',
    priority: 'ROUTINE',
    clinicalIndication: 'Cardiovascular risk evaluation',
    status: 'PENDING',
    orderedAt: '2026-09-30T10:15:00Z'
  }
];

export const INITIAL_MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 1,
    patientId: 1,
    providerId: 7,
    medicationName: 'Metformin Hydrochloride 500mg',
    rxNormCode: '860975',
    dosage: '500 mg',
    route: 'Oral',
    frequency: 'Twice daily with meals (BD)',
    durationDays: 90,
    refills: 2,
    prescribedAt: '2026-09-15',
    status: 'ACTIVE',
    instructions: 'Take immediately after breakfast and dinner with water.'
  },
  {
    id: 2,
    patientId: 1,
    providerId: 7,
    medicationName: 'Amlodipine Besylate 5mg',
    rxNormCode: '197361',
    dosage: '5 mg',
    route: 'Oral',
    frequency: 'Once daily in morning (OD)',
    durationDays: 30,
    refills: 3,
    prescribedAt: '2026-09-30',
    status: 'ACTIVE',
    instructions: 'Take in the morning for blood pressure management.'
  }
];

export const INITIAL_MOCK_STATS: DashboardStats = {
  totalPatients: 3,
  openEncounters: 5,
  pendingOrders: 2,
  activePrescriptions: 4,
  abnormalResultsCount: 1
};

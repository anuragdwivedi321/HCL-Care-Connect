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
    temperature: 36.8,
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
    temperature: 36.7,
    oxygenSaturation: 99,
    heightCm: 162,
    weightKg: 58,
    bmi: 22.1,
    recordedBy: 'Nurse Priya',
    notes: 'Normal healthy vitals flowsheet. Respiratory sounds clear.'
  },
  {
    id: 3,
    patientId: 3,
    recordedAt: '2026-10-01T08:00:00Z',
    systolicBP: 142,
    diastolicBP: 92,
    heartRate: 82,
    respiratoryRate: 16,
    temperature: 37.0,
    oxygenSaturation: 97,
    heightCm: 172,
    weightKg: 84,
    bmi: 28.4,
    recordedBy: 'Nurse Priya',
    notes: 'Stage 1 Hypertension. Scheduled for Cardiology consult.'
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
    soapSubjective: 'Patient reports mild morning headaches. Compliant with Metformin. Denies chest tightness or palpitations.',
    soapObjective: 'BP 138/88 mmHg, HR 78 bpm. CVS: S1 S2 normal. RS: Vesicular breath sounds. Abdomen: Soft, non-tender. Feet: Monofilament test normal.',
    soapAssessment: '1. Essential Hypertension (ICD-10 I10) - borderline. 2. Type 2 Diabetes Mellitus (ICD-10 E11.9).',
    soapPlan: 'Continue Metformin 500mg BD. Add Amlodipine 5mg OD. Order HbA1c and Serum Creatinine. Dietary low sodium regimen advised.',
    icd10Codes: 'I10, E11.9',
    status: 'SIGNED',
    signedAt: '2026-09-30T10:30:00Z',
    signedBy: 'Dr. Priyank'
  },
  {
    id: 2,
    patientId: 2,
    providerId: 3,
    providerName: 'Dr. Sneha Patel, MD (Internal Medicine)',
    encounterDate: '2026-09-29T14:30:00Z',
    encounterType: 'OUTPATIENT',
    chiefComplaint: 'Seasonal allergic cough and occasional wheezing',
    soapSubjective: 'Patient reports mild nocturnal cough during weather change. Uses rescue inhaler twice a week.',
    soapObjective: 'Vitals stable. SpO2 99% on room air. Chest: Mild end-expiratory rhonchi in bilateral lower zones, no stridor.',
    soapAssessment: 'Moderate Persistent Asthma with Acute Exacerbation (ICD-10 J45.40). Allergic Rhinitis (ICD-10 J30.9).',
    soapPlan: 'Continue Budesonide inhaler twice daily. Prescribed Montelukast 10mg OD at bedtime. Avoid known allergens.',
    icd10Codes: 'J45.40, J30.9',
    status: 'SIGNED',
    signedAt: '2026-09-29T15:00:00Z',
    signedBy: 'Dr. Sneha Patel'
  },
  {
    id: 3,
    patientId: 3,
    providerId: 2,
    providerName: 'Dr. Rajesh Sharma, MD (Cardiology)',
    encounterDate: '2026-10-01T08:30:00Z',
    encounterType: 'OUTPATIENT',
    chiefComplaint: 'Exertional chest discomfort relieved by rest',
    soapSubjective: '51-year-old male with history of dyslipidemia experiencing retrosternal heaviness upon climbing stairs.',
    soapObjective: 'BP 142/92 mmHg, Pulse 82 regular. Peripheral pulses intact. No pedal edema. S1 S2 heard with no murmur.',
    soapAssessment: 'Coronary Artery Disease with Stable Angina (ICD-10 I25.10). Mixed Dyslipidemia (ICD-10 E78.2).',
    soapPlan: 'Initiate Atorvastatin 40mg nocte, Metoprolol 25mg BD, and Clopidogrel 75mg OD. Schedule 2D Echo and Stress TMT.',
    icd10Codes: 'I25.10, E78.2',
    status: 'SIGNED',
    signedAt: '2026-10-01T09:00:00Z',
    signedBy: 'Dr. Rajesh Sharma'
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
    resultNotes: 'HbA1c: 6.8% (Target < 7.0%)',
    normalRange: '4.0 - 5.6% (Non-Diabetic), < 7.0% (Diabetic Target)',
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
  },
  {
    id: 3,
    patientId: 2,
    providerId: 3,
    orderType: 'PROCEDURE',
    orderName: 'Pulmonary Function Test (Spirometry)',
    loincCode: '81458-2',
    priority: 'ROUTINE',
    clinicalIndication: 'Assess reversibility of airflow obstruction in asthma',
    status: 'COMPLETED',
    orderedAt: '2026-09-29T14:45:00Z',
    completedAt: '2026-09-30T10:00:00Z',
    resultNotes: 'FEV1/FVC: 78% (Post-bronchodilator improvement of 14%)',
    normalRange: '> 75% Expected',
    flaggedAbnormal: false
  },
  {
    id: 4,
    patientId: 3,
    providerId: 2,
    orderType: 'RADIOLOGY',
    orderName: 'Transthoracic Echocardiogram (2D Echo)',
    loincCode: '79944-5',
    priority: 'URGENT',
    clinicalIndication: 'Assess LV function and regional wall motion abnormality in CAD',
    status: 'PENDING',
    orderedAt: '2026-10-01T08:45:00Z'
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
  },
  {
    id: 3,
    patientId: 2,
    providerId: 3,
    medicationName: 'Budesonide / Formoterol Inhaler 160/4.5 mcg',
    rxNormCode: '896188',
    dosage: '2 puffs',
    route: 'Inhalation',
    frequency: 'Twice daily (BD)',
    durationDays: 60,
    refills: 2,
    prescribedAt: '2026-09-29',
    status: 'ACTIVE',
    instructions: 'Rinse mouth with water thoroughly after inhalation.'
  },
  {
    id: 4,
    patientId: 3,
    providerId: 2,
    medicationName: 'Atorvastatin Calcium 40mg',
    rxNormCode: '259255',
    dosage: '40 mg',
    route: 'Oral',
    frequency: 'Once daily at bedtime (HS)',
    durationDays: 90,
    refills: 3,
    prescribedAt: '2026-10-01',
    status: 'ACTIVE',
    instructions: 'Take at night for lipid regulation.'
  }
];

export const INITIAL_MOCK_STATS: DashboardStats = {
  totalPatients: 3,
  openEncounters: 3,
  pendingOrders: 2,
  activePrescriptions: 4,
  abnormalResultsCount: 1
};

export const INITIAL_MOCK_AUDIT_LOGS: AuditLog[] = [
  {
    id: 1,
    timestamp: '2026-10-01T08:30:15Z',
    performedBy: 'priyank',
    userRole: 'ROLE_DOCTOR',
    action: 'LOGIN',
    entityName: 'User',
    entityId: 7,
    details: 'Dr. Priyank authenticated into clinical EHR workstation',
    ipAddress: '127.0.0.1'
  },
  {
    id: 2,
    timestamp: '2026-10-01T08:31:40Z',
    performedBy: 'priyank',
    userRole: 'ROLE_DOCTOR',
    action: 'VIEW_RECORD',
    entityName: 'Patient',
    entityId: 1,
    details: 'Viewed clinical chart of Rohit Verma (MRN-2026-1001)',
    ipAddress: '127.0.0.1'
  },
  {
    id: 3,
    timestamp: '2026-10-01T08:35:10Z',
    performedBy: 'dr.sharma',
    userRole: 'ROLE_DOCTOR',
    action: 'SIGN_SOAP',
    entityName: 'ClinicalEncounter',
    entityId: 3,
    details: 'Digitally signed and locked Cardiology SOAP note for Vikram Malhotra',
    ipAddress: '127.0.0.1'
  },
  {
    id: 4,
    timestamp: '2026-10-01T08:45:22Z',
    performedBy: 'dr.sharma',
    userRole: 'ROLE_DOCTOR',
    action: 'CPOE_ORDER',
    entityName: 'MedicalOrder',
    entityId: 4,
    details: 'Placed URGENT Transthoracic Echocardiogram order (LOINC 79944-5)',
    ipAddress: '127.0.0.1'
  }
];

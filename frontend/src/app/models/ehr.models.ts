export type Role = 'ROLE_ADMIN' | 'ROLE_DOCTOR' | 'ROLE_NURSE' | 'ROLE_PATIENT';

export interface User {
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  patientId?: number;
  specialization?: string;
  licenseNumber?: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  fullName: string;
  email: string;
  role: Role;
  patientId?: number;
}

export interface Patient {
  id?: number;
  mrn?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  allergies?: string;
  chronicConditions?: string;
  insuranceProvider?: string;
  policyNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VitalSign {
  id?: number;
  patientId: number;
  recordedAt?: string;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  respiratoryRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  recordedBy?: string;
  notes?: string;
}

export interface ClinicalEncounter {
  id?: number;
  patientId: number;
  providerId?: number;
  providerName?: string;
  encounterDate?: string;
  encounterType: string; // OUTPATIENT, INPATIENT, EMERGENCY, TELEHEALTH
  chiefComplaint: string;
  soapSubjective?: string;
  soapObjective?: string;
  soapAssessment?: string;
  soapPlan?: string;
  icd10Codes?: string;
  status?: string; // IN_PROGRESS, COMPLETED, SIGNED
  signedAt?: string;
  signedBy?: string;
}

export interface MedicalOrder {
  id?: number;
  patientId: number;
  providerId?: number;
  encounterId?: number;
  orderType: string; // LAB, RADIOLOGY, PROCEDURE
  orderName: string;
  loincCode?: string;
  priority: string; // ROUTINE, URGENT, STAT
  clinicalIndication?: string;
  status?: string; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED
  orderedAt?: string;
  completedAt?: string;
  resultNotes?: string;
  normalRange?: string;
  flaggedAbnormal?: boolean;
}

export interface Prescription {
  id?: number;
  patientId: number;
  providerId?: number;
  encounterId?: number;
  medicationName: string;
  rxNormCode?: string;
  dosage: string;
  frequency: string;
  route: string;
  durationDays?: number;
  instructions?: string;
  refills?: number;
  status?: string; // ACTIVE, COMPLETED, DISCONTINUED
  prescribedAt?: string;
}

export interface InteractionCheckResult {
  hasInteraction: boolean;
  drugA?: string;
  drugB?: string;
  severity?: 'HIGH' | 'MODERATE' | 'LOW';
  description?: string;
  clinicalRecommendation?: string;
}

export interface DashboardStats {
  totalPatients: number;
  openEncounters: number;
  pendingOrders: number;
  activePrescriptions: number;
  abnormalResultsCount: number;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  performedBy: string;
  userRole: string;
  action: string;
  entityName: string;
  entityId: number;
  details: string;
  ipAddress: string;
}

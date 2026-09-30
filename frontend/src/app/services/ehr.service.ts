import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Patient,
  VitalSign,
  ClinicalEncounter,
  MedicalOrder,
  Prescription,
  InteractionCheckResult,
  DashboardStats,
  AuditLog
} from '../models/ehr.models';

@Injectable({
  providedIn: 'root'
})
export class EhrService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // 1. Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard/stats`);
  }

  // 2. Patients & Vitals
  getPatients(query?: string): Observable<Patient[]> {
    let params = new HttpParams();
    if (query && query.trim()) {
      params = params.set('query', query.trim());
    }
    return this.http.get<Patient[]>(`${this.apiUrl}/patients`, { params });
  }

  getPatient(id: number): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/patients/${id}`);
  }

  createPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(`${this.apiUrl}/patients`, patient);
  }

  updatePatient(id: number, patient: Patient): Observable<Patient> {
    return this.http.put<Patient>(`${this.apiUrl}/patients/${id}`, patient);
  }

  getPatientVitals(patientId: number): Observable<VitalSign[]> {
    return this.http.get<VitalSign[]>(`${this.apiUrl}/patients/${patientId}/vitals`);
  }

  recordVitals(patientId: number, vitals: VitalSign): Observable<VitalSign> {
    return this.http.post<VitalSign>(`${this.apiUrl}/patients/${patientId}/vitals`, vitals);
  }

  // 3. Clinical Documentation / SOAP notes
  getEncountersByPatient(patientId: number): Observable<ClinicalEncounter[]> {
    return this.http.get<ClinicalEncounter[]>(`${this.apiUrl}/encounters/patient/${patientId}`);
  }

  getEncounter(id: number): Observable<ClinicalEncounter> {
    return this.http.get<ClinicalEncounter>(`${this.apiUrl}/encounters/${id}`);
  }

  createEncounter(encounter: ClinicalEncounter): Observable<ClinicalEncounter> {
    return this.http.post<ClinicalEncounter>(`${this.apiUrl}/encounters`, encounter);
  }

  signEncounter(id: number): Observable<ClinicalEncounter> {
    return this.http.put<ClinicalEncounter>(`${this.apiUrl}/encounters/${id}/sign`, {});
  }

  // 4. CPOE Orders
  getAllOrders(status?: string): Observable<MedicalOrder[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<MedicalOrder[]>(`${this.apiUrl}/orders`, { params });
  }

  getOrdersByPatient(patientId: number): Observable<MedicalOrder[]> {
    return this.http.get<MedicalOrder[]>(`${this.apiUrl}/orders/patient/${patientId}`);
  }

  placeOrder(order: MedicalOrder): Observable<MedicalOrder> {
    return this.http.post<MedicalOrder>(`${this.apiUrl}/orders`, order);
  }

  updateOrderStatus(orderId: number, update: { status: string; resultNotes?: string; normalRange?: string; flaggedAbnormal?: boolean }): Observable<MedicalOrder> {
    return this.http.patch<MedicalOrder>(`${this.apiUrl}/orders/${orderId}/status`, update);
  }

  // 5. Medications & Drug Interactions
  getPrescriptionsByPatient(patientId: number, activeOnly: boolean = false): Observable<Prescription[]> {
    const params = new HttpParams().set('activeOnly', activeOnly.toString());
    return this.http.get<Prescription[]>(`${this.apiUrl}/medications/patient/${patientId}`, { params });
  }

  checkInteractions(patientId: number, newMedication: string): Observable<InteractionCheckResult[]> {
    return this.http.post<InteractionCheckResult[]>(`${this.apiUrl}/medications/check-interactions`, {
      patientId,
      newMedication
    });
  }

  prescribe(prescription: Prescription): Observable<Prescription> {
    return this.http.post<Prescription>(`${this.apiUrl}/medications`, prescription);
  }

  discontinuePrescription(id: number, reason: string): Observable<Prescription> {
    return this.http.put<Prescription>(`${this.apiUrl}/medications/${id}/discontinue`, { reason });
  }

  // 6. Patient Portal (Self-Service)
  getMyProfile(): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/portal/my-profile`);
  }

  getMyVitals(): Observable<VitalSign[]> {
    return this.http.get<VitalSign[]>(`${this.apiUrl}/portal/my-vitals`);
  }

  getMyEncounters(): Observable<ClinicalEncounter[]> {
    return this.http.get<ClinicalEncounter[]>(`${this.apiUrl}/portal/my-encounters`);
  }

  getMyOrders(): Observable<MedicalOrder[]> {
    return this.http.get<MedicalOrder[]>(`${this.apiUrl}/portal/my-orders`);
  }

  getMyPrescriptions(): Observable<Prescription[]> {
    return this.http.get<Prescription[]>(`${this.apiUrl}/portal/my-prescriptions`);
  }

  // 7. Audit Trail
  getAuditLogs(entityName?: string, entityId?: number): Observable<AuditLog[]> {
    let params = new HttpParams();
    if (entityName) params = params.set('entityName', entityName);
    if (entityId) params = params.set('entityId', entityId.toString());
    return this.http.get<AuditLog[]>(`${this.apiUrl}/audit/logs`, { params });
  }
}

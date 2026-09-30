import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EhrService } from '../../services/ehr.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import {
  Patient,
  VitalSign,
  ClinicalEncounter,
  MedicalOrder,
  Prescription
} from '../../models/ehr.models';

@Component({
  selector: 'app-patient-portal',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="portal-page">
      <!-- Clinician Preview Switcher Banner (Visible for Doctor, Nurse, Admin) -->
      <div class="clinician-preview-banner card" *ngIf="!authService.isPatient()">
        <div class="cpb-left">
          <span class="preview-icon">👁️</span>
          <div>
            <div class="cpb-title">Clinician Portal Preview Mode</div>
            <div class="cpb-sub">Select any patient to preview what they see on their personal health portal:</div>
          </div>
        </div>
        <div class="cpb-right">
          <label>Preview Patient:</label>
          <select [(ngModel)]="selectedPreviewPatientId" (change)="onPreviewPatientChange()" class="form-control preview-select">
            <option *ngFor="let p of allPatients" [ngValue]="p.id">
              {{ p.firstName }} {{ p.lastName }} ({{ p.mrn }})
            </option>
          </select>
        </div>
      </div>

      <!-- Loading State -->
      <div class="card loading-card" *ngIf="loading">
        <div class="portal-spinner"></div>
        <span>Loading personal health records...</span>
      </div>

      <!-- Portal Header Banner -->
      <div class="portal-hero card" *ngIf="!loading">
        <div class="hero-content">
          <div class="avatar-circle">
            {{ getInitials() }}
          </div>
          <div>
            <span class="portal-badge">PATIENT HEALTH ACCESS PORTAL</span>
            <h2>Welcome, {{ profile?.firstName }} {{ profile?.lastName }}</h2>
            <div class="hero-meta">
              <span>MRN: <strong>{{ profile?.mrn }}</strong></span> •
              <span>DOB: {{ profile?.dateOfBirth }}</span> •
              <span>Blood Group: <strong>{{ profile?.bloodGroup }}</strong></span> •
              <span>Insurance: {{ profile?.insuranceProvider }}</span>
            </div>
          </div>
        </div>

        <div class="hero-alert" *ngIf="profile?.allergies">
          <span class="alert-icon">⚠️</span>
          <div>
            <small>CRITICAL ALLERGY ALERT</small>
            <strong>{{ profile?.allergies }}</strong>
          </div>
        </div>
      </div>

      <!-- Portal Tabs -->
      <div class="portal-tabs">
        <button [class.active]="activeTab === 'vitals'" (click)="activeTab = 'vitals'" class="tab-link">
          <span>🩺</span> My Vitals Log ({{ vitals.length }})
        </button>
        <button [class.active]="activeTab === 'results'" (click)="activeTab = 'results'" class="tab-link">
          <span>🔬</span> Lab & Radiology Results ({{ orders.length }})
        </button>
        <button [class.active]="activeTab === 'meds'" (click)="activeTab = 'meds'" class="tab-link">
          <span>💊</span> Active Medications ({{ prescriptions.length }})
        </button>
        <button [class.active]="activeTab === 'visits'" (click)="activeTab = 'visits'" class="tab-link">
          <span>📋</span> Doctor Visit Summaries ({{ encounters.length }})
        </button>
      </div>

      <!-- Tab 1: Vitals -->
      <div *ngIf="activeTab === 'vitals'" class="portal-tab-content">
        <div class="card">
          <div class="tab-header">
            <h3>Recent Health Measurements</h3>
            <span class="badge badge-primary">Clinically Recorded</span>
          </div>

          <div class="table-responsive">
            <table class="ehr-table">
              <thead>
                <tr>
                  <th>Date & Time</th>
                  <th>Blood Pressure</th>
                  <th>Pulse Rate</th>
                  <th>Oxygen (SpO2)</th>
                  <th>Body Temperature</th>
                  <th>BMI & Weight</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let v of vitals">
                  <td>{{ v.recordedAt | date:'medium' }}</td>
                  <td>
                    <strong>{{ v.systolicBP }}/{{ v.diastolicBP }}</strong> mmHg
                  </td>
                  <td>{{ v.heartRate }} bpm</td>
                  <td>{{ v.oxygenSaturation }}%</td>
                  <td>{{ v.temperature }} °C</td>
                  <td>{{ v.bmi }} ({{ v.weightKg }} kg)</td>
                  <td><small class="text-sub">{{ v.recordedBy }}</small></td>
                </tr>
                <tr *ngIf="vitals.length === 0">
                  <td colspan="7" class="text-center py-4">No vital records currently available.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab 2: Results -->
      <div *ngIf="activeTab === 'results'" class="portal-tab-content">
        <div class="card">
          <div class="tab-header">
            <h3>Diagnostic Laboratory & Imaging Reports</h3>
            <span class="badge badge-teal">Certified Clinical Diagnostics</span>
          </div>

          <div class="results-grid" *ngIf="orders.length > 0">
            <div *ngFor="let o of orders" class="result-card" [class.abnormal-card]="o.flaggedAbnormal">
              <div class="card-top">
                <span class="badge badge-primary">{{ o.orderType }}</span>
                <span class="badge" [ngClass]="o.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'">
                  {{ o.status }}
                </span>
                <small class="text-sub">{{ o.completedAt || o.orderedAt | date:'mediumDate' }}</small>
              </div>

              <div class="result-title">{{ o.orderName }}</div>
              <div class="loinc-tag" *ngIf="o.loincCode">LOINC: {{ o.loincCode }}</div>

              <div class="findings-box" *ngIf="o.resultNotes">
                <div *ngIf="o.flaggedAbnormal" class="text-danger font-bold mb-1">
                  ⚠️ ABNORMAL RESULT FLAGGED BY LABORATORY
                </div>
                <div class="findings-text">{{ o.resultNotes }}</div>
                <div class="normal-ref" *ngIf="o.normalRange">Standard Range: {{ o.normalRange }}</div>
              </div>

              <div *ngIf="!o.resultNotes" class="pending-notice">
                <span>⏳</span> Specimen processing in laboratory. Results will post here automatically.
              </div>
            </div>
          </div>

          <div *ngIf="orders.length === 0" class="empty-state">
            No diagnostic tests on record.
          </div>
        </div>
      </div>

      <!-- Tab 3: Medications -->
      <div *ngIf="activeTab === 'meds'" class="portal-tab-content">
        <div class="card">
          <div class="tab-header">
            <h3>My Prescribed Medications & Pharmacy Instructions</h3>
            <span class="badge badge-success">Pharmacy Synchronized</span>
          </div>

          <div class="meds-grid" *ngIf="prescriptions.length > 0">
            <div *ngFor="let rx of prescriptions" class="med-card">
              <div class="med-header">
                <div class="med-name">{{ rx.medicationName }}</div>
                <span class="badge" [ngClass]="rx.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'">
                  {{ rx.status }}
                </span>
              </div>

              <div class="med-dose">
                <strong>{{ rx.dosage }}</strong> • <span>{{ rx.route }}</span> • <span>{{ rx.frequency }}</span>
              </div>

              <div class="med-instructions">
                <strong>Directions for Use:</strong>
                <p>{{ rx.instructions || 'Take as advised by your physician.' }}</p>
              </div>

              <div class="med-footer">
                <span>Refills Left: <strong>{{ rx.refills }}</strong></span>
                <span class="text-sub">Prescribed: {{ rx.prescribedAt | date:'mediumDate' }}</span>
              </div>
            </div>
          </div>

          <div *ngIf="prescriptions.length === 0" class="empty-state">
            No active prescriptions currently on record.
          </div>
        </div>
      </div>

      <!-- Tab 4: Encounters -->
      <div *ngIf="activeTab === 'visits'" class="portal-tab-content">
        <div class="card">
          <div class="tab-header">
            <h3>Physician Encounter Visit Summaries</h3>
            <span class="badge badge-primary">Medical Records</span>
          </div>

          <div class="visits-flow" *ngIf="encounters.length > 0">
            <div *ngFor="let enc of encounters" class="visit-card">
              <div class="visit-top">
                <div>
                  <span class="badge badge-teal">{{ enc.encounterType }}</span>
                  <span class="enc-date">{{ enc.encounterDate | date:'medium' }}</span>
                </div>
                <div class="doctor-name">Attending: <strong>{{ enc.providerName }}</strong></div>
              </div>

              <div class="visit-complaint">
                <strong>Reason for Visit:</strong> {{ enc.chiefComplaint }}
              </div>

              <div class="visit-plan-box" *ngIf="enc.soapPlan">
                <strong>Doctor's Care Plan & Advice:</strong>
                <p>{{ enc.soapPlan }}</p>
              </div>

              <div class="visit-footer" *ngIf="enc.signedBy">
                <span>✍️ Electronically certified by <strong>{{ enc.signedBy }}</strong></span>
              </div>
            </div>
          </div>

          <div *ngIf="encounters.length === 0" class="empty-state">
            No encounter notes available.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .portal-page {
      max-width: 1300px;
      margin: 1.5rem auto;
      padding: 0 1.5rem;
    }

    .clinician-preview-banner {
      background: #f0fdf4;
      border: 1.5px solid #86efac;
      border-radius: 12px;
      padding: 1rem 1.25rem;
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;

      .cpb-left {
        display: flex;
        align-items: center;
        gap: 0.85rem;

        .preview-icon {
          font-size: 1.5rem;
        }

        .cpb-title {
          font-size: 0.95rem;
          font-weight: 800;
          color: #14532d;
        }

        .cpb-sub {
          font-size: 0.78rem;
          color: #166534;
          margin-top: 0.15rem;
        }
      }

      .cpb-right {
        display: flex;
        align-items: center;
        gap: 0.65rem;

        label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #166534;
          white-space: nowrap;
        }

        .preview-select {
          min-width: 280px;
          height: 38px;
          border: 1.5px solid #22c55e;
          border-radius: 8px;
          font-weight: 600;
          background: white;
        }
      }
    }

    .loading-card {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 2.5rem;
      margin-bottom: 1.5rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      color: #64748b;
      font-weight: 600;

      .portal-spinner {
        width: 24px;
        height: 24px;
        border: 3px solid #e2e8f0;
        border-top-color: #0284c7;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .portal-hero {
      background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
      color: white;
      padding: 2rem;
      border-radius: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      border: 1px solid #334155;

      .hero-content {
        display: flex;
        align-items: center;
        gap: 1.5rem;
      }

      .avatar-circle {
        width: 72px;
        height: 72px;
        border-radius: 50%;
        background: linear-gradient(135deg, #0284c7, #0d9488);
        font-size: 1.8rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid rgba(255, 255, 255, 0.2);
      }

      .portal-badge {
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.12em;
        color: #38bdf8;
      }

      h2 {
        color: white;
        font-size: 1.7rem;
        margin: 0.2rem 0 0.4rem;
      }

      .hero-meta {
        font-size: 0.85rem;
        color: #cbd5e1;
      }

      .hero-alert {
        background: rgba(239, 68, 68, 0.2);
        border: 1px solid rgba(239, 68, 68, 0.4);
        border-radius: 10px;
        padding: 0.75rem 1.25rem;
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .alert-icon { font-size: 1.5rem; }
        small { display: block; font-size: 0.65rem; font-weight: 800; color: #fca5a5; letter-spacing: 0.05em; }
        strong { color: #fecaca; font-size: 0.85rem; }
      }
    }

    .portal-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      overflow-x: auto;
    }

    .tab-link {
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 0.75rem 1.25rem;
      font-size: 0.9rem;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover {
        color: #0f172a;
        border-color: #0284c7;
      }

      &.active {
        background: #0284c7;
        color: white;
        border-color: #0284c7;
        box-shadow: 0 4px 10px rgba(2, 132, 199, 0.25);
      }
    }

    .tab-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.75rem;

      h3 { font-size: 1.2rem; }
    }

    .results-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 1rem;
    }

    .result-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1rem;
      background: #f8fafc;

      &.abnormal-card {
        border-color: #fca5a5;
        background: #fff5f5;
      }

      .card-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }

      .result-title {
        font-size: 1.05rem;
        font-weight: 700;
        color: #0f172a;
      }

      .loinc-tag {
        font-size: 0.75rem;
        color: #64748b;
        font-family: monospace;
        margin-top: 0.2rem;
      }

      .findings-box {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 0.75rem;
        margin-top: 0.75rem;
        font-size: 0.85rem;

        .normal-ref {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.4rem;
        }
      }

      .pending-notice {
        margin-top: 0.75rem;
        font-size: 0.8rem;
        color: #64748b;
        background: white;
        padding: 0.6rem;
        border-radius: 8px;
        border: 1px solid #e2e8f0;
      }
    }

    .meds-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }

    .med-card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.25rem;
      background: #ffffff;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

      .med-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        .med-name {
          font-size: 1.1rem;
          font-weight: 800;
          color: #0f172a;
        }
      }

      .med-dose {
        font-size: 0.85rem;
        color: #0284c7;
        font-weight: 700;
        margin-bottom: 0.75rem;
      }

      .med-instructions {
        font-size: 0.85rem;
        color: #334155;
        background: #f8fafc;
        padding: 0.75rem;
        border-radius: 8px;
        border: 1px solid #f1f5f9;
        margin-bottom: 0.75rem;

        p { margin-top: 0.25rem; }
      }

      .med-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 0.8rem;
        color: #475569;
        border-top: 1px dashed #e2e8f0;
        padding-top: 0.5rem;
      }
    }

    .visits-flow {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .visit-card {
      border: 1px solid #e2e8f0;
      border-left: 4px solid #0d9488;
      border-radius: 10px;
      padding: 1rem;
      background: #f8fafc;

      .visit-top {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;

        .enc-date {
          font-size: 0.8rem;
          color: #64748b;
          margin-left: 0.5rem;
        }

        .doctor-name {
          font-size: 0.85rem;
        }
      }

      .visit-complaint {
        font-size: 0.9rem;
        color: #0f172a;
        margin-bottom: 0.75rem;
      }

      .visit-plan-box {
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
        padding: 0.75rem;
        font-size: 0.85rem;
        color: #334155;

        p { margin-top: 0.25rem; }
      }

      .visit-footer {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: #047857;
      }
    }

    .empty-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
      font-size: 0.95rem;
    }

    .text-sub { font-size: 0.75rem; color: #64748b; }
    .mb-1 { margin-bottom: 0.25rem; }

    @media (max-width: 900px) {
      .portal-hero {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }
    }

    @media (max-width: 768px) {
      .portal-page {
        padding: 1rem;
      }
      .portal-tabs {
        overflow-x: auto;
        white-space: nowrap;
        padding-bottom: 0.35rem;
        -webkit-overflow-scrolling: touch;
      }
      .tab-link {
        flex-shrink: 0;
      }
      .hero-content {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .hero-meta {
        justify-content: center;
        flex-wrap: wrap;
      }
      .hero-alert {
        width: 100%;
      }
    }

    @media (max-width: 640px) {
      .portal-page {
        padding: 0.75rem;
      }
    }
  `]
})
export class PatientPortalComponent implements OnInit {
  profile: Patient | null = null;
  vitals: VitalSign[] = [];
  orders: MedicalOrder[] = [];
  prescriptions: Prescription[] = [];
  encounters: ClinicalEncounter[] = [];

  allPatients: Patient[] = [];
  selectedPreviewPatientId = 1;
  loading = false;

  activeTab: 'vitals' | 'results' | 'meds' | 'visits' = 'vitals';

  constructor(
    private ehrService: EhrService,
    public authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (!this.authService.isPatient()) {
      // Clinician preview mode: Load all patients for preview selector
      this.loading = true;
      this.cdr.markForCheck();

      this.ehrService.getPatients().subscribe({
        next: (pts) => {
          this.allPatients = pts || [];
          if (pts && pts.length > 0) {
            this.selectedPreviewPatientId = pts[0].id!;
            this.loadPatientRecords(this.selectedPreviewPatientId);
          } else {
            this.loadPatientRecords(1);
          }
          this.cdr.markForCheck();
        },
        error: () => {
          this.loadPatientRecords(1);
        }
      });
    } else {
      this.loadSelfPortalData();
    }
  }

  loadSelfPortalData(): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.ehrService.getMyProfile().subscribe({
      next: (p) => {
        this.profile = p;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        this.toastService.error('Portal Error', 'Could not load your patient profile record.');
        this.cdr.markForCheck();
      }
    });

    this.ehrService.getMyVitals().subscribe({
      next: (v) => { this.vitals = v || []; this.cdr.markForCheck(); },
      error: (e) => console.error(e)
    });

    this.ehrService.getMyOrders().subscribe({
      next: (o) => { this.orders = o || []; this.cdr.markForCheck(); },
      error: (e) => console.error(e)
    });

    this.ehrService.getMyPrescriptions().subscribe({
      next: (rx) => { this.prescriptions = rx || []; this.cdr.markForCheck(); },
      error: (e) => console.error(e)
    });

    this.ehrService.getMyEncounters().subscribe({
      next: (enc) => { this.encounters = enc || []; this.cdr.markForCheck(); },
      error: (e) => console.error(e)
    });
  }

  onPreviewPatientChange(): void {
    if (!this.selectedPreviewPatientId) return;
    this.loadPatientRecords(this.selectedPreviewPatientId);
  }

  loadPatientRecords(patientId: number): void {
    this.loading = true;
    this.cdr.markForCheck();

    this.ehrService.getPatient(patientId).subscribe({
      next: (p) => {
        this.profile = p;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (e) => {
        console.error(e);
        this.loading = false;
        this.toastService.error('Error', 'Unable to load patient record.');
        this.cdr.markForCheck();
      }
    });

    this.ehrService.getPatientVitals(patientId).subscribe({
      next: (v) => { this.vitals = v || []; this.cdr.markForCheck(); },
      error: (e) => console.error(e)
    });

    this.ehrService.getOrdersByPatient(patientId).subscribe({
      next: (o) => { this.orders = o || []; this.cdr.markForCheck(); },
      error: (e) => console.error(e)
    });

    this.ehrService.getPrescriptionsByPatient(patientId).subscribe({
      next: (rx) => { this.prescriptions = rx || []; this.cdr.markForCheck(); },
      error: (e) => console.error(e)
    });

    this.ehrService.getEncountersByPatient(patientId).subscribe({
      next: (enc) => { this.encounters = enc || []; this.cdr.markForCheck(); },
      error: (e) => console.error(e)
    });
  }

  getInitials(): string {
    if (!this.profile) return 'PT';
    const first = this.profile.firstName ? this.profile.firstName.charAt(0) : '';
    const last = this.profile.lastName ? this.profile.lastName.charAt(0) : '';
    return (first + last).toUpperCase() || 'PT';
  }
}

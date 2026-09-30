import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
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
  selector: 'app-patient-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="patient-detail-page">
      <!-- Back Navigation -->
      <div class="top-nav">
        <a routerLink="/patients" class="back-link">← Back to Patient Directory</a>
      </div>

      <!-- Loading State -->
      <div class="card detail-state-card" *ngIf="loading">
        <div class="detail-spinner"></div>
        <h3>Opening Patient Medical Chart...</h3>
        <p class="text-sub">Retrieving clinical record, vitals flowsheet, orders, and documentation.</p>
      </div>

      <!-- Error State -->
      <div class="card detail-state-card text-danger" *ngIf="!loading && errorMessage">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚠️</div>
        <h3>Medical Chart Not Found</h3>
        <p class="text-sub" style="margin-bottom: 1.25rem;">{{ errorMessage }}</p>
        <a routerLink="/patients" class="btn btn-primary btn-sm">← Return to Patient Master Index</a>
      </div>

      <!-- Patient Content When Loaded -->
      <ng-container *ngIf="!loading && patient">

      <!-- Patient Header Banner -->
      <div class="patient-banner card">
        <div class="banner-main">
          <div class="patient-avatar">{{ getInitials() }}</div>
          <div class="patient-meta">
            <div class="meta-row">
              <h2>{{ patient.firstName }} {{ patient.lastName }}</h2>
              <span class="badge badge-primary mrn-badge">{{ patient.mrn }}</span>
              <span class="badge badge-teal" *ngIf="patient.bloodGroup">Blood: {{ patient.bloodGroup }}</span>
            </div>
            <div class="demographics-line">
              <span>{{ calculateAge(patient.dateOfBirth) }} yrs</span> •
              <span>{{ patient.gender }}</span> •
              <span>DOB: {{ patient.dateOfBirth }}</span> •
              <span>📞 {{ patient.phone || 'No phone' }}</span> •
              <span>📍 {{ patient.city }}, {{ patient.state }}</span>
            </div>
          </div>
        </div>

        <!-- Clinical Safety Indicators -->
        <div class="safety-alerts">
          <div class="alert-box allergy-box">
            <span class="alert-title">⚠️ ALLERGIES</span>
            <span class="alert-content">{{ patient.allergies || 'No Known Drug Allergies (NKDA)' }}</span>
          </div>
          <div class="alert-box conditions-box">
            <span class="alert-title">🩺 CHRONIC PROBLEMS</span>
            <span class="alert-content">{{ patient.chronicConditions || 'None documented' }}</span>
          </div>
        </div>
      </div>

      <!-- Clinical Chart Tabs -->
      <div class="chart-tabs">
        <button [class.active]="activeTab === 'summary'" (click)="activeTab = 'summary'" class="tab-btn">
          <span>📋</span> Demographics & Info
        </button>
        <button [class.active]="activeTab === 'vitals'" (click)="activeTab = 'vitals'" class="tab-btn">
          <span>🩺</span> Vitals Flowsheet ({{ vitals.length }})
        </button>
        <button [class.active]="activeTab === 'encounters'" (click)="activeTab = 'encounters'" class="tab-btn">
          <span>📝</span> Clinical SOAP Notes ({{ encounters.length }})
        </button>
        <button [class.active]="activeTab === 'orders'" (click)="activeTab = 'orders'" class="tab-btn">
          <span>🔬</span> CPOE Orders ({{ orders.length }})
        </button>
        <button [class.active]="activeTab === 'meds'" (click)="activeTab = 'meds'" class="tab-btn">
          <span>💊</span> Medications ({{ prescriptions.length }})
        </button>
      </div>

      <!-- Tab Content 1: Summary -->
      <div *ngIf="activeTab === 'summary'" class="tab-content">
        <div class="grid-2">
          <div class="card">
            <h3>Contact & Emergency Details</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="label">Full Address</span>
                <span class="val">{{ patient.address || '—' }}, {{ patient.city }}, {{ patient.state }} {{ patient.postalCode }}</span>
              </div>
              <div class="info-item">
                <span class="label">Email</span>
                <span class="val">{{ patient.email || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Emergency Contact</span>
                <span class="val">{{ patient.emergencyContactName || '—' }} ({{ patient.emergencyContactRelationship || 'Relative' }})</span>
              </div>
              <div class="info-item">
                <span class="label">Emergency Phone</span>
                <span class="val">{{ patient.emergencyContactPhone || '—' }}</span>
              </div>
            </div>
          </div>

          <div class="card">
            <h3>Insurance & Policy</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="label">Insurance Payer</span>
                <span class="val">{{ patient.insuranceProvider || 'Self-Pay / Cash' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Policy / Member ID</span>
                <span class="val">{{ patient.policyNumber || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Registration Date</span>
                <span class="val">{{ patient.createdAt | date:'medium' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Electronic Record ID</span>
                <span class="val">#CC-EHR-{{ patient.id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content 2: Vitals -->
      <div *ngIf="activeTab === 'vitals'" class="tab-content">
        <div class="section-actions mb-3">
          <button (click)="openVitalsModal()" class="btn btn-primary btn-sm">
            <span>➕</span> Record New Vitals
          </button>
        </div>

        <!-- BMI Spectrum Visualizer -->
        <div class="bmi-spectrum-card card mb-3" *ngIf="vitals.length > 0">
          <div class="bmi-header-row">
            <div>
              <div class="bmi-title"><span>⚖️</span> Body Mass Index (BMI) Clinical Spectrum</div>
              <p class="text-sub">World Health Organization (WHO) adult weight classification based on latest vitals flowsheet.</p>
            </div>
            <div class="bmi-current-pill" [ngClass]="getBmiClass(vitals[0].bmi)">
              Latest BMI: <strong>{{ vitals[0].bmi }}</strong> ({{ getBmiLabel(vitals[0].bmi) }})
            </div>
          </div>
          <div class="bmi-spectrum-bar">
            <div class="bmi-segment seg-under" [class.highlight]="(vitals[0].bmi || 0) < 18.5">Underweight (&lt;18.5)</div>
            <div class="bmi-segment seg-normal" [class.highlight]="(vitals[0].bmi || 0) >= 18.5 && (vitals[0].bmi || 0) < 25">Normal (18.5 - 24.9)</div>
            <div class="bmi-segment seg-over" [class.highlight]="(vitals[0].bmi || 0) >= 25 && (vitals[0].bmi || 0) < 30">Overweight (25 - 29.9)</div>
            <div class="bmi-segment seg-obese" [class.highlight]="(vitals[0].bmi || 0) >= 30">Obese (30+)</div>
          </div>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="ehr-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Blood Pressure</th>
                  <th>Pulse</th>
                  <th>Resp Rate</th>
                  <th>Temp</th>
                  <th>SpO2</th>
                  <th>BMI / Weight</th>
                  <th>Recorded By</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let v of vitals">
                  <td>{{ v.recordedAt | date:'medium' }}</td>
                  <td>
                    <strong [class.text-danger]="(v.systolicBP || 0) > 135 || (v.diastolicBP || 0) > 85">
                      {{ v.systolicBP }}/{{ v.diastolicBP }}
                    </strong> mmHg
                  </td>
                  <td>{{ v.heartRate }} bpm</td>
                  <td>{{ v.respiratoryRate }} /min</td>
                  <td>{{ v.temperature }} °C</td>
                  <td>
                    <span [class.text-danger]="(v.oxygenSaturation || 100) < 95">{{ v.oxygenSaturation }}%</span>
                  </td>
                  <td>
                    <strong>{{ v.bmi }}</strong> ({{ v.weightKg }} kg / {{ v.heightCm }} cm)
                  </td>
                  <td><small class="text-sub">{{ v.recordedBy }}</small></td>
                </tr>
                <tr *ngIf="vitals.length === 0">
                  <td colspan="8" class="text-center py-3">No vital signs recorded yet.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab Content 3: SOAP Notes -->
      <div *ngIf="activeTab === 'encounters'" class="tab-content">
        <div class="section-actions mb-3">
          <a [routerLink]="['/clinical-notes']" [queryParams]="{ patientId: patient.id }" class="btn btn-primary btn-sm">
            <span>✍️</span> Document New SOAP Note
          </a>
        </div>

        <div class="encounters-flow" *ngIf="encounters.length > 0">
          <div *ngFor="let e of encounters" class="encounter-card card">
            <div class="enc-header">
              <div>
                <span class="badge badge-teal">{{ e.encounterType }}</span>
                <span class="badge" [ngClass]="e.status === 'SIGNED' ? 'badge-success' : 'badge-warning'">
                  {{ e.status }}
                </span>
                <span class="enc-date">{{ e.encounterDate | date:'medium' }}</span>
              </div>
              <div class="enc-provider">Provider: <strong>{{ e.providerName }}</strong></div>
            </div>

            <div class="enc-complaint">
              <strong>Chief Complaint:</strong> {{ e.chiefComplaint }}
            </div>

            <!-- SOAP Structure -->
            <div class="soap-grid">
              <div class="soap-col soap-s">
                <div class="soap-heading">S (Subjective)</div>
                <p>{{ e.soapSubjective || 'No subjective narrative recorded.' }}</p>
              </div>
              <div class="soap-col soap-o">
                <div class="soap-heading">O (Objective)</div>
                <p>{{ e.soapObjective || 'No objective findings recorded.' }}</p>
              </div>
              <div class="soap-col soap-a">
                <div class="soap-heading">A (Assessment & ICD-10)</div>
                <p>{{ e.soapAssessment || 'No assessment recorded.' }}</p>
                <div *ngIf="e.icd10Codes" class="icd-tags">
                  <span class="icd-tag" *ngFor="let code of splitCodes(e.icd10Codes)">{{ code }}</span>
                </div>
              </div>
              <div class="soap-col soap-p">
                <div class="soap-heading">P (Plan)</div>
                <p>{{ e.soapPlan || 'No therapeutic plan recorded.' }}</p>
              </div>
            </div>

            <div class="enc-footer" *ngIf="e.signedBy">
              <span>✍️ Digitally Signed by <strong>{{ e.signedBy }}</strong> on {{ e.signedAt | date:'medium' }}</span>
            </div>
            <div class="enc-footer" *ngIf="!e.signedBy && authService.isDoctor()">
              <button (click)="signNote(e.id!)" class="btn btn-teal btn-sm">
                Sign & Lock Note
              </button>
            </div>
          </div>
        </div>

        <div *ngIf="encounters.length === 0" class="card empty-card">
          No clinical documentation or SOAP encounters on record for this patient.
        </div>
      </div>

      <!-- Tab Content 4: CPOE Orders -->
      <div *ngIf="activeTab === 'orders'" class="tab-content">
        <div class="section-actions mb-3">
          <a [routerLink]="['/cpoe-orders']" [queryParams]="{ patientId: patient.id }" class="btn btn-primary btn-sm">
            <span>➕</span> Place CPOE Order
          </a>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="ehr-table">
              <thead>
                <tr>
                  <th>Order Type</th>
                  <th>Order / Test Name</th>
                  <th>Priority</th>
                  <th>LOINC Code</th>
                  <th>Status</th>
                  <th>Results & Reference Range</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let o of orders" [class.row-abnormal]="o.flaggedAbnormal">
                  <td>
                    <span class="badge" [ngClass]="'badge-' + (o.orderType === 'LAB' ? 'primary' : 'teal')">
                      {{ o.orderType }}
                    </span>
                  </td>
                  <td>
                    <strong>{{ o.orderName }}</strong>
                    <div class="text-sub" *ngIf="o.clinicalIndication">{{ o.clinicalIndication }}</div>
                  </td>
                  <td>
                    <span class="badge" [ngClass]="o.priority === 'STAT' ? 'badge-danger' : (o.priority === 'URGENT' ? 'badge-warning' : 'badge-neutral')">
                      {{ o.priority }}
                    </span>
                  </td>
                  <td><code>{{ o.loincCode || '—' }}</code></td>
                  <td>
                    <span class="badge" [ngClass]="o.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'">
                      {{ o.status }}
                    </span>
                  </td>
                  <td>
                    <div *ngIf="o.resultNotes">
                      <span *ngIf="o.flaggedAbnormal" class="text-danger font-bold">⚠️ [ABNORMAL]: </span>
                      <span>{{ o.resultNotes }}</span>
                    </div>
                    <div *ngIf="o.normalRange" class="text-sub">Ref: {{ o.normalRange }}</div>
                    <div *ngIf="!o.resultNotes" class="text-sub">Awaiting laboratory specimen processing</div>
                  </td>
                </tr>
                <tr *ngIf="orders.length === 0">
                  <td colspan="6" class="text-center py-3">No CPOE orders placed.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tab Content 5: Medications -->
      <div *ngIf="activeTab === 'meds'" class="tab-content">
        <div class="section-actions mb-3">
          <a [routerLink]="['/medications']" [queryParams]="{ patientId: patient.id }" class="btn btn-primary btn-sm">
            <span>➕</span> Prescribe Medication
          </a>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="ehr-table">
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage & Frequency</th>
                  <th>Route</th>
                  <th>Duration</th>
                  <th>Refills</th>
                  <th>Status</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let rx of prescriptions">
                  <td>
                    <strong>{{ rx.medicationName }}</strong>
                    <div class="text-sub" *ngIf="rx.rxNormCode">RxNorm: {{ rx.rxNormCode }}</div>
                  </td>
                  <td>{{ rx.dosage }} • {{ rx.frequency }}</td>
                  <td>{{ rx.route }}</td>
                  <td>{{ rx.durationDays ? rx.durationDays + ' days' : 'Continuous' }}</td>
                  <td>{{ rx.refills }}</td>
                  <td>
                    <span class="badge" [ngClass]="rx.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'">
                      {{ rx.status }}
                    </span>
                  </td>
                  <td>{{ rx.instructions || 'Take as directed.' }}</td>
                </tr>
                <tr *ngIf="prescriptions.length === 0">
                  <td colspan="7" class="text-center py-3">No medications prescribed.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Record Vitals Modal -->
      <div class="modal-backdrop" *ngIf="showVitalsModal">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3><span>🩺</span> Record Patient Vitals</h3>
            <button class="close-btn" (click)="closeVitalsModal()">×</button>
          </div>
          <form (ngSubmit)="submitVitals()">
            <div class="form-row">
              <div class="form-group col">
                <label>Systolic BP (mmHg)</label>
                <input type="number" [(ngModel)]="newVital.systolicBP" name="systolicBP" class="form-control" placeholder="120" />
              </div>
              <div class="form-group col">
                <label>Diastolic BP (mmHg)</label>
                <input type="number" [(ngModel)]="newVital.diastolicBP" name="diastolicBP" class="form-control" placeholder="80" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Heart Rate (BPM)</label>
                <input type="number" [(ngModel)]="newVital.heartRate" name="heartRate" class="form-control" placeholder="72" />
              </div>
              <div class="form-group col">
                <label>Respiratory Rate (/min)</label>
                <input type="number" [(ngModel)]="newVital.respiratoryRate" name="respiratoryRate" class="form-control" placeholder="16" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Temperature (°C)</label>
                <input type="number" step="0.1" [(ngModel)]="newVital.temperature" name="temperature" class="form-control" placeholder="36.8" />
              </div>
              <div class="form-group col">
                <label>Oxygen Saturation SpO2 (%)</label>
                <input type="number" [(ngModel)]="newVital.oxygenSaturation" name="oxygenSaturation" class="form-control" placeholder="98" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Height (cm)</label>
                <input type="number" [(ngModel)]="newVital.heightCm" name="heightCm" class="form-control" placeholder="175" (input)="computeBmi()" />
              </div>
              <div class="form-group col">
                <label>Weight (kg)</label>
                <input type="number" step="0.1" [(ngModel)]="newVital.weightKg" name="weightKg" class="form-control" placeholder="75.0" (input)="computeBmi()" />
              </div>
              <div class="form-group col">
                <label>Calculated BMI</label>
                <input type="number" [(ngModel)]="newVital.bmi" name="bmi" class="form-control bg-light" readonly />
              </div>
            </div>

            <div class="form-group">
              <label>Clinical Notes</label>
              <input type="text" [(ngModel)]="newVital.notes" name="notes" class="form-control" placeholder="Routine checkup vitals, patient sitting" />
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeVitalsModal()">Cancel</button>
              <button type="submit" [disabled]="submittingVitals" class="btn btn-primary">
                {{ submittingVitals ? 'Saving...' : 'Save Vitals Record' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .patient-detail-page {
      max-width: 1400px;
      margin: 1.5rem auto;
      padding: 0 1.5rem;
    }

    .detail-state-card {
      text-align: center;
      padding: 3.5rem 1.5rem;
      margin-bottom: 1.5rem;
      background: white;
      border-radius: 12px;
    }

    .detail-spinner {
      width: 44px;
      height: 44px;
      border: 3.5px solid #e2e8f0;
      border-top-color: #0284c7;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1.25rem auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .top-nav {
      margin-bottom: 1rem;

      .back-link {
        color: #0284c7;
        font-weight: 600;
        text-decoration: none;
        font-size: 0.85rem;

        &:hover {
          text-decoration: underline;
        }
      }
    }

    .patient-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      gap: 1.5rem;
    }

    .banner-main {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .patient-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #0d9488);
      color: white;
      font-size: 1.5rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;

      h2 {
        font-size: 1.5rem;
      }
    }

    .demographics-line {
      font-size: 0.85rem;
      color: #64748b;
      margin-top: 0.35rem;
    }

    .safety-alerts {
      display: flex;
      gap: 0.75rem;
    }

    .alert-box {
      border-radius: 8px;
      padding: 0.5rem 0.85rem;
      min-width: 180px;

      .alert-title {
        display: block;
        font-size: 0.65rem;
        font-weight: 800;
        letter-spacing: 0.05em;
        margin-bottom: 0.15rem;
      }

      .alert-content {
        display: block;
        font-size: 0.8rem;
        font-weight: 600;
      }

      &.allergy-box {
        background: #fee2e2;
        border: 1px solid #fecaca;
        .alert-title, .alert-content { color: #b91c1c; }
      }

      &.conditions-box {
        background: #e0f2fe;
        border: 1px solid #bae6fd;
        .alert-title, .alert-content { color: #0369a1; }
      }
    }

    /* BMI Spectrum Gauge */
    .bmi-spectrum-card {
      padding: 1.15rem 1.35rem;
      background: white;
    }

    .bmi-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.85rem;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .bmi-title {
      font-size: 0.95rem;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 0.4rem;
    }

    .bmi-current-pill {
      font-size: 0.8rem;
      padding: 0.3rem 0.75rem;
      border-radius: 20px;
      font-weight: 700;

      &.bmi-under { background: #e0f2fe; color: #0284c7; }
      &.bmi-normal { background: #d1fae5; color: #059669; }
      &.bmi-over { background: #fef3c7; color: #d97706; }
      &.bmi-obese { background: #fee2e2; color: #dc2626; }
    }

    .bmi-spectrum-bar {
      display: grid;
      grid-template-columns: 1fr 1.5fr 1fr 1fr;
      border-radius: 8px;
      overflow: hidden;
      height: 28px;
      font-size: 0.72rem;
      font-weight: 800;
      text-align: center;
      line-height: 28px;
      color: white;
    }

    .bmi-segment {
      transition: all 0.2s;
      opacity: 0.45;

      &.highlight {
        opacity: 1;
        box-shadow: inset 0 0 0 2px white, 0 0 8px rgba(0, 0, 0, 0.3);
        transform: scaleY(1.1);
        z-index: 2;
      }

      &.seg-under { background: #0284c7; }
      &.seg-normal { background: #10b981; }
      &.seg-over { background: #f59e0b; }
      &.seg-obese { background: #ef4444; }
    }

    .chart-tabs {
      display: flex;
      gap: 0.4rem;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid #cbd5e1;
      padding-bottom: 0.2rem;
      overflow-x: auto;
    }

    .tab-btn {
      background: none;
      border: none;
      padding: 0.65rem 1.1rem;
      font-size: 0.875rem;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      border-radius: 8px 8px 0 0;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      transition: all 0.15s ease;
      white-space: nowrap;

      &:hover {
        color: #0f172a;
        background: #f1f5f9;
      }

      &.active {
        color: #0284c7;
        border-bottom: 3px solid #0284c7;
        background: white;
      }
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.25rem;
    }

    .info-list {
      margin-top: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dashed #e2e8f0;
      padding-bottom: 0.4rem;
      font-size: 0.85rem;

      .label { color: #64748b; font-weight: 600; }
      .val { color: #1e293b; font-weight: 700; }
    }

    .encounters-flow {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .encounter-card {
      border-left: 4px solid #0284c7;
    }

    .enc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.6rem;

      .enc-date {
        font-size: 0.8rem;
        color: #64748b;
        margin-left: 0.5rem;
      }

      .enc-provider {
        font-size: 0.85rem;
        color: #334155;
      }
    }

    .enc-complaint {
      font-size: 0.95rem;
      color: #0f172a;
      margin-bottom: 1rem;
    }

    .soap-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 0.75rem;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .soap-col {
      .soap-heading {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        color: #0369a1;
        margin-bottom: 0.35rem;
      }

      p {
        font-size: 0.8rem;
        color: #334155;
        white-space: pre-line;
      }
    }

    .icd-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.25rem;
      margin-top: 0.5rem;
    }

    .icd-tag {
      background: #e2e8f0;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      font-size: 0.7rem;
      font-family: monospace;
      font-weight: 700;
    }

    .enc-footer {
      margin-top: 0.75rem;
      padding-top: 0.6rem;
      border-top: 1px solid #f1f5f9;
      font-size: 0.8rem;
      color: #047857;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .row-abnormal {
      background-color: #fff5f5 !important;
    }

    .form-row {
      display: flex;
      gap: 0.75rem;
    }

    .col { flex: 1; }
    .bg-light { background-color: #f1f5f9 !important; }
    .mb-3 { margin-bottom: 1rem; }

    @media (max-width: 1024px) {
      .patient-banner {
        flex-direction: column;
        align-items: flex-start;
      }
      .grid-2 {
        grid-template-columns: 1fr;
      }
      .soap-grid {
        grid-template-columns: 1fr 1fr;
      }
    }

    @media (max-width: 640px) {
      .patient-detail-page {
        padding: 0 0.75rem;
        margin: 0.75rem auto;
      }
      .patient-banner {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
      .banner-main {
        flex-direction: column;
        align-items: center;
        text-align: center;
      }
      .meta-row {
        justify-content: center;
        flex-wrap: wrap;
      }
      .demographics-line {
        justify-content: center;
        flex-wrap: wrap;
        font-size: 0.8rem;
      }
      .safety-alerts {
        width: 100%;
        flex-direction: column;
      }
      .chart-tabs {
        overflow-x: auto;
        flex-wrap: nowrap;
        padding-bottom: 0.5rem;
        -webkit-overflow-scrolling: touch;
      }
      .tab-btn {
        flex-shrink: 0;
      }
      .soap-grid {
        grid-template-columns: 1fr;
      }
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class PatientDetailComponent implements OnInit {
  patient: Patient | null = null;
  vitals: VitalSign[] = [];
  encounters: ClinicalEncounter[] = [];
  orders: MedicalOrder[] = [];
  prescriptions: Prescription[] = [];

  activeTab: 'summary' | 'vitals' | 'encounters' | 'orders' | 'meds' = 'summary';

  loading = true;
  errorMessage = '';

  showVitalsModal = false;
  submittingVitals = false;
  newVital: VitalSign = {
    patientId: 0,
    systolicBP: 120,
    diastolicBP: 80,
    heartRate: 72,
    respiratoryRate: 16,
    temperature: 36.8,
    oxygenSaturation: 98,
    heightCm: 175,
    weightKg: 75,
    bmi: 24.5,
    notes: ''
  };

  constructor(
    private route: ActivatedRoute,
    private ehrService: EhrService,
    public authService: AuthService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      const id = idParam ? Number(idParam) : null;
      if (id && !isNaN(id)) {
        this.loadPatientChart(id);
      } else {
        this.loading = false;
        this.errorMessage = 'Invalid or missing Patient ID in URL.';
        this.cdr.markForCheck();
      }
    });
  }

  loadPatientChart(id: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.ehrService.getPatient(id).subscribe({
      next: (p) => {
        this.patient = p;
        this.loading = false;
        this.newVital.patientId = p.id!;
        this.cdr.markForCheck();
      },
      error: (e) => {
        this.loading = false;
        this.errorMessage = e.error?.message || e.message || `Patient with ID #${id} was not found in the database.`;
        this.toastService.error('Chart Load Error', this.errorMessage);
        this.cdr.markForCheck();
      }
    });

    this.ehrService.getPatientVitals(id).subscribe({
      next: (v) => { this.vitals = v || []; this.cdr.markForCheck(); },
      error: (e) => console.warn('Could not load vitals', e)
    });

    this.ehrService.getEncountersByPatient(id).subscribe({
      next: (enc) => { this.encounters = enc || []; this.cdr.markForCheck(); },
      error: (e) => console.warn('Could not load encounters', e)
    });

    this.ehrService.getOrdersByPatient(id).subscribe({
      next: (o) => { this.orders = o || []; this.cdr.markForCheck(); },
      error: (e) => console.warn('Could not load orders', e)
    });

    this.ehrService.getPrescriptionsByPatient(id).subscribe({
      next: (rx) => { this.prescriptions = rx || []; this.cdr.markForCheck(); },
      error: (e) => console.warn('Could not load prescriptions', e)
    });
  }

  getInitials(): string {
    if (!this.patient) return 'PT';
    const f = (this.patient.firstName || '').trim().charAt(0);
    const l = (this.patient.lastName || '').trim().charAt(0);
    return (f + l).toUpperCase() || 'PT';
  }

  splitCodes(codes?: string): string[] {
    if (!codes) return [];
    return codes.split(',').map(c => c.trim());
  }

  getBmiLabel(bmi?: number): string {
    if (!bmi) return 'N/A';
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal Weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  }

  getBmiClass(bmi?: number): string {
    if (!bmi) return 'bmi-normal';
    if (bmi < 18.5) return 'bmi-under';
    if (bmi < 25) return 'bmi-normal';
    if (bmi < 30) return 'bmi-over';
    return 'bmi-obese';
  }

  openVitalsModal(): void {
    this.computeBmi();
    this.showVitalsModal = true;
  }

  closeVitalsModal(): void {
    this.showVitalsModal = false;
  }

  computeBmi(): void {
    if (this.newVital.heightCm && this.newVital.weightKg && this.newVital.heightCm > 0) {
      const hM = this.newVital.heightCm / 100.0;
      const bmi = this.newVital.weightKg / (hM * hM);
      this.newVital.bmi = Math.round(bmi * 10) / 10;
    }
  }

  submitVitals(): void {
    if (!this.patient?.id) return;
    this.submittingVitals = true;
    this.ehrService.recordVitals(this.patient.id, this.newVital).subscribe({
      next: (saved) => {
        this.submittingVitals = false;
        this.vitals.unshift(saved);
        this.closeVitalsModal();
        this.toastService.success(
          'Vitals Logged Successfully',
          `BP: ${saved.systolicBP}/${saved.diastolicBP} mmHg, Calculated BMI: ${saved.bmi} (${this.getBmiLabel(saved.bmi)})`
        );
      },
      error: (err) => {
        this.submittingVitals = false;
        this.toastService.error('Vitals Recording Failed', err.error?.message || err.message);
      }
    });
  }

  signNote(encounterId: number): void {
    this.ehrService.signEncounter(encounterId).subscribe({
      next: (updated) => {
        const index = this.encounters.findIndex(e => e.id === encounterId);
        if (index >= 0) {
          this.encounters[index] = updated;
        }
        this.toastService.success(
          'Encounter Signed',
          'Clinical documentation has been digitally signed and locked.'
        );
      },
      error: (err) => this.toastService.error('Sign Note Failed', err.message)
    });
  }

  calculateAge(dob?: string): number {
    if (!dob) return 0;
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}

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
      <!-- Back Navigation Breadcrumb -->
      <div class="top-nav">
        <a routerLink="/patients" class="back-link">
          <span>←</span> Back to Patient Master Index
        </a>
      </div>

      <!-- Loading State -->
      <div class="card detail-state-card" *ngIf="loading">
        <div class="detail-spinner"></div>
        <h3>Retrieving Electronic Health Record...</h3>
        <p class="text-sub">Loading clinical chart, historical flowsheet, CPOE orders, and documentation.</p>
      </div>

      <!-- Error State -->
      <div class="card detail-state-card text-danger" *ngIf="!loading && errorMessage">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">⚠️</div>
        <h3>Medical Chart Not Found</h3>
        <p class="text-sub" style="margin-bottom: 1.25rem;">{{ errorMessage }}</p>
        <a routerLink="/patients" class="btn btn-primary btn-sm">← Return to Patient Directory</a>
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
              <span><strong>{{ calculateAge(patient.dateOfBirth) }} yrs</strong></span> •
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
            <span class="alert-title">⚠️ DOCUMENTED ALLERGIES</span>
            <span class="alert-content">{{ patient.allergies || 'No Known Drug Allergies (NKDA)' }}</span>
          </div>
          <div class="alert-box conditions-box">
            <span class="alert-title">🩺 CHRONIC PROBLEMS</span>
            <span class="alert-content">{{ patient.chronicConditions || 'None documented on chart' }}</span>
          </div>
        </div>
      </div>

      <!-- Clinical Chart Tabs -->
      <div class="chart-tabs">
        <button [class.active]="activeTab === 'summary'" (click)="activeTab = 'summary'" class="tab-btn">
          <span>📋</span> Demographics & Policy
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
          <span>💊</span> E-Prescriptions ({{ prescriptions.length }})
        </button>
      </div>

      <!-- Tab Content 1: Summary -->
      <div *ngIf="activeTab === 'summary'" class="tab-content">
        <div class="grid-2">
          <div class="card">
            <h3>Contact & Emergency Details</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="label">Full Residential Address</span>
                <span class="val">{{ patient.address || '—' }}, {{ patient.city }}, {{ patient.state }} {{ patient.postalCode }}</span>
              </div>
              <div class="info-item">
                <span class="label">Email Address</span>
                <span class="val">{{ patient.email || '—' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Emergency Contact</span>
                <span class="val">{{ patient.emergencyContactName || '—' }} ({{ patient.emergencyContactRelationship || 'Next of Kin' }})</span>
              </div>
              <div class="info-item">
                <span class="label">Emergency Contact Phone</span>
                <span class="val">{{ patient.emergencyContactPhone || '—' }}</span>
              </div>
            </div>
          </div>

          <div class="card">
            <h3>Insurance & Healthcare Policy</h3>
            <div class="info-list">
              <div class="info-item">
                <span class="label">Insurance Payer</span>
                <span class="val">{{ patient.insuranceProvider || 'Self-Pay / Cash Healthcare' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Policy / Member ID</span>
                <span class="val">{{ patient.policyNumber || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="label">First Registered At</span>
                <span class="val">{{ patient.createdAt | date:'medium' }}</span>
              </div>
              <div class="info-item">
                <span class="label">Internal EHR Record ID</span>
                <span class="val font-mono">#CC-PT-{{ patient.id }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Content 2: Vitals -->
      <div *ngIf="activeTab === 'vitals'" class="tab-content">
        <!-- Latest Vital Telemetry HUD -->
        <div class="latest-vitals-grid" *ngIf="vitals.length > 0">
          <div class="vital-hud-card" [class.hud-alert]="isBpAbnormal(vitals[0])">
            <div class="hud-top">
              <span class="hud-icon">🩺</span>
              <span class="hud-tag">Blood Pressure</span>
            </div>
            <div class="hud-val">{{ vitals[0].systolicBP }}/{{ vitals[0].diastolicBP }} <small>mmHg</small></div>
            <div class="hud-status" [ngClass]="getBpStatusClass(vitals[0])">{{ getBpStatus(vitals[0]) }}</div>
          </div>

          <div class="vital-hud-card" [class.hud-alert]="isHrAbnormal(vitals[0])">
            <div class="hud-top">
              <span class="hud-icon">💓</span>
              <span class="hud-tag">Heart Rate</span>
            </div>
            <div class="hud-val">{{ vitals[0].heartRate }} <small>bpm</small></div>
            <div class="hud-status">{{ vitals[0].heartRate! > 100 ? 'Tachycardia' : (vitals[0].heartRate! < 60 ? 'Bradycardia' : 'Normal Sinus') }}</div>
          </div>

          <div class="vital-hud-card" [class.hud-alert]="(vitals[0].oxygenSaturation || 100) < 95">
            <div class="hud-top">
              <span class="hud-icon">🫁</span>
              <span class="hud-tag">Oxygen Sat (SpO2)</span>
            </div>
            <div class="hud-val">{{ vitals[0].oxygenSaturation }} <small>%</small></div>
            <div class="hud-status">{{ (vitals[0].oxygenSaturation || 100) >= 95 ? 'Optimal Room Air' : 'Hypoxia Alert' }}</div>
          </div>

          <div class="vital-hud-card" [class.hud-alert]="(vitals[0].temperature || 37) > 37.8">
            <div class="hud-top">
              <span class="hud-icon">🌡️</span>
              <span class="hud-tag">Temperature</span>
            </div>
            <div class="hud-val">{{ vitals[0].temperature }} <small>°C</small></div>
            <div class="hud-status">{{ (vitals[0].temperature || 37) > 37.8 ? 'Febrile / Pyrexia' : 'Normothermic' }}</div>
          </div>

          <div class="vital-hud-card">
            <div class="hud-top">
              <span class="hud-icon">⚖️</span>
              <span class="hud-tag">Body Mass Index</span>
            </div>
            <div class="hud-val">{{ vitals[0].bmi }} <small>kg/m²</small></div>
            <div class="hud-status">{{ getBmiLabel(vitals[0].bmi) }}</div>
          </div>
        </div>

        <div class="section-actions mb-3">
          <button (click)="openVitalsModal()" class="btn btn-primary btn-sm">
            <span>➕</span> Record New Vitals Flowsheet
          </button>
        </div>

        <div class="card">
          <div class="table-responsive">
            <table class="ehr-table">
              <thead>
                <tr>
                  <th>Recorded Time</th>
                  <th>Blood Pressure</th>
                  <th>Pulse / HR</th>
                  <th>Resp Rate</th>
                  <th>Temp</th>
                  <th>SpO2</th>
                  <th>BMI & Weight</th>
                  <th>Clinician</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let v of vitals">
                  <td>{{ v.recordedAt | date:'medium' }}</td>
                  <td>
                    <strong [class.text-danger]="isBpAbnormal(v)">
                      {{ v.systolicBP }}/{{ v.diastolicBP }} mmHg
                    </strong>
                  </td>
                  <td>
                    <span [class.text-danger]="isHrAbnormal(v)">{{ v.heartRate }} bpm</span>
                  </td>
                  <td>{{ v.respiratoryRate }} /min</td>
                  <td>
                    <span [class.text-danger]="(v.temperature || 37) > 37.8">{{ v.temperature }}°C</span>
                  </td>
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
              <div class="enc-provider">Attending Provider: <strong>{{ e.providerName }}</strong></div>
            </div>

            <div class="enc-complaint">
              <strong>Chief Complaint:</strong> {{ e.chiefComplaint }}
            </div>

            <!-- SOAP Structure -->
            <div class="soap-grid">
              <div class="soap-col soap-s">
                <div class="soap-heading">S • Subjective</div>
                <p>{{ e.soapSubjective || 'No subjective narrative recorded.' }}</p>
              </div>
              <div class="soap-col soap-o">
                <div class="soap-heading">O • Objective</div>
                <p>{{ e.soapObjective || 'No objective findings recorded.' }}</p>
              </div>
              <div class="soap-col soap-a">
                <div class="soap-heading">A • Assessment & ICD-10</div>
                <p>{{ e.soapAssessment || 'No assessment recorded.' }}</p>
                <div *ngIf="e.icd10Codes" class="icd-tags">
                  <span class="icd-tag" *ngFor="let code of splitCodes(e.icd10Codes)">{{ code }}</span>
                </div>
              </div>
              <div class="soap-col soap-p">
                <div class="soap-heading">P • Plan</div>
                <p>{{ e.soapPlan || 'No therapeutic plan recorded.' }}</p>
              </div>
            </div>

            <div class="enc-footer" *ngIf="e.signedBy">
              <span>✍️ Digitally Signed & Locked by <strong>{{ e.signedBy }}</strong> on {{ e.signedAt | date:'medium' }}</span>
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
                  <td><code class="font-mono">{{ o.loincCode || '—' }}</code></td>
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
            <div class="vitals-presets">
              <button type="button" class="btn btn-xs btn-secondary" (click)="applyVitalPreset('normal')">Normal</button>
              <button type="button" class="btn btn-xs btn-secondary" (click)="applyVitalPreset('hypertensive')">Hypertensive</button>
              <button type="button" class="btn btn-xs btn-secondary" (click)="applyVitalPreset('fever')">Fever</button>
            </div>
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
              <div class="form-group col">
                <label>Heart Rate (bpm)</label>
                <input type="number" [(ngModel)]="newVital.heartRate" name="heartRate" class="form-control" placeholder="72" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Resp Rate (/min)</label>
                <input type="number" [(ngModel)]="newVital.respiratoryRate" name="respiratoryRate" class="form-control" placeholder="16" />
              </div>
              <div class="form-group col">
                <label>Temp (°C)</label>
                <input type="number" step="0.1" [(ngModel)]="newVital.temperature" name="temperature" class="form-control" placeholder="36.8" />
              </div>
              <div class="form-group col">
                <label>Oxygen Sat (%)</label>
                <input type="number" [(ngModel)]="newVital.oxygenSaturation" name="oxygenSaturation" class="form-control" placeholder="98" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Height (cm)</label>
                <input type="number" [(ngModel)]="newVital.heightCm" (input)="computeBmi()" name="heightCm" class="form-control" placeholder="175" />
              </div>
              <div class="form-group col">
                <label>Weight (kg)</label>
                <input type="number" step="0.1" [(ngModel)]="newVital.weightKg" (input)="computeBmi()" name="weightKg" class="form-control" placeholder="70" />
              </div>
              <div class="form-group col">
                <label>Calculated BMI</label>
                <input type="number" [(ngModel)]="newVital.bmi" name="bmi" readonly class="form-control bg-light font-mono" />
              </div>
            </div>

            <div class="form-group">
              <label>Clinical Observations / Notes</label>
              <textarea [(ngModel)]="newVital.notes" name="notes" class="form-control" rows="2" placeholder="e.g. Patient rested 5 minutes prior to measurement"></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeVitalsModal()">Cancel</button>
              <button type="submit" [disabled]="submittingVitals" class="btn btn-primary">
                {{ submittingVitals ? 'Saving...' : 'Save Vitals Flowsheet' }}
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
      max-width: 1440px;
      margin: 1.5rem auto;
      padding: 0 1.75rem;
    }

    .top-nav {
      margin-bottom: 1.25rem;

      .back-link {
        display: inline-flex;
        align-items: center;
        gap: 0.45rem;
        color: #0284c7;
        font-weight: 700;
        text-decoration: none;
        font-size: 0.88rem;
        transition: color 0.15s;

        &:hover {
          color: #0369a1;
        }
      }
    }

    .detail-state-card {
      text-align: center;
      padding: 4rem 2rem;

      h3 {
        font-size: 1.35rem;
        margin-bottom: 0.5rem;
      }
    }

    .detail-spinner {
      width: 36px;
      height: 36px;
      border: 3.5px solid #e2e8f0;
      border-top-color: #0284c7;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin: 0 auto 1.25rem auto;
    }

    /* Patient Header Banner */
    .patient-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1.5rem;
      background: white;
      border-left: 5px solid #0284c7;
    }

    .banner-main {
      display: flex;
      align-items: center;
      gap: 1.25rem;
    }

    .patient-avatar {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #0284c7, #0d9488);
      color: white;
      font-weight: 800;
      font-size: 1.45rem;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 16px rgba(2, 132, 199, 0.35);
      flex-shrink: 0;
    }

    .meta-row {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      margin-bottom: 0.35rem;

      h2 {
        font-size: 1.45rem;
        margin: 0;
      }
    }

    .demographics-line {
      font-size: 0.88rem;
      color: #64748b;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;
    }

    .safety-alerts {
      display: flex;
      gap: 0.85rem;
    }

    .alert-box {
      border-radius: 10px;
      padding: 0.65rem 0.95rem;
      font-size: 0.78rem;
      min-width: 200px;

      .alert-title {
        display: block;
        font-weight: 800;
        letter-spacing: 0.05em;
        font-size: 0.68rem;
        margin-bottom: 0.2rem;
      }

      .alert-content {
        font-weight: 600;
      }

      &.allergy-box {
        background: #fee2e2;
        border: 1px solid rgba(239, 68, 68, 0.3);
        color: #b91c1c;
      }

      &.conditions-box {
        background: #e0f2fe;
        border: 1px solid rgba(2, 132, 199, 0.3);
        color: #0369a1;
      }
    }

    /* Chart Tabs */
    .chart-tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 0.35rem;
      flex-wrap: wrap;
    }

    .tab-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.15rem;
      font-size: 0.88rem;
      font-weight: 700;
      color: #64748b;
      background: transparent;
      border: none;
      border-radius: 9px;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        color: #0f172a;
        background: #f1f5f9;
      }

      &.active {
        color: #0284c7;
        background: #e0f2fe;
      }
    }

    /* Vitals HUD Grid */
    .latest-vitals-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .vital-hud-card {
      background: white;
      border: 1.5px solid var(--slate-200);
      border-radius: 14px;
      padding: 1.1rem;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
      }

      &.hud-alert {
        border-color: #fca5a5;
        background: #fff8f8;
      }

      .hud-top {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        margin-bottom: 0.5rem;
      }

      .hud-icon {
        font-size: 1.25rem;
      }

      .hud-tag {
        font-size: 0.75rem;
        font-weight: 700;
        color: #64748b;
        text-transform: uppercase;
      }

      .hud-val {
        font-size: 1.65rem;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.1;

        small {
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 600;
        }
      }

      .hud-status {
        font-size: 0.75rem;
        color: #059669;
        font-weight: 700;
        margin-top: 0.35rem;

        &.status-danger {
          color: #dc2626;
        }
        &.status-warn {
          color: #d97706;
        }
      }
    }

    /* Information Lists */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;

      .label {
        font-size: 0.75rem;
        color: #64748b;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .val {
        font-size: 0.95rem;
        font-weight: 600;
        color: #0f172a;
      }
    }

    /* SOAP Notes Flow */
    .encounters-flow {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .encounter-card {
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 1.5rem;
    }

    .enc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .enc-date {
      font-size: 0.82rem;
      color: #64748b;
      margin-left: 0.75rem;
    }

    .enc-provider {
      font-size: 0.85rem;
      color: #334155;
    }

    .enc-complaint {
      background: #f8fafc;
      padding: 0.75rem 1rem;
      border-radius: 8px;
      font-size: 0.9rem;
      margin-bottom: 1.25rem;
      border: 1px solid #e2e8f0;
    }

    .soap-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1rem;
    }

    .soap-col {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1rem;

      .soap-heading {
        font-size: 0.75rem;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 0.5rem;
      }

      p {
        font-size: 0.85rem;
        line-height: 1.45;
        margin: 0;
      }

      &.soap-s {
        border-top: 3px solid #0284c7;
        .soap-heading { color: #0284c7; }
      }
      &.soap-o {
        border-top: 3px solid #0d9488;
        .soap-heading { color: #0d9488; }
      }
      &.soap-a {
        border-top: 3px solid #8b5cf6;
        .soap-heading { color: #8b5cf6; }
      }
      &.soap-p {
        border-top: 3px solid #10b981;
        .soap-heading { color: #10b981; }
      }
    }

    .icd-tags {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
      margin-top: 0.65rem;
    }

    .icd-tag {
      background: #ede9fe;
      color: #6d28d9;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }

    .enc-footer {
      margin-top: 1.25rem;
      padding-top: 0.85rem;
      border-top: 1px solid #f1f5f9;
      font-size: 0.82rem;
      color: #047857;
      display: flex;
      justify-content: flex-end;
    }

    .empty-card {
      text-align: center;
      padding: 3rem;
      color: #94a3b8;
    }

    .vitals-presets {
      display: flex;
      gap: 0.35rem;
    }

    .btn-xs {
      padding: 0.25rem 0.6rem;
      font-size: 0.72rem;
      border-radius: 6px;
    }

    .form-row {
      display: flex;
      gap: 0.75rem;
    }

    .col { flex: 1; }
    .bg-light { background-color: #f1f5f9 !important; }
    .mb-3 { margin-bottom: 1rem; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }

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
        padding: 0.75rem;
        margin: 0.5rem auto;
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

  isBpAbnormal(v: VitalSign): boolean {
    if (!v.systolicBP || !v.diastolicBP) return false;
    return v.systolicBP >= 140 || v.diastolicBP >= 90;
  }

  getBpStatus(v: VitalSign): string {
    if (!v.systolicBP || !v.diastolicBP) return 'Normal';
    if (v.systolicBP >= 140 || v.diastolicBP >= 90) return 'Hypertensive (Stage 2)';
    if (v.systolicBP >= 130 || v.diastolicBP >= 80) return 'Pre-hypertension';
    return 'Optimal BP';
  }

  getBpStatusClass(v: VitalSign): string {
    if (!v.systolicBP || !v.diastolicBP) return '';
    if (v.systolicBP >= 140 || v.diastolicBP >= 90) return 'status-danger';
    if (v.systolicBP >= 130 || v.diastolicBP >= 80) return 'status-warn';
    return '';
  }

  isHrAbnormal(v: VitalSign): boolean {
    if (!v.heartRate) return false;
    return v.heartRate > 100 || v.heartRate < 60;
  }

  openVitalsModal(): void {
    this.computeBmi();
    this.showVitalsModal = true;
  }

  closeVitalsModal(): void {
    this.showVitalsModal = false;
  }

  applyVitalPreset(type: 'normal' | 'hypertensive' | 'fever'): void {
    if (type === 'normal') {
      this.newVital.systolicBP = 118;
      this.newVital.diastolicBP = 76;
      this.newVital.heartRate = 68;
      this.newVital.respiratoryRate = 16;
      this.newVital.temperature = 36.7;
      this.newVital.oxygenSaturation = 99;
      this.newVital.notes = 'Patient resting quietly. Vitals within expected clinical range.';
    } else if (type === 'hypertensive') {
      this.newVital.systolicBP = 158;
      this.newVital.diastolicBP = 96;
      this.newVital.heartRate = 88;
      this.newVital.respiratoryRate = 18;
      this.newVital.temperature = 36.9;
      this.newVital.oxygenSaturation = 97;
      this.newVital.notes = 'Stage 2 Hypertension detected. Recheck recommended in 15 mins.';
    } else if (type === 'fever') {
      this.newVital.systolicBP = 110;
      this.newVital.diastolicBP = 70;
      this.newVital.heartRate = 106;
      this.newVital.respiratoryRate = 22;
      this.newVital.temperature = 38.6;
      this.newVital.oxygenSaturation = 95;
      this.newVital.notes = 'Patient reports chills and malaise. Pyrexia noted.';
    }
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
          `BP: ${saved.systolicBP}/${saved.diastolicBP} mmHg, BMI: ${saved.bmi} (${this.getBmiLabel(saved.bmi)})`
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

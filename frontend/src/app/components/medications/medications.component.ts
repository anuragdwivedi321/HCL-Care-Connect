import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EhrService } from '../../services/ehr.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { InteractionCheckResult, Patient, Prescription } from '../../models/ehr.models';

@Component({
  selector: 'app-medications',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="medications-page">
      <div class="page-header">
        <div>
          <h2>E-Prescriptions & Medication Management</h2>
          <p class="subtitle">Clinical pharmacy order management with integrated real-time drug-drug interaction warning checks.</p>
        </div>
        <button (click)="openPrescribeModal()" class="btn btn-primary" *ngIf="authService.isDoctor() || authService.isAdmin()">
          <span>💊</span> Prescribe New Medication
        </button>
      </div>

      <!-- Patient Filter Toolbar with Live Search & Suggestions -->
      <div class="card toolbar-card">
        <div class="toolbar-header-row">
          <div class="toolbar-title-box">
            <span class="toolbar-title-icon">👥</span>
            <div>
              <strong class="toolbar-title">Patient Medication Worklist</strong>
              <div class="toolbar-subtitle">Filter prescriptions by searching patient name, MRN, or selecting from registry.</div>
            </div>
          </div>

          <div class="filter-toggle">
            <label class="checkbox-label">
              <input type="checkbox" [(ngModel)]="activeOnly" (change)="loadPrescriptions()" />
              <span>Show Active Prescriptions Only</span>
            </label>
          </div>
        </div>

        <div class="toolbar-search-row">
          <!-- Autocomplete Search Input with Live Suggestions -->
          <div class="patient-search-autocomplete">
            <label class="filter-label">Search / Filter by Patient:</label>
            <div class="search-input-group">
              <span class="search-icon">🔍</span>
              <input
                type="text"
                class="form-control patient-search-field"
                placeholder="Search by name, MRN, or phone (e.g. Rohit, 1001)..."
                [(ngModel)]="patientSearchText"
                (input)="onSearchInput()"
                (focus)="openSuggestions()"
              />
              <button *ngIf="patientSearchText" type="button" class="clear-btn" (click)="clearSearch()" title="Clear filter">×</button>
            </div>

            <!-- Floating Suggestions Dropdown -->
            <div class="suggestions-dropdown card" *ngIf="showSuggestions && filteredPatients.length > 0">
              <div class="suggestions-count">
                <span>Matching Patients ({{ filteredPatients.length }})</span>
                <button type="button" class="close-sugg-link" (click)="showSuggestions = false">Close ✕</button>
              </div>
              <div class="suggestions-scroll">
                <div
                  *ngFor="let p of filteredPatients"
                  class="suggestion-row"
                  [class.active-row]="p.id === selectedPatientId"
                  (mousedown)="selectPatientFromSuggestion(p)"
                >
                  <div class="sugg-avatar">{{ getPatientInitials(p) }}</div>
                  <div class="sugg-content">
                    <div class="sugg-name">
                      <strong>{{ p.firstName }} {{ p.lastName }}</strong>
                      <span class="badge-mrn">{{ p.mrn }}</span>
                      <span class="badge-blood" *ngIf="p.bloodGroup">{{ p.bloodGroup }}</span>
                    </div>
                    <div class="sugg-sub">
                      <span>{{ p.gender }} • Ph: {{ p.phone || 'N/A' }}</span>
                      <span *ngIf="p.allergies" class="sugg-allergy">⚠️ {{ p.allergies }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Dropdown -->
          <div class="patient-select-box">
            <label class="filter-label">Quick Patient Select:</label>
            <select [(ngModel)]="selectedPatientId" (change)="onPatientSelectChange()" class="form-control patient-dropdown-select">
              <option *ngFor="let p of patients" [ngValue]="p.id">
                {{ p.firstName }} {{ p.lastName }} ({{ p.mrn }})
              </option>
            </select>
          </div>
        </div>

        <!-- Selected Patient Context Banner -->
        <div class="selected-patient-bar" *ngIf="selectedPatient">
          <div class="sp-left">
            <span class="sp-avatar">{{ getPatientInitials(selectedPatient) }}</span>
            <div class="sp-info">
              <div class="sp-name-row">
                <span class="sp-title">{{ selectedPatient.firstName }} {{ selectedPatient.lastName }}</span>
                <span class="sp-badge-mrn">MRN: {{ selectedPatient.mrn }}</span>
                <span class="sp-badge-gender">{{ selectedPatient.gender }}</span>
                <span class="sp-badge-blood" *ngIf="selectedPatient.bloodGroup">{{ selectedPatient.bloodGroup }}</span>
              </div>
              <div class="sp-meta-row">
                <span class="sp-meta-item"><span>📞</span> {{ selectedPatient.phone || 'No contact phone' }}</span>
                <span class="sp-meta-item"><span>📍</span> {{ selectedPatient.city || 'Inpatient' }}</span>
                <span class="sp-meta-item text-danger" *ngIf="selectedPatient.allergies">
                  <span>⚠️ Allergies:</span> <strong>{{ selectedPatient.allergies }}</strong>
                </span>
                <span class="sp-meta-item text-warning" *ngIf="selectedPatient.chronicConditions">
                  <span>🩺 Conditions:</span> {{ selectedPatient.chronicConditions }}
                </span>
              </div>
            </div>
          </div>
          <div class="sp-right">
            <a [routerLink]="['/patients', selectedPatient.id]" class="btn btn-secondary btn-sm">
              <span>📂</span> View Chart
            </a>
          </div>
        </div>
      </div>

      <!-- Prescriptions Table -->
      <div class="card table-card">
        <div class="table-responsive">
          <table class="ehr-table">
            <thead>
              <tr>
                <th>Rx ID</th>
                <th>Medication Name</th>
                <th>Dosage & Frequency</th>
                <th>Route</th>
                <th>Duration & Refills</th>
                <th>Status</th>
                <th>Prescribed Date</th>
                <th>Instructions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let rx of prescriptions">
                <td><span class="badge badge-neutral">#RX-{{ rx.id }}</span></td>
                <td>
                  <strong>{{ rx.medicationName }}</strong>
                  <div class="text-sub" *ngIf="rx.rxNormCode">RxNorm: <code>{{ rx.rxNormCode }}</code></div>
                </td>
                <td>
                  <div>{{ rx.dosage }}</div>
                  <div class="text-sub">{{ rx.frequency }}</div>
                </td>
                <td>{{ rx.route }}</td>
                <td>
                  <div>{{ rx.durationDays ? rx.durationDays + ' days' : 'Continuous' }}</div>
                  <div class="text-sub">Refills: {{ rx.refills }}</div>
                </td>
                <td>
                  <span class="badge" [ngClass]="rx.status === 'ACTIVE' ? 'badge-success' : 'badge-neutral'">
                    {{ rx.status }}
                  </span>
                </td>
                <td>{{ rx.prescribedAt | date:'shortDate' }}</td>
                <td><small>{{ rx.instructions || 'As instructed.' }}</small></td>
                <td>
                  <button *ngIf="rx.status === 'ACTIVE' && (authService.isDoctor() || authService.isAdmin())" (click)="openDiscontinueModal(rx)" class="btn btn-secondary btn-sm text-danger">
                    Discontinue
                  </button>
                </td>
              </tr>
              <tr *ngIf="prescriptions.length === 0">
                <td colspan="9" class="text-center py-4">No medication records found for this patient.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal: New E-Prescription with Interaction Warning -->
      <div class="modal-backdrop" *ngIf="showPrescribeModal">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3><span>💊</span> E-Prescribe Medication</h3>
            <button class="close-btn" (click)="closePrescribeModal()">×</button>
          </div>
          <form (ngSubmit)="submitPrescription()">
            <div class="form-group">
              <label>Patient *</label>
              <select [(ngModel)]="newRx.patientId" name="patientId" required class="form-control" (change)="onPrescribePatientSelected()">
                <option *ngFor="let p of patients" [ngValue]="p.id">
                  {{ p.firstName }} {{ p.lastName }} ({{ p.mrn }})
                </option>
              </select>
            </div>

            <!-- Formulary Quick-Fill Chips -->
            <div class="formulary-chips">
              <span class="chip-label">Hospital Formulary Suggestions:</span>
              <button type="button" *ngFor="let drug of formularySuggestions" (click)="selectFormulary(drug)" class="chip-btn">
                + {{ drug }}
              </button>
            </div>

            <div class="form-row">
              <div class="form-group col-2">
                <label>Medication Generic / Brand Name *</label>
                <input
                  type="text"
                  [(ngModel)]="newRx.medicationName"
                  name="medicationName"
                  required
                  (input)="checkLiveInteraction()"
                  class="form-control"
                  placeholder="e.g. Spironolactone, Metformin, Lisinopril"
                />
              </div>
              <div class="form-group col">
                <label>Dosage *</label>
                <input type="text" [(ngModel)]="newRx.dosage" name="dosage" required class="form-control" placeholder="e.g. 25 mg" />
              </div>
            </div>

            <!-- REAL-TIME DRUG INTERACTION ALERT BANNER -->
            <div *ngIf="interactionAlerts.length > 0" class="interaction-banner">
              <div class="alert-head">
                <span class="warning-icon">⚠️</span>
                <strong>DRUG-DRUG INTERACTION WARNING DETECTED</strong>
              </div>
              <div *ngFor="let alert of interactionAlerts" class="alert-body">
                <div class="severity-pill" [ngClass]="'sev-' + alert.severity?.toLowerCase()">
                  SEVERITY: {{ alert.severity }}
                </div>
                <div class="interaction-desc">
                  <strong>{{ alert.drugA }}</strong> interacts with <strong>{{ alert.drugB }}</strong>
                </div>
                <p class="interaction-details">{{ alert.description }}</p>
                <div class="clinical-rec">
                  <span>💡 Clinical Recommendation:</span> {{ alert.clinicalRecommendation }}
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Route *</label>
                <select [(ngModel)]="newRx.route" name="route" required class="form-control">
                  <option value="Oral">Oral (PO)</option>
                  <option value="Intravenous">Intravenous (IV)</option>
                  <option value="Sublingual">Sublingual (SL)</option>
                  <option value="Subcutaneous">Subcutaneous (SC)</option>
                  <option value="Topical">Topical</option>
                  <option value="Inhalation">Inhalation</option>
                </select>
              </div>

              <div class="form-group col">
                <label>Dosing Frequency *</label>
                <select [(ngModel)]="newRx.frequency" name="frequency" required class="form-control">
                  <option value="Once daily (QD)">Once daily (QD)</option>
                  <option value="Twice daily (BID)">Twice daily (BID)</option>
                  <option value="Three times daily (TID)">Three times daily (TID)</option>
                  <option value="Every 8 hours (q8h)">Every 8 hours (q8h)</option>
                  <option value="As needed (PRN)">As needed (PRN)</option>
                  <option value="At bedtime (QHS)">At bedtime (QHS)</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Duration (Days)</label>
                <input type="number" [(ngModel)]="newRx.durationDays" name="durationDays" class="form-control" placeholder="30" />
              </div>
              <div class="form-group col">
                <label>Authorized Refills</label>
                <input type="number" [(ngModel)]="newRx.refills" name="refills" class="form-control" placeholder="2" />
              </div>
            </div>

            <div class="form-group">
              <label>Pharmacy Patient Instructions (SIG)</label>
              <input type="text" [(ngModel)]="newRx.instructions" name="instructions" class="form-control" placeholder="Take 1 tablet by mouth daily in the morning with meals" />
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closePrescribeModal()">Cancel</button>
              <button type="submit" [disabled]="submittingRx" class="btn btn-primary">
                {{ submittingRx ? 'Authorizing...' : 'Authorize E-Prescription' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Discontinue Medication -->
      <div class="modal-backdrop" *ngIf="prescriptionToDiscontinue">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3><span>🛑</span> Discontinue Prescription</h3>
            <button class="close-btn" (click)="prescriptionToDiscontinue = null">×</button>
          </div>
          <div class="discontinue-body">
            <p>
              Are you sure you want to discontinue
              <strong>{{ prescriptionToDiscontinue.medicationName }} ({{ prescriptionToDiscontinue.dosage }})</strong>?
            </p>
            <div class="form-group mt-3">
              <label>Reason for Discontinuation *</label>
              <select [(ngModel)]="discontinueReason" class="form-control">
                <option value="Condition resolved / course completed">Course completed</option>
                <option value="Adverse drug reaction / side effect">Adverse drug reaction / allergy</option>
                <option value="Suboptimal efficacy / switching therapy">Switching therapy</option>
                <option value="Potential drug-drug interaction flagged">Drug-drug interaction risk</option>
                <option value="Patient request">Patient request</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="prescriptionToDiscontinue = null">Cancel</button>
            <button type="button" (click)="confirmDiscontinue()" class="btn btn-danger">Confirm Discontinuation</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .medications-page {
      max-width: 1400px;
      margin: 1.5rem auto;
      padding: 0 1.5rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;

      h2 { font-size: 1.6rem; }
      .subtitle { color: #64748b; font-size: 0.9rem; margin-top: 0.2rem; }
    }

    .toolbar-card {
      padding: 1.15rem 1.35rem;
      margin-bottom: 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      background: white;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
    }

    .toolbar-header-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      border-bottom: 1px solid #f1f5f9;
      padding-bottom: 0.75rem;
    }

    .toolbar-title-box {
      display: flex;
      align-items: center;
      gap: 0.65rem;

      .toolbar-title-icon {
        font-size: 1.35rem;
      }

      .toolbar-title {
        font-size: 1.05rem;
        color: #0f172a;
      }

      .toolbar-subtitle {
        font-size: 0.78rem;
        color: #64748b;
      }
    }

    .toolbar-search-row {
      display: flex;
      align-items: flex-start;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .patient-search-autocomplete {
      flex: 2;
      min-width: 300px;
      position: relative;
    }

    .patient-select-box {
      flex: 1;
      min-width: 250px;
    }

    .filter-label {
      display: block;
      font-size: 0.78rem;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      margin-bottom: 0.35rem;
    }

    .search-input-group {
      position: relative;
      display: flex;
      align-items: center;

      .search-icon {
        position: absolute;
        left: 0.85rem;
        font-size: 0.95rem;
        color: #94a3b8;
        pointer-events: none;
      }

      .patient-search-field {
        padding-left: 2.35rem;
        padding-right: 2.2rem;
        font-weight: 500;
        height: 42px;
        border: 1.5px solid #cbd5e1;
        border-radius: 8px;
        transition: all 0.2s ease;

        &:focus {
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }
      }

      .clear-btn {
        position: absolute;
        right: 0.65rem;
        background: none;
        border: none;
        font-size: 1.1rem;
        color: #94a3b8;
        cursor: pointer;
        padding: 0.2rem;
        border-radius: 50%;

        &:hover {
          color: #ef4444;
        }
      }
    }

    .patient-dropdown-select {
      height: 42px;
      border: 1.5px solid #cbd5e1;
      border-radius: 8px;
      font-weight: 500;
    }

    /* Floating Suggestions Dropdown */
    .suggestions-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 1050;
      background: white;
      border: 1.5px solid #0284c7;
      border-radius: 10px;
      margin-top: 0.35rem;
      box-shadow: 0 10px 25px rgba(15, 23, 42, 0.15);
      overflow: hidden;
    }

    .suggestions-count {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.45rem 0.85rem;
      background: #f0f9ff;
      border-bottom: 1px solid #e0f2fe;
      font-size: 0.72rem;
      font-weight: 700;
      color: #0369a1;

      .close-sugg-link {
        background: none;
        border: none;
        color: #64748b;
        font-size: 0.72rem;
        font-weight: 700;
        cursor: pointer;

        &:hover {
          color: #0f172a;
        }
      }
    }

    .suggestions-scroll {
      max-height: 240px;
      overflow-y: auto;
    }

    .suggestion-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.65rem 0.85rem;
      border-bottom: 1px solid #f1f5f9;
      cursor: pointer;
      transition: background 0.15s ease;

      &:last-child {
        border-bottom: none;
      }

      &:hover, &.active-row {
        background: #f8fafc;
      }

      &.active-row {
        border-left: 3px solid #0284c7;
      }
    }

    .sugg-avatar {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: #e0f2fe;
      color: #0369a1;
      font-size: 0.75rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .sugg-content {
      flex: 1;

      .sugg-name {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        font-size: 0.88rem;
        color: #0f172a;

        .badge-mrn {
          font-size: 0.68rem;
          font-weight: 700;
          color: #475569;
          background: #f1f5f9;
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          font-family: monospace;
        }

        .badge-blood {
          font-size: 0.68rem;
          font-weight: 800;
          color: #be123c;
          background: #ffe4e6;
          padding: 0.15rem 0.35rem;
          border-radius: 4px;
        }
      }

      .sugg-sub {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        font-size: 0.75rem;
        color: #64748b;
        margin-top: 0.15rem;

        .sugg-allergy {
          color: #b91c1c;
          font-weight: 600;
        }
      }
    }

    /* Selected Patient Bar */
    .selected-patient-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      padding: 0.85rem 1.15rem;
      gap: 1rem;

      .sp-left {
        display: flex;
        align-items: center;
        gap: 0.85rem;
      }

      .sp-avatar {
        width: 44px;
        height: 44px;
        border-radius: 10px;
        background: linear-gradient(135deg, #0284c7, #0369a1);
        color: white;
        font-size: 0.95rem;
        font-weight: 800;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      .sp-name-row {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;

        .sp-title {
          font-size: 1rem;
          font-weight: 800;
          color: #0f172a;
        }

        .sp-badge-mrn {
          font-size: 0.72rem;
          font-weight: 700;
          background: #e2e8f0;
          color: #334155;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
          font-family: monospace;
        }

        .sp-badge-gender {
          font-size: 0.72rem;
          color: #475569;
          font-weight: 600;
        }

        .sp-badge-blood {
          font-size: 0.72rem;
          font-weight: 800;
          color: #be123c;
          background: #ffe4e6;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }
      }

      .sp-meta-row {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 0.78rem;
        color: #64748b;
        margin-top: 0.25rem;
        flex-wrap: wrap;

        .sp-meta-item {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
        }
      }
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
    }

    .formulary-chips {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem;
      margin-bottom: 1rem;
      background: #f8fafc;
      padding: 0.6rem;
      border-radius: 8px;
      border: 1px solid #e2e8f0;

      .chip-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: #475569;
        margin-right: 0.35rem;
      }

      .chip-btn {
        background: white;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 0.2rem 0.45rem;
        font-size: 0.7rem;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
          background: #e0f2fe;
          border-color: #0284c7;
          color: #0369a1;
        }
      }
    }

    .interaction-banner {
      background: #fff1f2;
      border: 2px solid #f43f5e;
      border-radius: 10px;
      padding: 1rem;
      margin-bottom: 1rem;
      animation: pulse 1.5s infinite alternate;

      .alert-head {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #9f1239;
        font-size: 0.9rem;
        margin-bottom: 0.5rem;
      }

      .warning-icon { font-size: 1.25rem; }

      .severity-pill {
        display: inline-block;
        padding: 0.2rem 0.5rem;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 800;
        letter-spacing: 0.05em;
        margin-bottom: 0.35rem;

        &.sev-high {
          background: #e11d48;
          color: white;
        }
        &.sev-moderate {
          background: #f59e0b;
          color: white;
        }
      }

      .interaction-desc {
        font-size: 0.85rem;
        color: #1e293b;
      }

      .interaction-details {
        font-size: 0.8rem;
        color: #475569;
        margin: 0.25rem 0 0.5rem;
      }

      .clinical-rec {
        background: white;
        border: 1px solid #fecdd3;
        border-radius: 6px;
        padding: 0.4rem 0.6rem;
        font-size: 0.75rem;
        color: #881337;
        font-weight: 600;
      }
    }

    @keyframes pulse {
      from { box-shadow: 0 0 0 rgba(244, 63, 94, 0); }
      to { box-shadow: 0 0 10px rgba(244, 63, 94, 0.4); }
    }

    .form-row { display: flex; gap: 1rem; }
    .col { flex: 1; }
    .col-2 { flex: 2; }
    .text-sub { font-size: 0.75rem; color: #64748b; }
    .mt-3 { margin-top: 0.75rem; }

    @media (max-width: 768px) {
      .medications-page {
        padding: 1rem;
      }
      .page-header {
        flex-direction: column;
        align-items: stretch;
        gap: 0.85rem;

        .btn {
          width: 100%;
        }
      }
      .toolbar-flex {
        flex-direction: column;
        align-items: stretch;
        gap: 1rem;
      }
    }

    @media (max-width: 640px) {
      .medications-page {
        padding: 0.75rem;
      }
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class MedicationsComponent implements OnInit {
  patients: Patient[] = [];
  selectedPatientId = 1;
  selectedPatient: Patient | null = null;
  patientSearchText = '';
  showSuggestions = false;
  filteredPatients: Patient[] = [];

  activeOnly = false;
  prescriptions: Prescription[] = [];

  showPrescribeModal = false;
  submittingRx = false;
  interactionAlerts: InteractionCheckResult[] = [];

  newRx: Prescription = {
    patientId: 1,
    medicationName: '',
    rxNormCode: '',
    dosage: '10 mg',
    frequency: 'Once daily (QD)',
    route: 'Oral',
    durationDays: 30,
    instructions: 'Take 1 tablet daily with water',
    refills: 2,
    status: 'ACTIVE'
  };

  prescriptionToDiscontinue: Prescription | null = null;
  discontinueReason = 'Course completed';

  formularySuggestions = [
    'Spironolactone',
    'Warfarin',
    'Aspirin',
    'Lisinopril',
    'Atorvastatin',
    'Metformin',
    'Omeprazole',
    'Clopidogrel',
    'Amiodarone'
  ];

  constructor(
    private ehrService: EhrService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.ehrService.getPatients().subscribe({
      next: (data) => {
        this.patients = data;
        this.filteredPatients = [...data];
        const paramId = Number(this.route.snapshot.queryParamMap.get('patientId'));
        if (paramId) {
          const match = data.find(p => p.id === paramId);
          if (match) {
            this.selectedPatientId = match.id!;
            this.selectedPatient = match;
            this.patientSearchText = `${match.firstName} ${match.lastName} (${match.mrn})`;
          } else {
            this.selectedPatientId = paramId;
          }
          this.newRx.patientId = paramId;
          this.openPrescribeModal();
        } else if (data.length > 0) {
          this.selectedPatientId = data[0].id!;
          this.selectedPatient = data[0];
          this.patientSearchText = `${data[0].firstName} ${data[0].lastName} (${data[0].mrn})`;
          this.newRx.patientId = data[0].id!;
        }
        this.loadPrescriptions();
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load patients', err);
        this.cdr.markForCheck();
      }
    });
  }

  onSearchInput(): void {
    const q = this.patientSearchText.trim().toLowerCase();
    if (!q) {
      this.filteredPatients = [...this.patients];
    } else {
      this.filteredPatients = this.patients.filter(p =>
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(q) ||
        (p.mrn && p.mrn.toLowerCase().includes(q)) ||
        (p.phone && p.phone.includes(q)) ||
        (p.bloodGroup && p.bloodGroup.toLowerCase().includes(q))
      );
    }
    this.showSuggestions = true;
    this.cdr.markForCheck();
  }

  openSuggestions(): void {
    if (!this.patientSearchText.trim()) {
      this.filteredPatients = [...this.patients];
    } else {
      this.onSearchInput();
    }
    this.showSuggestions = true;
    this.cdr.markForCheck();
  }

  clearSearch(): void {
    this.patientSearchText = '';
    this.filteredPatients = [...this.patients];
    this.showSuggestions = false;
    this.cdr.markForCheck();
  }

  selectPatientFromSuggestion(patient: Patient): void {
    if (!patient.id) return;
    this.selectedPatientId = patient.id;
    this.selectedPatient = patient;
    this.patientSearchText = `${patient.firstName} ${patient.lastName} (${patient.mrn})`;
    this.showSuggestions = false;
    this.newRx.patientId = patient.id;
    this.loadPrescriptions();
    this.cdr.markForCheck();
  }

  onPatientSelectChange(): void {
    const found = this.patients.find(p => p.id === this.selectedPatientId);
    if (found) {
      this.selectedPatient = found;
      this.patientSearchText = `${found.firstName} ${found.lastName} (${found.mrn})`;
    }
    this.newRx.patientId = this.selectedPatientId;
    this.loadPrescriptions();
    this.cdr.markForCheck();
  }

  getPatientInitials(patient?: Patient | null): string {
    if (!patient) return 'PT';
    const f = patient.firstName?.charAt(0) || '';
    const l = patient.lastName?.charAt(0) || '';
    return (f + l).toUpperCase() || 'PT';
  }

  loadPrescriptions(): void {
    if (!this.selectedPatientId) return;
    this.ehrService.getPrescriptionsByPatient(this.selectedPatientId, this.activeOnly).subscribe({
      next: (data) => {
        this.prescriptions = data;
        this.cdr.markForCheck();
      },
      error: (e) => {
        console.error(e);
        this.cdr.markForCheck();
      }
    });
  }

  onPatientChanged(): void {
    this.onPatientSelectChange();
  }

  onPrescribePatientSelected(): void {
    this.checkLiveInteraction();
  }

  selectFormulary(drug: string): void {
    this.newRx.medicationName = drug;
    this.checkLiveInteraction();
  }

  checkLiveInteraction(): void {
    if (!this.newRx.patientId || !this.newRx.medicationName || this.newRx.medicationName.trim().length < 3) {
      this.interactionAlerts = [];
      return;
    }

    this.ehrService.checkInteractions(this.newRx.patientId, this.newRx.medicationName.trim()).subscribe({
      next: (alerts) => {
        this.interactionAlerts = alerts;
      },
      error: (err) => console.error(err)
    });
  }

  openPrescribeModal(): void {
    this.newRx.patientId = this.selectedPatientId;
    this.interactionAlerts = [];
    this.showPrescribeModal = true;
    this.cdr.markForCheck();
  }

  closePrescribeModal(): void {
    this.showPrescribeModal = false;
    this.submittingRx = false;
    this.cdr.markForCheck();
  }

  submitPrescription(): void {
    if (!this.newRx.patientId || !this.newRx.medicationName || !this.newRx.dosage) {
      this.toastService.warning('Validation Warning', 'Please complete all required medication fields.');
      return;
    }

    if (this.interactionAlerts.length > 0) {
      const confirmProceed = confirm(
        '⚠️ HIGH CLINICAL SAFETY WARNING!\n\nA drug-drug interaction was identified for this patient. Do you acknowledge this risk and want to proceed with clinical override?'
      );
      if (!confirmProceed) return;
    }

    this.submittingRx = true;
    this.cdr.markForCheck();

    this.ehrService.prescribe(this.newRx).subscribe({
      next: (prescribed) => {
        this.submittingRx = false;
        this.prescriptions.unshift(prescribed);
        this.closePrescribeModal();
        this.toastService.success(
          'E-Prescription Authorized',
          `${prescribed.medicationName} (${prescribed.dosage}) successfully transmitted to pharmacy.`
        );
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.submittingRx = false;
        this.toastService.error('Prescription Failed', err.error?.message || err.message);
        this.cdr.markForCheck();
      }
    });
  }

  openDiscontinueModal(rx: Prescription): void {
    this.prescriptionToDiscontinue = rx;
    this.cdr.markForCheck();
  }

  confirmDiscontinue(): void {
    if (!this.prescriptionToDiscontinue?.id) return;

    this.ehrService.discontinuePrescription(this.prescriptionToDiscontinue.id, this.discontinueReason).subscribe({
      next: (updated) => {
        const idx = this.prescriptions.findIndex(p => p.id === updated.id);
        if (idx >= 0) this.prescriptions[idx] = updated;
        const medName = this.prescriptionToDiscontinue?.medicationName || 'Medication';
        this.prescriptionToDiscontinue = null;
        this.toastService.info('Medication Discontinued', `${medName} marked as DISCONTINUED.`);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.toastService.error('Discontinue Failed', err.message);
        this.cdr.markForCheck();
      }
    });
  }
}

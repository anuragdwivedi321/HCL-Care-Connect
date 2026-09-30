import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EhrService } from '../../services/ehr.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ClinicalEncounter, Patient } from '../../models/ehr.models';

@Component({
  selector: 'app-clinical-notes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="clinical-notes-page">
      <div class="page-header">
        <div>
          <h2>Clinical Documentation & SOAP Notes</h2>
          <p class="subtitle">Structured healthcare documentation compliant with HL7/FHIR encounter standards.</p>
        </div>
      </div>

      <div class="layout-grid">
        <!-- Documentation Editor Form -->
        <div class="editor-col card">
          <div class="editor-header">
            <h3><span>✍️</span> Document Clinical Encounter</h3>
            <span class="badge badge-teal">SOAP Standard</span>
          </div>

          <form (ngSubmit)="submitNote()">
            <!-- Patient Selector -->
            <div class="form-row">
              <div class="form-group col-2">
                <label>Select Patient *</label>
                <select [(ngModel)]="newEncounter.patientId" name="patientId" required class="form-control" (change)="onPatientSelected()">
                  <option [ngValue]="0" disabled>-- Choose Patient from Master Index --</option>
                  <option *ngFor="let p of patients" [ngValue]="p.id">
                    {{ p.firstName }} {{ p.lastName }} ({{ p.mrn }})
                  </option>
                </select>
              </div>

              <div class="form-group col">
                <label>Encounter Setting *</label>
                <select [(ngModel)]="newEncounter.encounterType" name="encounterType" required class="form-control">
                  <option value="OUTPATIENT">Outpatient Clinic</option>
                  <option value="INPATIENT">Inpatient Round</option>
                  <option value="EMERGENCY">Emergency Dept (ED)</option>
                  <option value="TELEHEALTH">Telehealth Consult</option>
                </select>
              </div>
            </div>

            <!-- Active Patient Context Pill -->
            <div *ngIf="selectedPatient" class="patient-context-pill">
              <div class="pill-info">
                <strong>{{ selectedPatient.firstName }} {{ selectedPatient.lastName }}</strong>
                <span>MRN: {{ selectedPatient.mrn }}</span> •
                <span>Allergies: <span class="text-danger">{{ selectedPatient.allergies || 'NKDA' }}</span></span>
              </div>
              <a [routerLink]="['/patients', selectedPatient.id]" target="_blank" class="btn btn-secondary btn-sm">
                View Past Chart
              </a>
            </div>

            <!-- Chief Complaint -->
            <div class="form-group">
              <label>Chief Complaint (CC) *</label>
              <input
                type="text"
                [(ngModel)]="newEncounter.chiefComplaint"
                name="chiefComplaint"
                required
                class="form-control"
                placeholder="e.g. Acute onset right-sided chest discomfort and shortness of breath"
              />
            </div>

            <!-- SOAP Form Blocks -->
            <div class="soap-sections">
              <!-- S -->
              <div class="soap-block block-s">
                <div class="soap-tag">S • SUBJECTIVE</div>
                <div class="soap-desc">Patient's narrative, History of Present Illness (HPI), pain scale, review of systems</div>
                <textarea
                  [(ngModel)]="newEncounter.soapSubjective"
                  name="soapSubjective"
                  rows="3"
                  class="form-control"
                  placeholder="Patient reports symptoms began 3 days ago. Mild exertional dyspnea..."
                ></textarea>
              </div>

              <!-- O -->
              <div class="soap-block block-o">
                <div class="soap-tag">O • OBJECTIVE</div>
                <div class="soap-desc">Observed vital signs, physical exam (CVS, RS, Abdomen, Neuro), diagnostic findings</div>
                <textarea
                  [(ngModel)]="newEncounter.soapObjective"
                  name="soapObjective"
                  rows="3"
                  class="form-control"
                  placeholder="BP 130/84 mmHg, HR 76 regular, Temp 37.0°C. S1/S2 distinct without murmurs..."
                ></textarea>
              </div>

              <!-- A -->
              <div class="soap-block block-a">
                <div class="soap-tag">A • ASSESSMENT & ICD-10</div>
                <div class="soap-desc">Clinical impressions, working diagnoses, differential diagnoses</div>
                <textarea
                  [(ngModel)]="newEncounter.soapAssessment"
                  name="soapAssessment"
                  rows="3"
                  class="form-control"
                  placeholder="1. Essential Hypertension (I10) - controlled. 2. Atypical chest pain, low cardiac risk..."
                ></textarea>
                
                <!-- ICD-10 Quick Taggers -->
                <div class="icd-helper">
                  <span class="icd-label">Quick ICD-10 Tags:</span>
                  <button type="button" (click)="addIcdTag('I10 (Essential Hypertension)')" class="icd-chip">+ I10 Hypertension</button>
                  <button type="button" (click)="addIcdTag('E11.9 (Type 2 Diabetes)')" class="icd-chip">+ E11.9 T2DM</button>
                  <button type="button" (click)="addIcdTag('E78.5 (Dyslipidemia)')" class="icd-chip">+ E78.5 Dyslipidemia</button>
                  <button type="button" (click)="addIcdTag('J06.9 (Acute URI)')" class="icd-chip">+ J06.9 URI</button>
                  <button type="button" (click)="addIcdTag('I25.10 (CAD)')" class="icd-chip">+ I25.10 CAD</button>
                </div>
                <input
                  type="text"
                  [(ngModel)]="newEncounter.icd10Codes"
                  name="icd10Codes"
                  class="form-control mt-2"
                  placeholder="Selected ICD-10 Codes (e.g. I10, E78.5)"
                />
              </div>

              <!-- P -->
              <div class="soap-block block-p">
                <div class="soap-tag">P • PLAN</div>
                <div class="soap-desc">Therapeutic management, lab/imaging requisitions, patient instructions & follow-up</div>
                <textarea
                  [(ngModel)]="newEncounter.soapPlan"
                  name="soapPlan"
                  rows="3"
                  class="form-control"
                  placeholder="1. Order basic metabolic panel & lipid profile. 2. Continue Lisinopril 20mg QD. 3. Follow-up in 4 weeks."
                ></textarea>
              </div>
            </div>

            <!-- Signature & Submission -->
            <div class="form-footer">
              <label class="sign-checkbox" *ngIf="authService.isDoctor()">
                <input type="checkbox" [(ngModel)]="autoSign" name="autoSign" />
                <span>Digitally sign note upon saving (Lock as Attending Physician)</span>
              </label>

              <button type="submit" [disabled]="submitting" class="btn btn-primary">
                {{ submitting ? 'Saving...' : 'Save Clinical Note' }}
              </button>
            </div>
          </form>
        </div>

        <!-- Recent Notes Stream -->
        <div class="stream-col card">
          <h3>Recent Encounters ({{ recentNotes.length }})</h3>
          <p class="text-sub mb-3">Recently documented patient visits across providers.</p>

          <div class="notes-list" *ngIf="recentNotes.length > 0">
            <div *ngFor="let n of recentNotes" class="note-item">
              <div class="note-top">
                <span class="badge badge-primary">{{ n.encounterType }}</span>
                <span class="badge" [ngClass]="n.status === 'SIGNED' ? 'badge-success' : 'badge-warning'">{{ n.status }}</span>
                <small class="text-sub">{{ n.encounterDate | date:'short' }}</small>
              </div>
              <div class="note-patient">Patient #{{ n.patientId }}</div>
              <div class="note-complaint">{{ n.chiefComplaint }}</div>
              <div class="note-doctor" *ngIf="n.signedBy">Signed by: {{ n.signedBy }}</div>
            </div>
          </div>

          <div *ngIf="recentNotes.length === 0" class="empty-state">
            No clinical notes documented yet.
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .clinical-notes-page {
      max-width: 1400px;
      margin: 1.5rem auto;
      padding: 0 1.5rem;
    }

    .page-header {
      margin-bottom: 1.5rem;
      h2 { font-size: 1.6rem; }
      .subtitle { color: #64748b; font-size: 0.9rem; margin-top: 0.2rem; }
    }

    .layout-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.75rem;

      h3 { font-size: 1.2rem; display: flex; align-items: center; gap: 0.5rem; }
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .col { flex: 1; }
    .col-2 { flex: 2; }

    .patient-context-pill {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 8px;
      padding: 0.6rem 0.85rem;
      margin-bottom: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .pill-info {
        font-size: 0.85rem;
        color: #166534;
      }
    }

    .soap-sections {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .soap-block {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 0.85rem 1rem;
      background: #f8fafc;

      .soap-tag {
        font-size: 0.8rem;
        font-weight: 800;
        color: #0284c7;
      }

      .soap-desc {
        font-size: 0.7rem;
        color: #64748b;
        margin-bottom: 0.5rem;
      }

      &.block-s { border-left: 4px solid #0284c7; }
      &.block-o { border-left: 4px solid #0d9488; }
      &.block-a { border-left: 4px solid #f59e0b; }
      &.block-p { border-left: 4px solid #10b981; }
    }

    .icd-helper {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.4rem;
      margin-top: 0.5rem;

      .icd-label {
        font-size: 0.75rem;
        font-weight: 700;
        color: #64748b;
      }

      .icd-chip {
        background: white;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 0.2rem 0.5rem;
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

    .form-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
    }

    .sign-checkbox {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.85rem;
      font-weight: 600;
      color: #047857;
      cursor: pointer;
    }

    .notes-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .note-item {
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.75rem;
      background: #f8fafc;
    }

    .note-top {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.35rem;
    }

    .note-patient {
      font-size: 0.85rem;
      font-weight: 700;
      color: #0f172a;
    }

    .note-complaint {
      font-size: 0.8rem;
      color: #334155;
      margin-top: 0.2rem;
    }

    .note-doctor {
      font-size: 0.7rem;
      color: #047857;
      margin-top: 0.35rem;
      font-weight: 600;
    }

    .text-sub { font-size: 0.75rem; color: #64748b; }
    .mt-2 { margin-top: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }

    @media (max-width: 1024px) {
      .layout-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 640px) {
      .clinical-notes-page {
        padding: 0.75rem;
        margin: 0.75rem auto;
      }
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      .form-footer {
        flex-direction: column;
        gap: 1rem;
        align-items: stretch;

        .btn {
          width: 100%;
        }
      }
      .patient-context-pill {
        flex-direction: column;
        align-items: stretch;
        gap: 0.5rem;
      }
    }
  `]
})
export class ClinicalNotesComponent implements OnInit {
  patients: Patient[] = [];
  selectedPatient: Patient | null = null;
  recentNotes: ClinicalEncounter[] = [];
  submitting = false;
  autoSign = true;

  newEncounter: ClinicalEncounter = {
    patientId: 0,
    encounterType: 'OUTPATIENT',
    chiefComplaint: '',
    soapSubjective: '',
    soapObjective: '',
    soapAssessment: '',
    soapPlan: '',
    icd10Codes: '',
    status: 'COMPLETED'
  };

  constructor(
    private ehrService: EhrService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPatients();

    const paramPatientId = Number(this.route.snapshot.queryParamMap.get('patientId'));
    if (paramPatientId) {
      this.newEncounter.patientId = paramPatientId;
    }
  }

  loadPatients(): void {
    this.ehrService.getPatients().subscribe({
      next: (data) => {
        this.patients = data || [];
        if (this.newEncounter.patientId) {
          this.onPatientSelected();
        } else if (data.length > 0) {
          this.newEncounter.patientId = data[0].id!;
          this.onPatientSelected();
        }
        this.cdr.markForCheck();
      },
      error: (e) => {
        console.error(e);
        this.toastService.error('Error', 'Failed to load patient records');
        this.cdr.markForCheck();
      }
    });
  }

  onPatientSelected(): void {
    const p = this.patients.find(pt => pt.id === this.newEncounter.patientId);
    this.selectedPatient = p || null;

    if (this.newEncounter.patientId) {
      this.ehrService.getEncountersByPatient(this.newEncounter.patientId).subscribe({
        next: (notes) => {
          this.recentNotes = notes || [];
          this.cdr.markForCheck();
        },
        error: (e) => console.error(e)
      });
    }
    this.cdr.markForCheck();
  }

  addIcdTag(tag: string): void {
    if (!this.newEncounter.icd10Codes) {
      this.newEncounter.icd10Codes = tag;
    } else if (!this.newEncounter.icd10Codes.includes(tag)) {
      this.newEncounter.icd10Codes += ', ' + tag;
    }
    this.cdr.markForCheck();
  }

  submitNote(): void {
    if (!this.newEncounter.patientId || !this.newEncounter.chiefComplaint) {
      this.toastService.warning('Validation Warning', 'Please select a patient and state a chief complaint.');
      return;
    }

    this.submitting = true;
    this.cdr.markForCheck();

    this.ehrService.createEncounter(this.newEncounter).subscribe({
      next: (saved) => {
        if (this.autoSign && this.authService.isDoctor()) {
          this.ehrService.signEncounter(saved.id!).subscribe({
            next: (signed) => {
              this.submitting = false;
              this.recentNotes.unshift(signed);
              this.toastService.success(
                'SOAP Note Documented & Signed',
                `Encounter for ${this.selectedPatient?.firstName || 'Patient'} officially signed & locked.`
              );
              this.resetForm();
              this.cdr.markForCheck();
            },
            error: () => {
              this.submitting = false;
              this.recentNotes.unshift(saved);
              this.toastService.success('Clinical Note Saved', 'Encounter documented (unsigned).');
              this.resetForm();
              this.cdr.markForCheck();
            }
          });
        } else {
          this.submitting = false;
          this.recentNotes.unshift(saved);
          this.toastService.success('Clinical Note Saved', 'Encounter documented successfully.');
          this.resetForm();
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        this.submitting = false;
        this.toastService.error('Failed to document encounter', err.error?.message || err.message);
        this.cdr.markForCheck();
      }
    });
  }

  resetForm(): void {
    this.newEncounter.chiefComplaint = '';
    this.newEncounter.soapSubjective = '';
    this.newEncounter.soapObjective = '';
    this.newEncounter.soapAssessment = '';
    this.newEncounter.soapPlan = '';
    this.newEncounter.icd10Codes = '';
  }
}

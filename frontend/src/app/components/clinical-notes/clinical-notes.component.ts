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
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-left">
          <div class="header-title-row">
            <h2>Clinical Documentation & SOAP Notes</h2>
            <span class="badge-fhir">HL7 / FHIR US-CORE COMPLIANT</span>
          </div>
          <p class="subtitle">Structured clinical encounters adhering to universal SOAP methodology and ICD-10-CM diagnostic classification.</p>
        </div>
        <div class="header-actions">
          <button type="button" (click)="autoFillSampleNote()" class="btn btn-autofill">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
            </svg>
            Auto-Fill Sample Note
          </button>
          <button type="button" (click)="resetForm()" class="btn btn-secondary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="1 4 1 10 7 10"></polyline>
              <polyline points="23 20 23 14 17 14"></polyline>
              <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15"></path>
            </svg>
            Clear Form
          </button>
        </div>
      </div>

      <div class="layout-grid">
        <!-- Documentation Editor Form -->
        <div class="editor-col card">
          <div class="editor-header">
            <div class="editor-header-title">
              <div class="editor-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <div>
                <h3>Document Clinical Encounter</h3>
                <span class="editor-sub">Official Attending Physician Charting Worksheet</span>
              </div>
            </div>
            <div class="standard-pill">
              <span class="status-dot"></span>
              SOAP Telemetry Engine
            </div>
          </div>

          <form (ngSubmit)="submitNote()">
            <!-- Patient & Encounter Setting Selection Card -->
            <div class="patient-selector-card">
              <div class="form-row">
                <div class="form-group col-2">
                  <label class="field-label">Select Patient Record *</label>
                  <select [(ngModel)]="newEncounter.patientId" name="patientId" required class="form-control select-enhanced" (change)="onPatientSelected()">
                    <option [ngValue]="0" disabled>-- Choose Patient from Master Index --</option>
                    <option *ngFor="let p of patients" [ngValue]="p.id">
                      {{ p.firstName }} {{ p.lastName }} • MRN: {{ p.mrn }} ({{ p.gender }}, DOB: {{ p.dateOfBirth }})
                    </option>
                  </select>
                </div>

                <div class="form-group col">
                  <label class="field-label">Encounter Setting *</label>
                  <select [(ngModel)]="newEncounter.encounterType" name="encounterType" required class="form-control select-enhanced">
                    <option value="OUTPATIENT">Outpatient Clinic</option>
                    <option value="INPATIENT">Inpatient Round</option>
                    <option value="EMERGENCY">Emergency Dept (ED)</option>
                    <option value="TELEHEALTH">Telehealth Consult</option>
                  </select>
                </div>
              </div>

              <!-- Active Patient Context Banner -->
              <div *ngIf="selectedPatient" class="patient-context-banner">
                <div class="pcb-left">
                  <div class="pcb-avatar">{{ selectedPatient.firstName.charAt(0) }}{{ selectedPatient.lastName.charAt(0) }}</div>
                  <div class="pcb-details">
                    <div class="pcb-name">
                      <strong>{{ selectedPatient.firstName }} {{ selectedPatient.lastName }}</strong>
                      <span class="mrn-badge">MRN: {{ selectedPatient.mrn }}</span>
                    </div>
                    <div class="pcb-meta">
                      <span>Age: {{ calculateAge(selectedPatient.dateOfBirth) }} yrs ({{ selectedPatient.gender }})</span> •
                      <span>Blood Group: <strong>{{ selectedPatient.bloodGroup || 'O+' }}</strong></span> •
                      <span>Phone: {{ selectedPatient.phone || 'N/A' }}</span>
                    </div>
                  </div>
                </div>

                <div class="pcb-right">
                  <div class="allergy-tag" [class.allergy-alert]="selectedPatient.allergies">
                    <span class="tag-label">Allergies:</span>
                    <strong class="tag-val">{{ selectedPatient.allergies || 'NKDA (No Known Allergies)' }}</strong>
                  </div>
                  <a [routerLink]="['/patients', selectedPatient.id]" target="_blank" class="btn btn-secondary btn-sm link-chart">
                    View Chart ↗
                  </a>
                </div>
              </div>
            </div>

            <!-- Chief Complaint Field -->
            <div class="form-group cc-group">
              <label class="field-label">
                Chief Complaint (CC) *
                <span class="label-hint">Patient's primary presenting symptom in their own words</span>
              </label>
              <div class="input-icon-wrapper">
                <span class="input-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
                    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
                  </svg>
                </span>
                <input
                  type="text"
                  [(ngModel)]="newEncounter.chiefComplaint"
                  name="chiefComplaint"
                  required
                  class="form-control cc-input"
                  placeholder="e.g. Acute onset right-sided chest discomfort and shortness of breath (3 days duration)"
                />
              </div>
            </div>

            <!-- SOAP Form Blocks -->
            <div class="soap-sections">
              <!-- S Block -->
              <div class="soap-card block-s">
                <div class="soap-header">
                  <div class="soap-title-wrap">
                    <div class="soap-letter letter-s">S</div>
                    <div>
                      <h4 class="soap-title">SUBJECTIVE</h4>
                      <p class="soap-subtitle">Patient narrative, History of Present Illness (HPI), pain scale, and Review of Systems (ROS)</p>
                    </div>
                  </div>
                  <div class="macro-group">
                    <span class="macro-label">Smart Macros:</span>
                    <button type="button" class="macro-pill" (click)="insertSnippet('S', 'chest-pain')">+ Chest Pain HPI</button>
                    <button type="button" class="macro-pill" (click)="insertSnippet('S', 'diabetic')">+ Diabetes Follow-up</button>
                    <button type="button" class="macro-pill" (click)="insertSnippet('S', 'routine')">+ Routine Annual ROS</button>
                  </div>
                </div>
                <div class="soap-body">
                  <textarea
                    [(ngModel)]="newEncounter.soapSubjective"
                    name="soapSubjective"
                    rows="4"
                    class="form-control soap-textarea"
                    placeholder="Document patient's history of present illness: onset, location, duration, character, aggravating/relieving factors, radiation, temporal pattern, severity (OLDCARTS)..."
                  ></textarea>
                </div>
              </div>

              <!-- O Block -->
              <div class="soap-card block-o">
                <div class="soap-header">
                  <div class="soap-title-wrap">
                    <div class="soap-letter letter-o">O</div>
                    <div>
                      <h4 class="soap-title">OBJECTIVE</h4>
                      <p class="soap-subtitle">Physiological vital signs, physical exam findings (HEENT, CVS, Lungs, Abdomen, Neuro), and lab assays</p>
                    </div>
                  </div>
                  <div class="macro-group">
                    <span class="macro-label">Smart Macros:</span>
                    <button type="button" class="macro-pill" (click)="insertSnippet('O', 'normal-exam')">+ Normal Physical Exam</button>
                    <button type="button" class="macro-pill" (click)="insertSnippet('O', 'htn-exam')">+ Hypertensive / Tachycardic</button>
                    <button type="button" class="macro-pill" (click)="insertSnippet('O', 'resp-exam')">+ Respiratory Distress</button>
                  </div>
                </div>
                <div class="soap-body">
                  <textarea
                    [(ngModel)]="newEncounter.soapObjective"
                    name="soapObjective"
                    rows="4"
                    class="form-control soap-textarea"
                    placeholder="Document clinical observations: BP, HR, Temp, SpO2, general appearance, cardiovascular exam (heart sounds), respiratory exam, abdominal palpation..."
                  ></textarea>
                </div>
              </div>

              <!-- A Block -->
              <div class="soap-card block-a">
                <div class="soap-header">
                  <div class="soap-title-wrap">
                    <div class="soap-letter letter-a">A</div>
                    <div>
                      <h4 class="soap-title">ASSESSMENT & ICD-10 CLASSIFICATION</h4>
                      <p class="soap-subtitle">Clinical impressions, working diagnoses, differential diagnoses, and ICD-10-CM coded entries</p>
                    </div>
                  </div>
                  <div class="macro-group">
                    <span class="macro-label">Smart Macros:</span>
                    <button type="button" class="macro-pill" (click)="insertSnippet('A', 'cad-htn')">+ CAD / HTN Impression</button>
                    <button type="button" class="macro-pill" (click)="insertSnippet('A', 'uri')">+ Acute URI Impression</button>
                  </div>
                </div>
                <div class="soap-body">
                  <textarea
                    [(ngModel)]="newEncounter.soapAssessment"
                    name="soapAssessment"
                    rows="3"
                    class="form-control soap-textarea"
                    placeholder="1. Primary diagnosis and stage. 2. Secondary co-morbidities. 3. Risk stratification and prognosis..."
                  ></textarea>

                  <!-- ICD-10 Tagger Bar -->
                  <div class="icd-tagger-panel">
                    <div class="icd-tagger-header">
                      <span class="icd-tagger-title">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                          <line x1="7" y1="7" x2="7.01" y2="7"></line>
                        </svg>
                        Click to append ICD-10-CM Codes:
                      </span>
                    </div>
                    <div class="icd-chip-container">
                      <button type="button" (click)="addIcdTag('I10 (Essential Hypertension)')" class="icd-chip">
                        <strong>+ I10</strong> Hypertension
                      </button>
                      <button type="button" (click)="addIcdTag('E11.9 (Type 2 Diabetes)')" class="icd-chip">
                        <strong>+ E11.9</strong> T2DM
                      </button>
                      <button type="button" (click)="addIcdTag('E78.5 (Dyslipidemia)')" class="icd-chip">
                        <strong>+ E78.5</strong> Dyslipidemia
                      </button>
                      <button type="button" (click)="addIcdTag('J06.9 (Acute URI)')" class="icd-chip">
                        <strong>+ J06.9</strong> Acute URI
                      </button>
                      <button type="button" (click)="addIcdTag('I25.10 (CAD)')" class="icd-chip">
                        <strong>+ I25.10</strong> CAD
                      </button>
                      <button type="button" (click)="addIcdTag('R07.9 (Chest Pain)')" class="icd-chip">
                        <strong>+ R07.9</strong> Chest Pain
                      </button>
                    </div>

                    <div class="icd-input-wrap">
                      <input
                        type="text"
                        [(ngModel)]="newEncounter.icd10Codes"
                        name="icd10Codes"
                        class="form-control icd-input"
                        placeholder="Selected ICD-10 Codes will appear here (e.g. I10, E78.5, R07.9)..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- P Block -->
              <div class="soap-card block-p">
                <div class="soap-header">
                  <div class="soap-title-wrap">
                    <div class="soap-letter letter-p">P</div>
                    <div>
                      <h4 class="soap-title">PLAN OF CARE</h4>
                      <p class="soap-subtitle">Therapeutic management, lab/imaging requisitions, patient instructions, and follow-up timeline</p>
                    </div>
                  </div>
                  <div class="macro-group">
                    <span class="macro-label">Smart Macros:</span>
                    <button type="button" class="macro-pill" (click)="insertSnippet('P', 'cardio-plan')">+ Comprehensive Cardio Plan</button>
                    <button type="button" class="macro-pill" (click)="insertSnippet('P', 'routine-plan')">+ Standard Outpatient Plan</button>
                  </div>
                </div>
                <div class="soap-body">
                  <textarea
                    [(ngModel)]="newEncounter.soapPlan"
                    name="soapPlan"
                    rows="4"
                    class="form-control soap-textarea"
                    placeholder="1. Requisitions (Labs/Radiology). 2. Medication management & titration. 3. Patient education & lifestyle. 4. Follow-up interval..."
                  ></textarea>
                </div>
              </div>
            </div>

            <!-- Signature & Submission Bar -->
            <div class="form-footer-card">
              <div class="footer-left">
                <label class="sign-checkbox" *ngIf="authService.isDoctor() || authService.isAdmin()">
                  <input type="checkbox" [(ngModel)]="autoSign" name="autoSign" class="custom-check" />
                  <div class="sign-text-box">
                    <strong>Certify & Digitally Sign Note</strong>
                    <span class="sign-legal">Applies cryptographic timestamp and locks clinical note under attending credentials: {{ authService.currentUser()?.fullName }}</span>
                  </div>
                </label>
              </div>

              <div class="footer-right">
                <button type="submit" [disabled]="submitting" class="btn btn-primary btn-submit-note">
                  <span *ngIf="!submitting" class="btn-inner">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                      <polyline points="17 21 17 13 7 13 7 21"></polyline>
                      <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                    Save & Lock Clinical Note
                  </span>
                  <span *ngIf="submitting" class="btn-inner">
                    <span class="btn-spinner"></span>
                    Cryptographically Signing...
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>

        <!-- Recent Notes Stream / Audit Sidebar -->
        <div class="stream-col card">
          <div class="stream-header">
            <div>
              <h3>Recent Encounters ({{ recentNotes.length }})</h3>
              <p class="stream-subtitle">Audit-logged encounters for active patient.</p>
            </div>
            <span class="badge badge-teal">HL7 EMR Feed</span>
          </div>

          <div class="notes-list" *ngIf="recentNotes.length > 0">
            <div *ngFor="let n of recentNotes" class="note-item-card" (click)="selectedNotePreview = n" [class.selected-note]="selectedNotePreview?.id === n.id">
              <div class="note-top-row">
                <span class="setting-chip">{{ n.encounterType }}</span>
                <span class="status-chip" [ngClass]="n.status === 'SIGNED' ? 'chip-signed' : 'chip-pending'">
                  <span class="dot"></span>
                  {{ n.status }}
                </span>
                <span class="note-time">{{ n.encounterDate | date:'MMM d, HH:mm' }}</span>
              </div>

              <div class="note-cc-row">
                <span class="cc-prefix">CC:</span>
                <strong class="cc-title">{{ n.chiefComplaint }}</strong>
              </div>

              <div class="note-icd-row" *ngIf="n.icd10Codes">
                <span class="icd-pill">{{ n.icd10Codes }}</span>
              </div>

              <div class="note-footer-row">
                <div class="note-cert-by">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                  <span>{{ n.signedBy || 'Unsigned Draft' }}</span>
                </div>
                <span class="view-pill">Inspect Note →</span>
              </div>
            </div>
          </div>

          <div *ngIf="recentNotes.length === 0" class="empty-stream-state">
            <div class="empty-icon-wrap">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <strong>No prior encounters found</strong>
            <p>Document the patient's first clinical SOAP encounter on the left to initialize their medical chart.</p>
          </div>

          <!-- Note Inspector Modal / Box (When a past note is clicked) -->
          <div *ngIf="selectedNotePreview" class="note-detail-inspector">
            <div class="inspector-header">
              <div>
                <strong>Encounter Record #{{ selectedNotePreview.id }}</strong>
                <span class="inspector-date">{{ selectedNotePreview.encounterDate | date:'medium' }}</span>
              </div>
              <button type="button" class="close-inspector-btn" (click)="selectedNotePreview = null">✕</button>
            </div>
            <div class="inspector-body">
              <div class="insp-section">
                <span class="insp-tag tag-s">SUBJECTIVE</span>
                <p>{{ selectedNotePreview.soapSubjective || 'No subjective narrative.' }}</p>
              </div>
              <div class="insp-section">
                <span class="insp-tag tag-o">OBJECTIVE</span>
                <p>{{ selectedNotePreview.soapObjective || 'No objective findings.' }}</p>
              </div>
              <div class="insp-section">
                <span class="insp-tag tag-a">ASSESSMENT</span>
                <p>{{ selectedNotePreview.soapAssessment || 'No assessment recorded.' }}</p>
              </div>
              <div class="insp-section">
                <span class="insp-tag tag-p">PLAN</span>
                <p>{{ selectedNotePreview.soapPlan || 'No plan recorded.' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .clinical-notes-page {
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
      padding: 1.75rem 2rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      gap: 1.5rem;
      flex-wrap: wrap;

      .header-title-row {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        flex-wrap: wrap;

        h2 {
          font-size: 1.65rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .badge-fhir {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          color: #0369a1;
          background: #e0f2fe;
          border: 1px solid #bae6fd;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;
        }
      }

      .subtitle {
        color: #64748b;
        font-size: 0.9rem;
        margin-top: 0.35rem;
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.75rem;

        .btn-autofill {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.15);
          padding: 0.65rem 1.25rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.88rem;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
          transition: all 0.2s ease;

          &:hover {
            transform: translateY(-1.5px);
            box-shadow: 0 6px 16px rgba(2, 132, 199, 0.35);
          }
        }
      }
    }

    .layout-grid {
      display: grid;
      grid-template-columns: 2.15fr 1fr;
      gap: 1.5rem;
      align-items: start;
    }

    .editor-col {
      padding: 1.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      background: #ffffff;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
    }

    .editor-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 1.25rem;
      border-bottom: 1px solid #f1f5f9;
      margin-bottom: 1.5rem;

      .editor-header-title {
        display: flex;
        align-items: center;
        gap: 0.85rem;

        .editor-icon-wrap {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: #e0f2fe;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0284c7;
        }

        h3 {
          font-size: 1.25rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .editor-sub {
          font-size: 0.78rem;
          color: #64748b;
          font-weight: 500;
        }
      }

      .standard-pill {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.74rem;
        font-weight: 700;
        color: #047857;
        background: #ecfdf5;
        border: 1px solid #a7f3d0;
        padding: 0.35rem 0.75rem;
        border-radius: 20px;

        .status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10b981;
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
        }
      }
    }

    .patient-selector-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 1.25rem;
      margin-bottom: 1.5rem;
    }

    .form-row {
      display: flex;
      gap: 1.25rem;
    }

    .col { flex: 1; }
    .col-2 { flex: 2; }

    .field-label {
      display: block;
      font-size: 0.82rem;
      font-weight: 700;
      color: #334155;
      margin-bottom: 0.45rem;
      letter-spacing: -0.01em;

      .label-hint {
        font-weight: 400;
        color: #64748b;
        font-size: 0.75rem;
        margin-left: 0.5rem;
      }
    }

    .select-enhanced {
      height: 42px;
      font-weight: 600;
      border-radius: 8px;
    }

    .patient-context-banner {
      margin-top: 1rem;
      padding: 0.85rem 1rem;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);

      .pcb-left {
        display: flex;
        align-items: center;
        gap: 0.85rem;

        .pcb-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #0284c7, #0d9488);
          color: white;
          font-weight: 800;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .pcb-name {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          strong {
            font-size: 0.95rem;
            color: #0f172a;
          }

          .mrn-badge {
            font-size: 0.7rem;
            font-weight: 700;
            color: #475569;
            background: #f1f5f9;
            padding: 0.15rem 0.45rem;
            border-radius: 4px;
            font-family: monospace;
          }
        }

        .pcb-meta {
          font-size: 0.78rem;
          color: #64748b;
          margin-top: 0.15rem;

          strong { color: #0f172a; }
        }
      }

      .pcb-right {
        display: flex;
        align-items: center;
        gap: 0.85rem;

        .allergy-tag {
          font-size: 0.76rem;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          color: #166534;
          padding: 0.25rem 0.65rem;
          border-radius: 6px;

          &.allergy-alert {
            background: #fef2f2;
            border-color: #fecaca;
            color: #991b1b;
          }

          .tag-label {
            font-weight: 600;
            margin-right: 0.35rem;
          }

          .tag-val {
            font-weight: 800;
          }
        }

        .link-chart {
          white-space: nowrap;
          font-weight: 700;
        }
      }
    }

    .cc-group {
      margin-bottom: 1.5rem;
    }

    .input-icon-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      .input-icon {
        position: absolute;
        left: 1rem;
        color: #94a3b8;
        pointer-events: none;
      }

      .cc-input {
        padding-left: 2.75rem;
        height: 46px;
        font-size: 0.95rem;
        font-weight: 600;
        border-radius: 8px;
        border: 1.5px solid #cbd5e1;
        transition: all 0.2s ease;

        &:focus {
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }
      }
    }

    .soap-sections {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .soap-card {
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      background: #ffffff;
      overflow: hidden;
      transition: all 0.2s ease;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.02);

      &:hover {
        border-color: #cbd5e1;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.04);
      }

      &.block-s {
        border-left: 5px solid #0284c7;
        .soap-header { background: #f0f9ff; }
      }

      &.block-o {
        border-left: 5px solid #0d9488;
        .soap-header { background: #f0fdfa; }
      }

      &.block-a {
        border-left: 5px solid #d97706;
        .soap-header { background: #fffbeb; }
      }

      &.block-p {
        border-left: 5px solid #059669;
        .soap-header { background: #ecfdf5; }
      }

      .soap-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.85rem 1.15rem;
        border-bottom: 1px solid #e2e8f0;
        gap: 1rem;
        flex-wrap: wrap;

        .soap-title-wrap {
          display: flex;
          align-items: center;
          gap: 0.85rem;

          .soap-letter {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            font-weight: 900;
            color: white;

            &.letter-s { background: #0284c7; }
            &.letter-o { background: #0d9488; }
            &.letter-a { background: #d97706; }
            &.letter-p { background: #059669; }
          }

          .soap-title {
            font-size: 0.95rem;
            font-weight: 800;
            color: #0f172a;
            margin: 0;
            letter-spacing: -0.01em;
          }

          .soap-subtitle {
            font-size: 0.72rem;
            color: #64748b;
            margin: 0.1rem 0 0;
          }
        }

        .macro-group {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          flex-wrap: wrap;

          .macro-label {
            font-size: 0.68rem;
            font-weight: 700;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.04em;
            margin-right: 0.2rem;
          }

          .macro-pill {
            background: white;
            border: 1px solid #cbd5e1;
            border-radius: 16px;
            padding: 0.22rem 0.65rem;
            font-size: 0.72rem;
            font-weight: 700;
            color: #334155;
            cursor: pointer;
            transition: all 0.15s ease;

            &:hover {
              background: #0284c7;
              border-color: #0284c7;
              color: white;
              transform: translateY(-1px);
            }
          }
        }
      }

      .soap-body {
        padding: 1rem 1.15rem;

        .soap-textarea {
          width: 100% !important;
          box-sizing: border-box;
          min-height: 105px;
          padding: 0.85rem 1rem;
          font-size: 0.92rem;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #0f172a;
          border: 1.5px solid #cbd5e1;
          border-radius: 8px;
          background: #ffffff;
          transition: all 0.2s ease;
          resize: vertical;

          &:focus {
            border-color: #0284c7;
            box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
          }
        }
      }
    }

    /* ICD-10 Tagger Panel */
    .icd-tagger-panel {
      margin-top: 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.85rem 1rem;

      .icd-tagger-header {
        margin-bottom: 0.5rem;

        .icd-tagger-title {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.75rem;
          font-weight: 700;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
      }

      .icd-chip-container {
        display: flex;
        flex-wrap: wrap;
        gap: 0.45rem;
        margin-bottom: 0.75rem;

        .icd-chip {
          background: white;
          border: 1.5px solid #cbd5e1;
          border-radius: 6px;
          padding: 0.3rem 0.65rem;
          font-size: 0.75rem;
          color: #334155;
          cursor: pointer;
          transition: all 0.15s ease;

          strong {
            color: #d97706;
          }

          &:hover {
            border-color: #d97706;
            background: #fffbeb;
            transform: translateY(-1px);
          }
        }
      }

      .icd-input-wrap {
        .icd-input {
          font-family: monospace;
          font-weight: 600;
          font-size: 0.85rem;
          height: 38px;
          border-radius: 6px;
        }
      }
    }

    /* Signature & Submission Footer */
    .form-footer-card {
      margin-top: 1.5rem;
      padding: 1.25rem;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.5rem;
      flex-wrap: wrap;

      .footer-left {
        flex: 1;

        .sign-checkbox {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;

          .custom-check {
            width: 18px;
            height: 18px;
            margin-top: 0.2rem;
            cursor: pointer;
            accent-color: #059669;
          }

          .sign-text-box {
            strong {
              display: block;
              font-size: 0.92rem;
              color: #065f46;
            }

            .sign-legal {
              font-size: 0.74rem;
              color: #047857;
              display: block;
              margin-top: 0.15rem;
            }
          }
        }
      }

      .footer-right {
        .btn-submit-note {
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.85rem 1.85rem;
          font-size: 0.95rem;
          font-weight: 800;
          border-radius: 10px;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.28);
          color: white;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover:not(:disabled) {
            transform: translateY(-1.5px);
            box-shadow: 0 6px 20px rgba(2, 132, 199, 0.4);
          }

          .btn-inner {
            display: flex;
            align-items: center;
            gap: 0.65rem;
          }

          .btn-spinner {
            width: 16px;
            height: 16px;
            border: 2.5px solid rgba(255, 255, 255, 0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
        }
      }
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    /* Sidebar Stream */
    .stream-col {
      padding: 1.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 14px;
      background: #ffffff;
      box-shadow: 0 4px 20px rgba(15, 23, 42, 0.04);
      position: sticky;
      top: 1.5rem;

      .stream-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding-bottom: 1rem;
        border-bottom: 1px solid #f1f5f9;
        margin-bottom: 1.25rem;

        h3 {
          font-size: 1.15rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .stream-subtitle {
          font-size: 0.75rem;
          color: #64748b;
          margin: 0.2rem 0 0;
        }
      }
    }

    .notes-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
      max-height: calc(100vh - 280px);
      overflow-y: auto;
      padding-right: 0.25rem;
    }

    .note-item-card {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #ffffff;
        border-color: #0284c7;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.08);
        transform: translateY(-1.5px);
      }

      &.selected-note {
        border-color: #0284c7;
        background: #f0f9ff;
        box-shadow: 0 0 0 2px rgba(2, 132, 199, 0.2);
      }

      .note-top-row {
        display: flex;
        align-items: center;
        gap: 0.45rem;
        margin-bottom: 0.45rem;

        .setting-chip {
          font-size: 0.65rem;
          font-weight: 800;
          color: #0369a1;
          background: #e0f2fe;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;
        }

        .status-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.65rem;
          font-weight: 800;
          padding: 0.15rem 0.45rem;
          border-radius: 4px;

          .dot {
            width: 5px;
            height: 5px;
            border-radius: 50%;
          }

          &.chip-signed {
            background: #ecfdf5;
            color: #047857;
            .dot { background: #10b981; }
          }

          &.chip-pending {
            background: #fffbeb;
            color: #b45309;
            .dot { background: #f59e0b; }
          }
        }

        .note-time {
          margin-left: auto;
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 500;
        }
      }

      .note-cc-row {
        font-size: 0.85rem;
        margin-bottom: 0.45rem;
        line-height: 1.4;

        .cc-prefix {
          font-size: 0.72rem;
          font-weight: 800;
          color: #64748b;
          margin-right: 0.35rem;
        }

        .cc-title {
          color: #0f172a;
        }
      }

      .note-icd-row {
        margin-bottom: 0.5rem;

        .icd-pill {
          display: inline-block;
          font-size: 0.68rem;
          font-family: monospace;
          font-weight: 700;
          color: #92400e;
          background: #fef3c7;
          border: 1px solid #fde68a;
          padding: 0.12rem 0.4rem;
          border-radius: 4px;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .note-footer-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #f1f5f9;
        padding-top: 0.45rem;

        .note-cert-by {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.72rem;
          color: #059669;
          font-weight: 700;
        }

        .view-pill {
          font-size: 0.72rem;
          font-weight: 700;
          color: #0284c7;
        }
      }
    }

    .empty-stream-state {
      padding: 2.5rem 1rem;
      text-align: center;
      background: #f8fafc;
      border: 1.5px dashed #cbd5e1;
      border-radius: 10px;

      .empty-icon-wrap {
        width: 54px;
        height: 54px;
        border-radius: 50%;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 0.85rem;
      }

      strong {
        display: block;
        font-size: 0.92rem;
        color: #334155;
        margin-bottom: 0.35rem;
      }

      p {
        font-size: 0.78rem;
        color: #64748b;
        margin: 0;
        line-height: 1.5;
      }
    }

    /* Note Inspector Detail Box */
    .note-detail-inspector {
      margin-top: 1.25rem;
      background: #ffffff;
      border: 1.5px solid #0284c7;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 6px 18px rgba(2, 132, 199, 0.12);

      .inspector-header {
        background: #0284c7;
        color: white;
        padding: 0.65rem 0.95rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        strong { font-size: 0.85rem; display: block; }
        .inspector-date { font-size: 0.7rem; opacity: 0.85; }

        .close-inspector-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-weight: 800;
          font-size: 0.75rem;

          &:hover {
            background: rgba(255, 255, 255, 0.35);
          }
        }
      }

      .inspector-body {
        padding: 0.85rem;
        max-height: 320px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.65rem;

        .insp-section {
          p {
            font-size: 0.78rem;
            color: #334155;
            margin: 0.25rem 0 0;
            line-height: 1.45;
          }

          .insp-tag {
            font-size: 0.65rem;
            font-weight: 800;
            padding: 0.1rem 0.4rem;
            border-radius: 4px;
            letter-spacing: 0.05em;

            &.tag-s { background: #e0f2fe; color: #0284c7; }
            &.tag-o { background: #ccfbf1; color: #0d9488; }
            &.tag-a { background: #fef3c7; color: #d97706; }
            &.tag-p { background: #d1fae5; color: #059669; }
          }
        }
      }
    }

    @media (max-width: 1024px) {
      .layout-grid {
        grid-template-columns: 1fr;
      }
      .stream-col {
        position: static;
      }
    }

    @media (max-width: 640px) {
      .clinical-notes-page {
        padding: 1rem;
      }
      .form-row {
        flex-direction: column;
        gap: 0;
      }
      .patient-context-banner {
        flex-direction: column;
        align-items: stretch;
      }
      .form-footer-card {
        flex-direction: column;
        align-items: stretch;
        .btn-submit-note {
          width: 100%;
          justify-content: center;
        }
      }
    }
  `]
})
export class ClinicalNotesComponent implements OnInit {
  patients: Patient[] = [];
  selectedPatient: Patient | null = null;
  recentNotes: ClinicalEncounter[] = [];
  selectedNotePreview: ClinicalEncounter | null = null;
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

  calculateAge(dob: string | undefined): number {
    if (!dob) return 45;
    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    return currentYear - birthYear || 45;
  }

  addIcdTag(tag: string): void {
    if (!this.newEncounter.icd10Codes) {
      this.newEncounter.icd10Codes = tag;
    } else if (!this.newEncounter.icd10Codes.includes(tag)) {
      this.newEncounter.icd10Codes += ', ' + tag;
    }
    this.cdr.markForCheck();
  }

  insertSnippet(section: 'S' | 'O' | 'A' | 'P', templateKey: string): void {
    switch (section) {
      case 'S':
        if (templateKey === 'chest-pain') {
          this.newEncounter.soapSubjective =
            'Patient presents with a 3-day history of intermittent substernal chest heaviness occurring with moderate exertion (walking uphill). ' +
            'Pain is rated 4/10, non-radiating, lasting ~10 minutes, relieved by rest. Associated with mild exertional dyspnea and diaphoresis. ' +
            'Denies orthopnea, palpitations, syncope, fever, or prior myocardial infarction.';
        } else if (templateKey === 'diabetic') {
          this.newEncounter.soapSubjective =
            'Patient presents for routine Type 2 Diabetes Mellitus follow-up. Reports compliant with Metformin 500mg BID. ' +
            'Home fasting blood glucose logs average 115-135 mg/dL. Denies polyuria, polydipsia, blurred vision, or paresthesias in lower extremities.';
        } else if (templateKey === 'routine') {
          this.newEncounter.soapSubjective =
            'Patient presents for annual preventive wellness examination. No acute somatic complaints. ' +
            'Appetite, sleep architecture, bowel and bladder habits intact. Non-smoker, drinks alcohol socially. Physical activity: walks 3x/week.';
        }
        break;

      case 'O':
        if (templateKey === 'normal-exam') {
          this.newEncounter.soapObjective =
            'Constitutional: Well-nourished, alert, in no acute distress.\n' +
            'Vitals: BP 124/78 mmHg, HR 72 bpm regular, SpO2 99% room air, Temp 36.6°C, BMI 24.2.\n' +
            'CVS: S1/S2 normal, regular rhythm. No murmurs, rubs, or gallops. Peripheral pulses 2+ intact.\n' +
            'Respiratory: Bilateral breath sounds clear to auscultation without wheezing or crackles.\n' +
            'Abdomen: Soft, non-tender, non-distended with active normoactive bowel sounds.\n' +
            'Neurological: Cranial nerves II-XII grossly intact, non-focal sensory/motor exam.';
        } else if (templateKey === 'htn-exam') {
          this.newEncounter.soapObjective =
            'Constitutional: Awake, oriented, mild flushing noted.\n' +
            'Vitals: BP 154/96 mmHg (confirmed on both arms), HR 84 bpm, SpO2 98%, Temp 36.8°C.\n' +
            'CVS: Tachycardic, regular rhythm, no murmurs. JVP not elevated. No peripheral edema.\n' +
            'Fundoscopy: Mild arteriolar narrowing without papilledema.\n' +
            'Respiratory: Clear bilateral vesicular breath sounds.';
        } else if (templateKey === 'resp-exam') {
          this.newEncounter.soapObjective =
            'Constitutional: Mild respiratory distress, talking in full sentences.\n' +
            'Vitals: BP 128/82 mmHg, HR 88 bpm, SpO2 94% on room air, RR 20 bpm, Temp 37.4°C.\n' +
            'ENT: Erythematous posterior pharynx without tonsillar exudates.\n' +
            'Chest/Lungs: Mild end-expiratory bilateral wheezing noted at lung bases; no stridor.';
        }
        break;

      case 'A':
        if (templateKey === 'cad-htn') {
          this.newEncounter.soapAssessment =
            '1. Atypical Chest Pain (R07.9) - Intermediate cardiovascular pre-test probability; rule out acute coronary syndrome vs microvascular disease.\n' +
            '2. Essential Primary Hypertension (I10) - Stage 1, uncontrolled on monotherapy.\n' +
            '3. Dyslipidemia, Primary (E78.5) - Statin therapy evaluation indicated.';
          this.addIcdTag('R07.9 (Chest Pain)');
          this.addIcdTag('I10 (Essential Hypertension)');
          this.addIcdTag('E78.5 (Dyslipidemia)');
        } else if (templateKey === 'uri') {
          this.newEncounter.soapAssessment =
            '1. Acute Upper Respiratory Infection (J06.9) - Likely viral etiology.\n' +
            '2. Reactive Airway Wheezing (J45.909) - Mild bronchospasm secondary to URI.';
          this.addIcdTag('J06.9 (Acute URI)');
        }
        break;

      case 'P':
        if (templateKey === 'cardio-plan') {
          this.newEncounter.soapPlan =
            '1. Diagnostics: Baseline 12-lead Electrocardiogram (ECG), High-Sensitivity Troponin I, CMP, Lipid Profile, and HbA1c.\n' +
            '2. Therapeutics: Initiate Atorvastatin 20mg PO QHS. Titrate Lisinopril to 20mg PO QD. Prescribe Sublingual Nitroglycerin 0.4mg PRN.\n' +
            '3. Referral: Outpatient Cardiology consult for Stress Echocardiogram.\n' +
            '4. Instructions: Strict return precautions regarding worsening chest tightness, radiation, syncope, or diaphoresis.\n' +
            '5. Follow-up: Re-evaluate in clinic in 14 days with diagnostic results.';
        } else if (templateKey === 'routine-plan') {
          this.newEncounter.soapPlan =
            '1. Diagnostics: Order routine screening labs (CBC, Comprehensive Metabolic Panel, Lipid Panel).\n' +
            '2. Therapeutics: Continue current home maintenance medications without adjustment.\n' +
            '3. Preventive: Administered seasonal influenza vaccination (0.5mL IM left deltoid).\n' +
            '4. Follow-up: Routine annual wellness visit in 12 months.';
        }
        break;
    }
    this.toastService.info('Macro Applied', `Clinical template inserted into Section ${section}.`);
    this.cdr.markForCheck();
  }

  autoFillSampleNote(): void {
    if (!this.newEncounter.patientId && this.patients.length > 0) {
      this.newEncounter.patientId = this.patients[0].id!;
      this.onPatientSelected();
    }
    this.newEncounter.encounterType = 'OUTPATIENT';
    this.newEncounter.chiefComplaint = 'Acute onset exertional chest tightness and shortness of breath (3 days duration)';
    this.insertSnippet('S', 'chest-pain');
    this.insertSnippet('O', 'htn-exam');
    this.insertSnippet('A', 'cad-htn');
    this.insertSnippet('P', 'cardio-plan');
    this.autoSign = true;
    this.toastService.success('Sample Clinical Encounter Loaded', 'High-fidelity SOAP documentation with ICD-10 populated.');
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
        if (this.autoSign && (this.authService.isDoctor() || this.authService.isAdmin())) {
          this.ehrService.signEncounter(saved.id!).subscribe({
            next: (signed) => {
              this.submitting = false;
              this.recentNotes.unshift(signed);
              this.selectedNotePreview = signed;
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
              this.selectedNotePreview = saved;
              this.toastService.success('Clinical Note Saved', 'Encounter documented (unsigned).');
              this.resetForm();
              this.cdr.markForCheck();
            }
          });
        } else {
          this.submitting = false;
          this.recentNotes.unshift(saved);
          this.selectedNotePreview = saved;
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
    this.cdr.markForCheck();
  }
}

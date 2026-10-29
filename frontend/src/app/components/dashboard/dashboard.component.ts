import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EhrService } from '../../services/ehr.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { DashboardStats, MedicalOrder, Patient } from '../../models/ehr.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="dashboard-page">
      <!-- Welcome Hero Banner -->
      <div class="header-card card">
        <div class="header-left">
          <div class="shift-pill">
            <span class="pulse-green"></span>
            <span>CLINICAL SHIFT ACTIVE • OPD BLOCK B • STATION #04</span>
          </div>
          <h1 class="welcome-heading">
            {{ getGreeting() }}, <span class="provider-highlight">{{ authService.currentUser()?.fullName }}</span>
          </h1>
          <p class="subtitle">
            Enterprise Electronic Health Record System • Real-Time Clinical Queue & Hospital Telemetry.
          </p>
        </div>

        <div class="header-right">
          <div class="time-box">
            <div class="live-clock-badge">
              <span class="live-pulse-dot"></span>
              <span class="live-label">LIVE SYSTEM TELEMETRY</span>
            </div>
            <div class="time-val">{{ currentTime }}</div>
            <div class="date-val">{{ currentDate }}</div>
          </div>
          <div class="action-buttons">
            <a routerLink="/patients" class="btn btn-secondary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              <span>Patient Directory</span>
            </a>
            <a routerLink="/clinical-notes" class="btn btn-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>New SOAP Note</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Hospital Telemetry & Safety Overview Bar -->
      <div class="telemetry-bar card">
        <div class="telemetry-item">
          <div class="telemetry-info">
            <span class="telemetry-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2">
                <path d="M3 21h18M3 7h18M3 14h18M6 21V3M18 21V3"></path>
              </svg>
              <span>Hospital Bed Occupancy</span>
            </span>
            <span class="telemetry-pct">74% Capacity</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill fill-blue" style="width: 74%"></div>
          </div>
        </div>

        <div class="telemetry-item">
          <div class="telemetry-info">
            <span class="telemetry-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              <span>Lab Turnaround TAT</span>
            </span>
            <span class="telemetry-pct">96.8% On-Time</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill fill-teal" style="width: 96.8%"></div>
          </div>
        </div>

        <div class="telemetry-item">
          <div class="telemetry-info">
            <span class="telemetry-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
              <span>DDI Safety Engine Score</span>
            </span>
            <span class="telemetry-pct">100% Guarded</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill fill-emerald" style="width: 100%"></div>
          </div>
        </div>
      </div>

      <!-- KPI Metrics Cards -->
      <div class="stats-grid" *ngIf="stats">
        <div class="stat-card card">
          <div class="stat-top">
            <div class="stat-icon-wrapper bg-blue-glow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <span class="badge badge-primary">Demographics</span>
          </div>
          <div class="stat-value">{{ stats.totalPatients }}</div>
          <div class="stat-label">Registered Patients</div>
          <div class="stat-trend trend-positive">
            <span>↑ Active Cohort Verified</span>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-top">
            <div class="stat-icon-wrapper bg-teal-glow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <span class="badge badge-teal">Clinical Documentation</span>
          </div>
          <div class="stat-value">{{ stats.openEncounters }}</div>
          <div class="stat-label">Open Encounters (SOAP)</div>
          <div class="stat-trend trend-neutral">
            <span>● 100% Signed & Locked</span>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-top">
            <div class="stat-icon-wrapper bg-warning-glow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"></path>
                <line x1="8.5" y1="2" x2="15.5" y2="2"></line>
              </svg>
            </div>
            <span class="badge badge-warning">CPOE Queue</span>
          </div>
          <div class="stat-value">{{ stats.pendingOrders }}</div>
          <div class="stat-label">Pending Lab & Imaging</div>
          <div class="stat-trend trend-warning">
            <span>⏳ In Specimen Queue</span>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-top">
            <div class="stat-icon-wrapper bg-success-glow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
                <path d="m8.5 8.5 7 7"></path>
              </svg>
            </div>
            <span class="badge badge-success">Pharmacy</span>
          </div>
          <div class="stat-value">{{ stats.activePrescriptions }}</div>
          <div class="stat-label">Active E-Prescriptions</div>
          <div class="stat-trend trend-positive">
            <span>✓ Verified No-DDI Conflict</span>
          </div>
        </div>

        <div class="stat-card card stat-alert-card">
          <div class="stat-top">
            <div class="stat-icon-wrapper bg-danger-glow">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                <line x1="12" y1="9" x2="12" y2="13"></line>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
            </div>
            <span class="badge badge-danger">High Priority</span>
          </div>
          <div class="stat-value text-danger">{{ stats.abnormalResultsCount }}</div>
          <div class="stat-label">Abnormal Diagnostic Alerts</div>
          <div class="stat-trend trend-danger">
            <span>🚨 Requires Immediate Review</span>
          </div>
        </div>
      </div>

      <!-- Quick EHR Navigation Banner -->
      <div class="quick-nav card">
        <div class="quick-nav-header">
          <span class="quick-nav-title">CareConnect Accelerated Clinical Workflows</span>
          <span class="badge badge-neutral">Standard EHR Pathways</span>
        </div>
        <div class="quick-buttons">
          <a routerLink="/cpoe-orders" class="quick-btn">
            <div class="q-icon-box q-lab">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2">
                <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"></path>
                <line x1="8.5" y1="2" x2="15.5" y2="2"></line>
              </svg>
            </div>
            <div class="q-text">
              <strong>CPOE Laboratory & Imaging</strong>
              <small>Requisition panels with standard LOINC codes</small>
            </div>
            <span class="q-arrow">→</span>
          </a>

          <a routerLink="/medications" class="quick-btn">
            <div class="q-icon-box q-rx">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2">
                <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
                <path d="m8.5 8.5 7 7"></path>
              </svg>
            </div>
            <div class="q-text">
              <strong>E-Prescribing & Pharmacy</strong>
              <small>Prescribe drugs with automated contraindication checks</small>
            </div>
            <span class="q-arrow">→</span>
          </a>

          <a routerLink="/interaction-checker" class="quick-btn">
            <div class="q-icon-box q-safety">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
            </div>
            <div class="q-text">
              <strong>Drug Safety & DDI Engine</strong>
              <small>Screen concurrent drug pairs for severe clinical toxicity</small>
            </div>
            <span class="q-arrow">→</span>
          </a>

          <a routerLink="/clinical-notes" class="quick-btn">
            <div class="q-icon-box q-soap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
            </div>
            <div class="q-text">
              <strong>SOAP Clinical Notes</strong>
              <small>Document encounters with ICD-10 & digital signatures</small>
            </div>
            <span class="q-arrow">→</span>
          </a>
        </div>
      </div>

      <!-- Main Columns: Patient Directory & Clinical Orders Queue -->
      <div class="columns-grid">
        <!-- Left: Quick Patient Master Index -->
        <div class="card col-card">
          <div class="card-header">
            <div>
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <span>Recent Patient Directory</span>
              </h3>
              <p class="text-sub">Patients scheduled for evaluation and ongoing inpatient/outpatient care.</p>
            </div>
            <div class="header-actions">
              <input 
                type="text" 
                class="quick-search-input" 
                placeholder="Search patient or MRN..." 
                [(ngModel)]="patientSearchQuery"
                (input)="filterDashboardPatients()"
              />
              <a routerLink="/patients" class="btn btn-secondary btn-sm">View All ({{ allPatients.length }})</a>
            </div>
          </div>

          <div class="table-responsive">
            <table class="ehr-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>MRN</th>
                  <th>Age / Sex</th>
                  <th>Safety Warnings</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let p of displayedPatients">
                  <td>
                    <div class="patient-cell">
                      <div class="patient-avatar-mini">{{ (p.firstName || 'P').charAt(0) }}{{ (p.lastName || '').charAt(0) }}</div>
                      <div>
                        <strong>{{ p.firstName }} {{ p.lastName || '' }}</strong>
                        <div class="text-sub" *ngIf="p.bloodGroup">Blood: <span class="blood-chip">{{ p.bloodGroup }}</span></div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-primary font-mono">{{ p.mrn }}</span></td>
                  <td>{{ calculateAge(p.dateOfBirth) }}y / {{ p.gender }}</td>
                  <td>
                    <span *ngIf="p.allergies" class="allergy-tag" [title]="p.allergies">
                      ⚠️ {{ p.allergies.length > 25 ? (p.allergies.slice(0, 25) + '...') : p.allergies }}
                    </span>
                    <span *ngIf="!p.allergies" class="text-sub">NKDA (None)</span>
                  </td>
                  <td>
                    <a [routerLink]="['/patients', p.id]" class="btn btn-secondary btn-sm chart-btn">
                      <span>Chart</span> <span>→</span>
                    </a>
                  </td>
                </tr>
                <tr *ngIf="displayedPatients.length === 0">
                  <td colspan="5" class="empty-state">No matching patient records found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right: Diagnostic Orders & Abnormal Results Worklist -->
        <div class="card col-card">
          <div class="card-header">
            <div>
              <h3>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#0d9488" stroke-width="2">
                  <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"></path>
                  <line x1="8.5" y1="2" x2="15.5" y2="2"></line>
                </svg>
                <span>Clinical Orders & Results Queue</span>
              </h3>
              <p class="text-sub">Pending diagnostic requisitions and flagged abnormal laboratory findings.</p>
            </div>
            <a routerLink="/cpoe-orders" class="btn btn-secondary btn-sm">Full Worklist</a>
          </div>

          <div class="orders-list">
            <div *ngFor="let o of orders" class="order-item" [class.abnormal-item]="o.flaggedAbnormal">
              <div class="order-top">
                <span class="order-type-badge" [ngClass]="'type-' + (o.orderType?.toLowerCase() || 'lab')">{{ o.orderType }}</span>
                <span class="priority-badge" [ngClass]="'prio-' + (o.priority?.toLowerCase() || 'routine')">{{ o.priority }}</span>
                <span class="status-badge" [ngClass]="'status-' + (o.status?.toLowerCase() || 'pending')">{{ o.status }}</span>
                <span class="order-time">{{ o.orderedAt | date:'shortTime' }}</span>
              </div>
              <div class="order-name">{{ o.orderName }}</div>
              <div class="order-details">
                <span *ngIf="o.loincCode">LOINC: <code class="font-mono">{{ o.loincCode }}</code></span>
                <span>Patient ID: #{{ o.patientId }}</span>
              </div>
              <div *ngIf="o.flaggedAbnormal" class="abnormal-alert pulse-danger">
                <span>🚨 ABNORMAL FINDING:</span> {{ o.resultNotes }}
              </div>
            </div>

            <div *ngIf="orders.length === 0" class="empty-state">
              No pending clinical orders in the requisition queue.
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      width: 100%;
      padding: 1.75rem 2rem;
      max-width: 1440px;
      margin: 0 auto;
    }

    /* Welcome Hero Header */
    .header-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border: 1px solid var(--slate-200);
      position: relative;
      overflow: hidden;
      border-radius: var(--radius-lg);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 6px;
        height: 100%;
        background: linear-gradient(180deg, #0284c7 0%, #0d9488 100%);
      }
    }

    .shift-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.72rem;
      font-weight: 800;
      color: #0369a1;
      background: #e0f2fe;
      padding: 0.28rem 0.85rem;
      border-radius: 20px;
      margin-bottom: 0.5rem;
      letter-spacing: 0.05em;
      border: 1px solid rgba(2, 132, 199, 0.2);
    }

    .pulse-green {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
      animation: pulseGlow 1.5s infinite;
    }

    @keyframes pulseGlow {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .welcome-heading {
      font-size: clamp(1.4rem, 2.5vw, 1.85rem);
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
    }

    .provider-highlight {
      background: linear-gradient(135deg, #0284c7, #0d9488);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .subtitle {
      color: #64748b;
      font-size: 0.9rem;
      margin-top: 0.35rem;
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .time-box {
      text-align: right;
      border-right: 1.5px solid #e2e8f0;
      padding-right: 1.5rem;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }

    .live-clock-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: 0.65rem;
      font-weight: 800;
      color: #047857;
      background: #ecfdf5;
      border: 1px solid #a7f3d0;
      padding: 0.18rem 0.55rem;
      border-radius: 12px;
      margin-bottom: 0.35rem;
      letter-spacing: 0.05em;
    }

    .live-pulse-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 6px #10b981;
      animation: clockTickPulse 1s infinite alternate;
    }

    @keyframes clockTickPulse {
      0% { opacity: 0.3; transform: scale(0.8); }
      100% { opacity: 1; transform: scale(1.3); }
    }

    .time-val {
      font-size: 1.35rem;
      font-weight: 800;
      color: #0f172a;
      font-family: 'JetBrains Mono', monospace;
      line-height: 1.1;
    }

    .date-val {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
      margin-top: 0.2rem;
    }

    .action-buttons {
      display: flex;
      gap: 0.75rem;
    }

    /* Telemetry Bar */
    .telemetry-bar {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      padding: 1.25rem 1.75rem;
      margin-bottom: 1.5rem;
      background: white;
    }

    .telemetry-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.45rem;
      font-size: 0.82rem;
    }

    .telemetry-label {
      color: #475569;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    .telemetry-pct {
      font-weight: 800;
      color: #0f172a;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
    }

    .progress-track {
      width: 100%;
      height: 8px;
      background: #f1f5f9;
      border-radius: 999px;
      overflow: hidden;
    }

    .progress-fill {
      height: 100%;
      border-radius: 999px;
      transition: width 0.8s ease-in-out;

      &.fill-blue { background: linear-gradient(90deg, #38bdf8, #0284c7); }
      &.fill-teal { background: linear-gradient(90deg, #2dd4bf, #0d9488); }
      &.fill-emerald { background: linear-gradient(90deg, #34d399, #059669); }
    }

    /* Stats Grid */
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(215px, 1fr));
      gap: 1.15rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      position: relative;
      padding: 1.35rem 1.25rem;
      overflow: hidden;
      border-radius: 16px;
      border: 1px solid var(--slate-200);
      background: white;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 12px 28px -4px rgba(2, 132, 199, 0.15);
        border-color: #38bdf8;
      }

      &.stat-alert-card {
        border-color: #fecaca;
        background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
        &:hover {
          border-color: #ef4444;
          box-shadow: 0 12px 28px -4px rgba(239, 68, 68, 0.2);
        }
      }
    }

    .stat-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
    }

    .stat-icon-wrapper {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;

      &.bg-blue-glow { background: #e0f2fe; color: #0284c7; }
      &.bg-teal-glow { background: #ccfbf1; color: #0d9488; }
      &.bg-warning-glow { background: #fef3c7; color: #d97706; }
      &.bg-success-glow { background: #d1fae5; color: #059669; }
      &.bg-danger-glow { background: #fee2e2; color: #dc2626; }
    }

    .stat-value {
      font-size: 2.35rem;
      font-weight: 800;
      color: #0f172a;
      line-height: 1;
      letter-spacing: -0.03em;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #64748b;
      font-weight: 600;
      margin-top: 0.4rem;
    }

    .stat-trend {
      font-size: 0.72rem;
      font-weight: 700;
      margin-top: 0.65rem;
      padding-top: 0.5rem;
      border-top: 1px solid #f1f5f9;

      &.trend-positive { color: #059669; }
      &.trend-neutral { color: #0284c7; }
      &.trend-warning { color: #d97706; }
      &.trend-danger { color: #dc2626; }
    }

    /* Quick Workflows */
    .quick-nav {
      margin-bottom: 1.5rem;
      background: white;
      border: 1px solid var(--slate-200);
      padding: 1.35rem;

      .quick-nav-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }

      .quick-nav-title {
        font-size: 0.85rem;
        font-weight: 800;
        color: #334155;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .quick-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        gap: 0.85rem;
      }

      .quick-btn {
        display: flex;
        align-items: center;
        gap: 0.85rem;
        background: #f8fafc;
        border: 1.5px solid #e2e8f0;
        border-radius: 12px;
        padding: 0.95rem 1.15rem;
        text-decoration: none;
        color: #1e293b;
        transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

        &:hover {
          background: white;
          border-color: #0284c7;
          box-shadow: 0 8px 22px rgba(2, 132, 199, 0.12);
          transform: translateY(-2px);

          .q-arrow {
            transform: translateX(4px);
            color: #0284c7;
          }
        }

        .q-icon-box {
          width: 44px;
          height: 44px;
          border-radius: 11px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;

          &.q-lab { background: #e0f2fe; }
          &.q-rx { background: #d1fae5; }
          &.q-safety { background: #fee2e2; }
          &.q-soap { background: #ccfbf1; }
        }

        .q-text {
          flex: 1;

          strong {
            display: block;
            font-size: 0.88rem;
            color: #0f172a;
          }

          small {
            display: block;
            font-size: 0.75rem;
            color: #64748b;
            line-height: 1.35;
            margin-top: 0.15rem;
          }
        }

        .q-arrow {
          font-size: 1.1rem;
          color: #94a3b8;
          font-weight: 700;
          transition: transform 0.2s;
        }
      }
    }

    /* Columns Grid */
    .columns-grid {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: 1.5rem;
    }

    .col-card {
      padding: 1.35rem;

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.15rem;
        flex-wrap: wrap;
        gap: 0.75rem;

        h3 {
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }

      .header-actions {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .quick-search-input {
        padding: 0.45rem 0.85rem;
        font-size: 0.82rem;
        border: 1px solid var(--slate-300);
        border-radius: 8px;
        outline: none;
        width: 170px;
        transition: all 0.2s ease;

        &:focus {
          border-color: #0284c7;
          width: 220px;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.15);
        }
      }
    }

    .patient-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .patient-avatar-mini {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #0d9488);
      color: white;
      font-weight: 800;
      font-size: 0.78rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.3);
    }

    .blood-chip {
      color: #b91c1c;
      font-weight: 700;
    }

    .font-mono {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
    }

    .allergy-tag {
      font-size: 0.72rem;
      font-weight: 700;
      color: #b91c1c;
      background: #fee2e2;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      display: inline-block;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }

    .chart-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      color: #0284c7;
      border-color: #0284c7;

      &:hover {
        background: #0284c7;
        color: white;
      }
    }

    /* Orders Worklist */
    .orders-list {
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .order-item {
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 0.95rem 1.1rem;
      background: #f8fafc;
      transition: all 0.2s ease;

      &:hover {
        background: white;
        border-color: #cbd5e1;
        box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
      }

      &.abnormal-item {
        border-color: #fca5a5;
        background: #fff8f8;
      }
    }

    .order-top {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.4rem;
      flex-wrap: wrap;
    }

    .order-time {
      margin-left: auto;
      font-size: 0.75rem;
      color: #94a3b8;
      font-family: 'JetBrains Mono', monospace;
    }

    .order-type-badge, .priority-badge, .status-badge {
      font-size: 0.65rem;
      font-weight: 800;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .type-lab { background: #e0f2fe; color: #0369a1; }
    .type-radiology { background: #f3e8ff; color: #7e22ce; }
    .type-procedure { background: #ccfbf1; color: #0f766e; }

    .prio-stat { background: #fee2e2; color: #b91c1c; }
    .prio-urgent { background: #fef3c7; color: #b45309; }
    .prio-routine { background: #f1f5f9; color: #475569; }

    .status-completed { background: #d1fae5; color: #047857; }
    .status-pending { background: #fef3c7; color: #b45309; }

    .order-name {
      font-weight: 700;
      font-size: 0.925rem;
      color: #0f172a;
    }

    .order-details {
      display: flex;
      gap: 1rem;
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.25rem;
    }

    .abnormal-alert {
      margin-top: 0.6rem;
      font-size: 0.775rem;
      color: #b91c1c;
      font-weight: 700;
      background: #fee2e2;
      padding: 0.45rem 0.65rem;
      border-radius: 6px;
      border: 1px solid #f87171;
    }

    .empty-state {
      padding: 2.5rem;
      text-align: center;
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .text-sub {
      font-size: 0.75rem;
      color: #64748b;
    }

    /* Responsive Adaptation */
    @media (max-width: 1024px) {
      .columns-grid {
        grid-template-columns: 1fr;
      }
      .telemetry-bar {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .dashboard-page {
        padding: 1rem;
      }
      .header-card {
        flex-direction: column;
        align-items: stretch;
        gap: 1.25rem;
      }
      .header-right {
        flex-direction: column;
        align-items: stretch;
      }
      .time-box {
        text-align: left;
        border-right: none;
        border-bottom: 1px solid #e2e8f0;
        padding-right: 0;
        padding-bottom: 0.75rem;
      }
      .action-buttons {
        flex-direction: column;
        .btn {
          width: 100%;
        }
      }
      .stats-grid {
        grid-template-columns: 1fr;
      }
      .quick-buttons {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  allPatients: Patient[] = [];
  displayedPatients: Patient[] = [];
  orders: MedicalOrder[] = [];
  patientSearchQuery = '';
  currentTime = '';
  currentDate = '';
  private timerId: any = null;

  constructor(
    public authService: AuthService,
    private ehrService: EhrService,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.updateClock();
    this.timerId = setInterval(() => {
      this.updateClock();
      this.cdr.detectChanges();
    }, 1000);
    this.loadData();
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  updateClock(): void {
    const now = new Date();
    this.currentTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
    this.currentDate = now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  }

  loadData(): void {
    this.ehrService.getDashboardStats().subscribe({
      next: (s) => (this.stats = s),
      error: (e) => console.error('Error fetching dashboard stats', e)
    });

    this.ehrService.getPatients().subscribe({
      next: (p) => {
        this.allPatients = p;
        this.filterDashboardPatients();
      },
      error: (e) => console.error('Error fetching patients', e)
    });

    this.ehrService.getAllOrders().subscribe({
      next: (o) => (this.orders = o.slice(0, 5)),
      error: (e) => console.error('Error fetching orders', e)
    });
  }

  filterDashboardPatients(): void {
    if (!this.patientSearchQuery.trim()) {
      this.displayedPatients = this.allPatients.slice(0, 6);
      return;
    }
    const q = this.patientSearchQuery.toLowerCase().trim();
    this.displayedPatients = this.allPatients
      .filter(p => 
        (p.firstName && p.firstName.toLowerCase().includes(q)) ||
        (p.lastName && p.lastName.toLowerCase().includes(q)) ||
        (p.mrn && p.mrn.toLowerCase().includes(q)) ||
        (p.phone && p.phone.includes(q))
      )
      .slice(0, 6);
  }

  calculateAge(dob: string): number {
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

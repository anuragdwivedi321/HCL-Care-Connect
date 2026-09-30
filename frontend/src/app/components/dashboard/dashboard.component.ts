import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EhrService } from '../../services/ehr.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { DashboardStats, MedicalOrder, Patient } from '../../models/ehr.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <!-- Welcome Hero Banner -->
      <div class="header-card card">
        <div class="header-left">
          <div class="shift-pill">
            <span class="pulse-green"></span>
            <span>CLINICAL SHIFT ACTIVE • OPD BLOCK B</span>
          </div>
          <h1 class="welcome-heading">
            {{ getGreeting() }}, <span class="provider-highlight">{{ authService.currentUser()?.fullName }}</span>
          </h1>
          <p class="subtitle">
            Enterprise Electronic Health Record System • Real-Time Clinical Queue & Telemetry.
          </p>
        </div>

        <div class="header-right">
          <div class="time-box">
            <div class="live-clock-badge">
              <span class="live-pulse-dot"></span>
              <span class="live-label">LIVE SYSTEM TIME</span>
            </div>
            <div class="time-val">{{ currentTime }}</div>
            <div class="date-val">{{ currentDate }}</div>
          </div>
          <div class="action-buttons">
            <a routerLink="/patients" class="btn btn-secondary">
              <span>👥</span> Patient Directory
            </a>
            <a routerLink="/clinical-notes" class="btn btn-primary">
              <span>✍️</span> New SOAP Note
            </a>
          </div>
        </div>
      </div>

      <!-- Hospital Telemetry & Safety Overview Bar -->
      <div class="telemetry-bar card">
        <div class="telemetry-item">
          <div class="telemetry-info">
            <span class="telemetry-label">Hospital Bed Occupancy</span>
            <span class="telemetry-pct">74%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill fill-blue" style="width: 74%"></div>
          </div>
        </div>

        <div class="telemetry-item">
          <div class="telemetry-info">
            <span class="telemetry-label">Lab Turnaround Time (TAT)</span>
            <span class="telemetry-pct">96.8%</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill fill-teal" style="width: 96.8%"></div>
          </div>
        </div>

        <div class="telemetry-item">
          <div class="telemetry-info">
            <span class="telemetry-label">Drug Interaction Safety Score</span>
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
              <span class="stat-icon">👥</span>
            </div>
            <span class="badge badge-primary">Demographics</span>
          </div>
          <div class="stat-value">{{ stats.totalPatients }}</div>
          <div class="stat-label">Registered Patients</div>
          <div class="stat-trend trend-positive">
            <span>↑ Active Cohort</span>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-top">
            <div class="stat-icon-wrapper bg-teal-glow">
              <span class="stat-icon">📋</span>
            </div>
            <span class="badge badge-teal">Clinical Documentation</span>
          </div>
          <div class="stat-value">{{ stats.openEncounters }}</div>
          <div class="stat-label">Open Encounters (SOAP)</div>
          <div class="stat-trend trend-neutral">
            <span>● 100% Signed</span>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-top">
            <div class="stat-icon-wrapper bg-warning-glow">
              <span class="stat-icon">🔬</span>
            </div>
            <span class="badge badge-warning">CPOE Queue</span>
          </div>
          <div class="stat-value">{{ stats.pendingOrders }}</div>
          <div class="stat-label">Pending Lab & Imaging</div>
          <div class="stat-trend trend-warning">
            <span>⏳ In Lab Queue</span>
          </div>
        </div>

        <div class="stat-card card">
          <div class="stat-top">
            <div class="stat-icon-wrapper bg-success-glow">
              <span class="stat-icon">💊</span>
            </div>
            <span class="badge badge-success">Pharmacy</span>
          </div>
          <div class="stat-value">{{ stats.activePrescriptions }}</div>
          <div class="stat-label">Active E-Prescriptions</div>
          <div class="stat-trend trend-positive">
            <span>✓ Verified Safe</span>
          </div>
        </div>

        <div class="stat-card card stat-alert-card">
          <div class="stat-top">
            <div class="stat-icon-wrapper bg-danger-glow">
              <span class="stat-icon">⚠️</span>
            </div>
            <span class="badge badge-danger">High Priority</span>
          </div>
          <div class="stat-value text-danger">{{ stats.abnormalResultsCount }}</div>
          <div class="stat-label">Abnormal Diagnostic Alerts</div>
          <div class="stat-trend trend-danger">
            <span>🚨 Requires Review</span>
          </div>
        </div>
      </div>

      <!-- Quick EHR Navigation Banner -->
      <div class="quick-nav card">
        <div class="quick-nav-header">
          <span class="quick-nav-title">CareConnect Accelerated Clinical Workflows</span>
          <span class="badge badge-neutral">Shortcuts</span>
        </div>
        <div class="quick-buttons">
          <a routerLink="/cpoe-orders" class="quick-btn">
            <div class="q-icon-box q-lab">🔬</div>
            <div class="q-text">
              <strong>CPOE Laboratory & Imaging</strong>
              <small>Order diagnostic panels with standard LOINC codes</small>
            </div>
            <span class="q-arrow">→</span>
          </a>

          <a routerLink="/medications" class="quick-btn">
            <div class="q-icon-box q-rx">💊</div>
            <div class="q-text">
              <strong>E-Prescribing & Pharmacy</strong>
              <small>Prescribe drugs with automated contraindication checks</small>
            </div>
            <span class="q-arrow">→</span>
          </a>

          <a routerLink="/interaction-checker" class="quick-btn">
            <div class="q-icon-box q-safety">🛡️</div>
            <div class="q-text">
              <strong>Drug Interaction Safety Engine</strong>
              <small>Screen concurrent drug pairs for severe hyperkalemia & toxicity</small>
            </div>
            <span class="q-arrow">→</span>
          </a>

          <a routerLink="/clinical-notes" class="quick-btn">
            <div class="q-icon-box q-soap">📝</div>
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
              <h3><span>👥</span> Recent Patient Directory</h3>
              <p class="text-sub">Patients scheduled for evaluation and ongoing care.</p>
            </div>
            <a routerLink="/patients" class="btn btn-secondary btn-sm">View All ({{ patients.length }})</a>
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
                <tr *ngFor="let p of patients">
                  <td>
                    <div class="patient-cell">
                      <div class="patient-avatar-mini">{{ (p.firstName || 'P').charAt(0) }}{{ (p.lastName || '').charAt(0) }}</div>
                      <div>
                        <strong>{{ p.firstName }} {{ p.lastName || '' }}</strong>
                        <div class="text-sub" *ngIf="p.bloodGroup">Blood: {{ p.bloodGroup }}</div>
                      </div>
                    </div>
                  </td>
                  <td><span class="badge badge-primary font-mono">{{ p.mrn }}</span></td>
                  <td>{{ calculateAge(p.dateOfBirth) }}y / {{ p.gender }}</td>
                  <td>
                    <span *ngIf="p.allergies" class="allergy-tag" [title]="p.allergies">
                      ⚠️ {{ p.allergies.length > 25 ? (p.allergies.slice(0, 25) + '...') : p.allergies }}
                    </span>
                    <span *ngIf="!p.allergies" class="text-sub">NKDA</span>
                  </td>
                  <td>
                    <a [routerLink]="['/patients', p.id]" class="btn btn-secondary btn-sm chart-btn">
                      Chart <span>→</span>
                    </a>
                  </td>
                </tr>
                <tr *ngIf="patients.length === 0">
                  <td colspan="5" class="empty-state">No patients available in the index.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right: Diagnostic Orders & Abnormal Results Worklist -->
        <div class="card col-card">
          <div class="card-header">
            <div>
              <h3><span>🔬</span> Clinical Orders & Results Queue</h3>
              <p class="text-sub">Pending requisitions and flagged abnormal laboratory findings.</p>
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
                <span *ngIf="o.loincCode">LOINC: <code>{{ o.loincCode }}</code></span>
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
      max-width: 1400px;
      margin: 1.5rem auto;
      padding: 0 1.5rem;
    }

    /* Welcome Hero Header */
    .header-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
      border: 1px solid #e2e8f0;
      position: relative;
      overflow: hidden;

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
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      margin-bottom: 0.5rem;
      letter-spacing: 0.05em;
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
      padding: 0.15rem 0.5rem;
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
      padding: 1.15rem 1.5rem;
      margin-bottom: 1.5rem;
      background: white;
    }

    .telemetry-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.4rem;
      font-size: 0.8rem;
    }

    .telemetry-label {
      color: #64748b;
      font-weight: 600;
    }

    .telemetry-pct {
      font-weight: 800;
      color: #0f172a;
      font-family: 'JetBrains Mono', monospace;
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
      grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
      gap: 1.15rem;
      margin-bottom: 1.5rem;
    }

    .stat-card {
      position: relative;
      padding: 1.35rem 1.25rem;
      overflow: hidden;
      border-radius: 16px;
      border: 1px solid #e2e8f0;
      background: white;
      transition: all 0.25s ease;

      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px -5px rgba(2, 132, 199, 0.15);
        border-color: #38bdf8;
      }

      &.stat-alert-card {
        border-color: #fecaca;
        background: linear-gradient(135deg, #ffffff 0%, #fff5f5 100%);
        &:hover {
          border-color: #ef4444;
          box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.2);
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
      font-size: 1.35rem;

      &.bg-blue-glow { background: #e0f2fe; color: #0284c7; }
      &.bg-teal-glow { background: #ccfbf1; color: #0d9488; }
      &.bg-warning-glow { background: #fef3c7; color: #d97706; }
      &.bg-success-glow { background: #d1fae5; color: #059669; }
      &.bg-danger-glow { background: #fee2e2; color: #dc2626; }
    }

    .stat-value {
      font-size: 2.25rem;
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
      border: 1px solid #e2e8f0;
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
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

        &:hover {
          background: white;
          border-color: #0284c7;
          box-shadow: 0 8px 20px rgba(2, 132, 199, 0.12);
          transform: translateY(-2px);

          .q-arrow {
            transform: translateX(4px);
            color: #0284c7;
          }
        }

        .q-icon-box {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
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
            line-height: 1.3;
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

        h3 {
          font-size: 1.15rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
      }
    }

    .patient-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .patient-avatar-mini {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #0d9488);
      color: white;
      font-weight: 700;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
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
      border-radius: 10px;
      padding: 0.85rem 1rem;
      background: #f8fafc;
      transition: all 0.2s ease;

      &:hover {
        background: white;
        border-color: #cbd5e1;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05);
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
        padding: 0.85rem;
        margin: 0.5rem auto;
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
  patients: Patient[] = [];
  orders: MedicalOrder[] = [];
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
      next: (p) => (this.patients = p.slice(0, 5)),
      error: (e) => console.error('Error fetching patients', e)
    });

    this.ehrService.getAllOrders().subscribe({
      next: (o) => (this.orders = o.slice(0, 5)),
      error: (e) => console.error('Error fetching orders', e)
    });
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

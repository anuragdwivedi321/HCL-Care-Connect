import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EhrService } from '../../services/ehr.service';
import { AuditLog } from '../../models/ehr.models';

@Component({
  selector: 'app-audit-trail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="audit-page">
      <div class="page-header">
        <div>
          <h2>HIPAA Compliance & Access Audit Log</h2>
          <p class="subtitle">Immutable log recording every view, edit, order, and electronic signature on Protected Health Information (PHI).</p>
        </div>
        <button (click)="loadLogs()" class="btn btn-secondary">
          <span>🔄</span> Refresh Logs
        </button>
      </div>

      <!-- Filter Controls -->
      <div class="card filter-card">
        <div class="filter-row">
          <div class="form-group flex-1">
            <label>Filter by Entity Type</label>
            <select [(ngModel)]="entityFilter" (change)="applyFilters()" class="form-control">
              <option value="">All Entities</option>
              <option value="Patient">Patient Demographics</option>
              <option value="ClinicalEncounter">Clinical Encounter / SOAP</option>
              <option value="MedicalOrder">Medical Order (CPOE)</option>
              <option value="Prescription">Prescription / Medication</option>
              <option value="User">User / Authentication</option>
            </select>
          </div>

          <div class="form-group flex-1">
            <label>Search Performed By / Details</label>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="applyFilters()"
              placeholder="e.g. dr.sharma, MRN, SIGN_SOAP..."
              class="form-control"
            />
          </div>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div class="card table-card">
        <div class="table-responsive">
          <table class="ehr-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operator</th>
                <th>Role</th>
                <th>Action Performed</th>
                <th>Entity Affected</th>
                <th>Audit Telemetry Details</th>
                <th>Client IP</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let l of filteredLogs">
                <td>
                  <span class="timestamp-text">{{ l.timestamp | date:'medium' }}</span>
                </td>
                <td>
                  <strong>{{ l.performedBy }}</strong>
                </td>
                <td>
                  <span class="badge" [ngClass]="getRoleBadgeClass(l.userRole)">
                    {{ l.userRole }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-primary action-badge">{{ l.action }}</span>
                </td>
                <td>
                  <span class="entity-tag">{{ l.entityName }} #{{ l.entityId }}</span>
                </td>
                <td>
                  <span class="details-text">{{ l.details }}</span>
                </td>
                <td>
                  <code>{{ l.ipAddress }}</code>
                </td>
              </tr>
              <tr *ngIf="filteredLogs.length === 0">
                <td colspan="7" class="text-center py-4">No audit logs matching this criteria.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .audit-page {
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

    .filter-card {
      padding: 1rem 1.25rem;
      margin-bottom: 1.25rem;
    }

    .filter-row {
      display: flex;
      gap: 1.25rem;
    }

    .flex-1 { flex: 1; }

    .timestamp-text {
      font-size: 0.75rem;
      color: #64748b;
      white-space: nowrap;
    }

    .action-badge {
      font-family: monospace;
      font-weight: 700;
      font-size: 0.7rem;
    }

    .entity-tag {
      font-size: 0.8rem;
      font-weight: 600;
      color: #0369a1;
    }

    .details-text {
      font-size: 0.8rem;
      color: #334155;
    }
  `]
})
export class AuditTrailComponent implements OnInit {
  logs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  entityFilter = '';
  searchQuery = '';

  constructor(private ehrService: EhrService) {}

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.ehrService.getAuditLogs().subscribe({
      next: (data) => {
        this.logs = data;
        this.applyFilters();
      },
      error: (e) => console.error(e)
    });
  }

  applyFilters(): void {
    let result = [...this.logs];

    if (this.entityFilter) {
      result = result.filter(l => l.entityName === this.entityFilter);
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(l =>
        l.performedBy.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        (l.details && l.details.toLowerCase().includes(q))
      );
    }

    this.filteredLogs = result;
  }

  getRoleBadgeClass(role: string): string {
    if (role === 'ROLE_DOCTOR') return 'badge-teal';
    if (role === 'ROLE_NURSE') return 'badge-warning';
    if (role === 'ROLE_PATIENT') return 'badge-primary';
    return 'badge-neutral';
  }
}

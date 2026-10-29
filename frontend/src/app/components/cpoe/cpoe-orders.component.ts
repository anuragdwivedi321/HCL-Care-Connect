import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EhrService } from '../../services/ehr.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { MedicalOrder, Patient } from '../../models/ehr.models';

interface OrderTemplate {
  name: string;
  type: string;
  loinc: string;
  priority: string;
}

@Component({
  selector: 'app-cpoe-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="cpoe-page">
      <div class="page-header">
        <div>
          <h2>Computerized Physician Order Entry (CPOE)</h2>
          <p class="subtitle">Direct digital entry of clinical orders for laboratories, diagnostic imaging, and diagnostic procedures.</p>
        </div>
        <button (click)="openNewOrderModal()" class="btn btn-primary" *ngIf="authService.isDoctor() || authService.isAdmin()">
          <span>➕</span> Requisition New Order
        </button>
      </div>

      <!-- Filters & Status Counts -->
      <div class="filter-bar card">
        <div class="filter-tabs">
          <button (click)="setFilter('ALL')" [class.active]="currentFilter === 'ALL'" class="filter-tab">
            All Orders ({{ orders.length }})
          </button>
          <button (click)="setFilter('PENDING')" [class.active]="currentFilter === 'PENDING'" class="filter-tab">
            Pending Orders ({{ getCount('PENDING') }})
          </button>
          <button (click)="setFilter('COMPLETED')" [class.active]="currentFilter === 'COMPLETED'" class="filter-tab">
            Completed / Resulted ({{ getCount('COMPLETED') }})
          </button>
          <button (click)="setFilter('ABNORMAL')" [class.active]="currentFilter === 'ABNORMAL'" class="filter-tab text-danger">
            ⚠️ Abnormal Flags ({{ getAbnormalCount() }})
          </button>
        </div>
      </div>

      <!-- Orders Worklist Table -->
      <div class="card table-card">
        <div class="table-responsive">
          <table class="ehr-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Category</th>
                <th>Order Name & LOINC</th>
                <th>Patient ID</th>
                <th>Priority</th>
                <th>Ordered At</th>
                <th>Status</th>
                <th>Results / Diagnostic Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let o of filteredOrders" [class.abnormal-row]="o.flaggedAbnormal">
                <td><span class="badge badge-neutral font-mono">#ORD-{{ o.id }}</span></td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + (o.orderType === 'LAB' ? 'primary' : (o.orderType === 'RADIOLOGY' ? 'teal' : 'warning'))">
                    {{ o.orderType }}
                  </span>
                </td>
                <td>
                  <strong>{{ o.orderName }}</strong>
                  <div class="text-sub font-mono" *ngIf="o.loincCode">LOINC: <code>{{ o.loincCode }}</code></div>
                  <div class="text-sub" *ngIf="o.clinicalIndication">Indication: {{ o.clinicalIndication }}</div>
                </td>
                <td>
                  <a [routerLink]="['/patients', o.patientId]" class="patient-link">
                    Patient #{{ o.patientId }}
                  </a>
                </td>
                <td>
                  <span class="badge" [ngClass]="o.priority === 'STAT' ? 'badge-danger' : (o.priority === 'URGENT' ? 'badge-warning' : 'badge-neutral')">
                    {{ o.priority }}
                  </span>
                </td>
                <td>{{ o.orderedAt | date:'short' }}</td>
                <td>
                  <span class="badge" [ngClass]="o.status === 'COMPLETED' ? 'badge-success' : 'badge-warning'">
                    {{ o.status }}
                  </span>
                </td>
                <td>
                  <div *ngIf="o.resultNotes">
                    <span *ngIf="o.flaggedAbnormal" class="text-danger font-bold">⚠️ [ABNORMAL]: </span>
                    <span>{{ o.resultNotes }}</span>
                    <div *ngIf="o.normalRange" class="text-sub">Ref: {{ o.normalRange }}</div>
                  </div>
                  <span *ngIf="!o.resultNotes" class="text-sub">Specimen / scan processing...</span>
                </td>
                <td>
                  <button (click)="openResultModal(o)" class="btn btn-secondary btn-sm">
                    <span>🔬</span> Result / Update
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredOrders.length === 0">
                <td colspan="9" class="empty-state">No CPOE orders matching this filter.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal: Requisition New Order -->
      <div class="modal-backdrop" *ngIf="showNewOrderModal">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3><span>🔬</span> Place CPOE Requisition</h3>
            <button class="close-btn" (click)="closeNewOrderModal()">×</button>
          </div>
          <form (ngSubmit)="submitOrder()">
            <!-- Quick Pre-Set Templates -->
            <div class="template-box">
              <span class="template-title">Standard LOINC Order Templates:</span>
              <div class="template-chips">
                <button type="button" *ngFor="let t of templates" (click)="applyTemplate(t)" class="template-chip">
                  {{ t.name }}
                </button>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-2">
                <label>Patient *</label>
                <select [(ngModel)]="newOrder.patientId" name="patientId" required class="form-control">
                  <option [ngValue]="0" disabled>-- Select Patient --</option>
                  <option *ngFor="let p of patients" [ngValue]="p.id">
                    {{ p.firstName }} {{ p.lastName }} ({{ p.mrn }})
                  </option>
                </select>
              </div>

              <div class="form-group col">
                <label>Order Class *</label>
                <select [(ngModel)]="newOrder.orderType" name="orderType" required class="form-control">
                  <option value="LAB">Laboratory</option>
                  <option value="RADIOLOGY">Radiology / Imaging</option>
                  <option value="PROCEDURE">Procedure / Other</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-2">
                <label>Order / Test Name *</label>
                <input type="text" [(ngModel)]="newOrder.orderName" name="orderName" required class="form-control" placeholder="e.g. Complete Blood Count (CBC)" />
              </div>

              <div class="form-group col">
                <label>LOINC Code</label>
                <input type="text" [(ngModel)]="newOrder.loincCode" name="loincCode" class="form-control font-mono" placeholder="e.g. 58410-2" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Clinical Priority *</label>
                <select [(ngModel)]="newOrder.priority" name="priority" class="form-control">
                  <option value="ROUTINE">Routine</option>
                  <option value="URGENT">Urgent (Within 4 hrs)</option>
                  <option value="STAT">STAT (Immediate Critical)</option>
                </select>
              </div>

              <div class="form-group col-2">
                <label>Clinical Indication / Reason</label>
                <input type="text" [(ngModel)]="newOrder.clinicalIndication" name="clinicalIndication" class="form-control" placeholder="e.g. Suspected anemia or pre-operative clearance" />
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeNewOrderModal()">Cancel</button>
              <button type="submit" [disabled]="submittingOrder" class="btn btn-primary">
                {{ submittingOrder ? 'Submitting Requisition...' : 'Place Order & Send to Lab' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Result / Update Diagnostic Order -->
      <div class="modal-backdrop" *ngIf="selectedOrderForResult">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3><span>🔬</span> Enter Diagnostic Results & Telemetry</h3>
            <button class="close-btn" (click)="closeResultModal()">×</button>
          </div>
          <form (ngSubmit)="submitResults()">
            <div class="order-summary-box">
              <strong>{{ selectedOrderForResult.orderName }}</strong> ({{ selectedOrderForResult.orderType }})
              <div class="text-sub font-mono">Patient #{{ selectedOrderForResult.patientId }} • LOINC: {{ selectedOrderForResult.loincCode || 'N/A' }}</div>
            </div>

            <div class="form-group mt-3">
              <label>Lifecycle Status *</label>
              <select [(ngModel)]="resultForm.status" name="status" class="form-control">
                <option value="IN_PROGRESS">In Progress / Specimen Processing</option>
                <option value="COMPLETED">Completed / Published</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div class="form-group">
              <label>Result Findings / Interpretation</label>
              <textarea [(ngModel)]="resultForm.resultNotes" name="resultNotes" rows="3" class="form-control" placeholder="Enter quantitative values or radiologist impression..."></textarea>
            </div>

            <div class="form-group">
              <label>Biological Reference / Normal Range</label>
              <input type="text" [(ngModel)]="resultForm.normalRange" name="normalRange" class="form-control font-mono" placeholder="e.g. Hemoglobin 13.8 - 17.2 g/dL, WBC 4.5 - 11.0 x10^3/uL" />
            </div>

            <div class="form-group alert-checkbox-group">
              <label class="checkbox-label text-danger">
                <input type="checkbox" [(ngModel)]="resultForm.flaggedAbnormal" name="flaggedAbnormal" />
                <span>⚠️ Flag Result as ABNORMAL (Critical Diagnostic Finding)</span>
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeResultModal()">Cancel</button>
              <button type="submit" [disabled]="submittingResult" class="btn btn-primary">
                {{ submittingResult ? 'Publishing...' : 'Save & Publish Results' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cpoe-page {
      max-width: 1440px;
      margin: 1.5rem auto;
      padding: 0 1.75rem;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
      gap: 1rem;

      h2 { font-size: 1.6rem; }
      .subtitle { color: #64748b; font-size: 0.9rem; margin-top: 0.2rem; }
    }

    .filter-bar {
      padding: 0.65rem 1.15rem;
      margin-bottom: 1.25rem;
      background: white;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
    }

    .filter-tab {
      background: none;
      border: none;
      padding: 0.55rem 0.95rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      border-radius: 8px;
      transition: all 0.15s ease;

      &:hover {
        background: #f1f5f9;
        color: #0f172a;
      }

      &.active {
        background: #0284c7;
        color: white;
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35);
      }
    }

    .table-card {
      padding: 0;
      overflow: hidden;
    }

    .abnormal-row {
      background-color: #fff5f5 !important;
    }

    .patient-link {
      color: #0284c7;
      font-weight: 700;
      text-decoration: none;

      &:hover { text-decoration: underline; }
    }

    .template-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 0.85rem;
      margin-bottom: 1.15rem;

      .template-title {
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        color: #475569;
        margin-bottom: 0.45rem;
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .template-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
      }

      .template-chip {
        background: white;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        padding: 0.3rem 0.65rem;
        font-size: 0.78rem;
        font-weight: 600;
        color: #334155;
        cursor: pointer;
        transition: all 0.15s;

        &:hover {
          background: #e0f2fe;
          border-color: #0284c7;
          color: #0369a1;
        }
      }
    }

    .order-summary-box {
      background: #f8fafc;
      border-radius: 10px;
      padding: 0.85rem 1rem;
      border: 1px solid #e2e8f0;
    }

    .alert-checkbox-group {
      background: #fff5f5;
      padding: 0.85rem 1rem;
      border-radius: 10px;
      border: 1px solid #fecaca;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
    }

    .form-row { display: flex; gap: 1rem; }
    .col { flex: 1; }
    .col-2 { flex: 2; }
    .mt-3 { margin-top: 0.75rem; }
    .font-mono { font-family: 'JetBrains Mono', monospace; }

    .empty-state {
      padding: 3rem;
      text-align: center;
      color: #94a3b8;
    }

    @media (max-width: 768px) {
      .cpoe-page {
        padding: 0.85rem;
        margin: 0.5rem auto;
      }
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
      .filter-tabs {
        overflow-x: auto;
        white-space: nowrap;
        padding-bottom: 0.25rem;
      }
      .form-row {
        flex-direction: column;
        gap: 0;
      }
    }
  `]
})
export class CpoeOrdersComponent implements OnInit {
  orders: MedicalOrder[] = [];
  filteredOrders: MedicalOrder[] = [];
  patients: Patient[] = [];
  currentFilter: 'ALL' | 'PENDING' | 'COMPLETED' | 'ABNORMAL' = 'ALL';

  showNewOrderModal = false;
  submittingOrder = false;

  newOrder: MedicalOrder = {
    patientId: 0,
    orderType: 'LAB',
    orderName: '',
    loincCode: '',
    priority: 'ROUTINE',
    clinicalIndication: ''
  };

  selectedOrderForResult: MedicalOrder | null = null;
  submittingResult = false;
  resultForm = {
    status: 'COMPLETED',
    resultNotes: '',
    normalRange: '',
    flaggedAbnormal: false
  };

  templates: OrderTemplate[] = [
    { name: 'Lipid Profile Panel', type: 'LAB', loinc: '57698-3', priority: 'ROUTINE' },
    { name: 'Complete Blood Count (CBC)', type: 'LAB', loinc: '58410-2', priority: 'ROUTINE' },
    { name: 'Basic Metabolic Panel (BMP)', type: 'LAB', loinc: '24320-4', priority: 'ROUTINE' },
    { name: 'Hemoglobin A1c (HbA1c)', type: 'LAB', loinc: '4548-4', priority: 'ROUTINE' },
    { name: 'Chest X-Ray PA View', type: 'RADIOLOGY', loinc: '36554-4', priority: 'ROUTINE' },
    { name: 'STAT Cardiac Troponin I', type: 'LAB', loinc: '10839-9', priority: 'STAT' },
    { name: 'Brain MRI without Contrast', type: 'RADIOLOGY', loinc: '24725-4', priority: 'URGENT' }
  ];

  constructor(
    private ehrService: EhrService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.route.queryParams.subscribe(params => {
      if (params['patientId']) {
        this.newOrder.patientId = Number(params['patientId']);
        this.openNewOrderModal();
      }
    });
  }

  loadData(): void {
    this.ehrService.getAllOrders().subscribe({
      next: (orders) => {
        this.orders = orders || [];
        this.applyFilter();
        this.cdr.markForCheck();
      },
      error: (e) => console.error(e)
    });

    this.ehrService.getPatients().subscribe({
      next: (patients) => {
        this.patients = patients || [];
        this.cdr.markForCheck();
      },
      error: (e) => console.error(e)
    });
  }

  setFilter(filter: 'ALL' | 'PENDING' | 'COMPLETED' | 'ABNORMAL'): void {
    this.currentFilter = filter;
    this.applyFilter();
  }

  applyFilter(): void {
    if (this.currentFilter === 'ALL') {
      this.filteredOrders = this.orders;
    } else if (this.currentFilter === 'PENDING') {
      this.filteredOrders = this.orders.filter(o => o.status === 'PENDING' || o.status === 'IN_PROGRESS');
    } else if (this.currentFilter === 'COMPLETED') {
      this.filteredOrders = this.orders.filter(o => o.status === 'COMPLETED');
    } else if (this.currentFilter === 'ABNORMAL') {
      this.filteredOrders = this.orders.filter(o => o.flaggedAbnormal);
    }
  }

  getCount(status: string): number {
    return this.orders.filter(o => o.status === status).length;
  }

  getAbnormalCount(): number {
    return this.orders.filter(o => o.flaggedAbnormal).length;
  }

  openNewOrderModal(): void {
    this.showNewOrderModal = true;
  }

  closeNewOrderModal(): void {
    this.showNewOrderModal = false;
  }

  applyTemplate(t: OrderTemplate): void {
    this.newOrder.orderName = t.name;
    this.newOrder.orderType = t.type as any;
    this.newOrder.loincCode = t.loinc;
    this.newOrder.priority = t.priority as any;
  }

  submitOrder(): void {
    if (!this.newOrder.patientId || !this.newOrder.orderName) {
      this.toastService.warning('Validation Warning', 'Please select a patient and specify an order name.');
      return;
    }

    this.submittingOrder = true;
    this.ehrService.placeOrder(this.newOrder).subscribe({
      next: (created) => {
        this.submittingOrder = false;
        this.orders.unshift(created);
        this.applyFilter();
        this.closeNewOrderModal();
        this.toastService.success(
          'CPOE Requisition Submitted',
          `Order #${created.id} for "${created.orderName}" sent to diagnostics.`
        );
      },
      error: (err) => {
        this.submittingOrder = false;
        this.toastService.error('Requisition Failed', err.message);
      }
    });
  }

  openResultModal(order: MedicalOrder): void {
    this.selectedOrderForResult = order;
    this.resultForm = {
      status: order.status || 'COMPLETED',
      resultNotes: order.resultNotes || '',
      normalRange: order.normalRange || '',
      flaggedAbnormal: order.flaggedAbnormal || false
    };
  }

  closeResultModal(): void {
    this.selectedOrderForResult = null;
  }

  submitResults(): void {
    if (!this.selectedOrderForResult?.id) return;
    this.submittingResult = true;

    this.ehrService.updateOrderStatus(this.selectedOrderForResult.id, this.resultForm).subscribe({
      next: (updated) => {
        this.submittingResult = false;
        const idx = this.orders.findIndex(o => o.id === updated.id);
        if (idx >= 0) {
          this.orders[idx] = updated;
        }
        this.applyFilter();
        this.closeResultModal();
        this.toastService.success(
          'Diagnostics Updated',
          `Order #${updated.id} result status saved. Flagged abnormal: ${updated.flaggedAbnormal ? 'YES' : 'NO'}`
        );
      },
      error: (err) => {
        this.submittingResult = false;
        this.toastService.error('Result Update Failed', err.message);
      }
    });
  }
}

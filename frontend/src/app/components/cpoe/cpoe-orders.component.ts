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
          <p class="subtitle">Direct entry of clinical orders for laboratories, diagnostic imaging, and clinical procedures.</p>
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
                <td><span class="badge badge-neutral">#ORD-{{ o.id }}</span></td>
                <td>
                  <span class="badge" [ngClass]="'badge-' + (o.orderType === 'LAB' ? 'primary' : (o.orderType === 'RADIOLOGY' ? 'teal' : 'warning'))">
                    {{ o.orderType }}
                  </span>
                </td>
                <td>
                  <strong>{{ o.orderName }}</strong>
                  <div class="text-sub" *ngIf="o.loincCode">LOINC: <code>{{ o.loincCode }}</code></div>
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
                <td colspan="9" class="text-center py-4">No CPOE orders matching this filter.</td>
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
              <span class="template-title">Standard Healthcare Order Templates:</span>
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
                  <option value="LAB">Laboratory Panel</option>
                  <option value="RADIOLOGY">Diagnostic Radiology</option>
                  <option value="PROCEDURE">Clinical Procedure</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-2">
                <label>Test / Procedure Name *</label>
                <input type="text" [(ngModel)]="newOrder.orderName" name="orderName" required class="form-control" placeholder="e.g. Complete Blood Count (CBC)" />
              </div>
              <div class="form-group col">
                <label>LOINC Code</label>
                <input type="text" [(ngModel)]="newOrder.loincCode" name="loincCode" class="form-control" placeholder="e.g. 58410-2" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Priority *</label>
                <select [(ngModel)]="newOrder.priority" name="priority" required class="form-control">
                  <option value="ROUTINE">Routine</option>
                  <option value="URGENT">Urgent</option>
                  <option value="STAT">STAT (Immediate Emergency)</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Clinical Indication & Diagnosis Justification</label>
              <textarea [(ngModel)]="newOrder.clinicalIndication" name="clinicalIndication" rows="2" class="form-control" placeholder="e.g. Evaluate dyspnea, rule out acute coronary syndrome..."></textarea>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeNewOrderModal()">Cancel</button>
              <button type="submit" [disabled]="submittingOrder" class="btn btn-primary">
                {{ submittingOrder ? 'Placing Order...' : 'Sign & Submit Order' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal: Enter Results / Update Order Status -->
      <div class="modal-backdrop" *ngIf="selectedOrderForResult">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3><span>📝</span> Report Diagnostic Findings</h3>
            <button class="close-btn" (click)="closeResultModal()">×</button>
          </div>
          <form (ngSubmit)="submitResults()">
            <div class="order-summary-box">
              <strong>{{ selectedOrderForResult.orderName }}</strong> ({{ selectedOrderForResult.orderType }})
              <div class="text-sub">Patient #{{ selectedOrderForResult.patientId }} • LOINC: {{ selectedOrderForResult.loincCode || 'N/A' }}</div>
            </div>

            <div class="form-group mt-3">
              <label>Lifecycle Status *</label>
              <select [(ngModel)]="resultForm.status" name="status" class="form-control">
                <option value="IN_PROGRESS">In Progress / Processing</option>
                <option value="COMPLETED">Completed / Resulted</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div class="form-group">
              <label>Result Findings / Interpretation</label>
              <textarea [(ngModel)]="resultForm.resultNotes" name="resultNotes" rows="3" class="form-control" placeholder="Enter quantitative values or radiology radiologist impression..."></textarea>
            </div>

            <div class="form-group">
              <label>Biological Reference / Normal Range</label>
              <input type="text" [(ngModel)]="resultForm.normalRange" name="normalRange" class="form-control" placeholder="e.g. Hemoglobin 13.8 - 17.2 g/dL, WBC 4.5 - 11.0 x10^3/uL" />
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
                {{ submittingResult ? 'Updating...' : 'Save & Publish Results' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .cpoe-page {
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

    .filter-bar {
      padding: 0.5rem 1rem;
      margin-bottom: 1.25rem;
    }

    .filter-tabs {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
    }

    .filter-tab {
      background: none;
      border: none;
      padding: 0.5rem 0.85rem;
      font-size: 0.85rem;
      font-weight: 700;
      color: #64748b;
      cursor: pointer;
      border-radius: 6px;
      transition: all 0.15s ease;

      &:hover {
        background: #f1f5f9;
        color: #0f172a;
      }

      &.active {
        background: #0284c7;
        color: white;
      }
    }

    .abnormal-row {
      background-color: #fff5f5 !important;
    }

    .patient-link {
      color: #0284c7;
      font-weight: 600;
      text-decoration: none;

      &:hover { text-decoration: underline; }
    }

    .template-box {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 0.75rem;
      margin-bottom: 1rem;

      .template-title {
        display: block;
        font-size: 0.75rem;
        font-weight: 700;
        color: #475569;
        margin-bottom: 0.4rem;
      }

      .template-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 0.35rem;
      }

      .template-chip {
        background: white;
        border: 1px solid #cbd5e1;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
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
      border-radius: 8px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
    }

    .alert-checkbox-group {
      background: #fff5f5;
      padding: 0.75rem;
      border-radius: 8px;
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

    @media (max-width: 768px) {
      .cpoe-page {
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
      .filter-tabs {
        overflow-x: auto;
        white-space: nowrap;
        padding-bottom: 0.25rem;
        -webkit-overflow-scrolling: touch;
      }
      .filter-tab {
        flex-shrink: 0;
      }
    }

    @media (max-width: 640px) {
      .cpoe-page {
        padding: 0.75rem;
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
    this.loadOrders();
    this.loadPatients();

    const paramPatientId = Number(this.route.snapshot.queryParamMap.get('patientId'));
    if (paramPatientId) {
      this.newOrder.patientId = paramPatientId;
      this.showNewOrderModal = true;
    }
  }

  loadOrders(): void {
    this.ehrService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data || [];
        this.applyFilter();
        this.cdr.markForCheck();
      },
      error: (e) => {
        console.error(e);
        this.toastService.error('Error', 'Failed to load clinical orders worklist');
        this.cdr.markForCheck();
      }
    });
  }

  loadPatients(): void {
    this.ehrService.getPatients().subscribe({
      next: (data) => {
        this.patients = data || [];
        this.cdr.markForCheck();
      },
      error: (e) => console.error(e)
    });
  }

  setFilter(filter: 'ALL' | 'PENDING' | 'COMPLETED' | 'ABNORMAL'): void {
    this.currentFilter = filter;
    this.applyFilter();
    this.cdr.markForCheck();
  }

  applyFilter(): void {
    if (this.currentFilter === 'ALL') {
      this.filteredOrders = this.orders;
    } else if (this.currentFilter === 'ABNORMAL') {
      this.filteredOrders = this.orders.filter(o => o.flaggedAbnormal);
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.currentFilter);
    }
  }

  getCount(status: string): number {
    return this.orders.filter(o => o.status === status).length;
  }

  getAbnormalCount(): number {
    return this.orders.filter(o => o.flaggedAbnormal).length;
  }

  applyTemplate(t: OrderTemplate): void {
    this.newOrder.orderName = t.name;
    this.newOrder.orderType = t.type;
    this.newOrder.loincCode = t.loinc;
    this.newOrder.priority = t.priority;
    this.cdr.markForCheck();
  }

  openNewOrderModal(): void {
    this.showNewOrderModal = true;
    this.cdr.markForCheck();
  }

  closeNewOrderModal(): void {
    this.showNewOrderModal = false;
    this.submittingOrder = false;
    this.cdr.markForCheck();
  }

  submitOrder(): void {
    if (!this.newOrder.patientId || !this.newOrder.orderName) {
      this.toastService.warning('Validation Warning', 'Please select a patient and enter a test/procedure name.');
      return;
    }

    this.submittingOrder = true;
    this.cdr.markForCheck();

    this.ehrService.placeOrder(this.newOrder).subscribe({
      next: (placed) => {
        this.submittingOrder = false;
        this.orders.unshift(placed);
        this.applyFilter();
        this.closeNewOrderModal();
        this.toastService.success(
          'CPOE Order Placed',
          `Order #${placed.id} for "${placed.orderName}" submitted successfully in worklist.`
        );
        // Reset form
        this.newOrder = {
          patientId: 0,
          orderType: 'LAB',
          orderName: '',
          loincCode: '',
          priority: 'ROUTINE',
          clinicalIndication: ''
        };
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.submittingOrder = false;
        this.toastService.error('Order Placement Failed', err.error?.message || err.message);
        this.cdr.markForCheck();
      }
    });
  }

  openResultModal(order: MedicalOrder): void {
    this.selectedOrderForResult = order;
    this.resultForm.status = order.status || 'COMPLETED';
    this.resultForm.resultNotes = order.resultNotes || '';
    this.resultForm.normalRange = order.normalRange || '';
    this.resultForm.flaggedAbnormal = order.flaggedAbnormal || false;
    this.cdr.markForCheck();
  }

  closeResultModal(): void {
    this.selectedOrderForResult = null;
    this.submittingResult = false;
    this.cdr.markForCheck();
  }

  submitResults(): void {
    if (!this.selectedOrderForResult?.id) return;
    this.submittingResult = true;
    this.cdr.markForCheck();

    this.ehrService.updateOrderStatus(this.selectedOrderForResult.id, this.resultForm).subscribe({
      next: (updated) => {
        this.submittingResult = false;
        const idx = this.orders.findIndex(o => o.id === updated.id);
        if (idx >= 0) this.orders[idx] = updated;
        this.applyFilter();
        this.closeResultModal();
        this.toastService.success(
          'Diagnostic Result Updated',
          `Results reported for ${updated.orderName}. Status: ${updated.status}`
        );
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.submittingResult = false;
        this.toastService.error('Result Update Failed', err.error?.message || err.message);
        this.cdr.markForCheck();
      }
    });
  }
}

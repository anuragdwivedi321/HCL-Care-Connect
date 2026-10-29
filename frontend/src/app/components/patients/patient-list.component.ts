import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EhrService } from '../../services/ehr.service';
import { ToastService } from '../../services/toast.service';
import { Patient } from '../../models/ehr.models';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="patients-page">
      <div class="page-header">
        <div>
          <h2>Patient Master Index (EMPI)</h2>
          <p class="subtitle">Search, filter, and register patient medical charts across all clinical departments.</p>
        </div>
        <button (click)="openRegisterModal()" class="btn btn-primary">
          <span>➕</span> Register New Patient
        </button>
      </div>

      <!-- Quick Metrics Summary Bar -->
      <div class="metrics-bar card">
        <div class="metric-pill">
          <span class="m-icon">👥</span>
          <div>
            <span class="m-val">{{ patients.length }}</span>
            <span class="m-lbl">Total Patients</span>
          </div>
        </div>
        <div class="metric-pill">
          <span class="m-icon">🚹</span>
          <div>
            <span class="m-val">{{ getMaleCount() }}</span>
            <span class="m-lbl">Male Cohort</span>
          </div>
        </div>
        <div class="metric-pill">
          <span class="m-icon">🚺</span>
          <div>
            <span class="m-val">{{ getFemaleCount() }}</span>
            <span class="m-lbl">Female Cohort</span>
          </div>
        </div>
        <div class="metric-pill alert-pill">
          <span class="m-icon">⚠️</span>
          <div>
            <span class="m-val">{{ getChronicCount() }}</span>
            <span class="m-lbl">Chronic Alert Cohort</span>
          </div>
        </div>
      </div>

      <!-- Search & Filters Toolbar -->
      <div class="card search-card">
        <div class="search-flex">
          <div class="search-bar">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (input)="onSearch()"
              placeholder="Search by Name, Medical Record Number (MRN), phone, or city..."
              class="search-input"
            />
            <button *ngIf="searchQuery" (click)="clearSearch()" class="btn btn-secondary btn-sm">Clear</button>
          </div>

          <!-- Quick Condition Filter Pills -->
          <div class="filter-chips">
            <button (click)="filterCondition('ALL')" [class.active]="activeCondition === 'ALL'" class="chip-btn">
              All
            </button>
            <button (click)="filterCondition('Hypertension')" [class.active]="activeCondition === 'Hypertension'" class="chip-btn">
              Hypertension (I10)
            </button>
            <button (click)="filterCondition('Diabetes')" [class.active]="activeCondition === 'Diabetes'" class="chip-btn">
              Diabetes (E11)
            </button>
            <button (click)="filterCondition('Coronary')" [class.active]="activeCondition === 'Coronary'" class="chip-btn">
              Cardiac (I25)
            </button>
          </div>
        </div>
      </div>

      <!-- Patients Table -->
      <div class="card table-card">
        <div class="table-responsive">
          <table class="ehr-table">
            <thead>
              <tr>
                <th>Patient Details</th>
                <th>Medical Record #</th>
                <th>Demographics</th>
                <th>Contact & Location</th>
                <th>Clinical Allergies & Conditions</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr *ngIf="loading">
                <td colspan="6" class="table-state-cell">
                  <div class="table-spinner"></div>
                  <span>Loading patient directory from database...</span>
                </td>
              </tr>

              <!-- Error State -->
              <tr *ngIf="!loading && loadError">
                <td colspan="6" class="table-state-cell text-danger">
                  <div style="font-size: 1.5rem; margin-bottom: 0.35rem;">⚠️</div>
                  <strong>Database Connection Issue:</strong>
                  <p style="margin: 0.25rem 0 0.75rem 0; font-size: 0.85rem;">{{ loadError }}</p>
                  <button type="button" class="btn btn-sm btn-secondary" (click)="loadPatients()">↻ Refresh / Retry</button>
                </td>
              </tr>

              <!-- Patient Records Rows -->
              <ng-container *ngIf="!loading && !loadError">
                <tr *ngFor="let p of filteredPatients" (click)="openChart(p.id)" class="patient-row clickable-row" title="Click anywhere on row to open chart">
                  <td>
                    <div class="patient-profile-cell">
                      <div class="patient-avatar">{{ getAvatarInitials(p) }}</div>
                      <div>
                        <div class="patient-name">{{ p.firstName }} {{ p.lastName || '' }}</div>
                        <div class="blood-badge" *ngIf="p.bloodGroup">
                          <span class="blood-dot"></span> Blood Group: <strong>{{ p.bloodGroup }}</strong>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span class="badge badge-primary mrn-badge">{{ p.mrn }}</span>
                  </td>
                  <td>
                    <div class="demographics-text">
                      <strong>{{ calculateAge(p.dateOfBirth) }} yrs</strong> • {{ p.gender }}
                    </div>
                    <div class="text-sub">DOB: {{ p.dateOfBirth }}</div>
                  </td>
                  <td>
                    <div>📞 {{ p.phone || 'No phone' }}</div>
                    <div class="text-sub">📍 {{ p.city }}, {{ p.state }}</div>
                  </td>
                  <td>
                    <div *ngIf="p.allergies" class="allergy-badge">
                      <span>⚠️</span> {{ p.allergies }}
                    </div>
                    <div *ngIf="!p.allergies" class="text-sub">No known drug allergies (NKDA)</div>
                    <div *ngIf="p.chronicConditions" class="conditions-tag">
                      🩺 {{ p.chronicConditions }}
                    </div>
                  </td>
                  <td>
                    <button type="button" (click)="openChart(p.id, $event)" class="btn btn-secondary btn-sm chart-btn">
                      <span>📂</span> Open Chart
                    </button>
                  </td>
                </tr>

                <tr *ngIf="filteredPatients.length === 0">
                  <td colspan="6" class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <strong>No matching patient records found</strong>
                    <p>Try clearing your search query or registering a new patient record.</p>
                  </td>
                </tr>
              </ng-container>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Modal: Register Patient -->
      <div class="modal-backdrop" *ngIf="showModal">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3><span>👤</span> New Patient Registration (EMPI)</h3>
            <div class="modal-header-actions">
              <button type="button" class="btn btn-sm btn-secondary autofill-btn" (click)="autoFillSamplePatient()">
                <span>🎲</span> Auto-Fill Sample
              </button>
              <button class="close-btn" (click)="closeModal()">×</button>
            </div>
          </div>
          <form (ngSubmit)="submitPatient()">
            <div class="form-row">
              <div class="form-group col">
                <label>First Name *</label>
                <input type="text" [(ngModel)]="newPatient.firstName" name="firstName" required class="form-control" placeholder="e.g. Vikram" />
              </div>
              <div class="form-group col">
                <label>Last Name *</label>
                <input type="text" [(ngModel)]="newPatient.lastName" name="lastName" required class="form-control" placeholder="e.g. Malhotra" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Date of Birth *</label>
                <input type="date" [(ngModel)]="newPatient.dateOfBirth" name="dateOfBirth" required class="form-control" />
              </div>
              <div class="form-group col">
                <label>Gender *</label>
                <select [(ngModel)]="newPatient.gender" name="gender" required class="form-control">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="form-group col">
                <label>Blood Group</label>
                <select [(ngModel)]="newPatient.bloodGroup" name="bloodGroup" class="form-control">
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Contact Phone</label>
                <input type="text" [(ngModel)]="newPatient.phone" name="phone" class="form-control" placeholder="+91 98765 00000" />
              </div>
              <div class="form-group col">
                <label>Email Address</label>
                <input type="email" [(ngModel)]="newPatient.email" name="email" class="form-control" placeholder="patient@example.com" />
              </div>
            </div>

            <div class="form-group">
              <label>Residential Address</label>
              <input type="text" [(ngModel)]="newPatient.address" name="address" class="form-control" placeholder="House/Flat No, Street, Landmark" />
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>City</label>
                <input type="text" [(ngModel)]="newPatient.city" name="city" class="form-control" placeholder="Bengaluru" />
              </div>
              <div class="form-group col">
                <label>State</label>
                <input type="text" [(ngModel)]="newPatient.state" name="state" class="form-control" placeholder="Karnataka" />
              </div>
              <div class="form-group col">
                <label>Postal Code</label>
                <input type="text" [(ngModel)]="newPatient.postalCode" name="postalCode" class="form-control" placeholder="560001" />
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col">
                <label>Emergency Contact Name</label>
                <input type="text" [(ngModel)]="newPatient.emergencyContactName" name="emergencyContactName" class="form-control" placeholder="Relative Name" />
              </div>
              <div class="form-group col">
                <label>Emergency Contact Phone</label>
                <input type="text" [(ngModel)]="newPatient.emergencyContactPhone" name="emergencyContactPhone" class="form-control" placeholder="+91 98765 11111" />
              </div>
            </div>

            <div class="form-group">
              <label>Drug & Environmental Allergies (Safety Alert)</label>
              <input
                type="text"
                [(ngModel)]="newPatient.allergies"
                name="allergies"
                class="form-control"
                placeholder="e.g. Penicillin, NSAIDs, Sulfa drugs (Leave blank if NKDA)"
              />
            </div>

            <div class="form-group">
              <label>Chronic Medical Conditions</label>
              <input
                type="text"
                [(ngModel)]="newPatient.chronicConditions"
                name="chronicConditions"
                class="form-control"
                placeholder="e.g. Essential Hypertension, Type 2 Diabetes Mellitus"
              />
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeModal()">Cancel</button>
              <button type="submit" [disabled]="submitting" class="btn btn-primary">
                {{ submitting ? 'Registering...' : 'Save & Generate MRN' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .patients-page {
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
    }

    .subtitle {
      color: #64748b;
      font-size: 0.9rem;
      margin-top: 0.25rem;
    }

    /* Metrics Bar */
    .metrics-bar {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      padding: 1.15rem 1.5rem;
      margin-bottom: 1.5rem;
      background: white;
    }

    .metric-pill {
      display: flex;
      align-items: center;
      gap: 0.85rem;

      .m-icon {
        width: 44px;
        height: 44px;
        border-radius: 12px;
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.35rem;
      }

      .m-val {
        display: block;
        font-size: 1.45rem;
        font-weight: 800;
        color: #0f172a;
        line-height: 1.1;
      }

      .m-lbl {
        font-size: 0.78rem;
        color: #64748b;
        font-weight: 600;
      }

      &.alert-pill {
        .m-icon { background: #fee2e2; }
        .m-val { color: #dc2626; }
      }
    }

    /* Search Toolbar */
    .search-card {
      margin-bottom: 1.5rem;
      padding: 1.15rem 1.5rem;
    }

    .search-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1.25rem;
      flex-wrap: wrap;
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 0.45rem 0.85rem;
      flex: 1;
      min-width: 280px;

      .search-icon {
        font-size: 1.1rem;
        color: #94a3b8;
      }

      .search-input {
        border: none;
        background: transparent;
        outline: none;
        font-size: 0.9rem;
        width: 100%;
        color: #0f172a;

        &::placeholder {
          color: #94a3b8;
        }
      }
    }

    .filter-chips {
      display: flex;
      gap: 0.45rem;
      flex-wrap: wrap;
    }

    .chip-btn {
      background: #f1f5f9;
      border: 1px solid #e2e8f0;
      color: #475569;
      padding: 0.45rem 0.85rem;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #e2e8f0;
        color: #0f172a;
      }

      &.active {
        background: #0284c7;
        color: white;
        border-color: #0284c7;
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.35);
      }
    }

    /* Table Styles */
    .table-card {
      padding: 0;
      overflow: hidden;
    }

    .clickable-row {
      cursor: pointer;
      transition: background-color 0.15s ease;

      &:hover {
        background-color: #f0f9ff !important;
      }
    }

    .patient-profile-cell {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .patient-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #0d9488);
      color: white;
      font-weight: 800;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(2, 132, 199, 0.25);
    }

    .patient-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: #0f172a;
    }

    .blood-badge {
      font-size: 0.72rem;
      color: #b91c1c;
      margin-top: 0.15rem;
      display: flex;
      align-items: center;
      gap: 0.3rem;

      .blood-dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #dc2626;
      }
    }

    .mrn-badge {
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      font-size: 0.8rem;
    }

    .demographics-text {
      font-size: 0.875rem;
      color: #0f172a;
    }

    .text-sub {
      font-size: 0.75rem;
      color: #64748b;
      margin-top: 0.15rem;
    }

    .allergy-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      background: #fee2e2;
      color: #dc2626;
      border: 1px solid rgba(239, 68, 68, 0.25);
      border-radius: 4px;
      padding: 0.2rem 0.5rem;
      font-size: 0.74rem;
      font-weight: 700;
      margin-bottom: 0.2rem;
    }

    .conditions-tag {
      font-size: 0.75rem;
      color: #0369a1;
      font-weight: 600;
    }

    .chart-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;

      &:hover {
        background: #0284c7;
        color: white;
        border-color: #0284c7;
      }
    }

    .table-state-cell {
      padding: 3rem 1.5rem;
      text-align: center;
      color: #64748b;
    }

    .table-spinner {
      width: 24px;
      height: 24px;
      border: 3px solid #e2e8f0;
      border-top-color: #0284c7;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      margin: 0 auto 0.75rem auto;
    }

    .empty-state {
      padding: 3.5rem 1.5rem;
      text-align: center;

      .empty-icon {
        font-size: 2.2rem;
        margin-bottom: 0.5rem;
      }

      strong {
        display: block;
        font-size: 1.05rem;
        color: #0f172a;
        margin-bottom: 0.25rem;
      }

      p {
        font-size: 0.85rem;
        color: #64748b;
      }
    }

    /* Modal Form Rows */
    .modal-header-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .autofill-btn {
      background: #f0fdf4;
      border-color: #86efac;
      color: #166534;
      font-weight: 600;

      &:hover {
        background: #dcfce7;
      }
    }

    .form-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 0.25rem;

      .col {
        flex: 1;
      }

      @media (max-width: 600px) {
        flex-direction: column;
        gap: 0;
      }
    }

    @media (max-width: 768px) {
      .patients-page {
        padding: 0.85rem;
        margin: 0.5rem auto;
      }
      .page-header {
        flex-direction: column;
        align-items: stretch;
      }
      .search-flex {
        flex-direction: column;
        align-items: stretch;
      }
    }
  `]
})
export class PatientListComponent implements OnInit {
  patients: Patient[] = [];
  filteredPatients: Patient[] = [];
  loading = false;
  loadError = '';
  submitting = false;
  searchQuery = '';
  activeCondition = 'ALL';
  showModal = false;

  newPatient: Patient = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    allergies: '',
    chronicConditions: '',
    emergencyContactName: '',
    emergencyContactPhone: ''
  };

  constructor(
    private ehrService: EhrService,
    private toastService: ToastService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.loading = true;
    this.loadError = '';
    this.cdr.markForCheck();

    this.ehrService.getPatients().subscribe({
      next: (data) => {
        this.loading = false;
        this.patients = data || [];
        this.applyFilters();
        this.cdr.markForCheck();
      },
      error: (e) => {
        this.loading = false;
        this.loadError = e.error?.message || e.message || 'Unable to load patients from database.';
        this.toastService.error('Connection Error', this.loadError);
        this.cdr.markForCheck();
      }
    });
  }

  openChart(patientId?: number, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (patientId) {
      this.router.navigate(['/patients', patientId]);
    }
  }

  getAvatarInitials(p: Patient): string {
    if (!p) return 'PT';
    const f = (p.firstName || '').trim().charAt(0);
    const l = (p.lastName || '').trim().charAt(0);
    return (f + l).toUpperCase() || 'PT';
  }

  getMaleCount(): number {
    return this.patients.filter(p => p.gender === 'Male').length;
  }

  getFemaleCount(): number {
    return this.patients.filter(p => p.gender === 'Female').length;
  }

  getChronicCount(): number {
    return this.patients.filter(p => !!p.chronicConditions).length;
  }

  onSearch(): void {
    this.applyFilters();
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.applyFilters();
  }

  filterCondition(condition: string): void {
    this.activeCondition = condition;
    this.applyFilters();
  }

  applyFilters(): void {
    let list = this.patients;

    if (this.activeCondition !== 'ALL') {
      list = list.filter(p => p.chronicConditions && p.chronicConditions.toLowerCase().includes(this.activeCondition.toLowerCase()));
    }

    const q = this.searchQuery.toLowerCase().trim();
    if (q) {
      list = list.filter(p =>
        p.firstName.toLowerCase().includes(q) ||
        p.lastName.toLowerCase().includes(q) ||
        (p.mrn && p.mrn.toLowerCase().includes(q)) ||
        (p.phone && p.phone.includes(q)) ||
        (p.city && p.city.toLowerCase().includes(q))
      );
    }

    this.filteredPatients = list;
  }

  openRegisterModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  autoFillSamplePatient(): void {
    const samples = [
      {
        firstName: 'Meera',
        lastName: 'Iyer',
        dateOfBirth: '1988-06-14',
        gender: 'Female',
        bloodGroup: 'B+',
        phone: '+91 98450 12345',
        email: 'meera.iyer@example.com',
        address: '42 Orchid Residency, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560038',
        allergies: 'Penicillin, Sulfonamides',
        chronicConditions: 'Asthma, Mild Hypertension',
        emergencyContactName: 'Karthik Iyer (Spouse)',
        emergencyContactPhone: '+91 98450 67890'
      },
      {
        firstName: 'Arjun',
        lastName: 'Kapoor',
        dateOfBirth: '1975-11-20',
        gender: 'Male',
        bloodGroup: 'O+',
        phone: '+91 97110 54321',
        email: 'arjun.k@example.com',
        address: '15 Park Street, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        allergies: 'Aspirin (Bronchospasm)',
        chronicConditions: 'Coronary Artery Disease, Hyperlipidemia',
        emergencyContactName: 'Sunita Kapoor (Wife)',
        emergencyContactPhone: '+91 97110 99887'
      }
    ];

    const pick = samples[Math.floor(Math.random() * samples.length)];
    this.newPatient = { ...pick };
    this.toastService.info('Sample Generated', `Loaded details for ${pick.firstName} ${pick.lastName}`);
  }

  submitPatient(): void {
    if (!this.newPatient.firstName || !this.newPatient.lastName || !this.newPatient.dateOfBirth) {
      this.toastService.warning('Validation Warning', 'Please provide First Name, Last Name and Date of Birth');
      return;
    }

    this.submitting = true;
    this.ehrService.createPatient(this.newPatient).subscribe({
      next: (created) => {
        this.submitting = false;
        this.patients.unshift(created);
        this.applyFilters();
        this.closeModal();
        this.toastService.success(
          'Patient Registered',
          `Successfully generated Medical Record ${created.mrn} for ${created.firstName} ${created.lastName}`
        );
      },
      error: (err) => {
        this.submitting = false;
        this.toastService.error('Registration Failed', err.error?.message || err.message);
      }
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

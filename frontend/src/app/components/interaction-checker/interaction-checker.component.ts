import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface RuleCard {
  drugA: string;
  drugB: string;
  severity: 'HIGH' | 'MODERATE' | 'LOW';
  mechanism: string;
  recommendation: string;
}

@Component({
  selector: 'app-interaction-checker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="checker-page">
      <div class="page-header">
        <div>
          <h2>Pharmacology & Drug-Drug Interaction Safety Engine</h2>
          <p class="subtitle">Clinical decision support tool for cross-referencing multi-drug interactions, contraindications, and adverse reactions.</p>
        </div>
      </div>

      <!-- Simulator Card -->
      <div class="card check-card">
        <h3>Pairwise Drug Interaction Test</h3>
        <p class="text-sub mb-3">Select or enter two medications to test for pharmacological contraindications.</p>

        <div class="drugs-selector">
          <div class="form-group flex-1">
            <label>Medication A</label>
            <input
              type="text"
              [(ngModel)]="drugA"
              (input)="evaluate()"
              list="drug-list"
              class="form-control"
              placeholder="e.g. Warfarin, Lisinopril, Clopidogrel"
            />
          </div>

          <div class="vs-badge">VS</div>

          <div class="form-group flex-1">
            <label>Medication B</label>
            <input
              type="text"
              [(ngModel)]="drugB"
              (input)="evaluate()"
              list="drug-list"
              class="form-control"
              placeholder="e.g. Aspirin, Spironolactone, Omeprazole"
            />
          </div>
        </div>

        <datalist id="drug-list">
          <option value="Warfarin"></option>
          <option value="Aspirin"></option>
          <option value="Lisinopril"></option>
          <option value="Spironolactone"></option>
          <option value="Metformin"></option>
          <option value="Iodinated Contrast"></option>
          <option value="Clopidogrel"></option>
          <option value="Omeprazole"></option>
          <option value="Simvastatin"></option>
          <option value="Amiodarone"></option>
        </datalist>

        <!-- Quick Pair Buttons -->
        <div class="quick-pairs">
          <span class="quick-title">Quick Test Common High-Risk Pairs:</span>
          <button (click)="testPair('Warfarin', 'Aspirin')" class="pair-pill">Warfarin + Aspirin</button>
          <button (click)="testPair('Lisinopril', 'Spironolactone')" class="pair-pill">Lisinopril + Spironolactone</button>
          <button (click)="testPair('Metformin', 'Iodinated Contrast')" class="pair-pill">Metformin + Contrast</button>
          <button (click)="testPair('Clopidogrel', 'Omeprazole')" class="pair-pill">Clopidogrel + Omeprazole</button>
          <button (click)="testPair('Simvastatin', 'Amiodarone')" class="pair-pill">Simvastatin + Amiodarone</button>
        </div>

        <!-- Evaluation Outcome -->
        <div *ngIf="matchedRule" class="result-box mt-3" [ngClass]="'sev-box-' + matchedRule.severity.toLowerCase()">
          <div class="result-header">
            <div class="severity-tag" [ngClass]="'sev-' + matchedRule.severity.toLowerCase()">
              {{ matchedRule.severity }} CLINICAL RISK IDENTIFIED
            </div>
            <span class="drugs-combo">{{ matchedRule.drugA }} ↔ {{ matchedRule.drugB }}</span>
          </div>

          <div class="result-details">
            <strong>Adverse Mechanism:</strong>
            <p>{{ matchedRule.mechanism }}</p>
          </div>

          <div class="recommendation-box">
            <strong>💡 Clinical Management Protocol:</strong>
            <p>{{ matchedRule.recommendation }}</p>
          </div>
        </div>

        <div *ngIf="evaluated && !matchedRule" class="safe-box mt-3">
          <span>✅</span>
          <div>
            <strong>No Known High/Moderate Clinical Interaction in Primary Formulary</strong>
            <p>Always review patient renal/hepatic function and standard dosing guidelines before prescribing.</p>
          </div>
        </div>
      </div>

      <!-- Standard Clinical Interaction Knowledge Base Reference -->
      <div class="card mt-4">
        <h3>EHR Knowledge Base: High Alert Drug Pairs</h3>
        <p class="text-sub mb-3">Pre-configured safety rules integrated into CareConnect EHR e-prescribing workflow.</p>

        <div class="table-responsive">
          <table class="ehr-table">
            <thead>
              <tr>
                <th>Drug 1</th>
                <th>Drug 2</th>
                <th>Severity</th>
                <th>Clinical Risk Description</th>
                <th>Action Recommendation</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let r of rules">
                <td><strong>{{ r.drugA }}</strong></td>
                <td><strong>{{ r.drugB }}</strong></td>
                <td>
                  <span class="badge" [ngClass]="r.severity === 'HIGH' ? 'badge-danger' : 'badge-warning'">
                    {{ r.severity }}
                  </span>
                </td>
                <td>{{ r.mechanism }}</td>
                <td><small>{{ r.recommendation }}</small></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .checker-page {
      max-width: 1400px;
      margin: 1.5rem auto;
      padding: 0 1.5rem;
    }

    .page-header {
      margin-bottom: 1.5rem;
      h2 { font-size: 1.6rem; }
      .subtitle { color: #64748b; font-size: 0.9rem; margin-top: 0.2rem; }
    }

    .check-card {
      background: white;
      padding: 1.5rem;
    }

    .drugs-selector {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .flex-1 { flex: 1; }

    .vs-badge {
      background: #f1f5f9;
      color: #64748b;
      font-weight: 800;
      font-size: 0.75rem;
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid #cbd5e1;
      margin-top: 1rem;
    }

    .quick-pairs {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.5rem;

      .quick-title {
        font-size: 0.75rem;
        font-weight: 700;
        color: #64748b;
      }

      .pair-pill {
        background: #f8fafc;
        border: 1px solid #cbd5e1;
        border-radius: 20px;
        padding: 0.3rem 0.75rem;
        font-size: 0.75rem;
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

    .result-box {
      border-radius: 12px;
      padding: 1.25rem;

      &.sev-box-high {
        background: #fff1f2;
        border: 2px solid #f43f5e;
      }

      &.sev-box-moderate {
        background: #fffbeb;
        border: 2px solid #f59e0b;
      }

      .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.75rem;
      }

      .severity-tag {
        font-size: 0.8rem;
        font-weight: 800;
        padding: 0.25rem 0.6rem;
        border-radius: 4px;

        &.sev-high { background: #e11d48; color: white; }
        &.sev-moderate { background: #d97706; color: white; }
      }

      .drugs-combo {
        font-size: 1rem;
        font-weight: 800;
        color: #0f172a;
      }

      .result-details {
        font-size: 0.85rem;
        color: #334155;
        margin-bottom: 0.75rem;
      }

      .recommendation-box {
        background: white;
        padding: 0.75rem;
        border-radius: 8px;
        border: 1px solid rgba(0, 0, 0, 0.08);
        font-size: 0.85rem;
        color: #0f172a;
      }
    }

    .safe-box {
      background: #f0fdf4;
      border: 1px solid #bbf7d0;
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      color: #166534;
      font-size: 0.85rem;

      span { font-size: 1.5rem; }
    }

    .mt-3 { margin-top: 1rem; }
    .mt-4 { margin-top: 1.5rem; }
    .mb-3 { margin-bottom: 1rem; }
    .text-sub { font-size: 0.75rem; color: #64748b; }
  `]
})
export class InteractionCheckerComponent {
  drugA = '';
  drugB = '';
  evaluated = false;
  matchedRule: RuleCard | null = null;

  rules: RuleCard[] = [
    {
      drugA: 'Warfarin',
      drugB: 'Aspirin',
      severity: 'HIGH',
      mechanism: 'Concurrent use significantly increases risk of major gastrointestinal and systemic bleeding due to dual inhibition of clotting cascade and platelet aggregation.',
      recommendation: 'Avoid combination unless specifically indicated (e.g. mechanical heart valve); close INR monitoring mandatory.'
    },
    {
      drugA: 'Lisinopril',
      drugB: 'Spironolactone',
      severity: 'HIGH',
      mechanism: 'Concurrent ACE inhibitor and potassium-sparing diuretic can cause severe, life-threatening hyperkalemia and acute kidney injury.',
      recommendation: 'Monitor serum potassium and renal function within 1 week of co-administration.'
    },
    {
      drugA: 'Metformin',
      drugB: 'Iodinated Contrast',
      severity: 'HIGH',
      mechanism: 'Risk of lactic acidosis in patients undergoing radiographic procedures with iodinated contrast media due to contrast-induced nephropathy.',
      recommendation: 'Discontinue metformin prior to or at time of procedure; withhold for 48 hours post-procedure until renal function confirmed normal.'
    },
    {
      drugA: 'Clopidogrel',
      drugB: 'Omeprazole',
      severity: 'MODERATE',
      mechanism: 'Omeprazole inhibits CYP2C19, significantly reducing the antiplatelet efficacy of clopidogrel.',
      recommendation: 'Consider alternative acid suppressant such as Pantoprazole or H2-receptor antagonist (Famotidine).'
    },
    {
      drugA: 'Simvastatin',
      drugB: 'Amiodarone',
      severity: 'MODERATE',
      mechanism: 'Amiodarone inhibits CYP3A4 metabolism of simvastatin, increasing systemic statin exposure and risk of rhabdomyolysis.',
      recommendation: 'Do not exceed simvastatin 20 mg daily when co-administered with amiodarone, or switch to Rosuvastatin.'
    }
  ];

  testPair(a: string, b: string): void {
    this.drugA = a;
    this.drugB = b;
    this.evaluate();
  }

  evaluate(): void {
    if (!this.drugA || !this.drugB) {
      this.matchedRule = null;
      this.evaluated = false;
      return;
    }

    this.evaluated = true;
    const da = this.drugA.toLowerCase().trim();
    const db = this.drugB.toLowerCase().trim();

    this.matchedRule = this.rules.find(r =>
      (r.drugA.toLowerCase() === da && r.drugB.toLowerCase() === db) ||
      (r.drugA.toLowerCase() === db && r.drugB.toLowerCase() === da)
    ) || null;
  }
}

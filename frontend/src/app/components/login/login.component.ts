import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-layout">
        <!-- Left Hero Section (Enterprise Clinical Branding) -->
        <div class="hero-panel">
          <div class="hero-content">
            <div class="hero-brand">
              <span class="hero-logo-icon">⚕</span>
              <div>
                <h1 class="hero-title">CareConnect EHR</h1>
                <span class="hero-badge">Clinical Edition 2026</span>
              </div>
            </div>

            <h2 class="hero-headline">
              Modern Clinical Intelligence & Patient Care Platform.
            </h2>
            <p class="hero-desc">
              Secure, standards-compliant Electronic Health Record system with certified SOAP clinical documentation, CPOE diagnostic workflows, and automated drug safety checks.
            </p>

            <!-- Feature Highlights -->
            <div class="hero-features">
              <div class="feature-card">
                <span class="f-icon">📋</span>
                <div>
                  <strong>SOAP Documentation</strong>
                  <p>ICD-10 coding & digital clinician signatures</p>
                </div>
              </div>
              <div class="feature-card">
                <span class="f-icon">🔬</span>
                <div>
                  <strong>CPOE Lab Orders</strong>
                  <p>LOINC tagged with automated abnormal alerts</p>
                </div>
              </div>
              <div class="feature-card">
                <span class="f-icon">🛡️</span>
                <div>
                  <strong>Drug Safety Engine</strong>
                  <p>Real-time Drug-Drug Interaction prevention</p>
                </div>
              </div>
              <div class="feature-card">
                <span class="f-icon">🔒</span>
                <div>
                  <strong>Database Verified</strong>
                  <p>Encrypted credentials & secure access controls</p>
                </div>
              </div>
            </div>

            <div class="hero-footer">
              <span class="compliance-tag">🛡️ HIPAA Security Rule Compliant</span>
              <span class="compliance-tag">⚡ Spring Boot + Angular + H2/Oracle DB</span>
            </div>
          </div>
        </div>

        <!-- Right Panel: Auth Card (Sign In & Sign Up) -->
        <div class="form-panel">
          <div class="form-card">
            <div class="card-header">
              <h2>CareConnect Portal</h2>
              <p>Sign in with verified credentials or register a new user account.</p>
            </div>

            <!-- Tab Switcher -->
            <div class="auth-tabs">
              <button 
                type="button" 
                class="tab-btn" 
                [class.active]="activeTab === 'login'" 
                (click)="switchTab('login')">
                <span>🔐 Sign In</span>
              </button>
              <button 
                type="button" 
                class="tab-btn" 
                [class.active]="activeTab === 'register'" 
                (click)="switchTab('register')">
                <span>📝 Sign Up (New User)</span>
              </button>
            </div>

            <!-- ================= SIGN IN TAB ================= -->
            <form *ngIf="activeTab === 'login'" (ngSubmit)="onLoginSubmit()" class="auth-form">
              <div class="form-group" [class.has-error]="fieldErrors['loginUsername']">
                <label for="login-username">Username, Full Name, or Email *</label>
                <div class="input-wrap">
                  <span class="input-icon">👤</span>
                  <input
                    type="text"
                    id="login-username"
                    name="loginUsername"
                    [(ngModel)]="loginData.username"
                    class="form-control"
                    placeholder="e.g. devansh.dubey or Devansh Dubey"
                    autocomplete="username"
                  />
                </div>
                <span *ngIf="fieldErrors['loginUsername']" class="error-hint">{{ fieldErrors['loginUsername'] }}</span>
              </div>

              <div class="form-group" [class.has-error]="fieldErrors['loginPassword']">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <label for="login-password">Password *</label>
                  <button type="button" class="link-btn" style="font-size: 0.78rem;" (click)="toggleResetPassword()">
                    {{ showResetPassword ? '← Back to Login' : 'Forgot / Reset Password?' }}
                  </button>
                </div>
                <div class="input-wrap">
                  <span class="input-icon">🔑</span>
                  <input
                    type="password"
                    id="login-password"
                    name="loginPassword"
                    [(ngModel)]="loginData.password"
                    class="form-control"
                    placeholder="Enter your password"
                    autocomplete="current-password"
                  />
                </div>
                <span *ngIf="fieldErrors['loginPassword']" class="error-hint">{{ fieldErrors['loginPassword'] }}</span>
              </div>

              <!-- Reset Password Box -->
              <div *ngIf="showResetPassword" style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); border-radius: 10px; padding: 0.85rem; display: flex; flex-direction: column; gap: 0.6rem;">
                <span style="font-size: 0.82rem; color: #fcd34d; font-weight: 600;">
                  🔑 Enter new password for <u>{{ loginData.username || 'your account' }}</u>:
                </span>
                <div class="input-wrap">
                  <span class="input-icon">🔒</span>
                  <input
                    type="password"
                    name="newResetPassword"
                    [(ngModel)]="newResetPassword"
                    class="form-control"
                    placeholder="New password (min 6 chars)"
                  />
                </div>
                <button type="button" (click)="onResetPasswordSubmit()" [disabled]="loading" class="btn btn-submit" style="background: #f59e0b; color: #000; font-weight: 700;">
                  <span>Set New Password & Enter Portal →</span>
                </button>
              </div>

              <!-- Inline Alert Message Directly Above Submit Button -->
              <div *ngIf="errorMessage" class="alert-banner error-banner">
                <span class="banner-icon">⚠️</span>
                <div class="banner-body">
                  <span class="banner-text">{{ errorMessage }}</span>
                  <button *ngIf="isUserNotFound" type="button" class="btn-action-link" (click)="goToSignUpWithUsername()">
                    Create Account Now →
                  </button>
                  <button *ngIf="isIncorrectPassword && !showResetPassword" type="button" class="btn-action-link" (click)="toggleResetPassword()">
                    Reset Password Here 🔑
                  </button>
                </div>
              </div>

              <button *ngIf="!showResetPassword" type="submit" [disabled]="loading" class="btn btn-primary btn-submit">
                <span *ngIf="loading" class="spinner"></span>
                <span>{{ loading ? 'Verifying with Database...' : 'Sign In to Portal' }}</span>
              </button>

              <div class="form-footer-hint">
                <span>New user?</span>
                <button type="button" class="link-btn" (click)="switchTab('register')">
                  Sign Up for an account
                </button>
              </div>
            </form>

            <!-- ================= SIGN UP TAB ================= -->
            <form *ngIf="activeTab === 'register'" (ngSubmit)="onRegisterSubmit()" class="auth-form">
              <!-- Row 1: Full Name & Auto-generated Username -->
              <div class="form-row-2">
                <div class="form-group" [class.has-error]="fieldErrors['fullName']">
                  <label for="reg-fullname">Full Name *</label>
                  <div class="input-wrap">
                    <span class="input-icon">🪪</span>
                    <input
                      type="text"
                      id="reg-fullname"
                      name="regFullName"
                      [(ngModel)]="regData.fullName"
                      (input)="onFullNameChange()"
                      class="form-control"
                      placeholder="e.g. Dr. Nirmal Pandey"
                    />
                  </div>
                  <span *ngIf="fieldErrors['fullName']" class="error-hint">{{ fieldErrors['fullName'] }}</span>
                </div>

                <div class="form-group" [class.has-error]="fieldErrors['username']">
                  <label for="reg-username">Username *</label>
                  <div class="input-wrap">
                    <span class="input-icon">👤</span>
                    <input
                      type="text"
                      id="reg-username"
                      name="regUsername"
                      [(ngModel)]="regData.username"
                      class="form-control"
                      placeholder="e.g. nirmal.pandey"
                    />
                  </div>
                  <span *ngIf="fieldErrors['username']" class="error-hint">{{ fieldErrors['username'] }}</span>
                </div>
              </div>

              <!-- Row 2: Role & Email -->
              <div class="form-row-2">
                <div class="form-group">
                  <label for="reg-role">Role *</label>
                  <div class="input-wrap">
                    <span class="input-icon">🏷️</span>
                    <select
                      id="reg-role"
                      name="regRole"
                      [(ngModel)]="regData.role"
                      class="form-control select-control"
                    >
                      <option value="ROLE_DOCTOR">Doctor (Physician)</option>
                      <option value="ROLE_NURSE">Staff Nurse</option>
                      <option value="ROLE_PATIENT">Patient</option>
                    </select>
                  </div>
                </div>

                <div class="form-group" [class.has-error]="fieldErrors['email']">
                  <label for="reg-email">Email Address *</label>
                  <div class="input-wrap">
                    <span class="input-icon">✉️</span>
                    <input
                      type="email"
                      id="reg-email"
                      name="regEmail"
                      [(ngModel)]="regData.email"
                      class="form-control"
                      placeholder="user@careconnect.org"
                    />
                  </div>
                  <span *ngIf="fieldErrors['email']" class="error-hint">{{ fieldErrors['email'] }}</span>
                </div>
              </div>

              <!-- Row 3: Specialization (if Doctor) & Password -->
              <div class="form-row-2">
                <div *ngIf="regData.role === 'ROLE_DOCTOR'" class="form-group">
                  <label for="reg-spec">Specialization</label>
                  <div class="input-wrap">
                    <span class="input-icon">🩺</span>
                    <input
                      type="text"
                      id="reg-spec"
                      name="regSpec"
                      [(ngModel)]="regData.specialization"
                      class="form-control"
                      placeholder="e.g. General Medicine"
                    />
                  </div>
                </div>

                <div class="form-group" [class.has-error]="fieldErrors['password']" [style.gridColumn]="regData.role !== 'ROLE_DOCTOR' ? 'span 2' : 'auto'">
                  <label for="reg-password">Password (Min 6 chars) *</label>
                  <div class="input-wrap">
                    <span class="input-icon">🔑</span>
                    <input
                      type="password"
                      id="reg-password"
                      name="regPassword"
                      [(ngModel)]="regData.password"
                      class="form-control"
                      placeholder="••••••••"
                    />
                  </div>
                  <span *ngIf="fieldErrors['password']" class="error-hint">{{ fieldErrors['password'] }}</span>
                </div>
              </div>

              <!-- Inline Alert Message Directly Above Submit Button -->
              <div *ngIf="errorMessage" class="alert-banner error-banner">
                <span class="banner-icon">⚠️</span>
                <div class="banner-body">
                  <span class="banner-text">{{ errorMessage }}</span>
                  <button *ngIf="isUserAlreadyExists" type="button" class="btn-action-link" (click)="switchTab('login')">
                    Switch to Sign In →
                  </button>
                </div>
              </div>

              <div *ngIf="successMessage" class="alert-banner success-banner">
                <span class="banner-icon">✅</span>
                <div class="banner-body">
                  <span class="banner-text">{{ successMessage }}</span>
                </div>
              </div>

              <button type="submit" [disabled]="loading" class="btn btn-success btn-submit">
                <span *ngIf="loading" class="spinner"></span>
                <span>{{ loading ? 'Saving to Database...' : 'Register & Enter Portal' }}</span>
              </button>

              <div class="form-footer-hint">
                <span>Already have an account?</span>
                <button type="button" class="link-btn" (click)="switchTab('login')">
                  Sign In here
                </button>
              </div>
            </form>

            <div class="database-status-info">
              <div class="db-badge">
                <span class="dot-live"></span>
                <span>Database Connected: Records stored securely</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: stretch;
      background: #0b1329;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    }

    .login-layout {
      display: flex;
      width: 100%;
      min-height: 100vh;
    }

    /* Left Hero Panel */
    .hero-panel {
      flex: 1.1;
      background: linear-gradient(135deg, #0f172a 0%, #032b43 50%, #02436d 100%);
      color: white;
      padding: 3rem 2.5rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        width: 500px;
        height: 500px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, transparent 70%);
        top: -80px;
        left: -80px;
        pointer-events: none;
      }
    }

    .hero-content {
      max-width: 540px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    .hero-brand {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.75rem;
    }

    .hero-logo-icon {
      font-size: 2rem;
      background: linear-gradient(135deg, #0284c7, #10b981);
      width: 50px;
      height: 50px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 20px rgba(2, 132, 199, 0.4);
    }

    .hero-title {
      font-size: 1.75rem;
      font-weight: 800;
      color: white;
      letter-spacing: -0.02em;
      margin: 0;
    }

    .hero-badge {
      font-size: 0.72rem;
      color: #38bdf8;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .hero-headline {
      font-size: 1.95rem;
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 1rem;
      background: linear-gradient(135deg, #ffffff, #93c5fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero-desc {
      font-size: 0.95rem;
      line-height: 1.55;
      color: #94a3b8;
      margin-bottom: 2rem;
    }

    .hero-features {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 10px;
      padding: 1rem;
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
      backdrop-filter: blur(8px);

      .f-icon {
        font-size: 1.35rem;
        background: rgba(2, 132, 199, 0.2);
        padding: 0.35rem;
        border-radius: 7px;
      }

      strong {
        display: block;
        font-size: 0.9rem;
        color: #f1f5f9;
        margin-bottom: 0.2rem;
      }

      p {
        font-size: 0.78rem;
        color: #94a3b8;
        line-height: 1.35;
        margin: 0;
      }
    }

    .hero-footer {
      display: flex;
      gap: 0.85rem;
      flex-wrap: wrap;
    }

    .compliance-tag {
      font-size: 0.72rem;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.25);
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-weight: 600;
    }

    /* Right Form Panel */
    .form-panel {
      flex: 1;
      background: #0f172a;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
      overflow-y: auto;
    }

    .form-card {
      width: 100%;
      max-width: 520px;
      background: #1e293b;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 18px;
      padding: 2rem 2rem;
      box-shadow: 0 20px 45px -10px rgba(0, 0, 0, 0.5);
    }

    .card-header {
      margin-bottom: 1.25rem;

      h2 {
        font-size: 1.55rem;
        font-weight: 800;
        color: #f8fafc;
        margin: 0 0 0.4rem 0;
      }

      p {
        font-size: 0.85rem;
        color: #94a3b8;
        margin: 0;
      }
    }

    .auth-tabs {
      display: flex;
      background: #0f172a;
      border-radius: 10px;
      padding: 0.3rem;
      margin-bottom: 1.25rem;
      gap: 0.3rem;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }

    .tab-btn {
      flex: 1;
      padding: 0.6rem 0.75rem;
      border: none;
      background: transparent;
      color: #94a3b8;
      font-size: 0.88rem;
      font-weight: 600;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;

      &:hover {
        color: #f8fafc;
      }

      &.active {
        background: #0284c7;
        color: #ffffff;
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.4);
      }
    }

    /* Notification Banners */
    .alert-banner {
      border-radius: 9px;
      padding: 0.75rem 0.95rem;
      margin: 0.5rem 0 0.25rem 0;
      display: flex;
      align-items: flex-start;
      gap: 0.6rem;

      .banner-icon {
        font-size: 1.15rem;
        line-height: 1.2;
      }

      .banner-body {
        display: flex;
        flex-direction: column;
        gap: 0.4rem;
        flex: 1;
      }

      .banner-text {
        font-size: 0.85rem;
        font-weight: 600;
        line-height: 1.4;
      }

      .btn-action-link {
        align-self: flex-start;
        background: rgba(255, 255, 255, 0.2);
        color: white;
        border: none;
        padding: 0.3rem 0.65rem;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 600;
        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      }
    }

    .error-banner {
      background: rgba(239, 68, 68, 0.18);
      border: 1px solid rgba(239, 68, 68, 0.4);
      .banner-text { color: #fca5a5; }
    }

    .success-banner {
      background: rgba(16, 185, 129, 0.18);
      border: 1px solid rgba(16, 185, 129, 0.4);
      .banner-text { color: #6ee7b7; }
    }

    /* Forms */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.9rem;
    }

    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.85rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;

      label {
        font-size: 0.8rem;
        font-weight: 600;
        color: #cbd5e1;
      }

      &.has-error {
        .form-control {
          border-color: #ef4444 !important;
          box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25) !important;
        }
      }
    }

    .error-hint {
      font-size: 0.74rem;
      color: #f87171;
      font-weight: 600;
    }

    .input-wrap {
      position: relative;
      display: flex;
      align-items: center;

      .input-icon {
        position: absolute;
        left: 0.85rem;
        font-size: 0.95rem;
        color: #64748b;
        pointer-events: none;
      }

      .form-control {
        width: 100%;
        background: #0f172a;
        border: 1px solid #334155;
        border-radius: 9px;
        padding: 0.7rem 0.85rem 0.7rem 2.45rem;
        font-size: 0.88rem;
        color: #f8fafc;
        outline: none;
        transition: border-color 0.2s, box-shadow 0.2s;

        &::placeholder {
          color: #475569;
        }

        &:focus {
          border-color: #0284c7;
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.25);
        }
      }

      .select-control {
        cursor: pointer;
        padding-right: 1.25rem;
        option {
          background: #0f172a;
          color: #f8fafc;
        }
      }
    }

    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      border: none;
      border-radius: 9px;
      font-size: 0.95rem;
      font-weight: 700;
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      transition: all 0.2s ease;
      margin-top: 0.35rem;

      &.btn-primary {
        background: linear-gradient(135deg, #0284c7, #0369a1);
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #0369a1, #075985);
          transform: translateY(-1px);
        }
      }

      &.btn-success {
        background: linear-gradient(135deg, #10b981, #059669);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1px);
        }
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }

    .spinner {
      width: 15px;
      height: 15px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .form-footer-hint {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      font-size: 0.82rem;
      color: #94a3b8;
      margin-top: 0.35rem;

      .link-btn {
        background: none;
        border: none;
        color: #38bdf8;
        font-weight: 600;
        cursor: pointer;
        padding: 0;
        text-decoration: underline;

        &:hover {
          color: #7dd3fc;
        }
      }
    }

    .database-status-info {
      margin-top: 1.25rem;
      padding-top: 0.85rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);

      .db-badge {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.45rem;
        font-size: 0.75rem;
        color: #64748b;

        .dot-live {
          width: 7px;
          height: 7px;
          background: #10b981;
          border-radius: 50%;
          box-shadow: 0 0 6px #10b981;
        }
      }
    }

    @media (max-width: 980px) {
      .login-layout { flex-direction: column; }
      .hero-panel { flex: none; padding: 2rem 1.5rem; }
      .hero-features { display: none; }
      .form-panel { flex: 1; padding: 1.5rem 1rem; }
    }

    @media (max-width: 600px) {
      .form-row-2 { grid-template-columns: 1fr; }
      .form-card { padding: 1.5rem 1.15rem; }
    }
  `]
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';
  loading = false;
  errorMessage = '';
  successMessage = '';
  isUserNotFound = false;
  isUserAlreadyExists = false;
  isIncorrectPassword = false;
  showResetPassword = false;
  newResetPassword = '';

  fieldErrors: { [key: string]: string } = {};

  loginData = {
    username: '',
    password: ''
  };

  regData = {
    fullName: '',
    username: '',
    email: '',
    password: '',
    role: 'ROLE_DOCTOR',
    specialization: 'General Medicine',
    licenseNumber: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
    this.isUserNotFound = false;
    this.isUserAlreadyExists = false;
    this.isIncorrectPassword = false;
    this.showResetPassword = false;
    this.fieldErrors = {};
    this.cdr.markForCheck();
  }

  toggleResetPassword(): void {
    this.showResetPassword = !this.showResetPassword;
    this.errorMessage = '';
    this.newResetPassword = '';
    this.cdr.markForCheck();
  }

  onResetPasswordSubmit(): void {
    if (!this.loginData.username) {
      this.errorMessage = 'Please enter your username first';
      this.cdr.markForCheck();
      return;
    }
    if (!this.newResetPassword || this.newResetPassword.length < 6) {
      this.errorMessage = 'New password must be at least 6 characters long';
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    const u = this.loginData.username.trim().toLowerCase();
    const p = this.newResetPassword;

    this.authService.resetPassword(u, p).subscribe({
      next: () => {
        // Automatically login with the new password!
        this.loginData.password = p;
        this.showResetPassword = false;
        this.onLoginSubmit();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Failed to update password. Please check username.';
        this.cdr.markForCheck();
      }
    });
  }

  onFullNameChange(): void {
    if (this.regData.fullName && !this.regData.username) {
      // Auto suggest username from Full Name (e.g. Dr. Nirmal Pandey -> nirmal.pandey)
      let clean = this.regData.fullName.toLowerCase().replace(/^(dr|mr|mrs|ms)\.?\s+/i, '').trim();
      this.regData.username = clean.replace(/[^a-z0-9]/g, '.').replace(/\.+/g, '.');
    }
  }

  goToSignUpWithUsername(): void {
    this.regData.username = this.loginData.username.trim().toLowerCase().replace(/\s+/g, '.');
    this.switchTab('register');
  }

  onLoginSubmit(): void {
    this.fieldErrors = {};
    let hasError = false;

    if (!this.loginData.username) {
      this.fieldErrors['loginUsername'] = 'Please enter your username';
      hasError = true;
    }
    if (!this.loginData.password) {
      this.fieldErrors['loginPassword'] = 'Please enter your password';
      hasError = true;
    }

    if (hasError) {
      this.errorMessage = 'Please provide both username and password';
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.isUserNotFound = false;
    this.isUserAlreadyExists = false;
    this.isIncorrectPassword = false;
    this.cdr.markForCheck();

    this.authService.login({
      username: this.loginData.username.trim(),
      password: this.loginData.password
    }).subscribe({
      next: (res) => {
        this.loading = false;
        this.cdr.markForCheck();
        if (res.role === 'ROLE_PATIENT') {
          this.router.navigate(['/patient-portal']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        const errMsg = err.error?.message || err.message || '';
        const errType = err.error?.error;

        if (errType === 'USER_NOT_FOUND' || errMsg.toLowerCase().includes('not found')) {
          this.isUserNotFound = true;
          this.errorMessage = `User '${this.loginData.username}' is not registered in database. Please Sign Up first!`;
        } else if (errType === 'BAD_CREDENTIALS' || err.status === 401) {
          this.isIncorrectPassword = true;
          this.errorMessage = 'Incorrect password! If you forgot it, click "Reset Password" below.';
        } else {
          this.errorMessage = errMsg || 'Unable to sign in. Please verify your details.';
        }
        this.cdr.markForCheck();
      }
    });
  }

  onRegisterSubmit(): void {
    this.fieldErrors = {};
    let hasError = false;

    // Auto-fill username from full name if user left it blank
    if (!this.regData.username && this.regData.fullName) {
      this.onFullNameChange();
    }

    // Auto-fill full name from username if full name was left blank
    if (!this.regData.fullName && this.regData.username) {
      this.regData.fullName = this.regData.username;
    }

    if (!this.regData.fullName) {
      this.fieldErrors['fullName'] = 'Full Name is required';
      hasError = true;
    }

    if (!this.regData.username) {
      this.fieldErrors['username'] = 'Username is required';
      hasError = true;
    }

    if (!this.regData.email) {
      this.fieldErrors['email'] = 'Email is required';
      hasError = true;
    }

    if (!this.regData.password) {
      this.fieldErrors['password'] = 'Password is required';
      hasError = true;
    } else if (this.regData.password.length < 6) {
      this.fieldErrors['password'] = 'Password must be at least 6 characters';
      hasError = true;
    }

    if (hasError) {
      this.errorMessage = 'Please complete all required fields highlighted in red';
      this.cdr.markForCheck();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.isUserNotFound = false;
    this.isUserAlreadyExists = false;
    this.cdr.markForCheck();

    // Clean username (remove whitespace, lowercase)
    const cleanUsername = this.regData.username.trim().toLowerCase().replace(/\s+/g, '.');

    const payload = {
      fullName: this.regData.fullName.trim(),
      username: cleanUsername,
      email: this.regData.email.trim().toLowerCase(),
      password: this.regData.password,
      role: this.regData.role,
      specialization: this.regData.role === 'ROLE_DOCTOR' ? (this.regData.specialization || 'General Medicine') : undefined,
      licenseNumber: this.regData.role === 'ROLE_DOCTOR' ? (this.regData.licenseNumber || 'DOC-2026') : undefined
    };

    this.authService.register(payload).subscribe({
      next: (res) => {
        this.loading = false;
        this.successMessage = `Account created successfully for '${payload.username}'! Entering portal...`;
        this.cdr.markForCheck();

        // Direct instant navigation into portal
        setTimeout(() => {
          if (res.role === 'ROLE_PATIENT') {
            this.router.navigate(['/patient-portal']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        }, 300);
      },
      error: (err) => {
        this.loading = false;
        const msg = err.error?.message || err.message || '';
        if (msg.includes('already taken') || msg.includes('already registered')) {
          this.isUserAlreadyExists = true;
          this.loginData.username = payload.username;
          this.errorMessage = `Account '${payload.username}' already exists in database!`;
        } else {
          this.errorMessage = msg || 'Registration failed. Please check your details.';
        }
        this.cdr.markForCheck();
      }
    });
  }
}

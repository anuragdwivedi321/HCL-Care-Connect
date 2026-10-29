import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

interface DemoAccount {
  name: string;
  role: string;
  roleClass: string;
  icon: string;
  username: string;
  pass: string;
  desc: string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-page">
      <div class="login-layout">
        <!-- Left Hero Section (Enterprise Clinical Branding) -->
        <div class="hero-panel">
          <div class="hero-bg-blobs">
            <div class="blob blob-1"></div>
            <div class="blob blob-2"></div>
          </div>

          <div class="hero-content">
            <div class="hero-brand">
              <span class="hero-logo-icon">⚕</span>
              <div>
                <h1 class="hero-title">CareConnect EHR</h1>
                <div class="hero-badge-row">
                  <span class="hero-badge">Enterprise Edition 2026</span>
                  <span class="live-dot"></span>
                  <span class="live-status">v2.6 Cloud Active</span>
                </div>
              </div>
            </div>

            <h2 class="hero-headline">
              Intelligent Clinical Workflows & Patient Care Architecture.
            </h2>
            <p class="hero-desc">
              Next-generation Electronic Health Record system with certified SOAP clinical documentation, CPOE diagnostic requisitions, and real-time drug interaction safety safeguards.
            </p>

            <!-- ECG Pulse Wave Graphic -->
            <div class="ecg-container">
              <svg class="ecg-svg" viewBox="0 0 500 60" preserveAspectRatio="none">
                <path class="ecg-line" d="M0,30 L120,30 L135,10 L145,50 L155,20 L165,38 L175,30 L280,30 L295,8 L305,52 L315,18 L325,40 L335,30 L500,30" />
              </svg>
              <div class="ecg-caption">
                <span class="pulse-indicator"></span>
                <span>REAL-TIME HL7/FHIR COMPLIANT TELEMETRY STREAM</span>
              </div>
            </div>

            <!-- Feature Highlights Grid -->
            <div class="hero-features">
              <div class="feature-card">
                <span class="f-icon">📋</span>
                <div>
                  <strong>SOAP Documentation</strong>
                  <p>ICD-10 clinical coding & digital signatures</p>
                </div>
              </div>
              <div class="feature-card">
                <span class="f-icon">🔬</span>
                <div>
                  <strong>CPOE Diagnostics</strong>
                  <p>Standard LOINC panels with abnormal alerts</p>
                </div>
              </div>
              <div class="feature-card">
                <span class="f-icon">🛡️</span>
                <div>
                  <strong>Drug Safety Engine</strong>
                  <p>Real-time Drug-Drug Interaction screening</p>
                </div>
              </div>
              <div class="feature-card">
                <span class="f-icon">🔒</span>
                <div>
                  <strong>Verified Security</strong>
                  <p>Encrypted credentials & HIPAA audit trails</p>
                </div>
              </div>
            </div>

            <div class="hero-footer">
              <span class="compliance-tag">🛡️ HIPAA Security Rule Certified</span>
              <span class="compliance-tag">⚡ Java 21 + Spring Boot 3 + Angular 17</span>
              <span class="compliance-tag">🗄️ Oracle Database XE / H2 Engine</span>
            </div>
          </div>
        </div>

        <!-- Right Panel: Auth Card (Sign In & Sign Up) -->
        <div class="form-panel">
          <div class="form-card">
            
            <!-- Quick Demo Credentials Selector -->
            <div class="demo-selector-box">
              <div class="demo-header">
                <span class="demo-lightning">⚡</span>
                <span class="demo-title">One-Click Evaluator Demo Access</span>
                <span class="demo-subtitle">Tap any role to sign in instantly</span>
              </div>
              <div class="demo-grid">
                <button 
                  type="button" 
                  *ngFor="let acc of demoAccounts" 
                  class="demo-chip"
                  (click)="useDemoAccount(acc)"
                  [title]="'Sign in as ' + acc.name + ' (' + acc.role + ')'">
                  <span class="demo-icon">{{ acc.icon }}</span>
                  <div class="demo-info">
                    <span class="demo-name">{{ acc.name }}</span>
                    <span class="demo-role" [ngClass]="acc.roleClass">{{ acc.role }}</span>
                  </div>
                  <span class="demo-arrow">→</span>
                </button>
              </div>
            </div>

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
                <span>📝 Sign Up (New Account)</span>
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
                    placeholder="e.g. priyank or dr.sharma"
                    autocomplete="username"
                  />
                </div>
                <span *ngIf="fieldErrors['loginUsername']" class="error-hint">{{ fieldErrors['loginUsername'] }}</span>
              </div>

              <div class="form-group" [class.has-error]="fieldErrors['loginPassword']">
                <div class="label-row">
                  <label for="login-password">Password *</label>
                  <button type="button" class="link-btn" (click)="toggleResetPassword()">
                    {{ showResetPassword ? '← Back to Login' : 'Forgot / Reset Password?' }}
                  </button>
                </div>
                <div class="input-wrap">
                  <span class="input-icon">🔑</span>
                  <input
                    [type]="showPassword ? 'text' : 'password'"
                    id="login-password"
                    name="loginPassword"
                    [(ngModel)]="loginData.password"
                    class="form-control"
                    placeholder="Enter your password"
                    autocomplete="current-password"
                  />
                  <button type="button" class="eye-toggle" (click)="showPassword = !showPassword" [title]="showPassword ? 'Hide password' : 'Show password'">
                    {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                  </button>
                </div>
                <span *ngIf="fieldErrors['loginPassword']" class="error-hint">{{ fieldErrors['loginPassword'] }}</span>
              </div>

              <!-- Reset Password Box -->
              <div *ngIf="showResetPassword" class="reset-box">
                <span class="reset-title">
                  🔑 Enter new password for <u>{{ loginData.username || 'your account' }}</u>:
                </span>
                <div class="input-wrap">
                  <span class="input-icon">🔒</span>
                  <input
                    type="password"
                    name="newResetPassword"
                    [(ngModel)]="newResetPassword"
                    class="form-control"
                    placeholder="New password (min 6 characters)"
                  />
                </div>
                <button type="button" (click)="onResetPasswordSubmit()" [disabled]="loading" class="btn btn-warning-reset">
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
                <span>New user or patient?</span>
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
                      placeholder="e.g. Dr. Priyank Sharma"
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
                      placeholder="e.g. priyank.sharma"
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
                      <option value="ROLE_DOCTOR">Doctor (Physician / Specialist)</option>
                      <option value="ROLE_NURSE">Staff Nurse</option>
                      <option value="ROLE_PATIENT">Patient (Self-Service Portal)</option>
                      <option value="ROLE_ADMIN">System Administrator</option>
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
                      placeholder="user@careconnect.io"
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
                      placeholder="e.g. General Medicine, Cardiology"
                    />
                  </div>
                </div>

                <div class="form-group" [class.has-error]="fieldErrors['password']" [style.gridColumn]="regData.role !== 'ROLE_DOCTOR' ? 'span 2' : 'auto'">
                  <label for="reg-password">Password (Min 6 chars) *</label>
                  <div class="input-wrap">
                    <span class="input-icon">🔑</span>
                    <input
                      [type]="showPassword ? 'text' : 'password'"
                      id="reg-password"
                      name="regPassword"
                      [(ngModel)]="regData.password"
                      class="form-control"
                      placeholder="••••••••"
                    />
                    <button type="button" class="eye-toggle" (click)="showPassword = !showPassword" [title]="showPassword ? 'Hide password' : 'Show password'">
                      {{ showPassword ? '👁️' : '👁️‍🗨️' }}
                    </button>
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
                <span>Oracle DB XE / H2 Engine Verified • Secure AES Session Auth</span>
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
      background: #090e1a;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    }

    .login-layout {
      display: flex;
      width: 100%;
      min-height: 100vh;
    }

    /* Left Hero Panel */
    .hero-panel {
      flex: 1.15;
      background: linear-gradient(145deg, #0f172a 0%, #082f49 50%, #0369a1 100%);
      color: white;
      padding: 3.5rem 3rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      overflow: hidden;
      border-right: 1px solid rgba(2, 132, 199, 0.2);
    }

    .hero-bg-blobs {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;

      .blob {
        position: absolute;
        border-radius: 50%;
        filter: blur(80px);
        opacity: 0.25;
      }

      .blob-1 {
        width: 450px;
        height: 450px;
        background: #0284c7;
        top: -100px;
        left: -100px;
      }

      .blob-2 {
        width: 400px;
        height: 400px;
        background: #0d9488;
        bottom: -50px;
        right: -50px;
      }
    }

    .hero-content {
      max-width: 560px;
      margin: 0 auto;
      position: relative;
      z-index: 2;
    }

    .hero-brand {
      display: flex;
      align-items: center;
      gap: 1.1rem;
      margin-bottom: 2rem;
    }

    .hero-logo-icon {
      font-size: 2.2rem;
      background: linear-gradient(135deg, #0284c7, #10b981);
      width: 56px;
      height: 56px;
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(2, 132, 199, 0.45);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .hero-title {
      font-size: 1.9rem;
      font-weight: 800;
      color: white;
      letter-spacing: -0.03em;
      margin: 0;
      line-height: 1.1;
    }

    .hero-badge-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }

    .hero-badge {
      font-size: 0.72rem;
      color: #38bdf8;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .live-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 8px #10b981;
    }

    .live-status {
      font-size: 0.7rem;
      color: #6ee7b7;
      font-weight: 600;
    }

    .hero-headline {
      font-size: 2.2rem;
      font-weight: 800;
      line-height: 1.22;
      margin-bottom: 1.15rem;
      background: linear-gradient(135deg, #ffffff 30%, #bae6fd 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.025em;
    }

    .hero-desc {
      font-size: 0.98rem;
      line-height: 1.6;
      color: #94a3b8;
      margin-bottom: 2rem;
    }

    /* ECG Wave */
    .ecg-container {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(56, 189, 248, 0.2);
      border-radius: 12px;
      padding: 0.75rem 1rem;
      margin-bottom: 2rem;
      backdrop-filter: blur(8px);
    }

    .ecg-svg {
      width: 100%;
      height: 38px;
    }

    .ecg-line {
      fill: none;
      stroke: #38bdf8;
      stroke-width: 2.5;
      stroke-linecap: round;
      stroke-linejoin: round;
      filter: drop-shadow(0 0 6px #38bdf8);
      stroke-dasharray: 1000;
      stroke-dashoffset: 1000;
      animation: drawEcg 4s ease-in-out infinite;
    }

    @keyframes drawEcg {
      0% { stroke-dashoffset: 1000; opacity: 0.2; }
      50% { stroke-dashoffset: 0; opacity: 1; }
      100% { stroke-dashoffset: -1000; opacity: 0.2; }
    }

    .ecg-caption {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.65rem;
      color: #7dd3fc;
      font-weight: 700;
      letter-spacing: 0.1em;
      margin-top: 0.35rem;
    }

    .pulse-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 6px #10b981;
      animation: pulseIndicator 1.5s infinite;
    }

    @keyframes pulseIndicator {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(0.7); opacity: 0.4; }
    }

    /* Feature Highlights */
    .hero-features {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      margin-bottom: 2.25rem;
    }

    .feature-card {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1.1rem;
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      backdrop-filter: blur(10px);
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.09);
        border-color: rgba(56, 189, 248, 0.35);
        transform: translateY(-2px);
      }

      .f-icon {
        font-size: 1.4rem;
        background: rgba(2, 132, 199, 0.25);
        padding: 0.45rem;
        border-radius: 9px;
      }

      strong {
        display: block;
        font-size: 0.92rem;
        color: #f8fafc;
        margin-bottom: 0.25rem;
      }

      p {
        font-size: 0.78rem;
        color: #94a3b8;
        line-height: 1.4;
        margin: 0;
      }
    }

    .hero-footer {
      display: flex;
      gap: 0.65rem;
      flex-wrap: wrap;
    }

    .compliance-tag {
      font-size: 0.72rem;
      color: #7dd3fc;
      background: rgba(56, 189, 248, 0.1);
      border: 1px solid rgba(56, 189, 248, 0.25);
      padding: 0.35rem 0.8rem;
      border-radius: 20px;
      font-weight: 600;
    }

    /* Right Form Panel */
    .form-panel {
      flex: 1;
      background: #0b1329;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2.5rem 2rem;
      overflow-y: auto;
    }

    .form-card {
      width: 100%;
      max-width: 520px;
      background: #111a33;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      padding: 2.25rem;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    }

    /* Demo Selector Box */
    .demo-selector-box {
      background: rgba(2, 132, 199, 0.1);
      border: 1px solid rgba(2, 132, 199, 0.3);
      border-radius: 14px;
      padding: 1rem 1.15rem;
      margin-bottom: 1.5rem;
    }

    .demo-header {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      margin-bottom: 0.75rem;
    }

    .demo-lightning {
      font-size: 1.1rem;
    }

    .demo-title {
      font-size: 0.82rem;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .demo-subtitle {
      font-size: 0.72rem;
      color: #94a3b8;
      margin-left: auto;
    }

    .demo-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.6rem;

      @media (max-width: 500px) {
        grid-template-columns: 1fr;
      }
    }

    .demo-chip {
      background: rgba(15, 23, 42, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 9px;
      padding: 0.55rem 0.75rem;
      display: flex;
      align-items: center;
      gap: 0.65rem;
      cursor: pointer;
      text-align: left;
      transition: all 0.2s ease;

      &:hover {
        background: rgba(2, 132, 199, 0.25);
        border-color: #38bdf8;
        transform: translateY(-1.5px);

        .demo-arrow {
          transform: translateX(3px);
          color: #38bdf8;
        }
      }

      .demo-icon {
        font-size: 1.15rem;
      }

      .demo-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        line-height: 1.15;
      }

      .demo-name {
        font-size: 0.8rem;
        font-weight: 700;
        color: white;
      }

      .demo-role {
        font-size: 0.65rem;
        font-weight: 600;
        margin-top: 0.15rem;

        &.role-doc { color: #38bdf8; }
        &.role-admin { color: #c084fc; }
        &.role-nurse { color: #4ade80; }
        &.role-patient { color: #f472b6; }
      }

      .demo-arrow {
        font-size: 0.8rem;
        color: #64748b;
        transition: transform 0.2s;
      }
    }

    .card-header {
      margin-bottom: 1.35rem;

      h2 {
        font-size: 1.45rem;
        font-weight: 800;
        color: white;
        margin-bottom: 0.3rem;
      }

      p {
        font-size: 0.85rem;
        color: #94a3b8;
        margin: 0;
      }
    }

    /* Tabs */
    .auth-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      background: #090e1a;
      padding: 0.35rem;
      border-radius: 12px;
      margin-bottom: 1.4rem;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }

    .tab-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 0.85rem;
      font-weight: 700;
      padding: 0.65rem 0.85rem;
      border-radius: 8px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.45rem;
      transition: all 0.2s ease;

      &.active {
        background: #0284c7;
        color: white;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.4);
      }
    }

    /* Forms */
    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .form-row-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.85rem;
    }

    .label-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
        background: #090e1a;
        border: 1px solid #334155;
        border-radius: 10px;
        padding: 0.75rem 2.5rem 0.75rem 2.55rem;
        font-size: 0.9rem;
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

      .eye-toggle {
        position: absolute;
        right: 0.85rem;
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        font-size: 0.95rem;
        padding: 0;

        &:hover {
          color: #cbd5e1;
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

    .reset-box {
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.3);
      border-radius: 12px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .reset-title {
      font-size: 0.82rem;
      color: #fcd34d;
      font-weight: 600;
    }

    .btn-warning-reset {
      background: #f59e0b;
      color: #0f172a;
      font-weight: 700;
      border: none;
      padding: 0.75rem;
      border-radius: 9px;
      cursor: pointer;
      transition: background 0.2s;

      &:hover {
        background: #d97706;
      }
    }

    /* Alerts */
    .alert-banner {
      display: flex;
      align-items: flex-start;
      gap: 0.65rem;
      padding: 0.75rem 1rem;
      border-radius: 10px;
      font-size: 0.84rem;
      line-height: 1.35;
    }

    .error-banner {
      background: rgba(239, 68, 68, 0.15);
      border: 1px solid rgba(239, 68, 68, 0.4);
      .banner-text { color: #fca5a5; }
    }

    .success-banner {
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      .banner-text { color: #6ee7b7; }
    }

    .btn-action-link {
      background: rgba(255, 255, 255, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.25);
      color: white;
      font-size: 0.74rem;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
      cursor: pointer;
      margin-top: 0.35rem;
      display: inline-block;

      &:hover {
        background: rgba(255, 255, 255, 0.25);
      }
    }

    .btn-submit {
      width: 100%;
      padding: 0.85rem;
      border: none;
      border-radius: 10px;
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
        box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #0369a1, #075985);
          transform: translateY(-1.5px);
        }
      }

      &.btn-success {
        background: linear-gradient(135deg, #10b981, #059669);
        box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);

        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #059669, #047857);
          transform: translateY(-1.5px);
        }
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
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
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.08);

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

    @media (max-width: 1024px) {
      .login-layout { flex-direction: column; }
      .hero-panel { flex: none; padding: 2.5rem 1.75rem; }
      .hero-features { display: none; }
      .form-panel { flex: 1; padding: 2rem 1.25rem; }
    }

    @media (max-width: 600px) {
      .form-row-2 { grid-template-columns: 1fr; }
      .form-card { padding: 1.5rem 1.25rem; border-radius: 16px; }
    }
  `]
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';
  loading = false;
  showPassword = false;
  errorMessage = '';
  successMessage = '';
  isUserNotFound = false;
  isUserAlreadyExists = false;
  isIncorrectPassword = false;
  showResetPassword = false;
  newResetPassword = '';

  fieldErrors: { [key: string]: string } = {};

  demoAccounts: DemoAccount[] = [
    {
      name: 'Dr. Priyank',
      role: 'Physician',
      roleClass: 'role-doc',
      icon: '🩺',
      username: 'priyank',
      pass: 'Password@123',
      desc: 'General Physician / Doctor'
    },
    {
      name: 'Dr. Sharma',
      role: 'Cardiology',
      roleClass: 'role-doc',
      icon: '🫀',
      username: 'dr.sharma',
      pass: 'Doctor@123',
      desc: 'Cardiologist / MD'
    },
    {
      name: 'Sys Admin',
      role: 'Admin',
      roleClass: 'role-admin',
      icon: '🛡️',
      username: 'admin',
      pass: 'Admin@123',
      desc: 'System Administrator'
    },
    {
      name: 'Nurse Priya',
      role: 'Staff Nurse',
      roleClass: 'role-nurse',
      icon: '👩‍⚕️',
      username: 'nurse.priya',
      pass: 'Nurse@123',
      desc: 'Staff Registered Nurse'
    },
    {
      name: 'Rohit Verma',
      role: 'Patient',
      roleClass: 'role-patient',
      icon: '👤',
      username: 'patient.rohit',
      pass: 'Patient@123',
      desc: 'Patient Self-Service Portal'
    }
  ];

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

  useDemoAccount(acc: DemoAccount): void {
    this.switchTab('login');
    this.loginData.username = acc.username;
    this.loginData.password = acc.pass;
    this.errorMessage = '';
    this.cdr.markForCheck();
    // Auto-login for rapid evaluation
    this.onLoginSubmit();
  }

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

    if (!this.regData.username && this.regData.fullName) {
      this.onFullNameChange();
    }
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

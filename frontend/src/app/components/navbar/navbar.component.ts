import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="navbar-header" *ngIf="authService.currentUser()">
      <div class="nav-top-accent"></div>
      <div class="nav-container">
        <!-- Brand / Logo -->
        <div class="brand">
          <a routerLink="/" class="brand-link" (click)="closeMobileMenu()">
            <span class="brand-icon">⚕</span>
            <div class="brand-text">
              <div class="brand-title-row">
                <span class="brand-title">CareConnect</span>
                <span class="live-pulse-container" title="System Status: Fully Operational">
                  <span class="live-dot"></span>
                  <span class="live-ping"></span>
                </span>
              </div>
              <span class="brand-sub">ENTERPRISE EHR • v2.6</span>
            </div>
          </a>
        </div>

        <!-- Desktop Navigation Links -->
        <nav class="nav-links desktop-only">
          <ng-container *ngIf="!authService.isPatient()">
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📊</span>
              <span>Dashboard</span>
            </a>
            <a routerLink="/patients" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">👥</span>
              <span>Patients</span>
            </a>
            <a routerLink="/clinical-notes" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">📋</span>
              <span>SOAP Notes</span>
            </a>
            <a routerLink="/cpoe-orders" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🔬</span>
              <span>CPOE Orders</span>
            </a>
            <a routerLink="/medications" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">💊</span>
              <span>E-Prescribe</span>
            </a>
            <a routerLink="/interaction-checker" routerLinkActive="active" class="nav-item danger-highlight">
              <span class="nav-icon">🛡️</span>
              <span>Drug Safety</span>
            </a>
            <a *ngIf="authService.isAdmin() || authService.isDoctor()" routerLink="/audit-logs" routerLinkActive="active" class="nav-item">
              <span class="nav-icon">🔒</span>
              <span>Audit Trail</span>
            </a>
          </ng-container>

          <!-- Patient Portal Link -->
          <a routerLink="/patient-portal" routerLinkActive="active" class="nav-item portal-tab">
            <span class="nav-icon">🏥</span>
            <span>{{ authService.isPatient() ? 'My Health Portal' : 'Patient Portal' }}</span>
          </a>
        </nav>

        <!-- Right Side: Profile & Mobile Toggle -->
        <div class="right-controls">
          <!-- User Profile Badge (Desktop) -->
          <div class="user-badge desktop-only" [ngClass]="roleClass()">
            <span class="user-avatar" [ngClass]="roleClass()">{{ avatarText() }}</span>
            <div class="user-meta">
              <div class="user-name-row">
                <span class="user-name">{{ authService.currentUser()?.fullName }}</span>
                <span class="online-indicator" title="Connected"></span>
              </div>
              <span class="user-role-badge" [ngClass]="roleClass()">{{ formatRole(authService.currentUser()?.role) }}</span>
            </div>
          </div>

          <!-- Sign Out Button (Desktop) -->
          <button (click)="logout()" class="btn btn-logout desktop-only" title="Sign Out">
            <span>⏻</span>
            <span>Sign Out</span>
          </button>

          <!-- Mobile Hamburger Toggle Button -->
          <button class="mobile-toggle-btn mobile-only" (click)="toggleMobileMenu()" [attr.aria-expanded]="mobileMenuOpen()" aria-label="Toggle navigation menu">
            <span class="hamburger-icon">{{ mobileMenuOpen() ? '✕' : '☰' }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer / Menu -->
      <div class="mobile-drawer" [class.open]="mobileMenuOpen()">
        <div class="mobile-drawer-content">
          <!-- User info header inside mobile menu -->
          <div class="mobile-user-card" [ngClass]="roleClass()">
            <div class="avatar-large" [ngClass]="roleClass()">{{ avatarText() }}</div>
            <div class="mobile-user-info">
              <div class="mobile-name">{{ authService.currentUser()?.fullName }}</div>
              <span class="role-pill" [ngClass]="roleClass()">{{ formatRole(authService.currentUser()?.role) }}</span>
            </div>
          </div>

          <!-- Mobile Links List -->
          <div class="mobile-nav-list">
            <ng-container *ngIf="!authService.isPatient()">
              <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-link">
                <span class="m-icon">📊</span>
                <span class="m-text">Clinical Dashboard</span>
              </a>
              <a routerLink="/patients" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-link">
                <span class="m-icon">👥</span>
                <span class="m-text">Patient Directory & Vitals</span>
              </a>
              <a routerLink="/clinical-notes" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-link">
                <span class="m-icon">📋</span>
                <span class="m-text">Clinical Notes (SOAP)</span>
              </a>
              <a routerLink="/cpoe-orders" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-link">
                <span class="m-icon">🔬</span>
                <span class="m-text">CPOE Laboratory & Imaging</span>
              </a>
              <a routerLink="/medications" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-link">
                <span class="m-icon">💊</span>
                <span class="m-text">E-Prescriptions</span>
              </a>
              <a routerLink="/interaction-checker" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-link">
                <span class="m-icon">🛡️</span>
                <span class="m-text">Drug-Drug Safety Checker</span>
              </a>
              <a *ngIf="authService.isAdmin() || authService.isDoctor()" routerLink="/audit-logs" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-link">
                <span class="m-icon">🔒</span>
                <span class="m-text">HIPAA Audit Logs</span>
              </a>
            </ng-container>

            <a routerLink="/patient-portal" routerLinkActive="active" (click)="closeMobileMenu()" class="mobile-nav-link portal-link">
              <span class="m-icon">🏥</span>
              <span class="m-text">{{ authService.isPatient() ? 'My Health Portal' : 'Patient Portal' }}</span>
            </a>
          </div>

          <!-- Mobile Logout -->
          <div class="mobile-drawer-footer">
            <button (click)="logout()" class="btn btn-danger btn-block">
              <span>⏻</span> Sign Out from CareConnect
            </button>
          </div>
        </div>
      </div>
      <div class="mobile-backdrop" *ngIf="mobileMenuOpen()" (click)="closeMobileMenu()"></div>
    </header>
  `,
  styles: [`
    .navbar-header {
      background: rgba(15, 23, 42, 0.96);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      color: white;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      position: sticky;
      top: 0;
      z-index: 500;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    }

    .nav-top-accent {
      height: 3px;
      width: 100%;
      background: linear-gradient(90deg, #0284c7 0%, #0d9488 40%, #10b981 70%, #0284c7 100%);
      background-size: 200% 100%;
      animation: accentGradient 8s ease infinite;
    }

    @keyframes accentGradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }

    .nav-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0.65rem 1.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.5rem;
    }

    /* Brand */
    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      text-decoration: none;
      color: white;
      transition: opacity 0.2s;

      &:hover {
        opacity: 0.95;
      }
    }

    .brand-icon {
      font-size: 1.6rem;
      background: linear-gradient(135deg, #0284c7, #0d9488);
      width: 42px;
      height: 42px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 11px;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .brand-title-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .brand-title {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: white;
      line-height: 1.1;
    }

    .live-pulse-container {
      position: relative;
      width: 8px;
      height: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    .live-dot {
      width: 7px;
      height: 7px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }

    .live-ping {
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1.5px solid #10b981;
      opacity: 0.75;
      animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes ping {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(2.2); opacity: 0; }
    }

    .brand-sub {
      font-size: 0.62rem;
      letter-spacing: 0.12em;
      color: #38bdf8;
      font-weight: 700;
      display: block;
      margin-top: 0.1rem;
    }

    /* Desktop Navigation */
    .nav-links {
      display: flex;
      align-items: center;
      gap: 0.35rem;
      flex-wrap: wrap;
    }

    .nav-item {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.52rem 0.85rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 9px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      white-space: nowrap;
      border: 1px solid transparent;

      .nav-icon {
        font-size: 1rem;
      }

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.08);
        border-color: rgba(255, 255, 255, 0.1);
      }

      &.active {
        color: white;
        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        box-shadow: 0 2px 10px rgba(2, 132, 199, 0.45);
        border-color: rgba(255, 255, 255, 0.2);
      }

      &.portal-tab {
        border: 1px solid rgba(13, 148, 136, 0.45);
        color: #5eead4;
        background: rgba(13, 148, 136, 0.1);

        &.active {
          background: linear-gradient(135deg, #0d9488, #0f766e);
          color: white;
          box-shadow: 0 2px 10px rgba(13, 148, 136, 0.45);
        }
      }

      &.danger-highlight:hover {
        color: #fca5a5;
        background: rgba(239, 68, 68, 0.12);
        border-color: rgba(239, 68, 68, 0.25);
      }
    }

    /* Right Section */
    .right-controls {
      display: flex;
      align-items: center;
      gap: 0.85rem;
    }

    .user-badge {
      display: flex;
      align-items: center;
      gap: 0.7rem;
      padding: 0.35rem 0.85rem;
      border-radius: 40px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.2s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.09);
        border-color: rgba(255, 255, 255, 0.18);
      }
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.78rem;
      font-weight: 800;
      color: white;

      &.role-doctor { background: linear-gradient(135deg, #0284c7, #0369a1); }
      &.role-admin { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
      &.role-nurse { background: linear-gradient(135deg, #10b981, #059669); }
      &.role-patient { background: linear-gradient(135deg, #ec4899, #db2777); }
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }

    .user-name-row {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .user-name {
      font-size: 0.82rem;
      font-weight: 700;
      color: white;
    }

    .online-indicator {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }

    .user-role-badge {
      font-size: 0.65rem;
      font-weight: 700;
      letter-spacing: 0.04em;

      &.role-doctor { color: #38bdf8; }
      &.role-admin { color: #c084fc; }
      &.role-nurse { color: #4ade80; }
      &.role-patient { color: #f472b6; }
    }

    .btn-logout {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      font-size: 0.8rem;
      font-weight: 600;
      border-radius: 8px;
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.15);
      background: rgba(255, 255, 255, 0.06);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #ef4444;
        border-color: #ef4444;
        color: white;
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.35);
      }
    }

    /* Mobile Hamburger Button */
    .mobile-toggle-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.18);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 9px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.3rem;
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.16);
      }
    }

    /* Mobile Drawer */
    .mobile-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 84%;
      max-width: 320px;
      background: #0f172a;
      border-left: 2px solid #0284c7;
      z-index: 1000;
      box-shadow: -8px 0 28px rgba(0, 0, 0, 0.6);
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      overflow-y: auto;

      &.open {
        transform: translateX(0);
      }
    }

    .mobile-drawer-content {
      padding: 1.5rem 1.25rem;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .mobile-user-card {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 1.1rem;
      border-radius: 14px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 1.35rem;
    }

    .avatar-large {
      width: 46px;
      height: 46px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1rem;
      color: white;

      &.role-doctor { background: linear-gradient(135deg, #0284c7, #0369a1); }
      &.role-admin { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
      &.role-nurse { background: linear-gradient(135deg, #10b981, #059669); }
      &.role-patient { background: linear-gradient(135deg, #ec4899, #db2777); }
    }

    .mobile-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: white;
      margin-bottom: 0.25rem;
    }

    .role-pill {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.2rem 0.55rem;
      border-radius: 20px;

      &.role-doctor { color: #38bdf8; background: rgba(56, 189, 248, 0.15); }
      &.role-admin { color: #c084fc; background: rgba(192, 132, 252, 0.15); }
      &.role-nurse { color: #4ade80; background: rgba(74, 222, 128, 0.15); }
      &.role-patient { color: #f472b6; background: rgba(244, 114, 182, 0.15); }
    }

    .mobile-nav-list {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      flex: 1;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.8rem 1rem;
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.92rem;
      font-weight: 600;
      border-radius: 9px;
      transition: all 0.15s ease;

      .m-icon {
        font-size: 1.2rem;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: white;
      }

      &.active {
        background: #0284c7;
        color: white;
        box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
      }

      &.portal-link {
        border: 1px solid rgba(13, 148, 136, 0.4);
        color: #5eead4;
      }
    }

    .mobile-drawer-footer {
      margin-top: 1.5rem;
      padding-top: 1.15rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      .btn-block {
        width: 100%;
        padding: 0.8rem;
      }
    }

    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(5px);
      z-index: 999;
    }

    /* Visibility Controls */
    .mobile-only {
      display: none;
    }
    .desktop-only {
      display: flex;
    }

    @media (max-width: 1100px) {
      .mobile-only {
        display: flex;
      }
      .desktop-only {
        display: none !important;
      }
      .nav-container {
        padding: 0.65rem 1.15rem;
      }
    }
  `]
})
export class NavbarComponent {
  mobileMenuOpen = signal(false);

  constructor(public authService: AuthService, private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMobileMenu();
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  avatarText = computed(() => {
    const name = this.authService.currentUser()?.fullName || 'User';
    return name.slice(0, 2).toUpperCase();
  });

  roleClass = computed(() => {
    const role = this.authService.currentUser()?.role;
    if (role === 'ROLE_DOCTOR') return 'role-doctor';
    if (role === 'ROLE_NURSE') return 'role-nurse';
    if (role === 'ROLE_PATIENT') return 'role-patient';
    return 'role-admin';
  });

  formatRole(role?: string): string {
    if (!role) return '';
    return role.replace('ROLE_', '');
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
  }
}

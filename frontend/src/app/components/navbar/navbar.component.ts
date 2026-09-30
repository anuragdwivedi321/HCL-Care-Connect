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
      <div class="nav-container">
        <!-- Brand / Logo -->
        <div class="brand">
          <a routerLink="/" class="brand-link" (click)="closeMobileMenu()">
            <span class="brand-icon">⚕</span>
            <div class="brand-text">
              <div class="brand-title-row">
                <span class="brand-title">CareConnect</span>
                <span class="live-dot" title="EHR System Active"></span>
              </div>
              <span class="brand-sub">ENTERPRISE EHR</span>
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
            <span class="user-avatar">{{ avatarText() }}</span>
            <div class="user-meta">
              <span class="user-name">{{ authService.currentUser()?.fullName }}</span>
              <span class="user-role">{{ formatRole(authService.currentUser()?.role) }}</span>
            </div>
          </div>

          <!-- Sign Out Button (Desktop) -->
          <button (click)="logout()" class="btn btn-secondary btn-sm logout-btn desktop-only" title="Sign Out">
            <span>⏻</span> Sign Out
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
            <div class="avatar-large">{{ avatarText() }}</div>
            <div class="mobile-user-info">
              <div class="mobile-name">{{ authService.currentUser()?.fullName }}</div>
              <span class="role-pill">{{ formatRole(authService.currentUser()?.role) }}</span>
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
      background: #0f172a; // Slate Navy
      color: white;
      border-bottom: 2px solid #0284c7;
      position: sticky;
      top: 0;
      z-index: 500;
      box-shadow: 0 4px 16px rgba(15, 23, 42, 0.2);
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0.65rem 1.5rem;
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
    }

    .brand-icon {
      font-size: 1.6rem;
      background: linear-gradient(135deg, #0284c7, #0d9488);
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
    }

    .brand-title-row {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    .brand-title {
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: white;
      line-height: 1.1;
    }

    .live-dot {
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
      display: inline-block;
      animation: pulseLive 2s infinite;
    }

    @keyframes pulseLive {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }

    .brand-sub {
      font-size: 0.62rem;
      letter-spacing: 0.15em;
      color: #38bdf8;
      font-weight: 700;
      display: block;
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
      gap: 0.4rem;
      padding: 0.5rem 0.85rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 600;
      border-radius: 8px;
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      white-space: nowrap;

      .nav-icon {
        font-size: 1rem;
      }

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.08);
      }

      &.active {
        color: white;
        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        box-shadow: 0 2px 8px rgba(2, 132, 199, 0.4);
      }

      &.portal-tab {
        border: 1px solid rgba(13, 148, 136, 0.5);
        color: #5eead4;

        &.active {
          background: linear-gradient(135deg, #0d9488, #0f766e);
          color: white;
        }
      }

      &.danger-highlight:hover {
        color: #fca5a5;
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
      gap: 0.65rem;
      padding: 0.35rem 0.85rem;
      border-radius: 30px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.12);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      background: linear-gradient(135deg, #0284c7, #0d9488);
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.8rem;
      font-weight: 800;
    }

    .user-meta {
      display: flex;
      flex-direction: column;
      line-height: 1.15;
    }

    .user-name {
      font-size: 0.825rem;
      font-weight: 700;
      color: white;
    }

    .user-role {
      font-size: 0.65rem;
      color: #38bdf8;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .logout-btn {
      color: #e2e8f0;
      border-color: rgba(255, 255, 255, 0.2);
      background: rgba(255, 255, 255, 0.06);

      &:hover {
        background: #ef4444;
        border-color: #ef4444;
        color: white;
      }
    }

    /* Mobile Hamburger Button */
    .mobile-toggle-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.3rem;
      transition: background 0.2s;

      &:hover {
        background: rgba(255, 255, 255, 0.18);
      }
    }

    /* Mobile Drawer */
    .mobile-drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 82%;
      max-width: 320px;
      background: #0f172a;
      border-left: 2px solid #0284c7;
      z-index: 1000;
      box-shadow: -8px 0 24px rgba(0, 0, 0, 0.5);
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
      padding: 1rem;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      margin-bottom: 1.25rem;
    }

    .avatar-large {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0284c7, #0d9488);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1rem;
      color: white;
    }

    .mobile-name {
      font-weight: 700;
      font-size: 0.95rem;
      color: white;
      margin-bottom: 0.2rem;
    }

    .role-pill {
      font-size: 0.7rem;
      font-weight: 700;
      color: #38bdf8;
      background: rgba(56, 189, 248, 0.15);
      padding: 0.2rem 0.5rem;
      border-radius: 20px;
    }

    .mobile-nav-list {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      flex: 1;
    }

    .mobile-nav-link {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      color: #cbd5e1;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 600;
      border-radius: 8px;
      transition: all 0.15s ease;

      .m-icon {
        font-size: 1.15rem;
      }

      &:hover {
        background: rgba(255, 255, 255, 0.08);
        color: white;
      }

      &.active {
        background: #0284c7;
        color: white;
      }

      &.portal-link {
        border: 1px solid rgba(13, 148, 136, 0.4);
        color: #5eead4;
      }
    }

    .mobile-drawer-footer {
      margin-top: 1.5rem;
      padding-top: 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);

      .btn-block {
        width: 100%;
        padding: 0.75rem;
      }
    }

    .mobile-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(4px);
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
        padding: 0.65rem 1rem;
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

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
    <!-- If user is logged in, show Enterprise Navigation Shell -->
    <ng-container *ngIf="authService.currentUser()">
      
      <!-- Mobile Top Bar (Only on screens < 992px) -->
      <header class="mobile-topbar mobile-only">
        <button class="mobile-menu-btn" (click)="toggleMobileMenu()" aria-label="Toggle Navigation">
          <span>{{ mobileMenuOpen() ? '✕' : '☰' }}</span>
        </button>
        <div class="mobile-brand">
          <span class="brand-cross">⚕</span>
          <span class="mobile-brand-title">CareConnect EHR</span>
        </div>
        <div class="mobile-user-mini" [ngClass]="roleClass()">
          {{ avatarText() }}
        </div>
      </header>

      <!-- Desktop Sidebar & Mobile Drawer -->
      <aside class="sidebar-aside" [class.mobile-open]="mobileMenuOpen()">
        <!-- Brand Header -->
        <div class="sidebar-brand">
          <a routerLink="/" class="brand-link" (click)="closeMobileMenu()">
            <div class="brand-icon-box">
              <span class="brand-cross">⚕</span>
            </div>
            <div class="brand-titles">
              <div class="brand-name-row">
                <span class="brand-name">CareConnect</span>
                <span class="brand-version">v2.6</span>
              </div>
              <span class="brand-tagline">ENTERPRISE EHR PLATFORM</span>
            </div>
          </a>
        </div>

        <!-- Telemetry / Hospital Unit Badge -->
        <div class="telemetry-chip">
          <div class="t-pulse">
            <span class="t-dot"></span>
            <span class="t-ring"></span>
          </div>
          <div class="t-info">
            <span class="t-status">SYSTEM OPERATIONAL</span>
            <span class="t-sub">Oracle DB XE • HIPAA Compliant</span>
          </div>
        </div>

        <!-- Nav Navigation Menu -->
        <nav class="sidebar-nav">
          <ng-container *ngIf="!authService.isPatient()">
            <div class="nav-section-title">CLINICAL MANAGEMENT</div>

            <a routerLink="/dashboard" routerLinkActive="active" (click)="closeMobileMenu()" class="nav-link-item">
              <span class="nav-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="7" height="9"></rect>
                  <rect x="14" y="3" width="7" height="5"></rect>
                  <rect x="14" y="12" width="7" height="9"></rect>
                  <rect x="3" y="16" width="7" height="5"></rect>
                </svg>
              </span>
              <span class="nav-item-text">Clinical Dashboard</span>
            </a>

            <a routerLink="/patients" routerLinkActive="active" (click)="closeMobileMenu()" class="nav-link-item">
              <span class="nav-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              <span class="nav-item-text">Patient Directory (EMPI)</span>
            </a>

            <a routerLink="/clinical-notes" routerLinkActive="active" (click)="closeMobileMenu()" class="nav-link-item">
              <span class="nav-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </span>
              <span class="nav-item-text">SOAP Clinical Notes</span>
            </a>

            <div class="nav-section-title">DIAGNOSTICS & PHARMACY</div>

            <a routerLink="/cpoe-orders" routerLinkActive="active" (click)="closeMobileMenu()" class="nav-link-item">
              <span class="nav-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"></path>
                  <line x1="8.5" y1="2" x2="15.5" y2="2"></line>
                  <path d="M7 16h10"></path>
                </svg>
              </span>
              <span class="nav-item-text">CPOE Orders & Labs</span>
            </a>

            <a routerLink="/medications" routerLinkActive="active" (click)="closeMobileMenu()" class="nav-link-item">
              <span class="nav-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path>
                  <path d="m8.5 8.5 7 7"></path>
                </svg>
              </span>
              <span class="nav-item-text">E-Prescribing (Rx)</span>
            </a>

            <a routerLink="/interaction-checker" routerLinkActive="active" (click)="closeMobileMenu()" class="nav-link-item safety-item">
              <span class="nav-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  <path d="m9 12 2 2 4-4"></path>
                </svg>
              </span>
              <span class="nav-item-text">Drug Safety Engine</span>
              <span class="safety-badge">Guarded</span>
            </a>

            <div class="nav-section-title">GOVERNANCE & AUDIT</div>

            <a *ngIf="authService.isAdmin() || authService.isDoctor()" routerLink="/audit-logs" routerLinkActive="active" (click)="closeMobileMenu()" class="nav-link-item">
              <span class="nav-item-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <span class="nav-item-text">HIPAA Audit Trail</span>
            </a>
          </ng-container>

          <div class="nav-section-title">PATIENT ENGAGEMENT</div>

          <a routerLink="/patient-portal" routerLinkActive="active" (click)="closeMobileMenu()" class="nav-link-item portal-item">
            <span class="nav-item-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
              </svg>
            </span>
            <span class="nav-item-text">{{ authService.isPatient() ? 'My Health Portal' : 'Patient Portal' }}</span>
          </a>
        </nav>

        <!-- Sidebar User Footer -->
        <div class="sidebar-footer">
          <div class="user-card">
            <div class="user-avatar" [ngClass]="roleClass()">
              {{ avatarText() }}
            </div>
            <div class="user-details">
              <span class="user-name" [title]="authService.currentUser()?.fullName">{{ authService.currentUser()?.fullName }}</span>
              <span class="user-role-tag" [ngClass]="roleClass()">{{ formatRole(authService.currentUser()?.role) }}</span>
            </div>
            <button (click)="logout()" class="btn-logout" title="Sign Out from EHR">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      <!-- Backdrop for mobile drawer -->
      <div class="sidebar-backdrop" *ngIf="mobileMenuOpen()" (click)="closeMobileMenu()"></div>

    </ng-container>
  `,
  styles: [`
    /* Desktop Sidebar Styles */
    .sidebar-aside {
      width: 270px;
      height: 100vh;
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      background: #0f172a;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      flex-direction: column;
      z-index: 600;
      color: #94a3b8;
      box-shadow: 4px 0 24px rgba(0, 0, 0, 0.25);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    /* Brand Header */
    .sidebar-brand {
      padding: 1.25rem 1.4rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: 0.85rem;
      text-decoration: none;
      color: white;
    }

    .brand-icon-box {
      width: 42px;
      height: 42px;
      border-radius: 11px;
      background: linear-gradient(135deg, #0284c7 0%, #0d9488 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .brand-cross {
      font-size: 1.55rem;
      color: white;
      font-weight: 800;
      line-height: 1;
    }

    .brand-titles {
      display: flex;
      flex-direction: column;
    }

    .brand-name-row {
      display: flex;
      align-items: center;
      gap: 0.45rem;
    }

    .brand-name {
      font-size: 1.25rem;
      font-weight: 800;
      color: white;
      letter-spacing: -0.03em;
      line-height: 1.1;
    }

    .brand-version {
      font-size: 0.65rem;
      font-weight: 700;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(56, 189, 248, 0.3);
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
    }

    .brand-tagline {
      font-size: 0.58rem;
      letter-spacing: 0.12em;
      color: #64748b;
      font-weight: 700;
      margin-top: 0.15rem;
    }

    /* Telemetry Status Chip */
    .telemetry-chip {
      margin: 0.85rem 1.15rem;
      padding: 0.65rem 0.85rem;
      border-radius: 10px;
      background: rgba(2, 132, 199, 0.08);
      border: 1px solid rgba(2, 132, 199, 0.2);
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }

    .t-pulse {
      position: relative;
      width: 10px;
      height: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .t-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 6px #10b981;
    }

    .t-ring {
      position: absolute;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1.5px solid #10b981;
      animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
    }

    @keyframes ping {
      0% { transform: scale(0.8); opacity: 0.8; }
      100% { transform: scale(2); opacity: 0; }
    }

    .t-info {
      display: flex;
      flex-direction: column;
      line-height: 1.2;
    }

    .t-status {
      font-size: 0.68rem;
      font-weight: 800;
      color: #34d399;
      letter-spacing: 0.05em;
    }

    .t-sub {
      font-size: 0.62rem;
      color: #64748b;
      margin-top: 0.1rem;
    }

    /* Navigation */
    .sidebar-nav {
      flex: 1;
      padding: 0.5rem 0.85rem;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .nav-section-title {
      font-size: 0.62rem;
      font-weight: 800;
      color: #475569;
      letter-spacing: 0.1em;
      padding: 0.75rem 0.65rem 0.35rem 0.65rem;
      text-transform: uppercase;
    }

    .nav-link-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.62rem 0.85rem;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.86rem;
      font-weight: 600;
      border-radius: 9px;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      position: relative;

      .nav-item-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #64748b;
        transition: color 0.2s;
      }

      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.06);

        .nav-item-icon {
          color: #38bdf8;
        }
      }

      &.active {
        color: white;
        background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
        box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);

        .nav-item-icon {
          color: white;
        }
      }

      &.safety-item {
        .safety-badge {
          margin-left: auto;
          font-size: 0.62rem;
          font-weight: 800;
          color: #34d399;
          background: rgba(16, 185, 129, 0.15);
          border: 1px solid rgba(16, 185, 129, 0.3);
          padding: 0.12rem 0.45rem;
          border-radius: 12px;
          text-transform: uppercase;
        }

        &.active .safety-badge {
          color: white;
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.3);
        }
      }

      &.portal-item {
        border: 1px solid rgba(13, 148, 136, 0.3);
        color: #5eead4;
        background: rgba(13, 148, 136, 0.08);

        .nav-item-icon {
          color: #5eead4;
        }

        &.active {
          background: linear-gradient(135deg, #0d9488, #0f766e);
          color: white;
          border-color: rgba(255, 255, 255, 0.2);

          .nav-item-icon {
            color: white;
          }
        }
      }
    }

    /* Footer User Profile */
    .sidebar-footer {
      padding: 0.85rem 1rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      background: rgba(11, 19, 41, 0.6);
    }

    .user-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.82rem;
      font-weight: 800;
      color: white;
      flex-shrink: 0;

      &.role-doctor { background: linear-gradient(135deg, #0284c7, #0369a1); }
      &.role-admin { background: linear-gradient(135deg, #8b5cf6, #6d28d9); }
      &.role-nurse { background: linear-gradient(135deg, #10b981, #059669); }
      &.role-patient { background: linear-gradient(135deg, #ec4899, #db2777); }
    }

    .user-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      line-height: 1.2;
    }

    .user-name {
      font-size: 0.84rem;
      font-weight: 700;
      color: white;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role-tag {
      font-size: 0.65rem;
      font-weight: 700;
      margin-top: 0.15rem;

      &.role-doctor { color: #38bdf8; }
      &.role-admin { color: #c084fc; }
      &.role-nurse { color: #4ade80; }
      &.role-patient { color: #f472b6; }
    }

    .btn-logout {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #94a3b8;
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: #ef4444;
        border-color: #ef4444;
        color: white;
        transform: scale(1.05);
      }
    }

    /* Mobile Topbar */
    .mobile-topbar {
      display: none;
      position: sticky;
      top: 0;
      z-index: 550;
      background: #0f172a;
      border-bottom: 2px solid #0284c7;
      padding: 0.75rem 1rem;
      align-items: center;
      justify-content: space-between;
      color: white;
    }

    .mobile-menu-btn {
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: white;
      width: 38px;
      height: 38px;
      border-radius: 8px;
      font-size: 1.3rem;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .mobile-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .mobile-brand-title {
      font-size: 1.1rem;
      font-weight: 800;
      color: white;
    }

    .mobile-user-mini {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      font-weight: 800;
      color: white;
      &.role-doctor { background: #0284c7; }
      &.role-admin { background: #8b5cf6; }
      &.role-nurse { background: #10b981; }
      &.role-patient { background: #ec4899; }
    }

    .sidebar-backdrop {
      display: none;
    }

    /* Responsive Breakdown */
    @media (max-width: 992px) {
      .mobile-only {
        display: flex;
      }

      .sidebar-aside {
        transform: translateX(-100%);
        width: 280px;
        z-index: 1000;

        &.mobile-open {
          transform: translateX(0);
        }
      }

      .sidebar-backdrop {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.75);
        backdrop-filter: blur(4px);
        z-index: 990;
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

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PatientListComponent } from './components/patients/patient-list.component';
import { PatientDetailComponent } from './components/patients/patient-detail.component';
import { ClinicalNotesComponent } from './components/clinical-notes/clinical-notes.component';
import { CpoeOrdersComponent } from './components/cpoe/cpoe-orders.component';
import { MedicationsComponent } from './components/medications/medications.component';
import { InteractionCheckerComponent } from './components/interaction-checker/interaction-checker.component';
import { PatientPortalComponent } from './components/patient-portal/patient-portal.component';
import { AuditTrailComponent } from './components/audit-trail/audit-trail.component';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_DOCTOR', 'ROLE_NURSE', 'ROLE_ADMIN'] }
  },
  {
    path: 'patients',
    component: PatientListComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_DOCTOR', 'ROLE_NURSE', 'ROLE_ADMIN'] }
  },
  {
    path: 'patients/:id',
    component: PatientDetailComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_DOCTOR', 'ROLE_NURSE', 'ROLE_ADMIN'] }
  },
  {
    path: 'clinical-notes',
    component: ClinicalNotesComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_DOCTOR', 'ROLE_NURSE', 'ROLE_ADMIN'] }
  },
  {
    path: 'cpoe-orders',
    component: CpoeOrdersComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_DOCTOR', 'ROLE_NURSE', 'ROLE_ADMIN'] }
  },
  {
    path: 'medications',
    component: MedicationsComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_DOCTOR', 'ROLE_NURSE', 'ROLE_ADMIN'] }
  },
  {
    path: 'interaction-checker',
    component: InteractionCheckerComponent,
    canActivate: [authGuard]
  },
  {
    path: 'patient-portal',
    component: PatientPortalComponent,
    canActivate: [authGuard]
  },
  {
    path: 'audit-logs',
    component: AuditTrailComponent,
    canActivate: [authGuard],
    data: { roles: ['ROLE_DOCTOR', 'ROLE_ADMIN'] }
  },
  { path: '**', redirectTo: 'dashboard' }
];

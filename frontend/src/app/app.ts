import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastContainerComponent } from './components/toast/toast-container.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'CareConnect EHR';

  constructor(public authService: AuthService) {}
}

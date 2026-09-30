import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-wrapper" *ngIf="toastService.toasts().length > 0">
      <div
        *ngFor="let t of toastService.toasts()"
        class="toast-card"
        [ngClass]="'toast-' + t.type"
      >
        <div class="toast-icon">{{ t.icon }}</div>
        <div class="toast-body">
          <div class="toast-title">{{ t.title }}</div>
          <div class="toast-desc">{{ t.message }}</div>
        </div>
        <button class="toast-close" (click)="toastService.remove(t.id)" aria-label="Close">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-wrapper {
      position: fixed;
      top: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 420px;
      width: calc(100% - 3rem);
      pointer-events: none;
    }

    .toast-card {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 0.85rem;
      padding: 1rem 1.15rem;
      border-radius: 12px;
      background: white;
      box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.25), 0 0 0 1px rgba(15, 23, 42, 0.05);
      animation: toastSlideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      border-left: 5px solid;

      &.toast-success {
        border-left-color: #10b981;
        .toast-icon { background: #d1fae5; color: #047857; }
      }

      &.toast-danger {
        border-left-color: #ef4444;
        .toast-icon { background: #fee2e2; color: #b91c1c; }
      }

      &.toast-warning {
        border-left-color: #f59e0b;
        .toast-icon { background: #fef3c7; color: #b45309; }
      }

      &.toast-info {
        border-left-color: #0284c7;
        .toast-icon { background: #e0f2fe; color: #0369a1; }
      }
    }

    .toast-icon {
      font-size: 1.25rem;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .toast-body {
      flex: 1;
    }

    .toast-title {
      font-size: 0.9rem;
      font-weight: 700;
      color: #0f172a;
      line-height: 1.2;
      margin-bottom: 0.2rem;
    }

    .toast-desc {
      font-size: 0.8rem;
      color: #64748b;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 0.9rem;
      color: #94a3b8;
      cursor: pointer;
      padding: 0.2rem;
      margin-top: -0.2rem;

      &:hover {
        color: #1e293b;
      }
    }

    @keyframes toastSlideIn {
      from {
        opacity: 0;
        transform: translateX(50px) scale(0.95);
      }
      to {
        opacity: 1;
        transform: translateX(0) scale(1);
      }
    }

    @media (max-width: 640px) {
      .toast-wrapper {
        top: 1rem;
        right: 1rem;
        left: 1rem;
        width: auto;
      }
    }
  `]
})
export class ToastContainerComponent {
  constructor(public toastService: ToastService) {}
}

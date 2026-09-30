import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: number;
  title: string;
  message: string;
  type: 'success' | 'danger' | 'warning' | 'info';
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<ToastMessage[]>([]);
  private counter = 0;

  show(title: string, message: string, type: 'success' | 'danger' | 'warning' | 'info' = 'info'): void {
    const id = ++this.counter;
    let icon = 'ℹ️';
    if (type === 'success') icon = '✅';
    if (type === 'danger') icon = '🚨';
    if (type === 'warning') icon = '⚠️';

    const newToast: ToastMessage = { id, title, message, type, icon };
    this.toasts.update(current => [...current, newToast]);

    setTimeout(() => {
      this.remove(id);
    }, 4000);
  }

  success(title: string, message: string): void {
    this.show(title, message, 'success');
  }

  error(title: string, message: string): void {
    this.show(title, message, 'danger');
  }

  warning(title: string, message: string): void {
    this.show(title, message, 'warning');
  }

  info(title: string, message: string): void {
    this.show(title, message, 'info');
  }

  remove(id: number): void {
    this.toasts.update(current => current.filter(t => t.id !== id));
  }
}

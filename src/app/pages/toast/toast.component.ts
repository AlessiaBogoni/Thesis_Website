import { Component, OnInit, OnDestroy } from '@angular/core';
import { ToastService } from './toast.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-toast',
  template: `
    <div class="toast-container border" [class.show]="message">
      {{ message }}
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 0;
      right: -70%;
      margin: 20px;
      background-color: rgb(0, 0, 0);
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: all 0.5s ease-in-out;
    }
    .toast-container.show {
      right: 0;
      opacity: 1;
      visibility: visible;
    }
  `],
})
export class ToastComponent implements OnInit, OnDestroy {
  message: string | null = null;
  private toastSubscription!: Subscription;
  private timeoutId: any;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastSubscription = this.toastService.onToast().subscribe(toast => {
      this.message = toast.message;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => {
        this.message = null;
      }, toast.duration);
    });
  }

  ngOnDestroy(): void {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }
}


import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new EventEmitter<any>();

  show(message: string, duration: number = 3000): void {
    this.toastSubject.emit({ message, duration });
  }

  onToast(): EventEmitter<any> {
    return this.toastSubject;
  }
}

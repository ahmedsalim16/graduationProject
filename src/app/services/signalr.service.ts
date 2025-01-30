import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  private messageSubject = new BehaviorSubject<string>('');
  message$ = this.messageSubject.asObservable();

  constructor() {}

  // إنشاء الاتصال بـ SignalR
  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://adhamapis.runasp.net/swagger/index.html') // ضع رابط الـ API هنا
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('✅ SignalR Connected'))
      .catch((err) => console.error('❌ Error connecting to SignalR:', err));

    // استقبال بيانات جديدة عند حدوث تحديث في الغيابات
    this.hubConnection.on('UpdateAbsences', () => {
      console.log('🔄 Absence list updated from server');
      this.messageSubject.next('Updated');
    });
  }
  sendMessage( message: string) {
    this.hubConnection.invoke('SendMessage', message).catch((err) => console.error(err));
  }
}

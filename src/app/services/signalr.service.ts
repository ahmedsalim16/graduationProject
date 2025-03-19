import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private dataSubject = new BehaviorSubject<any>(null);
  data$ = this.dataSubject.asObservable();

  constructor() {
    this.startConnection();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://school-api.runasp.net//') // ضع رابط الـ API الخاص بك
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR Connected!'))
      .catch(err => console.error('SignalR Error:', err));

    this.hubConnection.on('ReceiveUpdate', (data) => {
      console.log('New Data Received:', data);
      this.dataSubject.next(data);
    });
  }

  sendUpdate(data: any) {
    this.hubConnection.invoke('SendUpdate', data)
      .catch(err => console.error('Error Sending Update:', err));
  }
}

import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection!: signalR.HubConnection;
  private messageSubject = new BehaviorSubject<any>(null);
  message$ = this.messageSubject.asObservable();

  get connection() {
    return this.hubConnection;
  }

  constructor() {
    this.startConnection();
  }

  private startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://school-api.runasp.net/api/Email') // استبدل بعنوان API الصحيح
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log("SignalR Connected"))
      .catch(err => console.error("Error connecting to SignalR:", err));

    this.hubConnection.on("ReceiveMessage", (message) => {
      this.messageSubject.next(message);
    });
  }

  sendEmail(emailData: any): Promise<void> {
    if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
      return Promise.reject("SignalR is not connected.");
    }
    return this.hubConnection.invoke("SendEmail", emailData);
  }
}

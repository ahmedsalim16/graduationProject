import { Component, Inject, NgModule, OnInit } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css',
  standalone:true,
  imports:[FormsModule,RouterModule,CommonModule],
})

export class MessagesComponent implements OnInit{
  
  emailData = {
    toEmail: '',
    subject: '',
    body: ''
  };
    messages: any[] = [];
    adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');

    constructor(public authService:AuthService,private router: Router,private shared:SharedService) {}
  ngOnInit(): void {
    this.adminId = this.authService.getAdminId(); // الحصول على ID الأدمن
    console.log('Admin ID:', this.adminId);
  }
  
    sendEmail() {
      if (!this.emailData.toEmail || !this.emailData.subject || !this.emailData.body) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Please Fill all fields',
          showConfirmButton: false,
          timer: 1500,
        });
        return;
      }
  
      this.shared.sendEmail(this.emailData).subscribe({
        next: (response) => {
          Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'Message Sent successfully',
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  console.log(response);
                  this.emailData = { toEmail: '', subject: '', body: '' };
        },
        error: (error) => {
           Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: error.error?.message || 'An error occurred',
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  console.error(error.error);
        }
      });
    }
    


    navigateToAdminUpdate(): void {
      if (this.adminId) {
        this.router.navigate(['/admin-update', this.adminId]);
      } else {
        console.error('Admin ID not found!');
      }
    }
  
    logout(): void {
      this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
    }
    isStudentOpen = false;
    isAdminOpen = false;
    
    toggleDropdown(menu: string) {
      if (menu === 'student') {
        this.isStudentOpen = !this.isStudentOpen;
      } else if (menu === 'admin') {
        this.isAdminOpen = !this.isAdminOpen;
      }
    }
    isSidebarOpen: boolean = true; // افتراضيًا، القائمة مفتوحة

toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}
  }
  

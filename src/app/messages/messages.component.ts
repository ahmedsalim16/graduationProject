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
  schoolName:string | null = localStorage.getItem('schoolTenantId');

    constructor(public authService:AuthService,private router: Router,private shared:SharedService) {}
  ngOnInit(): void {
    this.adminId = this.authService.getAdminId(); // الحصول على ID الأدمن
    console.log('Admin ID:', this.adminId);
    this.schoolLogo();
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

  pagesize:number=20;
  pageNumber:number=1;
  schoolLogoUrl: string = ''; // متغير لتخزين رابط الصورة

  schoolLogo() {
    const schoolTenantId = localStorage.getItem('schoolTenantId'); // جلب schoolTenantId من localStorage
  
    const filters = {
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };
  
    this.shared.filterSchools(filters).subscribe(
      (response: any) => {
        if (response && response.result && Array.isArray(response.result)) {
          // إيجاد المدرسة التي يعمل بها الإدمن
          const school = response.result.find((school: any) => school.schoolTenantId === schoolTenantId);
  
          // إذا وُجدت المدرسة، تخزين رابط الصورة، وإلا تعيين صورة افتراضية
          this.schoolLogoUrl = school.schoolLogo ;
  
          console.log('School Logo URL:', this.schoolLogoUrl);
        } else {
          console.error('No data found or invalid response format.');
          this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
        }
      },
      (err) => {
        console.error('Error while filtering schools:', err);
        this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
      }
    );
  }
  
getImageUrl(logoPath: string): string {
  if (!logoPath) {
    return '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png'; // صورة افتراضية إذا لم يكن هناك لوجو
  }
  return `https://school-api.runasp.net//${logoPath}`; // ضع هنا رابط السيرفر الصحيح
}

  }
  

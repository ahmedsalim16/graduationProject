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
  getImageUrl(logoPath: string): Promise<string> {
    return new Promise((resolve) => {
      if (!logoPath) {
        resolve('../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png'); // صورة افتراضية
        return;
      }
  
      const imageUrl = `https://school-api.runasp.net/${logoPath}`;
      this.convertToWebP(imageUrl)
        .then((webpUrl) => resolve(webpUrl))
        .catch(() => resolve(imageUrl)); // في حال الفشل، يتم استخدام الصورة الأصلية
    });
  }
  
  // ✅ تحويل الصورة إلى WebP
  convertToWebP(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // لتفادي مشاكل CORS
      img.src = imageUrl;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
  
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const webpUrl = canvas.toDataURL("image/webp", 0.8); // جودة 80%
          resolve(webpUrl);
        } else {
          reject("Canvas not supported");
        }
      };
  
      img.onerror = (err) => reject(err);
    });
  }
  
  // ✅ تحميل اللوجو وتحويله إلى WebP
  schoolLogoUrl: string = '';
  
  schoolLogo() {
    const schoolTenantId = localStorage.getItem('schoolTenantId');
  
    const filters = {
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };
  
    this.shared.filterSchools(filters).subscribe(
      (response: any) => {
        if (response?.result && Array.isArray(response.result)) {
          const school = response.result.find((s: any) => s.schoolTenantId === schoolTenantId);
          if (school?.schoolLogo) {
            // تحويل الصورة إلى WebP قبل العرض
            this.getImageUrl(school.schoolLogo).then((webpUrl) => {
              this.schoolLogoUrl = webpUrl;
            });
          } else {
            this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
          }
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

  }
  

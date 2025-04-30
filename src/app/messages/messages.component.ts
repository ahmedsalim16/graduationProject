import { Component, Inject, NgModule, OnInit, ViewChild,ElementRef } from '@angular/core';
import { SignalRService } from '../services/signalr.service';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { SharedService } from '../services/shared.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
// import { Editor, EditorModule } from 'primeng/editor';
import { Subscription } from 'rxjs';
// import Quill from 'quill';
// import { LanguageSwitcherComponent } from '../language-switcher/language-switcher.component';
// import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: [
    './messages.component.css',
    '../../../node_modules/quill/dist/quill.snow.css',
    '../../../node_modules/quill/dist/quill.core.css'
  ],
  standalone:true,
  imports:[FormsModule,RouterModule,CommonModule,SidebarModule,],
  template: `<div #editorContainer></div>`
})

export class MessagesComponent implements OnInit{
      @ViewChild('sidebarRef') sidebarRef!: Sidebar;
      // @ViewChild('editor') editor!: Editor;
      // @ViewChild('editorContainer', { static: true }) editorContainer!: ElementRef;
  // private quill!: Quill;
        
      sidebarVisible: boolean = false;
  emailData = {
    toEmail: '',
    subject: '',
    body: ''
  };
    messages: any[] = [];
    adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
  schoolName:string | null = localStorage.getItem('schoolTenantId');
  private subscriptions: Subscription = new Subscription();
//   ngAfterViewInit() {
//     this.quill = new Quill(this.editorContainer.nativeElement, {
//       theme: 'snow',
//       modules: {
//          toolbar: [
//       ['bold', 'italic', 'underline', 'strike'],
//       ['blockquote', 'code-block'],
//       [{ 'header': 1 }, { 'header': 2 }],
//       [{ 'list': 'ordered'}, { 'list': 'bullet' }],
//       [{ 'script': 'sub'}, { 'script': 'super' }],
//       [{ 'indent': '-1'}, { 'indent': '+1' }],
//       [{ 'direction': 'rtl' }],
//       [{ 'size': ['small', false, 'large', 'huge'] }],
//       [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
//       [{ 'color': [] }, { 'background': [] }],
//       [{ 'font': [] }],
//       [{ 'align': [] }],
//       ['clean'],
//       ['link', 'image', 'video']
//     ]
  
// }
// });
// }



    constructor(public authService:AuthService,private router: Router,private shared:SharedService) {}
    ngOnInit(): void {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
        return;
      }
  
      this.adminId = this.authService.getAdminId();
      console.log('Admin ID:', this.adminId);
      this.schoolLogo();
  
      if (window.innerWidth < 768) {
        this.sidebarVisible = false;
      }
      
      window.addEventListener('resize', this.handleResize);
    }
  
    ngOnDestroy(): void {
      window.removeEventListener('resize', this.handleResize);
      this.subscriptions.unsubscribe();
    }
  
    private handleResize = () => {
      if (window.innerWidth < 768) {
        this.sidebarVisible = false;
      }
    }
  
    sendEmail() {
      if (!this.validateEmailForm()) {
        return;
      }
  
      const emailSub = this.shared.sendEmail(this.emailData).subscribe({
        next: (response) => {
          this.showSuccessAlert('Message Sent successfully');
          this.emailData = { toEmail: '', subject: '', body: '' };
        },
        error: (error) => {
          this.showErrorAlert(error.error?.message || 'An error occurred');
        }
      });
  
      this.subscriptions.add(emailSub);
    }
  
    private validateEmailForm(): boolean {
      if (!this.emailData.toEmail || !this.emailData.subject || !this.emailData.body) {
        this.showErrorAlert('Please Fill all fields');
        return false;
      }
      
      // تحقق من صحة البريد الإلكتروني
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.emailData.toEmail)) {
        this.showErrorAlert('Please enter a valid email address');
        return false;
      }
      
      return true;
    }
  
    private showSuccessAlert(message: string): void {
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  
    private showErrorAlert(message: string): void {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: message,
        showConfirmButton: false,
        timer: 1500,
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
  this.sidebarVisible = !this.sidebarVisible;
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
  

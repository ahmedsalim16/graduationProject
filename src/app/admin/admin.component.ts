import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { NgForm } from '@angular/forms';
import { Loginmodel } from '../loginmodel';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ThemeService } from '../services/theme.service'; // استيراد خدمة الثيم
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component'; 
import { ImageStorageServiceService } from '../services/image-storage-service.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
   @ViewChild('sidebarRef') sidebarRef!: Sidebar;
    
  sidebarVisible: boolean = false;
  public login:Loginmodel
  adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
  schoolName:string | null = localStorage.getItem('schoolTenantId');
  constructor(public shared:SharedService,public authService:AuthService,private router: Router,private adminImageService: ImageStorageServiceService,){
   this.login=new Loginmodel();
  }
  ngOnInit(): void {
    this.adminId = this.authService.getAdminId(); // الحصول على ID الأدمن
    console.log('Admin ID:', this.adminId);
    this.schoolLogo();
    if (window.innerWidth < 768) {
      this.sidebarVisible = false;
    }
    
    // إضافة مستمع لتغيير حجم النافذة
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        this.sidebarVisible = false;
      }
    });
  }

 // الحصول على صورة الأدمن
  getAdminImage(adminId: string): string {
    return this.adminImageService.getAdminImageOrDefault(adminId);
  }

  // التحقق من وجود صورة مخصصة
  hasCustomImage(adminId: string): boolean {
    return this.adminImageService.hasCustomImage(adminId);
  }

  navigateToAdminUpdate(): void {
    if (this.adminId) {
      this.router.navigate(['/admin-update', this.adminId]);
    } else {
      console.error('Admin ID not found!');
    }
  }
    goBack(): void {
    // Logic to navigate back, e.g., using Angular Router
    window.history.back();
  }
  cancel(): void {
  this.admin ={
    userName:'',
    email:'',
    password:'',
    confirmPassword:'',
    role:1,
    owner:false

  }
  }
   admin ={
     userName:'',
     email:'',
     password:'',
     confirmPassword:'',
     role:1,
     owner:false
 
   }
   
 
   addAdmin(){
  
     
     this.shared.createNewAdmin(this.admin) .subscribe(
       res=>{
         this.admin={
          userName:'',
          email:'',
          password:'',
          confirmPassword:'',
          role:1,
          owner:false
       
         }
         Swal.fire({
                   position: "center",
                   icon: "success",
                   title: "admin added Successfull",
                   showConfirmButton: false,
                   timer: 1500
                 });
         console.log(res)
         
       },
       err=>{
        Swal.fire({
                  position: "center",
                  icon: "error",
                  title: "error while adding an Admin",
                  showConfirmButton: false,
                  timer: 1500
                });
         console.log(err);
       }
       
     );
    }


    selectedOption: string | null = null; // القيمة المختارة

    selectOption(option: string): void {
      this.selectedOption = option; // تحديد الخيار الجديد
      this.admin.role = option === 'manager' ? 3 : 1; // manager = 3, Cashier = 1
    }



    logout(): void {
        // عرض نافذة تأكيد باستخدام Swal
        Swal.fire({
          title: 'Logout',
          text: 'are you sure you want to logout?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes',
          cancelButtonText: 'No'
        }).then((result) => {
          if (result.isConfirmed) {
            // إذا ضغط المستخدم على "نعم"، قم بتسجيل الخروج
            this.authService.logout();
            // يمكنك إضافة رسالة نجاح إذا أردت
            Swal.fire(
              'Logout successfully',
              'success'
            );
          }
          // إذا ضغط على "لا"، فلن يحدث شيء ويتم إغلاق النافذة تلقائياً
        });
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

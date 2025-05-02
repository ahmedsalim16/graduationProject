import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ThemeService } from '../../services/theme.service'; // استيراد خدمة الثيم
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component'; 
@Component({
  selector: 'app-add-developer',
  templateUrl: './add-developer.component.html',
  styleUrl: './add-developer.component.css'
})
export class AddDeveloperComponent {
   @ViewChild('sidebarRef') sidebarRef!: Sidebar;
        
      sidebarVisible: boolean = false;
  schoolNames: string[] = [];
  pagesize:number=20;
  pageNumber:number=1;
  adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
constructor(public shared:SharedService,public authService:AuthService,private router: Router){}


ngOnInit(): void {
    
  
  this.adminId = this.authService.getAdminId(); // الحصول على ID الأدمن
  console.log('Admin ID:', this.adminId);

}
navigateToAdminUpdate(): void {
  if (this.adminId) {
    this.router.navigate(['/admin-update', this.adminId]);
  } else {
    console.error('Admin ID not found!');
  }
}
goBack(): void {
  this.admin ={
    userName:'',
    email:'',
    password:'',
    confirmPassword:'',
    role:0, 
    owner:false,

  }
}
admin ={
     userName:'',
     email:'',
     password:'',
     confirmPassword:'',
     role:0, 
     owner:false,
 
   }
   
 
   addAdmin(){
  
     
     this.shared.createNewAdmin(this.admin) .subscribe(
       res=>{
         this.admin={
          userName:'',
          email:'',
          password:'',
          confirmPassword:'',
          role:0,
          owner:false,
       
         }
         Swal.fire({
                   position: "center",
                   icon: "success",
                   title: "developer added Successfull",
                   showConfirmButton: false,
                   timer: 1500
                 });
         console.log(res)
         
       },
       err=>{
        Swal.fire({
                  position: "center",
                  icon: "error",
                  title: 'Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, and a special character',
                  showConfirmButton: false,
                  timer: 1500
                });
         console.log(err);
       }
       
     );
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
    
    
    isSidebarOpen: boolean = true; // افتراضيًا، القائمة مفتوحة

toggleSidebar() {
  this.sidebarVisible = !this.sidebarVisible;
}

isSchoolOpen = false;
isAdminOpen = false;

toggleDropdown(menu: string) {
  if (menu === 'school') {
    this.isSchoolOpen = !this.isSchoolOpen;
  } else if (menu === 'admin') {
    this.isAdminOpen = !this.isAdminOpen;
  }
}

}

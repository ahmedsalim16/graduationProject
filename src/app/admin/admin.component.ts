import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { NgForm } from '@angular/forms';
import { Loginmodel } from '../loginmodel';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  public login:Loginmodel
  adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
  schoolName:string | null = localStorage.getItem('schoolTenantId');
  constructor(public shared:SharedService,public authService:AuthService,private router: Router){
   this.login=new Loginmodel();
  }
  ngOnInit(): void {
    this.adminId = this.authService.getAdminId(); // الحصول على ID الأدمن
    console.log('Admin ID:', this.adminId);
    this.schoolLogo();
  }


  navigateToAdminUpdate(): void {
    if (this.adminId) {
      this.router.navigate(['/admin-update', this.adminId]);
    } else {
      console.error('Admin ID not found!');
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
          this.schoolLogoUrl = 'assets/default-school.png'; // صورة افتراضية
        }
      },
      (err) => {
        console.error('Error while filtering schools:', err);
        this.schoolLogoUrl = 'assets/default-school.png'; // صورة افتراضية في حالة الخطأ
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

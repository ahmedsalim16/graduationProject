import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-add-owner',
  templateUrl: './add-owner.component.html',
  styleUrl: './add-owner.component.css'
})
export class AddOwnerComponent implements OnInit {
  schoolNames: string[] = [];
  pagesize:number=20;
  pageNumber:number=1;
  adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
constructor(public shared:SharedService,public authService:AuthService,private router: Router){}


ngOnInit(): void {
    
  this.getSchoolNames()
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

admin ={
     userName:'',
     email:'',
     password:'',
     confirmPassword:'',
     role:3,
     schoolTenantId:'',
     owner:true,
 
   }
   
 
   addAdmin(){
  
     
     this.shared.createNewAdmin(this.admin) .subscribe(
       res=>{
         this.admin={
          userName:'',
          email:'',
          password:'',
          confirmPassword:'',
          role:3,
          schoolTenantId:'',
          owner:true,
       
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

getSchoolNames(): void {
  const filters = {
    pageNumber: this.pageNumber,
    pageSize: this.pagesize,
  };

  this.shared.filterSchools(filters).subscribe(
    (response: any) => {
      console.log('API Response:', response); // طباعة البيانات لفحصها
      
      if (response && response.result && Array.isArray(response.result)) {
        this.schoolNames = response.result.map((school: any) => {
          console.log('School Data:', school); // طباعة كل عنصر لفحصه
          return school.SchoolTenantId || 'N/A'; // تفادي undefined
        });

        console.log('School Names:', this.schoolNames);
      } else {
        console.error('No data found or invalid response format.');
      }
    },
    (err) => {
      console.error('Error while fetching school names:', err);
    }
  );
}

}

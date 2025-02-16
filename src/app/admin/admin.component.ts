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
  constructor(public shared:SharedService,public authService:AuthService,private router: Router){
   this.login=new Loginmodel();
  }
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
 
   admin ={
     userName:'',
     email:'',
     password:'',
     confirmPassword:'',
     role:0,
 
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
      this.admin.role = option === 'admin' ? 0 : 1; // Admin = 2, Cashier = 1
    }



    logout(): void {
      this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
    }
}

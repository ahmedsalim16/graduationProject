import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { NgForm } from '@angular/forms';
import { Loginmodel } from '../loginmodel';
import Swal from 'sweetalert2';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  public login:Loginmodel
  constructor(public shared:SharedService,public authService:AuthService){
   this.login=new Loginmodel();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


  onsubmit(form:NgForm){
    console.log(this.login)
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
                   position: "top-end",
                   icon: "success",
                   title: "admin added Successfull",
                   showConfirmButton: false,
                   timer: 1500
                 });
         console.log(res)
         
       },
       err=>{
        Swal.fire({
                  position: "top-end",
                  icon: "error",
                  title: "This account already exists",
                  showConfirmButton: false,
                  timer: 1500
                });
         console.log(err);
       }
       
     );
    }


    selectedOption: string | null = null;

    selectOption(option: string): void {
      if (this.selectedOption === option) {
        // Uncheck if the same option is selected again
        this.selectedOption = null;
        this.admin.role = 0; // Reset role to 0
      } else {
        // Check the new option and set role
        this.selectedOption = option;
        this.admin.role = option === 'admin' ? 2 : 1; // Admin = 2, Cashier = 1
      }
    }

    logout(): void {
      this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
    }
}

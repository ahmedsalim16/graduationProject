import { Component } from '@angular/core';
import { StudentComponent } from '../student/student.component';
import { SharedService } from '../shared.service';
import { Router, RouterLink, Routes } from '@angular/router';
import { link } from 'fs';
import path from 'path';
import { skip } from 'rxjs';
import { MessageChannel } from 'worker_threads';
import exp from 'constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ɵparseCookieValue } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private shared:SharedService,private router:Router,private http:HttpClient){}
  
  username:string='';
  passWord:string='';
  
    ngOnInit(): void {
    
    }
    
     headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    obj:any={
      userName:this.username,
      password:this.passWord
      
    }
  
    loginPage(){
      this.shared.loginPage(this.obj,this.headers).subscribe((res:any)=>{
        
          console.log("res",res);
          localStorage.setItem('token',res.accessToken);
           sessionStorage.setItem('token',res.accessToken);
          Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Loggin Successfull",
            showConfirmButton: false,
            timer: 1500
          });
          this.router.navigateByUrl('student')
       
        
        
      },
    
        err=>{
          Swal.fire({
            position: "top-end",
            icon: "error",
            title: "wrong username or password",
            showConfirmButton: false,
            timer: 1500
          });
          console.log(err);
          }
      
        )
      
  
    
    }
  

  // loginObj:Login;
  // constructor(public shared:SharedService,private router:Router,private http:HttpClient){
  //   this.loginObj=new Login();
   
  // }
  // obj:any={
  //   email:'',
  //   password:'',
  //   twoFactorCode:'',
  //   twoFactorRecoveryCode:''
  // }
  



  // Email:string;
  // Password:string;
  // login(){
  //   if(this.Email=='as0531869@gmail.com'&& this.Password =='123456')
  //   {
  //    // console.log("welcome");
     
  //    this.router.navigateByUrl('student');
     
     
  //   }
  //   else{
  //     alert("Invalid Email or Password");
  //     //  const para = document.createElement("p");
  //     //  para.innerText = "Invalid Email or Password";
  //     //  document.body.appendChild(para);
  //     //  para.style.color='darkred';
  //     }

  // }
  

  // // loginPage(){
  // //   this.shared.loginPage(this.obj).subscribe((res:any)=>{
      
  // //       console.log("res",res);
  // //       localStorage.setItem('token',res.accessToken);
  // //       sessionStorage.setItem('token',res.accessToken);
  // //       alert("login succeeded");
  // //       this.router.navigateByUrl('student')
     
      
      
  // //   },
  
  // //     err=>{
  // //       alert("Invalid Email or Password");
  // //       console.log(err);
  // //       }
    
  // //     )
    

  
  // // }
   
  // onlogin(){
   
  //   this.http.post("https://salimapi.runasp.net/account/login?useCookies=true&useSessionCookies=true",this.loginObj).subscribe((res:any)=>{
      
  //       if(res.result){
  //         this.router.navigateByUrl('student')
  //       }
  //       else{
  //         alert("Invalid Email or Password");
  //       }
        
      
  //   },
  //   err=>{
  //     console.log(err);
  //     }
  //   )

  // }
   
 
// }
// export class Login{
//   EmailId:string;
//   Password2:string;
//   twoFactorCode:string;
//   twoFactorRecoveryCode:string;
//   constructor(){
//     this.EmailId='';
//     this.Password2='';
//     this.twoFactorCode='string';
//     this.twoFactorRecoveryCode='string';
//   }
}

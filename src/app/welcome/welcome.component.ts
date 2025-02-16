import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import {  Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {
constructor(private shared:SharedService,private router:Router,private http:HttpClient,private authService:AuthService,private cdr: ChangeDetectorRef){}
isRightPanelActive = false;
username:string='';
passWord:string='';
showPassword: boolean = false;
showConfirmPassword: boolean = false;
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
        this.shared.setToken(res.token);
        localStorage.setItem('token',res.token);
         sessionStorage.setItem('token',res.token);
         this.authService.setAdminId(res.userId);
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Loggin Successfull",
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigateByUrl('Dashboard')
     
      
      
    },
  
      err=>{
        Swal.fire({
          position: "center",
          icon: "error",
          title: "wrong username or password",
          showConfirmButton: false,
          timer: 1500
        });
        console.log(err);
        }
    
      )
    

  
  }
  activateRightPanel() {
    this.isRightPanelActive = true;
    this.cdr.detectChanges(); // إجبار Angular على إعادة التحديث
  }

  deactivateRightPanel() {
    this.isRightPanelActive = false;
    this.cdr.detectChanges();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
}

toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
}

}

import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import {  Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {
constructor(private shared:SharedService,private router:Router,private http:HttpClient){}



  ngOnInit(): void {
  
  }


  obj:any={
    userName:'',
    password:'',
    twoFactorCode:'',
    twoFactorRecoveryCode:''
  }

  loginPage(){
    this.shared.loginPage(this.obj).subscribe((res:any)=>{
      
        console.log("res",res);
        localStorage.setItem('token',res.accessToken);
        sessionStorage.setItem('token',res.accessToken);
        alert("login succeeded");
        this.router.navigateByUrl('student')
     
      
      
    },
  
      err=>{
        alert("Invalid Email or Password");
        console.log(err);
        }
    
      )
    

  
  }

}

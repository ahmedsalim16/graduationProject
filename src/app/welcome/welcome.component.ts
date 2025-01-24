import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import {  Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css'
})
export class WelcomeComponent implements OnInit {
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
        this.shared.setToken(res.token);
        localStorage.setItem('token',res.token);
         sessionStorage.setItem('token',res.token);
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

}

import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { NgForm } from '@angular/forms';
import { Loginmodel } from '../loginmodel';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  public login:Loginmodel
  constructor(public shared:SharedService){
   this.login=new Loginmodel();
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }


  onsubmit(form:NgForm){
    console.log(this.login)
   }
 
   admin ={
     // id:0,
     userName:'',
     password:'',
 
   }
   
 
   addAdmin(){
  
     
     this.shared.createNewAdmin(this.admin) .subscribe(
       res=>{
         this.admin={
           // id:0,
           userName:'',
           password:'',
       
         }
         console.log(res)
         
       },
       err=>{
         console.log(err);
       }
       
     );
    }
}

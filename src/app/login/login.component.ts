import { Component, OnInit } from '@angular/core';
import { StudentComponent } from '../student/student.component';
import { SharedService } from '../services/shared.service';
import { Router, RouterLink, Routes } from '@angular/router';
import { link } from 'fs';
import path from 'path';
import { skip } from 'rxjs';
import { MessageChannel } from 'worker_threads';
import exp from 'constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ɵparseCookieValue } from '@angular/common';
import Swal from 'sweetalert2';
interface CalendarDay {
  date: Date;
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit{

  weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  calendarDays: CalendarDay[] = [];
  
  currentDate = new Date();
  currentMonth: number;
  currentYear: number;
  currentMonthName: string;

  selectedDate: Date | null = null;

  constructor() {
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonthName = this.currentDate.toLocaleString('default', { month: 'long' });
  }

  ngOnInit() {
    this.generateCalendar();
  }

  generateCalendar() {
    // Clear previous days
    this.calendarDays = [];

    // First day of the current month
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1);
    
    // Last day of the current month
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0);

    // Days from previous month
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();

    // Add days from previous month
    for (let i = 0; i < startingDayOfWeek; i++) {
      const date = new Date(
        this.currentYear, 
        this.currentMonth - 1, 
        prevMonthLastDay.getDate() - startingDayOfWeek + i + 1
      );
      
      this.calendarDays.push({
        date: date,
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: false,
        isToday: this.isToday(date),
        isSelected: this.isSelectedDate(date)
      });
    }

    // Add days of current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(this.currentYear, this.currentMonth, day);
      
      this.calendarDays.push({
        date: date,
        day: day,
        month: this.currentMonth,
        year: this.currentYear,
        isCurrentMonth: true,
        isToday: this.isToday(date),
        isSelected: this.isSelectedDate(date)
      });
    }

    // Add days from next month to complete the grid
    const remainingSlots = 42 - this.calendarDays.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const date = new Date(
        this.currentYear, 
        this.currentMonth + 1, 
        i
      );
      
      this.calendarDays.push({
        date: date,
        day: i,
        month: date.getMonth(),
        year: date.getFullYear(),
        isCurrentMonth: false,
        isToday: this.isToday(date),
        isSelected: this.isSelectedDate(date)
      });
    }
  }

  previousMonth() {
    this.currentDate = new Date(this.currentYear, this.currentMonth - 1, 1);
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonthName = this.currentDate.toLocaleString('default', { month: 'long' });
    this.generateCalendar();
  }

  nextMonth() {
    this.currentDate = new Date(this.currentYear, this.currentMonth + 1, 1);
    this.currentMonth = this.currentDate.getMonth();
    this.currentYear = this.currentDate.getFullYear();
    this.currentMonthName = this.currentDate.toLocaleString('default', { month: 'long' });
    this.generateCalendar();
  }

  selectDate(day: CalendarDay) {
    // Toggle selection
    this.selectedDate = day.date;
    this.generateCalendar(); // Regenerate to update selection styling
    
    // You can add additional logic here, like emitting the selected date
    console.log('Selected Date:', this.selectedDate);
  }

  private isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  private isSelectedDate(date: Date): boolean {
    if (!this.selectedDate) return false;
    return date.toDateString() === this.selectedDate.toDateString();
  }
  // username:string='';
  // passWord:string='';
  
  //   ngOnInit(): void {
    
  //   }
    
  //    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  //   obj:any={
  //     userName:this.username,
  //     password:this.passWord
      
  //   }
  
  //   loginPage(){
  //     this.shared.loginPage(this.obj,this.headers).subscribe((res:any)=>{
        
  //         console.log("res",res);
  //         localStorage.setItem('token',res.accessToken);
  //          sessionStorage.setItem('token',res.accessToken);
  //         Swal.fire({
  //           position: "top-end",
  //           icon: "success",
  //           title: "Loggin Successfull",
  //           showConfirmButton: false,
  //           timer: 1500
  //         });
  //         this.router.navigateByUrl('student')
       
        
        
  //     },
    
  //       err=>{
  //         Swal.fire({
  //           position: "top-end",
  //           icon: "error",
  //           title: "wrong username or password",
  //           showConfirmButton: false,
  //           timer: 1500
  //         });
  //         console.log(err);
  //         }
      
  //       )
      
  
    
  //   }
  

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

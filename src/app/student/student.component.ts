import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { text } from 'stream/consumers';
import { Loginmodel } from '../loginmodel';
import { log } from 'console';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { number } from 'echarts';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit{
  public login:Loginmodel
  adminId: string | null = null;
  admin:any={};
  constructor(public shared:SharedService,public authService:AuthService,private router: Router,private act: ActivatedRoute){
   this.login=new Loginmodel();
  }
  ngOnInit(){
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
 

  student ={
         FullName: '',
          Gender: 0,
          Grade: 0,
          City: '',
          Street: '',
          BirthDate: '',
          rfidTag_Id:'',
   

  }
  formatDateToYYYYMMDD(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // صيغة YYYY-MM-DD
  }
  
  

  addStudent() {
    
    this.student.BirthDate = this.formatDateToYYYYMMDD(this.student.BirthDate);

    this.shared.createNewStudent(this.student).subscribe(
      (res) => {
        this.student = {
          FullName: '',
          Gender: 0,
          Grade: 0,
          City: '',
          Street: '',
          BirthDate: '',
          rfidTag_Id:'',
        };
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Student added successfully',
          showConfirmButton: false,
          timer: 1500,
        });
        console.log(res);
      },
      (err) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.error?.message || 'An error occurred',
          showConfirmButton: false,
          timer: 1500,
        });
        console.error(err.error);
      }
    );
  }
  
  logout(): void {
    this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
  }
  
  // onFileChange(event: any): void {
  //   const file = event.target.files[0]; // الحصول على الملف الذي اختاره المستخدم
  //   if (file) {
  //     const fileName = file.name; // اسم الملف
  //     const fileType = file.type; // نوع الملف (مثل image/png)
  
  //     // صياغة البيانات بالشكل المطلوب
  //     this.student.StudentImg = `@${fileName};type=${fileType}`;
  
  //     console.log('Formatted StudentImg:', this.student.StudentImg); // التحقق من البيانات
  //   }
  // }

  StudentImg:any;
  onFileChange(event: any): void {
    this.StudentImg=event.target.files[0] // الحصول على أول ملف من المدخل
    console.log(this.StudentImg)
  }
  
  
}



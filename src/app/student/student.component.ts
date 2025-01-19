import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { text } from 'stream/consumers';
import { Loginmodel } from '../loginmodel';
import { log } from 'console';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { number } from 'echarts';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit{
  public login:Loginmodel
  constructor(public shared:SharedService){
   this.login=new Loginmodel();
  }
  ngOnInit(){}

  onsubmit(form:NgForm){
   console.log(this.login)
  }

  student ={
         FullName: '',
          Gender: 0,
          Grade: 0,
          City: '',
          Street: '',
          StudentImg: '',
          BirthDate: '',
   

  }
  formatDateToMMDDYYYY(date: string): string {
    const d = new Date(date); // تحويل النص إلى كائن تاريخ
    const month = (d.getMonth() + 1).toString().padStart(2, '0'); // الشهر
    const day = d.getDate().toString().padStart(2, '0'); // اليوم
    const year = d.getFullYear(); // السنة
    return `${month}/${day}/${year}`; // صيغة MM/DD/YYYY
  }
  

  addStudent(){
    this.student.BirthDate = this.formatDateToMMDDYYYY(this.student.BirthDate);
    this.student.Gender = +this.student.Gender;
    console.log('Data being sent to the server:', this.student);
    this.shared.createNewStudent(this.student) .subscribe(
      res=>{
        this.student={
          FullName: '',
          Gender: 0,
          Grade: 0,
          City: '',
          Street: '',
          StudentImg: '',
          BirthDate: '',
      
        }
         Swal.fire({
                           position: "top-end",
                           icon: "success",
                           title: "Stydent added Successfull",
                           showConfirmButton: false,
                           timer: 1500
                         });
                 console.log(res)
        
      },
      err=>{
         Swal.fire({
                          position: "top-end",
                          icon: "error",
                          title: err.error?.message || 'An error occurred',
                          showConfirmButton: false,
                          timer: 1500
                        });
                 console.log(err.error);
      }
      
    );
    
    //this.student.BirthDate = new Date(this.student.BirthDate).toISOString();
    
    
    // this.shared.studentList.push(this.student);
    // this.student={
    //   // id:0,
    //   firstName:'',
    //   lastName:'',
    //   email:'',
    //   age:0,
    //   address:'',
    //   city:'',
    //   grade:0,
    //   gender:''
  
    // }
  
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

  onFileChange(event: any): void {
    const file = event.target.files[0]; // الحصول على الملف المختار
    if (file) {
      const reader = new FileReader();
  
      // تحويل الملف إلى سلسلة Base64
      reader.onload = () => {
        this.student.StudentImg = reader.result as string; // تخزين الصورة كـ Base64
        console.log('Image Base64:', this.student.StudentImg);
      };
  
      reader.readAsDataURL(file); // قراءة الملف كـ Base64
    }
  }
  
}



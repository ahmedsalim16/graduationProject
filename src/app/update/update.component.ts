import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit{
  student:any = {};
  id:any;
  constructor(private act: ActivatedRoute,private _shared:SharedService,private router:Router) { 

  }
  ngOnInit(): void {
    
    // this.id = this.act.snapshot.paramMap.get('id');
    // this._shared.getStudentById(this.id)
    // .subscribe(
    //   res=>{
    //     this.student = res;
        

    //   },
    //   err=>{
    //     console.log(err);
    //   }
    // )
    const studentId = this.act.snapshot.paramMap.get('id');
    if (studentId) {
      this.getStudentById(studentId);
    }
  
    console.log('Current student object:', this.student);

  }
  getStudentById(id: string): void {
    this._shared.getStudentById(id).subscribe(
      (data) => {
        this.student = data.result; 
        if (this.student) {
          // تحويل التاريخ إلى نص
          if (this.student.birthDate) {
            this.student.birthDate = new Date(this.student.birthDate).toLocaleDateString(); // مثال لتحويل التاريخ إلى نص منسق
          }
  
          if (this.student.gender) {
            console.log('Gender is already a string:', this.student.gender);
          } else {
            console.warn('Gender field is missing or empty:', this.student.gender);
            this.student.gender = 'Unknown'; // وضع قيمة افتراضية إذا لم يكن موجودًا
          }
        }
        
        console.log('Student data fetched successfully:', this.student);
      },
      (error) => {
        console.error('Error fetching student data:', error);
      }
    );
  }

  formatDateToYYYYMMDD(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // صيغة YYYY-MM-DD
  }
  

  updateStudent() {
    this.student.birthDate = this.formatDateToYYYYMMDD(this.student.birthDate);
    const genderValue = this.student.gender === 'Male' ? 0 : this.student.gender === 'Female' ? 1 : null;
  console.log('Original Gender:', this.student.gender); // عرض النص الأصلي
  console.log('Gender Value:', genderValue);
    const studentData = {
      id: this.student.id || '',
      fullName: this.student.fullName || '',
      gender: genderValue,
      grade: this.student.grade || '',
      city: this.student.city || 'N/A',
      street: this.student.street || 'N/A',
      birthDate: this.student.birthDate || 'N/A',
      rfidTag_Id: this.student.rfidTag_Id || 'N/A',
       // تحويل النص إلى رقم
    };
   
  
    this._shared.updateStudent(studentData).subscribe(
      (res) => {
        Swal.fire({
                                   position: "center",
                                   icon: "success",
                                   title: "Student updated Successfull",
                                   showConfirmButton: false,
                                   timer: 1500
                                 });
                         console.log(res)
        this.router.navigate(['/student-list']);
      },
      (err) => {
        Swal.fire({
                                   position: "center",
                                   icon: "error",
                                   title: "can't update student",
                                   showConfirmButton: false,
                                   timer: 1500
                                 });
                         console.log(err)
      }
    );
  }
  
  
  // updateStudent(){
  //   this._shared.updateStudent(this.student)
  //   .subscribe(
  //     res=>{
  //       console.log(res);
  //       this.router.navigate(['/student-list']);
  //     },
  //     err=>{
  //       console.log(err);
  //     }
  //   )

  // }
  handleFileInput(event: any): void {
    const file: File = event.target.files[0];
    this.student.StudentImg = file;
  }
}

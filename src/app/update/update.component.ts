import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../shared.service';
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
    const studentId = this.act.snapshot.paramMap.get('id'); // الحصول على ID من مسار URL
    if (studentId) {
      this.getStudentById(studentId); // استدعاء البيانات
    }

  }
  getStudentById(id: string): void {
    this._shared.getStudentById(id).subscribe(
      (data) => {
        this.student = data; // ملء كائن الطالب بالبيانات المسترجعة
        console.log('Student data fetched successfully:', data);
      },
      (error) => {
        console.error('Error fetching student data:', error);
      }
    );
  }
  

  updateStudent() {
    const formData = new FormData();
    formData.append('Id', this.student.Id);
    formData.append('FullName', this.student.FullName);
    formData.append('Gender', this.student.Gender);
    formData.append('Grade', this.student.Grade.toString());
    formData.append('City', this.student.City);
    formData.append('Street', this.student.Street);
    formData.append('BirthDate', this.student.BirthDate);
    formData.append('rfidTag_Id', this.student.rfidTag_Id);
    
  
    this._shared.updateStudent(formData).subscribe(
      (res) => {
        Swal.fire({
                                   position: "top-end",
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
                                   position: "top-end",
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

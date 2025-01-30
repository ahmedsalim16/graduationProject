
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { customeInterceptor } from '../custome.interceptor';
import { Token } from '@angular/compiler';
import { HttpRequest, HttpHandler } from '@angular/common/http';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { number } from 'echarts';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent implements OnInit {
pagination: any;
  constructor(public shared:SharedService,private router:Router,public authService:AuthService){}
  student: any[] = [];
  searchtext:string='';
  pagesize:number=20;
  totalItems:number=20;
  itemsPerPage:number=5;
  pageNumber:number=1;
  count:number=0;
  gender: number | null = null; // لتخزين نوع الجنس المختار
grade: number | null = null;
  s='search for student';
  adminId: string | null = null;
 public qrValue:string;

  ngOnInit(): void {
    
    this.filterStudents();
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

 
getStudents(){
  localStorage.getItem('token');
  this.shared.getAllStudentspagination(this.pageNumber,this.pagesize).subscribe(
    response=>{
      console.log(response)
      if (response && response.result && Array.isArray(response.result)) {
        this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
      } else {
        console.error('Error: Invalid response format or no data found.');
        this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
      }

    },
    err=>{
      console.log(err);
      
    }
  )
}



// filterByGenderM(){
//   this.shared.getAllStudentsgender(this.gender=0,this.pageNumber,this.pagesize).subscribe(
//     response=>{
//       console.log(response)
//       if (response && response.result && Array.isArray(response.result)) {
//         this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
//       } else {
//         console.error('Error: Invalid response format or no data found.');
//         this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
//       }
      

//     },
//     err=>{
//       console.log(err);
      
//     }
//   )
  
// }
// filterByGenderF(){
//   this.shared.getAllStudentsgender(this.gender=1,this.pageNumber,this.pagesize).subscribe(
//     response=>{
//       console.log(response)
//       if (response && response.result && Array.isArray(response.result)) {
//         this.student = response.result; // إذا كانت البيانات موجودة، خزّنها
//       } else {
//         console.error('Error: Invalid response format or no data found.');
//         this.student = []; // تفريغ المصفوفة إذا لم توجد بيانات
//       }
      

//     },
//     err=>{
//       console.log(err);
      
//     }
//   )
  
// }
filterStudents() {
  localStorage.getItem('token');
  const filters = {
    gender: this.gender ?? undefined, // إذا كانت null قم بإرسال undefined
    grade: this.grade ?? undefined,   // إذا كانت null قم بإرسال undefined
    pageNumber: this.pageNumber,
    pageSize: this.pagesize,
  };

  this.shared.filterStudents(filters).subscribe(
    (response: any) => {
      if (response && response.result && Array.isArray(response.result)) {
        this.student = response.result; // تحديث قائمة الطلاب
        console.log('Filtered Students:', this.student);
      } else {
        console.error('No data found or invalid response format.');
        this.student = [];
      }
    },
    (err) => {
      console.error('Error while filtering students:', err);
    }
  );
}

sortByGradeAscending() {
  if (this.student && Array.isArray(this.student)) {
    this.student.sort((a: any, b: any) => a.grade - b.grade);
    console.log('Sorted Students by Grade Ascending:', this.student);
  }
}


delete(id: string) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this student!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.isConfirmed) {
      this.shared.deleteStudent(id).subscribe(
        (res) => {
          console.log('Student deleted:', res);
          this.student = this.student.filter((student: any) => student.id !== id);
          Swal.fire('Deleted!', 'The student has been deleted.', 'success');
        },
        (err) => {
          console.error('Error while deleting student:', err);
          Swal.fire('Error!', 'There was an error deleting the student.', 'error');
        }
      );
    }
  });
}

  pagechanged(event:any){
    this.pageNumber=event;
    // this.getStudents();
  }

  get filteredStudents() {
    return this.student.filter(student => 
      student.fullName.toLowerCase().includes(this.searchtext.toLowerCase()) ||
      student.city.toLowerCase().includes(this.searchtext.toLowerCase())
    );
  }

  logout(): void {
    this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
    this.authService.clearAdminId();
  }
  
  downloadCsvFile(){
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      title: 'Students data',
      useBom: true,
      headers: ['ID',
        'FullName',
        'Gender',
        'Grade',
        'City',
        'Street',
        'BirthDate',
        'Rfid-Tag',]
    };
   
    new ngxCsv(this.student, 'student-list', options);
  }

  // search(searchtext: string=''){
  //   this.shared.search(searchtext).subscribe(
  //     res=>{
  //       this.student=res;

  //     },
  //     err=>{
  //       console.log(err);
  //     }
  //   )
      
  // }

  // onPrevious(){
  //   this.PageNumber --;
  //   this.shared.getAllStudents(this.PageNumber,this.pagesize);
  // }
  // onNext() {
  //   this.PageNumber ++;
  //   this.shared.getAllStudents(this.PageNumber,this.pagesize);
  // }

}

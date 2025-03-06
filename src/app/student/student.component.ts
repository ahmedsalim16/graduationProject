import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { text } from 'stream/consumers';
import { Loginmodel } from '../loginmodel';
import { log } from 'console';
import { NgForm } from '@angular/forms';
import Swal from 'sweetalert2';
import { number } from 'echarts';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit{
  public login:Loginmodel
  adminId: string | null = null;
  admin:any={};
  selectedFile: File | null = null;
  constructor(public shared:SharedService,public authService:AuthService,private router: Router,private http: HttpClient,private act: ActivatedRoute,private renderer: Renderer2, private el: ElementRef){
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
  
  isStudentOpen = false;
isAdminOpen = false;

toggleDropdown(menu: string) {
  if (menu === 'student') {
    this.isStudentOpen = !this.isStudentOpen;
  } else if (menu === 'admin') {
    this.isAdminOpen = !this.isAdminOpen;
  }
}

// isSidebarOpen: boolean = true; // افتراضيًا، القائمة مفتوحة

// toggleSidebar() {
//   this.isSidebarOpen = !this.isSidebarOpen;
// }

 
  isSidebarOpen: boolean = true; // افتراضيًا، القائمة مفتوحة

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }


  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      this.selectedFile = file;
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File',
        text: 'Please select a valid CSV file.',
      });
      this.selectedFile = null;
    }
  }

  uploadCSV() {
    if (!this.selectedFile) {
      Swal.fire({
        icon: 'error',
        title: 'No File Selected',
        text: 'Please select a CSV file to upload.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', this.selectedFile);

    this.http.post('https://school-api.runasp.net/api/Student/UploadFile', formData).subscribe(
      (response) => {
        console.log('Upload Success:', response);
        Swal.fire({
          icon: 'success',
          title: 'Upload Successful',
          text: 'The CSV file has been uploaded and processed successfully.',
        });
      },
      (error) => {
        console.error('Upload Error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: error.error?.message || 'There was an error uploading the file.',
        });
      }
    );
  }
}




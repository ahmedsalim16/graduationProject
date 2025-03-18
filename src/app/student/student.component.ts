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
  adminName:string | null = localStorage.getItem('username');
  schoolName:string | null = localStorage.getItem('schoolTenantId');
  constructor(public shared:SharedService,public authService:AuthService,private router: Router,private http: HttpClient,private act: ActivatedRoute,private renderer: Renderer2, private el: ElementRef){
   this.login=new Loginmodel();
  }
  ngOnInit(){
    this.adminId = this.authService.getAdminId(); // الحصول على ID الأدمن
    console.log('Admin ID:', this.adminId);
    this.schoolLogo();
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
          RfidTag_Id:'',
          StudentImage:null,
   

  }
  formatDateToYYYYMMDD(date: string): string {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`; // صيغة YYYY-MM-DD
  }
  
  

  addStudent() {
    console.log('Student Data:', this.student);
    this.student.BirthDate = this.formatDateToYYYYMMDD(this.student.BirthDate);

    const formData = new FormData();

  formData.append('FullName', this.student.FullName);
  formData.append('Gender', this.student.Gender.toString()); // تحويل الرقم إلى نص
  formData.append('Grade', this.student.Grade.toString());
  formData.append('City', this.student.City);
  formData.append('Street', this.student.Street);
  formData.append('BirthDate', this.formatDateToYYYYMMDD(this.student.BirthDate)); 
  formData.append('RfidTag_Id', this.student.RfidTag_Id);

  if (this.student.StudentImage) {
    formData.append('StudentImage', this.student.StudentImage); // إضافة صورة الطالب
  }
  console.log(formData);
  this.shared.createNewStudent(formData).subscribe(
    (res) => {
     
      this.student = { FullName: '', Gender: 0, Grade: 0, City: '', Street: '', BirthDate: '', RfidTag_Id: '' ,StudentImage:null};
      
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
    const file = event.target.files[0];
  if (file) {
    this.student.StudentImage = file;
  }
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

  pagesize:number=20;
  pageNumber:number=1;
  schoolLogoUrl: string = ''; // متغير لتخزين رابط الصورة

  schoolLogo() {
    const schoolTenantId = localStorage.getItem('schoolTenantId'); // جلب schoolTenantId من localStorage
  
    const filters = {
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };
  
    this.shared.filterSchools(filters).subscribe(
      (response: any) => {
        if (response && response.result && Array.isArray(response.result)) {
          // إيجاد المدرسة التي يعمل بها الإدمن
          const school = response.result.find((school: any) => school.schoolTenantId === schoolTenantId);
  
          // إذا وُجدت المدرسة، تخزين رابط الصورة، وإلا تعيين صورة افتراضية
          this.schoolLogoUrl = school.schoolLogo ;
  
          console.log('School Logo URL:', this.schoolLogoUrl);
        } else {
          console.error('No data found or invalid response format.');
          this.schoolLogoUrl = 'assets/default-school.png'; // صورة افتراضية
        }
      },
      (err) => {
        console.error('Error while filtering schools:', err);
        this.schoolLogoUrl = 'assets/default-school.png'; // صورة افتراضية في حالة الخطأ
      }
    );
  }
  
getImageUrl(logoPath: string): string {
  if (!logoPath) {
    return '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png'; // صورة افتراضية إذا لم يكن هناك لوجو
  }
  return `https://school-api.runasp.net//${logoPath}`; // ضع هنا رابط السيرفر الصحيح
}

}




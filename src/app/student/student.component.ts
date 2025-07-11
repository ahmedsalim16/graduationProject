import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ThemeService } from '../services/theme.service'; // استيراد خدمة الثيم
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component'; 
import { ImageStorageServiceService } from '../services/image-storage-service.service';
@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrl: './student.component.css'
})
export class StudentComponent implements OnInit{
   @ViewChild('sidebarRef') sidebarRef!: Sidebar;
          
    sidebarVisible: boolean = false;
  public login:Loginmodel
  adminId: string | null = null;
  admin:any={};
  selectedFile: File | null = null;
  adminName:string | null = localStorage.getItem('username');
  schoolName:string | null = localStorage.getItem('schoolTenantId');
  constructor(
    public shared:SharedService,
    public authService:AuthService,
    private router: Router,
    private http: HttpClient,
    public themeService: ThemeService,
    private adminImageService: ImageStorageServiceService,
  ){
   this.login=new Loginmodel();
  }
  ngOnInit(){
    this.adminId = this.authService.getAdminId(); // الحصول على ID الأدمن
    console.log('Admin ID:', this.adminId);
    this.schoolLogo();
    if (window.innerWidth < 768) {
      this.sidebarVisible = false;
    }
    
    // إضافة مستمع لتغيير حجم النافذة
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        this.sidebarVisible = false;
      }
    });
  }


   // الحصول على صورة الأدمن
  getAdminImage(adminId: string): string {
    return this.adminImageService.getAdminImageOrDefault(adminId);
  }

  // التحقق من وجود صورة مخصصة
  hasCustomImage(adminId: string): boolean {
    return this.adminImageService.hasCustomImage(adminId);
  }

  navigateToAdminUpdate(): void {
    if (this.adminId) {
      this.router.navigate(['/admin-update', this.adminId]);
    } else {
      console.error('Admin ID not found!');
    }
  }
   goBack(): void {
    // Logic to navigate back, e.g., using Angular Router
    window.history.back();
  }
  cancel(): void {
    // Clear all input fields
    this.student = {
      FullName: '',
      Gender: 0,
      Grade: 0,
      City: '',
      Street: '',
      BirthDate: '',
      RfidTag_Id: '',
      StudentImage: null,
    };
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
     // عرض نافذة تأكيد باستخدام Swal
     Swal.fire({
       title: 'Logout',
       text: 'are you sure you want to logout?',
       icon: 'question',
       showCancelButton: true,
       confirmButtonColor: '#3085d6',
       cancelButtonColor: '#d33',
       confirmButtonText: 'Yes',
       cancelButtonText: 'No'
     }).then((result) => {
       if (result.isConfirmed) {
         // إذا ضغط المستخدم على "نعم"، قم بتسجيل الخروج
         this.authService.logout();
         // يمكنك إضافة رسالة نجاح إذا أردت
         Swal.fire(
           'Logout successfully',
           'success'
         );
       }
       // إذا ضغط على "لا"، فلن يحدث شيء ويتم إغلاق النافذة تلقائياً
     });
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
    this.sidebarVisible = !this.sidebarVisible;
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
  getImageUrl(logoPath: string): Promise<string> {
    return new Promise((resolve) => {
      if (!logoPath) {
        resolve('../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png'); // صورة افتراضية
        return;
      }
  
      const imageUrl = `https://school-api.runasp.net/${logoPath}`;
      this.convertToWebP(imageUrl)
        .then((webpUrl) => resolve(webpUrl))
        .catch(() => resolve(imageUrl)); // في حال الفشل، يتم استخدام الصورة الأصلية
    });
  }
  
  // ✅ تحويل الصورة إلى WebP
  convertToWebP(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous"; // لتفادي مشاكل CORS
      img.src = imageUrl;
  
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
  
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const webpUrl = canvas.toDataURL("image/webp", 0.8); // جودة 80%
          resolve(webpUrl);
        } else {
          reject("Canvas not supported");
        }
      };
  
      img.onerror = (err) => reject(err);
    });
  }
  
  // ✅ تحميل اللوجو وتحويله إلى WebP
  schoolLogoUrl: string = '';
  
  schoolLogo() {
    const schoolTenantId = localStorage.getItem('schoolTenantId');
  
    const filters = {
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };
  
    this.shared.filterSchools(filters).subscribe(
      (response: any) => {
        if (response?.result && Array.isArray(response.result)) {
          const school = response.result.find((s: any) => s.schoolTenantId === schoolTenantId);
          if (school?.schoolLogo) {
            // تحويل الصورة إلى WebP قبل العرض
            this.getImageUrl(school.schoolLogo).then((webpUrl) => {
              this.schoolLogoUrl = webpUrl;
            });
          } else {
            this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
          }
        } else {
          console.error('No data found or invalid response format.');
          this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
        }
      },
      (err) => {
        console.error('Error while filtering schools:', err);
        this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
      }
    );
  }
  


}




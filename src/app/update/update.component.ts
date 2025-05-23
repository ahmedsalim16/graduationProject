import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2';
import { ThemeService } from '../services/theme.service'; // استيراد خدمة الثيم
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component'; 
@Component({
  selector: 'app-update',
  templateUrl: './update.component.html',
  styleUrl: './update.component.css'
})
export class UpdateComponent implements OnInit{
  student:any = {};
  id:any;
  constructor(private act: ActivatedRoute,private _shared:SharedService,private router:Router) {}
  studentData :any={
     Id:'',
     FullName: '',
     Gender: 0,
     Grade: 0,
     City: '',
     Street: '',
     BirthDate: '',
     RfidTag_Id:'',
     StudentImage:null,
   }
  ngOnInit(): void {
    this.schoolLogo();
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
  goBack(): void {
    // Logic to navigate back, e.g., using Angular Router
    window.history.back();
  }
  Cancel():void{
    this.studentData={
      Id:'',
      FullName: '',
      Gender: 0,
      Grade: 0,
      City: '',
      Street: '',
      BirthDate: '',
      RfidTag_Id:'',
      StudentImage:null,
    }
  }
  getStudentById(id: string): void {
    this._shared.getStudentById(id).subscribe(
      (data) => {
        this.student = data.result; 
        this.studentData={
          Id:this.student.id ||'',
          FullName:this.student.fullName ||'',
          Gender:this.student.gender|| '',
          Grade:this.student.grade|| 0,
          City:this.student.city|| '',
          Street:this.student.street|| '',
          BirthDate:this.student.birthDate ||'',
          RfidTag_Id:this.student.rfidTag_Id||'',
          StudentImage:this.student.studentImage||null,
        }
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
    const formData = new FormData();
  
    // تحويل تاريخ الميلاد إلى الصيغة المطلوبة
    this.student.birthDate = this.formatDateToYYYYMMDD(this.student.birthDate);
  
    // تحويل الجنس إلى قيمة رقمية
    const genderValue = this.student.gender === 'Male' ? 0 : this.student.gender === 'Female' ? 1 : null;
    
    console.log('Original Gender:', this.student.gender);
    console.log('Gender Value:', genderValue);
  
    // إضافة البيانات إلى FormData
    formData.append('Id', this.studentData.Id || '');
    formData.append('FullName', this.studentData.FullName || '');
    formData.append('Gender', genderValue !== null ? genderValue.toString() : '');
    formData.append('Grade', this.studentData.Grade ||'');
    formData.append('City', this.studentData.City || 'N/A');
    formData.append('Street', this.studentData.Street || 'N/A');
    formData.append('BirthDate', this.studentData.BirthDate || 'N/A');
    formData.append('RfidTag_Id', this.studentData.RfidTag_Id || 'N/A');
  
    // إضافة الصورة إذا كانت موجودة
    if (this.studentData.StudentImage instanceof File) {
      formData.append('StudentImage', this.studentData.StudentImage);
    } else if (this.studentData.StudentImage) {
      // إذا كانت SchoolLogo موجودة كرابط، يمكنك إرساله كنص
      formData.append('StudentImage', this.studentData.StudentImage);
    }
  
    console.log('Data being sent:', this.studentData);
  
    // إرسال البيانات باستخدام FormData
    this._shared.updateStudent(formData).subscribe(
      (res) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Student updated successfully",
          showConfirmButton: false,
          timer: 1500
        });
        console.log(res);
        this.router.navigate(['/student-list']);
      },
      (err) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Can't update student",
          showConfirmButton: false,
          timer: 1500
        });
        console.log(err);
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
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.student.StudentImage = file;
    }
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
  
    this._shared.filterSchools(filters).subscribe(
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

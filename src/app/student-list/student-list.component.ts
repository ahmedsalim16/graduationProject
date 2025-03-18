
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  constructor(public shared:SharedService,private router:Router,public authService:AuthService,private cdr: ChangeDetectorRef){}
  student: any[] = [];
  searchtext:string='';
  pagesize:number=1000;
  totalItems:number;
  itemsPerPage:number=5;
  pageNumber:number=1;
  count:number=0;
  gender: number | null = null;
grade: number | null = null;
  s='search for student';
  adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
  schoolName:string | null = localStorage.getItem('schoolTenantId');
 public qrValue:string;

  ngOnInit(): void {
    // this.updateItemsPerPage(); // تحديد عدد العناصر بناءً على حجم الشاشة عند التحميل
    // window.addEventListener('resize', this.updateItemsPerPage.bind(this));
    this.filterStudents();
    this.adminId = this.authService.getAdminId(); // الحصول على ID الأدمن
    console.log('Admin ID:', this.adminId);
    this.schoolLogo();
  }
  // updateItemsPerPage(): void {
  //   if (window.innerWidth < 768) {
  //     this.itemsPerPage = 5; // موبايل
  //   } else {
  //     this.itemsPerPage = 10; // سطح المكتب
  //   }
  //   this.cdr.detectChanges(); // تحديث الواجهة لضمان تطبيق التغيير فورًا
  // }

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
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
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
        'RfidTag',
        'createdOn',
        'parentId',
        'parentEmail'
        ]
    };
    const formattedStudents = this.student.map(s => ({
      ID: s.id,
      FullName: s.fullName,
      Gender: s.gender,
      Grade: s.grade,
      City: s.city,
      Street: s.street,
      BirthDate: s.birthDate ? new Date(s.birthDate).toISOString().split('T')[0] : '', // YYYY-MM-DD
      RfidTag: s.rfidTag_Id ,
      createdOn: s.createdOn ,
      parentId:s.parentId,
      parentEmail:s.parentEmail,
      
    }));
  
   
    new ngxCsv(formattedStudents, 'student-list', options);
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
  isSidebarOpen: boolean = true; // افتراضيًا، القائمة مفتوحة

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  getImageUrl(logoPath: string): string {
    if (!logoPath) {
      return '../../assets/default-logo.png'; // صورة افتراضية إذا لم يكن هناك لوجو
    }
    return `https://school-api.runasp.net//${logoPath}`; // ضع هنا رابط السيرفر الصحيح
  }
 
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

import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { ngxCsv } from 'ngx-csv';
import { Router } from '@angular/router';


@Component({
  selector: 'app-absence-list',
  templateUrl: './absence-list.component.html',
  styleUrls: ['./absence-list.component.css'],
})
export class AbsenceListComponent {
  pagination: any;
  student: any[] = [];
  searchtext: string = '';
  pagesize: number = 20;
  totalItems: number;
  itemsPerPage: number = 4;
  pageNumber: number = 1;
  count: number = 0;
  grade: number | null = null; // لتخزين قيمة الصف الدراسي
  startDate: string | null = null; // لتخزين قيمة التاريخ
  showTable: boolean = false; // لتحديد ما إذا كان يجب عرض الجدول
  adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
  schoolName:string | null = localStorage.getItem('schoolTenantId');
  receivedMessage: string = '';
  userMessage: string = '';
  constructor(public shared: SharedService, public authService: AuthService,private router: Router) {}

  ngOnInit(): void {
    // this.signalRService.startConnection();

    // // استلام إشعارات التحديث وإعادة تحميل القائمة عند وصول تحديث جديد
    // this.signalRService.message$.subscribe((message) => {
    //   if (message === 'Updated') {
    //     this.filterStudents(); // إعادة جلب البيانات من الـ API
    //   }
    // });
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

  filterStudents() {
    const selectedGrade = this.grade ?? 0; // الصف الافتراضي 0
    const selectedDate = this.startDate ?? ''; // التاريخ الافتراضي فارغ
  
    this.shared.getAllAbsents(selectedGrade, selectedDate).subscribe(
      (response: any) => {
        console.log("data:",response);
        if (response && response.result && Array.isArray(response.result)) {
          this.student = response.result; // تحديث قائمة الطلاب بالبيانات القادمة من الخادم
        } else {
          console.warn('No valid data returned from the server.');
          this.student = []; // إذا لم تكن هناك بيانات، اجعل القائمة فارغة
        }
      },
      (error) => {
        console.error('Error fetching absents:', error);
        this.student = []; // في حالة الخطأ، اجعل القائمة فارغة
      }
    );
  }
 

  
  /**
   * تحديث الصفحة عند التغيير
   * @param event
   */
  pagechanged(event: any) {
    this.pageNumber = event;
  }

  /**
   * فلترة الطلاب عند البحث النصي
   */
  get filteredStudents() {
    return this.student.filter(
      (student) =>
        student.fullName.toLowerCase().includes(this.searchtext.toLowerCase()) ||
        student.city.toLowerCase().includes(this.searchtext.toLowerCase())
    );
  }

  /**
   * تسجيل الخروج
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * تحميل ملف CSV يحتوي على بيانات الطلاب
   */
  downloadCsvFile() {
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

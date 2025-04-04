import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  studentCount: number = 0; // العدد الكلي للطلاب
  maleStudentCount: number = 0; // عدد الطلاب الذكور
  femaleStudentCount: number = 0; // عدد الطالبات الإناث
  adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
  schoolName:string | null = localStorage.getItem('schoolTenantId');
  pagesize:number=50;
  pageNumber:number=1;
  role: string | null = null;
  parentCount:number=0;
  constructor(public shared: SharedService,public authService:AuthService,private router: Router) {}

  ngOnInit(): void {
    // الحصول على العدد الكلي للطلاب
    this.getTotalStudentCount();
    this.getParentCount();
    // الحصول على عدد الطلاب حسب الجنس
    this.getStudentCountByGender(0); // طلاب ذكور
    this.getStudentCountByGender(1); // طالبات إناث
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

  getTotalStudentCount(): void {
    this.shared.getStudentCountByGender().subscribe(
      (response) => {
        this.studentCount = response.result || 0; // العدد الكلي للطلاب
      },
      (err) => {
        console.error('Error fetching total student count:', err);
        this.studentCount = 0;
      }
    );
  }

  getStudentCountByGender(gender: number): void {
    this.shared.getStudentCountByGender(gender).subscribe(
      (response) => {
        if (gender === 0) {
          this.maleStudentCount = response.result || 0; // عدد الذكور
        } else if (gender === 1) {
          this.femaleStudentCount = response.result || 0; // عدد الإناث
        }
      },
      (err) => {
        console.error(`Error fetching student count for gender ${gender}:`, err);
        if (gender === 0) this.maleStudentCount = 0;
        if (gender === 1) this.femaleStudentCount = 0;
      }
    );
  }
  logout(): void {
    this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
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

getParentCount() {
  const filters = {
    role: this.role ?? undefined,
    pageNumber: this.pageNumber,
    pageSize: this.pagesize,
  };

  this.shared.filterAdmins(filters).subscribe(
    (response: any) => {
      if (response && response.result && Array.isArray(response.result)) {
        const parents = response.result.filter(
          (user: any) => user.role === 'Parent' && user.schoolTenantId === localStorage.getItem('schoolTenantId')
        );
        this.parentCount = parents.length; // عدد الآباء
        console.log('Number of Parents:', this.parentCount);
      } else {
        console.error('No data found or invalid response format.');
        this.parentCount = 0;
      }
    },
    (err) => {
      console.error('Error while fetching parents:', err);
    }
  );
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

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';
import { SignalRService } from '../services/signalr.service';

@Component({
  selector: 'app-parent-list',
  templateUrl: './parent-list.component.html',
  styleUrl: './parent-list.component.css'
})
export class ParentListComponent {
constructor(public shared:SharedService,public authService:AuthService,private router: Router,private signalRService: SignalRService){}
  parents: any[] = [];
  searchtext:string='';
  pagesize:number=100;
  totalItems:number;
  // تعديل قيمة المتغير الحالي
  itemsPerPage:number=1; // تغيير القيمة الافتراضية من 1 إلى 10
  // إضافة خيارات لعدد العناصر في الصفحة
  itemsPerPageOptions: number[] = [1, 5, 10, 15, 20];
  pageNumber:number=1;
  count:number=0;
  role: string | null = null; 
  s='search for admins';
  adminId: string | null = null;
 public qrValue:string;
 adminName:string | null = localStorage.getItem('username');
 schoolName:string | null = localStorage.getItem('schoolTenantId');
  ngOnInit(): void {
    // this.signalRService.data$.subscribe(data => {
    //   if (data) {
    //     this.parents = data.result; // تحديث قائمة المدارس عند استلام بيانات جديدة
    //   }
    // });
  
    this.filteradmins();
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
  onItemsPerPageChange(newValue: number): void {
    this.itemsPerPage = newValue;
    this.pageNumber = 1; // إعادة تعيين إلى الصفحة الأولى
    this.filteradmins(); // إعادة تحميل البيانات
  }
 
 


filteradmins() {
  localStorage.getItem('token');
  const filters = {
    role: this.role ?? undefined, // إذا كانت null قم بإرسال undefined   // إذا كانت null قم بإرسال undefined
    pageNumber: this.pageNumber,
    pageSize: this.pagesize,
  };

  this.shared.filterAdmins(filters).subscribe(
    (response: any) => {
      if (response && response.result && Array.isArray(response.result)) {
        this.parents = response.result.filter((user: any) => user.role === 'Parent'&& user.schoolTenantId===localStorage.getItem('schoolTenantId')); // تحديث قائمة الطلاب
        console.log('Filtered Parents:', this.parents);
      } else {
        console.error('No data found or invalid response format.');
        this.parents = [];
      }
    },
    (err) => {
      console.error('Error while filtering Parents:', err);
    }
  );
}




delete(id: string) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this Parent!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'No, keep it',
  }).then((result) => {
    if (result.isConfirmed) {
      this.shared.deleteadmins(id).subscribe(
        (res) => {
          console.log('admin deleted:', res);
          this.parents = this.parents.filter((student: any) => student.id !== id);
          Swal.fire('Deleted!', 'The Parent has been deleted.', 'success');
        },
        (err) => {
          console.error('Error while deleting admin:', err);
          Swal.fire('Error!', 'There was an error deleting the Parent.', 'error');
        }
      );
    }
  });
}

  pagechanged(event:any){
    this.pageNumber=event;
    // this.getadminss();
  }

  get filteredadmins() {
    return this.parents.filter(parents => 
      parents.userName.includes(this.searchtext.toLowerCase()) ||
      parents.email.includes(this.searchtext.toLowerCase()) 
    );
  }

  logout(): void {
    this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
  }

  downloadCsvFile() {
    const formattedAdmins = this.parents.map(admin => ({
      ID: admin.id,
      UserName: admin.userName,
      Email: admin.email,
      FirstName: admin.firstName,
      LastName: admin.lastName,
      PhoneNumber: admin.phoneNumber,
      Gender: admin.gender,
      Role: admin.role,
      CreatedOn:admin.createdOn ? new Date(admin.createdOn).toISOString().split('T')[0] : '', 
      
    }));


      var options = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: false,
        title: 'Admins Data',
        useBom: true,
        headers: [
          'ID',
          'UserName',
          'Email',
          'FirstName',
          'LastName',
          'PhoneNumber',
          'Gender',
          'Role',
          'CreatedOn',
          
          
        ],
      };
  
      new ngxCsv(formattedAdmins, 'admins-data', options);
    }
    formatDateTime(dateString: string): string {
      const date = new Date(dateString);
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
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

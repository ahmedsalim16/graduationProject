import { Component } from '@angular/core';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrl: './admin-list.component.css'
})
export class AdminListComponent {
pagination: any;
  constructor(public shared:SharedService,public authService:AuthService,private router: Router){}
  admins: any[] = [];
  searchtext:string='';
  pagesize:number=100;
  totalItems:number;
  itemsPerPage:number=1;
  pageNumber:number=1;
  count:number=0;
  role: string | null = null; // لتخزين نوع الجنس المختار
grade: number | null = null;
  s='search for admins';
  adminId: string | null = null;
 public qrValue:string;
 isOwner:string | null = null;
 MId:string | null = localStorage.getItem('userId');
 adminName:string | null = localStorage.getItem('username');
 schoolName:string | null = localStorage.getItem('schoolTenantId');
  ngOnInit(): void {
    this.schoolLogo();
    this.filteradmins();
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

  IsOwner():boolean{
    this.isOwner=localStorage.getItem('owner')
    if(this.isOwner=='true'){
      return true
    }
    else{
      return false
    }
  }
 
// getadmins(){
//   localStorage.getItem('token');
//   this.shared.getAllAdmins(this.pageNumber,this.pagesize).subscribe(
//     response=>{
//       console.log(response)
//       if (response && response.result && Array.isArray(response.result)) {
//         this.admins = response.result; // إذا كانت البيانات موجودة، خزّنها
//       } else {
//         console.error('Error: Invalid response format or no data found.');
//         this.admins = []; // تفريغ المصفوفة إذا لم توجد بيانات
//       }

//     },
//     err=>{
//       console.log(err);
      
//     }
//   )
// }


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
        this.admins = response.result.filter((user: any) => user.role !== 'Admin' && user.role !== 'Parent'&& user.schoolTenantId===localStorage.getItem('schoolTenantId')); // تحديث قائمة الطلاب
        console.log('Filtered admins:', this.admins);
      } else {
        console.error('No data found or invalid response format.');
        this.admins = [];
      }
    },
    (err) => {
      console.error('Error while filtering admins:', err);
    }
  );
}




delete(id: string) {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this admin!',
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
          this.admins = this.admins.filter((student: any) => student.id !== id);
          Swal.fire('Deleted!', 'The admin has been deleted.', 'success');
        },
        (err) => {
          console.error('Error while deleting admin:', err);
          Swal.fire('Error!', 'There was an error deleting the admin.', 'error');
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
    return this.admins.filter(admins => 
      admins.userName.includes(this.searchtext.toLowerCase()) ||
      admins.email.includes(this.searchtext.toLowerCase()) 
    );
  }

  logout(): void {
    this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
  }

  downloadCsvFile() {
    const formattedAdmins = this.admins.map(admin => ({
      ID: admin.id,
      UserName: admin.userName,
      Email: admin.email,
      FirstName: admin.firstName,
      LastName: admin.lastName,
      PhoneNumber: admin.phoneNumber,
      Gender: admin.gender,
      Role: admin.role,
      CreatedOn:admin.createdOn ? new Date(admin.createdOn).toISOString().split('T')[0] : '', 
      IsOwner: admin.owner,
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
          'IsOwner',
          
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

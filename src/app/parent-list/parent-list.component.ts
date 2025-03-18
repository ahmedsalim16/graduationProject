import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-parent-list',
  templateUrl: './parent-list.component.html',
  styleUrl: './parent-list.component.css'
})
export class ParentListComponent {
constructor(public shared:SharedService,public authService:AuthService,private router: Router){}
  parents: any[] = [];
  searchtext:string='';
  pagesize:number=100;
  totalItems:number;
  itemsPerPage:number=4;
  pageNumber:number=1;
  count:number=0;
  role: string | null = null; 
  s='search for admins';
  adminId: string | null = null;
 public qrValue:string;
 adminName:string | null = localStorage.getItem('username');
 schoolName:string | null = localStorage.getItem('schoolTenantId');
  ngOnInit(): void {
    
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

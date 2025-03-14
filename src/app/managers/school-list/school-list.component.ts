import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';
import { ngxCsv } from 'ngx-csv';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';

@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrl: './school-list.component.css'
})
export class SchoolListComponent {
pagination: any;
  constructor(public shared:SharedService,public authService:AuthService,private router: Router,private cdr: ChangeDetectorRef){}
  schools: any[] = [];
  searchtext:string='';
  pagesize:number=20;
  totalItems:number;
  itemsPerPage:number=1;
  pageNumber:number=1;
  count:number=0;
 
  s='search for schools';
  adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
 public qrValue:string;

  ngOnInit(): void {
    // this.updateItemsPerPage(); // تحديد عدد العناصر بناءً على حجم الشاشة عند التحميل
    // window.addEventListener('resize', this.updateItemsPerPage.bind(this));
    this.filterschools();
    this.adminId = this.authService.getAdminId(); // الحصول على ID الأدمن
    console.log('Admin ID:', this.adminId);

  }
  
  // updateItemsPerPage(): void {
  //   if (window.innerWidth < 768) {
  //     this.itemsPerPage = 1; // موبايل
  //   } else {
  //     this.itemsPerPage = 2; // سطح المكتب
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

 

filterschools() {
  localStorage.getItem('token');
  const filters = {
    pageNumber: this.pageNumber,
    pageSize: this.pagesize,
  };

  this.shared.filterSchools(filters).subscribe(
    (response: any) => {
      if (response && response.result && Array.isArray(response.result)) {
        this.schools = response.result; // تحديث قائمة الطلاب
        console.log('Filtered SChools:', this.schools);
      } else {
        console.error('No data found or invalid response format.');
        this.schools = [];
      }
    },
    (err) => {
      console.error('Error while filtering schools:', err);
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
      this.shared.deleteSchool(id).subscribe(
        (res) => {
          console.log('school deleted:', res);
          this.schools = this.schools.filter((school: any) => school.id !== id);
          Swal.fire('Deleted!', 'The school has been deleted.', 'success');
        },
        (err) => {
          console.error('Error while deleting admin:', err);
          Swal.fire('Error!', 'There was an error deleting the school.', 'error');
        }
      );
    }
  });
}

  pagechanged(event:any){
    this.pageNumber=event;
    // this.getadminss();
  }

  get filteredschools() {
    return this.schools.filter(school => 
      school.name?.toLowerCase().includes(this.searchtext.toLowerCase()) ||
      school.email?.toLowerCase().includes(this.searchtext.toLowerCase())
    );
  }
  

  logout(): void {
    this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
  }

  downloadCsvFile() {
    const formattedAdmins = this.schools.map(school => ({
      ID: school.schoolTenantId,
      Name: school.name,
      description: school.description,
      address: school.address,
      country: school.country,
      PhoneNumber: school.phoneNumber,
      email: school.email,
      schoolLogo: school.schoolLogo,
      CreatedOn:school.createdOn ? new Date(school.createdOn).toISOString().split('T')[0] : '', // تحويل التاريخ
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
          'name',
          'description',
          'address',
          'country',
          'phoneNumber',
          'email',
          'schoolLogo',
          'CreatedOn',
          
        ],
      };
  
      new ngxCsv(formattedAdmins, 'schools-data', options);
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

getImageUrl(logoPath: string): string {
  if (!logoPath) {
    return '../../assets/default-logo.png'; // صورة افتراضية إذا لم يكن هناك لوجو
  }
  return `https://school-api.runasp.net//${logoPath}`; // ضع هنا رابط السيرفر الصحيح
}

}

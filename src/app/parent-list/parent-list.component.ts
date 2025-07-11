import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router, RouterEvent, RouterModule } from '@angular/router';
import { ngxCsv } from 'ngx-csv';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { Sidebar,SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ThemeService } from '../services/theme.service'; // استيراد خدمة الثيم
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component'; 
import { TooltipModule } from 'primeng/tooltip';
import { ImageStorageServiceService } from '../services/image-storage-service.service';
@Component({
  selector: 'app-parent-list',
  templateUrl: './parent-list.component.html',
  styleUrls: ['./parent-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    HttpClientModule,
    ButtonModule,RouterModule,SidebarModule,ThemeToggleComponent,TooltipModule
  ]
})
export class ParentListComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
        
  sidebarVisible: boolean = false;
  constructor(
    public shared: SharedService,
    public authService: AuthService,
    private router: Router,
    private adminImageService: ImageStorageServiceService,
  ) {}

  parents: any[] = [];
  searchtext: string = '';
  pagesize: number = 100;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [5, 10, 25, 50];
  pageNumber: number = 1;
  loading: boolean = true;
  adminId: string | null = null;
  adminName: string | null = localStorage.getItem('username');
  schoolName: string | null = localStorage.getItem('schoolTenantId');
  schoolLogoUrl: string = '';
  isSidebarOpen: boolean = true;
  isStudentOpen: boolean = false;
  isAdminOpen: boolean = false;

  ngOnInit(): void {
    this.schoolLogo();
    this.filterParents();
    this.adminId = this.authService.getAdminId();
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

  filterParents() {
    this.loading = true;
    const filters = {
      role: 'Parent',
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };

    this.shared.filterAdmins(filters).subscribe(
      (response: any) => {
        if (response && response.result) {
          this.parents = response.result.filter((user: any) => 
            user.schoolTenantId === localStorage.getItem('schoolTenantId')
          );
          this.loading = false;
        } else {
          this.parents = [];
          this.loading = false;
        }
      },
      (err) => {
        console.error('Error while filtering parents:', err);
        this.loading = false;
      }
    );
  }

  navigateToAdminUpdate(): void {
    if (this.adminId) {
      this.router.navigate(['/admin-update', this.adminId]);
    }
  }

  applyFilterGlobal($event: any, stringVal: string) {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  onFilterChange(event: any, field: string, matchMode: string): void {
    if (this.table) {
      const target = event.target as HTMLInputElement;
      this.table.filter(target.value, field, matchMode);
    }
  }

  delete(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this parent!',
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
            this.parents = this.parents.filter((parent: any) => parent.id !== id);
            Swal.fire('Deleted!', 'The parent has been deleted.', 'success');
          },
          (err) => {
            Swal.fire('Error!', 'There was an error deleting the parent.', 'error');
          }
        );
      }
    });
  }

  downloadCsvFile() {
    const formattedParents = this.parents.map(parent => ({
      ID: parent.id,
      UserName: parent.userName,
      Email: parent.email,
      FirstName: parent.firstName,
      LastName: parent.lastName,
      PhoneNumber: parent.phoneNumber,
      Gender: this.getGenderText(parent.gender),
      Role: parent.role,
      CreatedOn: parent.createdOn ? new Date(parent.createdOn).toISOString().split('T')[0] : '',
    }));

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: [
        'ID', 'UserName', 'Email', 'FirstName', 'LastName', 
        'PhoneNumber', 'Gender', 'Role', 'CreatedOn'
      ],
    };

    new ngxCsv(formattedParents, 'parents-data', options);
  }

  getGenderText(genderValue: any): string {
    if (typeof genderValue === 'string') {
      return genderValue.trim().toLowerCase() === 'male' || genderValue.trim() === '0' 
        ? 'Male' 
        : 'Female';
    }
    return genderValue === 0 ? 'Male' : 'Female';
  }

  getGenderSeverity(genderValue: any): any {
    if (typeof genderValue === 'string') {
      return genderValue.trim().toLowerCase() === 'male' || genderValue.trim() === '0' 
        ? 'info' 
        : 'warning';
    }
    return genderValue === 0 ? 'info' : 'warning';
  }
  clear() {
    if (this.table) {
      this.table.clear();
      this.filterParents();
    }
  }
  toggleDropdown(menu: string) {
    if (menu === 'student') {
      this.isStudentOpen = !this.isStudentOpen;
    } else if (menu === 'admin') {
      this.isAdminOpen = !this.isAdminOpen;
    }
  }

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
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

  // باقي دوال معالجة الصور كما هي...
  getImageUrl(logoPath: string): Promise<string> {
    return new Promise((resolve) => {
      if (!logoPath) {
        resolve('../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png');
        return;
      }
      
      const imageUrl = `https://school-api.runasp.net/${logoPath}`;
      this.convertToWebP(imageUrl)
        .then((webpUrl) => resolve(webpUrl))
        .catch(() => resolve(imageUrl));
    });
  }

  convertToWebP(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const webpUrl = canvas.toDataURL("image/webp", 0.8);
          resolve(webpUrl);
        } else {
          reject("Canvas not supported");
        }
      };
      
      img.onerror = (err) => reject(err);
    });
  }

  schoolLogo() {
    const schoolTenantId = localStorage.getItem('schoolTenantId');
    
    const filters = {
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };
    
    this.shared.filterSchools(filters).subscribe(
      (response: any) => {
        if (response?.result) {
          const school = response.result.find((s: any) => s.schoolTenantId === schoolTenantId);
          if (school?.schoolLogo) {
            this.getImageUrl(school.schoolLogo).then((webpUrl) => {
              this.schoolLogoUrl = webpUrl;
            });
          } else {
            this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
          }
        } else {
          this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
        }
      },
      (err) => {
        this.schoolLogoUrl = '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
      }
    );
  }
      getManagerTooltip(parent: any): string {
      return `
👤 Manager Details:

🆔 ID: ${parent.id || 'N/A'}
👤 Username: ${parent.userName || 'N/A'}
📧 Email: ${parent.email || 'N/A'}
📝 First Name: ${parent.firstName || 'N/A'}
📝 Last Name: ${parent.lastName || 'N/A'}
📞 Phone: ${parent.phoneNumber || 'N/A'}
📍 Address: ${parent.address || 'N/A'}
⚧ Gender: ${this.getGenderText(parent.gender) || 'N/A'}
💼 Role: ${parent.role || 'N/A'}
🏫 School Tenant ID: ${parent.schoolTenantId || 'N/A'}
👑 Is Owner: ${parent.owner ? 'Yes' : 'No'}
📅 Created: ${parent.createdOn ? new Date(parent.createdOn).toLocaleDateString('en-GB') : 'N/A'}
      `.trim();
    }
}

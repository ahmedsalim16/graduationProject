import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../../services/shared.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router';
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
import Swal from 'sweetalert2';
import { Sidebar, SidebarModule } from 'primeng/sidebar';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ThemeService } from '../../services/theme.service'; // استيراد خدمة الثيم
import { ThemeToggleComponent } from '../../theme-toggle/theme-toggle.component'; 
import { TooltipModule } from 'primeng/tooltip';
@Component({
  selector: 'app-school-list',
  templateUrl: './school-list.component.html',
  styleUrls: ['./school-list.component.css'],
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
export class SchoolListComponent implements OnInit {
  @ViewChild('dt') table!: Table;
   @ViewChild('sidebarRef') sidebarRef!: Sidebar;
        
      sidebarVisible: boolean = false;
  
  constructor(
    public shared: SharedService,
    public authService: AuthService,
    private router: Router
  ) {}

  schools: any[] = [];
  searchtext: string = '';
  pagesize: number = 100;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [1, 5, 10, 20];
  pageNumber: number = 1;
  loading: boolean = true;
  adminId: string | null = null;
  adminName: string | null = localStorage.getItem('username');
  isSidebarOpen: boolean = true;
  isSchoolOpen: boolean = false;
  isAdminOpen: boolean = false;

  ngOnInit(): void {
    this.filterSchools();
    this.adminId = this.authService.getAdminId();
  }
  goBack(): void {
    // Logic to navigate back, e.g., using Angular Router
    window.history.back();
  }
  filterSchools() {
    this.loading = true;
    const filters = {
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };

    this.shared.filterSchools(filters).subscribe(
      (response: any) => {
        if (response && response.result) {
          this.schools = response.result.map((school: any) => this.normalizeKeys(school));
          this.loading = false;
        } else {
          this.schools = [];
          this.loading = false;
        }
      },
      (err) => {
        console.error('Error while filtering schools:', err);
        this.loading = false;
      }
    );
  }

  normalizeKeys(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj;
    return Object.keys(obj).reduce((acc: any, key: string) => {
      acc[key.toLowerCase()] = obj[key];
      return acc;
    }, {});
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
  clear() {
    if (this.table) {
      this.table.clear();
      this.filterSchools();
    }
  }
  delete(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this school!',
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
            this.schools = this.schools.filter((school: any) => school.schooltenantid !== id);
            Swal.fire('Deleted!', 'The school has been deleted.', 'success');
          },
          (err) => {
            Swal.fire('Error!', 'There was an error deleting the school.', 'error');
          }
        );
      }
    });
  }

  downloadCsvFile() {
    const formattedSchools = this.schools.map(school => ({
      ID: school.schooltenantid,
      Name: school.name,
      Description: school.description,
      Address: school.address,
      Country: school.country,
      PhoneNumber: school.phonenumber,
      Email: school.email,
      CreatedOn: school.createdon ? new Date(school.createdon).toISOString().split('T')[0] : '',
    }));

    const options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      useBom: true,
      headers: [
        'ID', 'Name', 'Description', 'Address', 
        'Country', 'PhoneNumber', 'Email', 'CreatedOn'
      ],
    };

    new ngxCsv(formattedSchools, 'schools-data', options);
  }

  getImageUrl(logoPath: string): string {
    if (!logoPath) {
      return '../../../assets/a4e461fe3742a7cf10a1008ffcb18744.png';
    }
    return `https://school-api.runasp.net/${logoPath}`;
  }

  toggleDropdown(menu: string) {
    if (menu === 'school') {
      this.isSchoolOpen = !this.isSchoolOpen;
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
    getSchoolTooltip(school: any): string {
    return `
🏫 School Details:

📝 Name: ${school.name || 'N/A'}
🆔 ID: ${school.schooltenantid || 'N/A'}
📋 Description: ${school.description || 'N/A'}
📍 Address: ${school.address || 'N/A'}
🌍 Country: ${school.country || 'N/A'}
📞 Phone: ${school.phonenumber || 'N/A'}
📧 Email: ${school.email || 'N/A'}
📅 Created: ${school.createdon ? new Date(school.createdon).toLocaleDateString('en-GB') : 'N/A'}
    `.trim();
  }
}
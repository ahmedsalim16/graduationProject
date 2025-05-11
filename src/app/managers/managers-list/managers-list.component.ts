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

@Component({
  selector: 'app-managers-list',
  templateUrl: './managers-list.component.html',
  styleUrls: ['./managers-list.component.css'],
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
      ButtonModule,RouterModule,SidebarModule,ThemeToggleComponent
    ]
})
export class ManagersListComponent implements OnInit{
 @ViewChild('dt') table!: Table;
   @ViewChild('sidebarRef') sidebarRef!: Sidebar;
        
      sidebarVisible: boolean = false;
  
  constructor(
    public shared: SharedService,
    public authService: AuthService,
    private router: Router
  ) {}

  admins: any[] = [];
  searchtext: string = '';
  pagesize: number = 100;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [5, 10, 25, 50];
  pageNumber: number = 1;
  loading: boolean = true;
  adminId: string | null = null;
  isOwner: string | null = null;
  MId: string | null = localStorage.getItem('userId');
  adminName: string | null = localStorage.getItem('username');
  isSidebarOpen: boolean = true;
  isSchoolOpen: boolean = false;
  isAdminOpen: boolean = false;

  ngOnInit(): void {
    this.filterAdmins();
    this.adminId = this.authService.getAdminId();
  }
  goBack(): void {
    // Logic to navigate back, e.g., using Angular Router
    window.history.back();
  }
  filterAdmins() {
    this.loading = true;
    const filters = {
      role: 'Manager',
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };

    this.shared.filterAdmins(filters).subscribe(
      (response: any) => {
        if (response && response.result) {
          this.admins = response.result.filter((user: any) => 
             user.owner === true
          );
          this.loading = false;
        } else {
          this.admins = [];
          this.loading = false;
        }
      },
      (err) => {
        console.error('Error while filtering admins:', err);
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
            this.admins = this.admins.filter((admin: any) => admin.id !== id);
            Swal.fire('Deleted!', 'The admin has been deleted.', 'success');
          },
          (err) => {
            Swal.fire('Error!', 'There was an error deleting the admin.', 'error');
          }
        );
      }
    });
  }

  downloadCsvFile() {
    const formattedAdmins = this.admins.map(admin => ({
      ID: admin.id,
      UserName: admin.userName,
      Email: admin.email,
      FirstName: admin.firstName,
      LastName: admin.lastName,
      PhoneNumber: admin.phoneNumber,
      Gender: this.getGenderText(admin.gender),
      Role: admin.role,
      CreatedOn: admin.createdOn ? new Date(admin.createdOn).toISOString().split('T')[0] : '',
      IsOwner: admin.owner,
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
        'PhoneNumber', 'Gender', 'Role', 'CreatedOn', 'IsOwner'
      ],
    };

    new ngxCsv(formattedAdmins, 'developers-data', options);
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

  getRoleSeverity(role: string): any {
    return role === 'Admin' ? 'danger' : 'info';
  }
  clear() {
    if (this.table) {
      this.table.clear();
      this.filterAdmins();
    }
  }

  IsOwner(): boolean {
    this.isOwner = localStorage.getItem('owner');
    return this.isOwner === 'true';
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
}

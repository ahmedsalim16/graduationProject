import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ngxCsv } from 'ngx-csv';
import { Table } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
// import { IconFieldModule } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
// import { InputIconModule } from 'primeng/inputicon';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { HttpClientModule } from '@angular/common/http';
import { PrimeIcons } from 'primeng/api';
import { ButtonModule } from 'primeng/button';


@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    TagModule,
    InputTextModule,
    MultiSelectModule,
    DropdownModule,
    HttpClientModule,RouterModule,ButtonModule
  ]
})
export class AdminListComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  
  pagination: any;
  constructor(public shared: SharedService, public authService: AuthService, private router: Router) {}
  
  admins: any[] = [];
  searchtext: string = '';
  pagesize: number = 100;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [5, 10, 25, 50];
  pageNumber: number = 1;
  count: number = 0;
  role: string | null = null;
  roleOptions: any[] = [
    { label: 'All Roles', value: null },
    { label: 'Cashier', value: 'Cashier' },
    { label: 'Manager', value: 'manager' }
  ];
  
  loading: boolean = true;
  s = 'search for admins';
  adminId: string | null = null;
  public qrValue: string = '';
  isOwner: string | null = null;
  MId: string | null = localStorage.getItem('userId');
  adminName: string | null = localStorage.getItem('username');
  schoolName: string | null = localStorage.getItem('schoolTenantId');
  schoolLogoUrl: string = '';
  
  ngOnInit(): void {
    this.schoolLogo();
    this.filteradmins();
    this.adminId = this.authService.getAdminId();
    console.log('Admin ID:', this.adminId);
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
    this.pageNumber = 1;
    this.filteradmins();
  }
  
  IsOwner(): boolean {
    this.isOwner = localStorage.getItem('owner');
    return this.isOwner === 'true';
  }
  
  filteradmins() {
    localStorage.getItem('token');
    this.loading = true;
    
    const filters = {
      role: this.role ?? undefined,
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };
    
    this.shared.filterAdmins(filters).subscribe(
      (response: any) => {
        if (response && response.result && Array.isArray(response.result)) {
          this.admins = response.result.filter((user: any) => 
            user.role !== 'Admin' && 
            user.role !== 'Parent' && 
            user.schoolTenantId === localStorage.getItem('schoolTenantId')
          );
          console.log('Filtered admins:', this.admins);
          this.loading = false;
        } else {
          console.error('No data found or invalid response format.');
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
  
  applyFilterGlobal($event: any, stringVal: string) {
    this.table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }
  onFilterChange(event: any, field: string, matchMode: string): void {
    if (this.table) {
      const target = event.target as HTMLInputElement;
      this.table.filter(target.value, field, matchMode);
    }
  }
  
  onRoleChange(event: any) {
    this.role = event.value;
    this.filteradmins();
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
            this.admins = this.admins.filter((admin: any) => admin.id !== id);
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
  
  clear() {
    if (this.table) {
      this.table.clear();
    }
  }
  
  logout(): void {
    this.authService.logout();
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
      CreatedOn: admin.createdOn ? new Date(admin.createdOn).toISOString().split('T')[0] : '',
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
  
  isSidebarOpen: boolean = true;
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
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
        if (response?.result && Array.isArray(response.result)) {
          const school = response.result.find((s: any) => s.schoolTenantId === schoolTenantId);
          if (school?.schoolLogo) {
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
  
  getSeverity(role: string) {
    switch (role) {
      case 'Cashier':
        return 'info';
      case 'Manager':
        return 'success';
      default:
        return 'warning';
    }
  }
}
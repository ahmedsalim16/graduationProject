import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { SharedService } from '../../services/shared.service';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
@Component({
  selector: 'app-add-owner',
  templateUrl: './add-owner.component.html',
  styleUrls: ['./add-owner.component.css']
})
export class AddOwnerComponent implements OnInit {
   @ViewChild('sidebarRef') sidebarRef!: Sidebar;
        
      sidebarVisible: boolean = false;
  schoolOptions: any[] = []; // تغيير من schoolNames إلى schoolOptions
  pagesize: number = 20;
  pageNumber: number = 1;
  adminId: string | null = null;
  adminName: string | null = localStorage.getItem('username');

  constructor(
    public shared: SharedService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSchoolNames();
    this.adminId = this.authService.getAdminId();
    console.log('Admin ID:', this.adminId);
  }

  admin = {
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 3,
    schoolTenantId: null, // تغيير إلى null ليتوافق مع PrimeNG Dropdown
    owner: true,
  }

  addAdmin() {
    if (this.admin.password !== this.admin.confirmPassword) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Passwords do not match",
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }

    this.shared.createNewAdmin(this.admin).subscribe(
      res => {
        this.admin = {
          userName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 3,
          schoolTenantId: null,
          owner: true,
        }
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Owner added successfully",
          showConfirmButton: false,
          timer: 1500
        });
        console.log(res);
      },
      err => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: 'Password must be at least 6 characters long and include an uppercase letter, a lowercase letter, and a special character',
          showConfirmButton: false,
          timer: 1500
        });
        console.log(err);
      }
    );
  }

  getSchoolNames(): void {
    const filters = {
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };

    this.shared.filterSchools(filters).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        
        if (response && response.result && Array.isArray(response.result)) {
          this.schoolOptions = response.result.map((school: any) => {
            return {
              id: school.SchoolTenantId || 'N/A',
              name: school.Name || 'Unnamed School'
            };
          });

          console.log('School Options:', this.schoolOptions);
        } else {
          console.error('No data found or invalid response format.');
        }
      },
      (err) => {
        console.error('Error while fetching school names:', err);
      }
    );
  }

  // باقي الدوال (logout, toggleDropdown, toggleSidebar) تبقى كما هي
  // ...

navigateToAdminUpdate(): void {
  if (this.adminId) {
    this.router.navigate(['/admin-update', this.adminId]);
  } else {
    console.error('Admin ID not found!');
  }
}

logout(): void {
  this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة

}
isSchoolOpen = false;
isAdminOpen = false;

toggleDropdown(menu: string) {
  if (menu === 'school') {
    this.isSchoolOpen = !this.isSchoolOpen;
  } else if (menu === 'admin') {
    this.isAdminOpen = !this.isAdminOpen;
  }
}
isSidebarOpen: boolean = true; // افتراضيًا، القائمة مفتوحة

toggleSidebar() {
this.sidebarVisible = !this.sidebarVisible;
}
}

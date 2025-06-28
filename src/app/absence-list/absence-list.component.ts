import { Component, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { ngxCsv } from 'ngx-csv';
import { Router } from '@angular/router';
import { Sidebar } from 'primeng/sidebar';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ThemeService } from '../services/theme.service';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { Table } from 'primeng/table';
import { CalendarModule } from 'primeng/calendar';
import { ImageStorageServiceService } from '../services/image-storage-service.service';
@Component({
  selector: 'app-absence-list',
  templateUrl: './absence-list.component.html',
  styleUrls: ['./absence-list.component.css'],
})
export class AbsenceListComponent {
  @ViewChild('sidebarRef') sidebarRef!: Sidebar;
  @ViewChild('dt') dt!: Table;
  
  sidebarVisible: boolean = false;
  pagination: any;
  student: any[] = [];
  searchtext: string = '';
  pagesize: number = 20;
  totalItems: number = 0;
  itemsPerPage: number = 4;
  pageNumber: number = 1;
  count: number = 0;
  grade: number | null = null;
  startDate: string | null = null;
  adminId: string | null = null;
  adminName: string | null = localStorage.getItem('username');
  schoolName: string | null = localStorage.getItem('schoolTenantId');
  loading: boolean = true;
  
  // Options for dropdowns
  gradeOptions = [
    { label: 'All Grades', value: null },
    { label: 'Grade 1', value: 1 },
    { label: 'Grade 2', value: 2 },
    { label: 'Grade 3', value: 3 },
    { label: 'Grade 4', value: 4 },
    { label: 'Grade 5', value: 5 },
    { label: 'Grade 6', value: 6 },
    { label: 'Grade 7', value: 7 },
    { label: 'Grade 8', value: 8 },
  ];
  
  gradeFilterOptions = [
    { label: 'Grade 1', value: 1 },
    { label: 'Grade 2', value: 2 },
    { label: 'Grade 3', value: 3 },
    { label: 'Grade 4', value: 4 },
    { label: 'Grade 5', value: 5 },
    { label: 'Grade 6', value: 6 },
    { label: 'Grade 7', value: 7 },
    { label: 'Grade 8', value: 8 },
  ];
  
  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' }
  ];

  constructor(
    public shared: SharedService, 
    public authService: AuthService,
    private router: Router,
    private adminImageService: ImageStorageServiceService,
  ) {}

  ngOnInit(): void {
    this.adminId = this.authService.getAdminId();
    console.log('Admin ID:', this.adminId);
    this.schoolLogo();
    
    if (window.innerWidth < 768) {
      this.sidebarVisible = false;
    }
    
    // Add resize event listener
    window.addEventListener('resize', () => {
      if (window.innerWidth < 768) {
        this.sidebarVisible = false;
      }
    });
    
    // Load initial data
    this.filterStudents();
  }

 // الحصول على صورة الأدمن
  getAdminImage(adminId: string): string {
    return this.adminImageService.getAdminImageOrDefault(adminId);
  }

  // التحقق من وجود صورة مخصصة
  hasCustomImage(adminId: string): boolean {
    return this.adminImageService.hasCustomImage(adminId);
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  navigateToAdminUpdate(): void {
    if (this.adminId) {
      this.router.navigate(['/admin-update', this.adminId]);
    } else {
      console.error('Admin ID not found!');
    }
  }

  filterStudents() {
    this.loading = true;
    const selectedGrade = this.grade ?? 0;
    const selectedDate = this.startDate ?? '';
  
    this.shared.getAllAbsents(selectedGrade, selectedDate).subscribe(
      (response: any) => {
        console.log("data:", response);
        if (response && response.result && Array.isArray(response.result)) {
          this.student = response.result;
        } else {
          console.warn('No valid data returned from the server.');
          this.student = [];
        }
        this.loading = false;
      },
      (error) => {
        console.error('Error fetching absents:', error);
        this.student = [];
        this.loading = false;
      }
    );
  }

  // Table filter methods
  clear() {
    if (this.dt) {
      this.dt.clear();
      this.searchtext = '';
    }
  }

  applyFilterGlobal($event: any, stringVal: string) {
    if (this.dt) {
      this.dt.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
    }
  }

  onFilterChange($event: any, field: string, matchMode: string) {
    if (this.dt) {
      this.dt.filter(($event.target as HTMLInputElement).value, field, matchMode);
    }
  }

  onGenderChange($event: any) {
    if (this.dt) {
      if ($event.value) {
        this.dt.filter($event.value, 'gender', 'equals');
      } else {
        this.dt.filter(null, 'gender', 'equals');
      }
    }
  }

  onGradeFilterChange($event: any) {
    if (this.dt) {
      if ($event.value) {
        this.dt.filter($event.value, 'grade', 'equals');
      } else {
        this.dt.filter(null, 'grade', 'equals');
      }
    }
  }

  getGenderSeverity(gender: string): any {
    switch (gender.toLowerCase()) {
      case 'male':
        return 'info';
      case 'female':
        return 'success';
      default:
        return 'primary';
    }
  }

  pagechanged(event: any) {
    this.pageNumber = event;
  }

  get filteredStudents() {
    return this.student.filter(
      (student) =>
        student.fullName.toLowerCase().includes(this.searchtext.toLowerCase()) ||
        student.city.toLowerCase().includes(this.searchtext.toLowerCase())
    );
  }

  logout(): void {
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
        this.authService.logout();
        Swal.fire(
          'Logout successfully',
          'success'
        );
      }
    });
  }

  downloadCsvFile() {
    var options = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true, 
      showTitle: false,
      title: 'Students data',
      useBom: true,
      headers: [
        'ID',
        'FullName',
        'Gender',
        'Grade',
        'City',
        'Street',
        'BirthDate',
        'RfidTag',
      ]
    };
    
    const formattedStudents = this.student.map(s => ({
      ID: s.id,
      FullName: s.fullName,
      Gender: s.gender,
      Grade: s.grade,
      City: s.city,
      Street: s.street,
      BirthDate: s.birthDate ? new Date(s.birthDate).toISOString().split('T')[0] : '',
      RfidTag: s.rfidTag_Id,
    }));
   
    new ngxCsv(formattedStudents, 'student-list', options);
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
  
  // Logo handling methods
  schoolLogoUrl: string = '';

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
}
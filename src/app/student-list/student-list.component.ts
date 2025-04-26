import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedService } from '../services/shared.service';
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
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css'],
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
    RouterModule,
    ButtonModule
  ]
})
export class StudentListComponent implements OnInit {
  @ViewChild('dt') table!: Table;
  
  constructor(
    public shared: SharedService,
    private router: Router,
    public authService: AuthService
  ) {}
  
  students: any[] = [];
  searchtext: string = '';
  pagesize: number = 100;
  totalItems: number = 0;
  itemsPerPage: number = 10;
  itemsPerPageOptions: number[] = [5, 10, 20, 50];
  pageNumber: number = 1;
  gender: number | null = null;
  grade: number | null = null;
  loading: boolean = true;
  adminId: string | null = null;
  adminName: string | null = localStorage.getItem('username');
  schoolName: string | null = localStorage.getItem('schoolTenantId');
  schoolLogoUrl: string = '';
  
  genderOptions: any[] = [
    { label: 'All Genders', value: null },
    { label: 'Male', value: 0 },
    { label: 'Female', value: 1 }
  ];
  
  gradeOptions: any[] = [
    { label: 'All Grades', value: null },
    { label: 'Grade 1', value: 1 },
    { label: 'Grade 2', value: 2 },
    { label: 'Grade 3', value: 3 },
    { label: 'Grade 4', value: 4 },
    { label: 'Grade 5', value: 5 },
    { label: 'Grade 6', value: 6 },
    { label: 'Grade 7', value: 7 },
    { label: 'Grade 8', value: 8 }
  ];
  
  ngOnInit(): void {
    this.loadStudents();
    this.adminId = this.authService.getAdminId();
    this.schoolLogo();
  }
  
  loadStudents() {
    localStorage.getItem('token');
    this.loading = true;
    
    const filters = {
      gender: this.gender ?? undefined,
      grade: this.grade ?? undefined,
      pageNumber: this.pageNumber,
      pageSize: this.pagesize,
    };
    
    this.shared.filterStudents(filters).subscribe(
      (response: any) => {
        if (response && response.result && Array.isArray(response.result)) {
          this.students = response.result.map((student: any) => this.normalizeKeys(student));
          console.log('Filtered Students:', this.students);
          this.loading = false;
        } else {
          console.error('No data found or invalid response format.');
          this.students = [];
          this.loading = false;
        }
      },
      (err) => {
        console.error('Error while filtering students:', err);
        this.loading = false;
      }
    );
  }
  
  normalizeKeys(obj: any): any {
    if (!obj || typeof obj !== 'object') return obj; // التحقق من أن الكائن صالح
    return Object.keys(obj).reduce((acc: any, key: string) => {
      acc[key.toLowerCase()] = obj[key]; // تحويل المفتاح إلى lowercase
      return acc;
    }, {});
  }
  
  navigateToAdminUpdate(): void {
    if (this.adminId) {
      this.router.navigate(['/admin-update', this.adminId]);
    } else {
      console.error('Admin ID not found!');
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
  
  onGenderChange(event: any) {
    this.gender = event.value;
    this.loadStudents();
  }
  
  onGradeChange(event: any) {
    this.grade = event.value;
    this.loadStudents();
  }
  
  clear() {
    if (this.table) {
      this.table.clear();
      this.gender = null;
      this.grade = null;
      this.loadStudents();
    }
  }
  
  delete(id: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this student!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (result.isConfirmed) {
        this.shared.deleteStudent(id).subscribe(
          (res) => {
            console.log('Student deleted:', res);
            this.students = this.students.filter((student: any) => student.id !== id);
            Swal.fire('Deleted!', 'The student has been deleted.', 'success');
          },
          (err) => {
            console.error('Error while deleting student:', err);
            Swal.fire('Error!', 'There was an error deleting the student.', 'error');
          }
        );
      }
    });
  }
  
  downloadCsvFile() {
    const formattedStudents = this.students.map(s => ({
      ID: s.id,
      FullName: s.fullname,
      Gender: s.gender === 0 ? 'Male' : 'Female',
      Grade: s.grade,
      City: s.city,
      Street: s.street,
      BirthDate: s.birthdate ? new Date(s.birthdate).toISOString().split('T')[0] : '',
      RfidTag: s.rfidtag_id,
      CreatedOn: s.createdon ? new Date(s.createdon).toISOString().split('T')[0] : '',
      ParentId: s.parentid,
      ParentEmail: s.parentemail,
    }));
    
    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: false,
      title: 'Students Data',
      useBom: true,
      headers: [
        'ID',
        'Full Name',
        'Gender',
        'Grade',
        'City',
        'Street',
        'Birth Date',
        'RFID Tag ID',
        'Created On',
        'Parent ID',
        'Parent Email'
      ],
    };
    
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
  
  isSidebarOpen: boolean = true;
  
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  logout(): void {
    this.authService.logout();
    this.authService.clearAdminId();
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
}
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../services/shared.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  studentCount: number = 0; // العدد الكلي للطلاب
  maleStudentCount: number = 0; // عدد الطلاب الذكور
  femaleStudentCount: number = 0; // عدد الطالبات الإناث
  adminId: string | null = null;
  adminName:string | null = localStorage.getItem('username');
  constructor(public shared: SharedService,public authService:AuthService,private router: Router) {}

  ngOnInit(): void {
    // الحصول على العدد الكلي للطلاب
    this.getTotalStudentCount();

    // الحصول على عدد الطلاب حسب الجنس
    this.getStudentCountByGender(0); // طلاب ذكور
    this.getStudentCountByGender(1); // طالبات إناث
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

  getTotalStudentCount(): void {
    this.shared.getStudentCountByGender().subscribe(
      (response) => {
        this.studentCount = response.result || 0; // العدد الكلي للطلاب
      },
      (err) => {
        console.error('Error fetching total student count:', err);
        this.studentCount = 0;
      }
    );
  }

  getStudentCountByGender(gender: number): void {
    this.shared.getStudentCountByGender(gender).subscribe(
      (response) => {
        if (gender === 0) {
          this.maleStudentCount = response.result || 0; // عدد الذكور
        } else if (gender === 1) {
          this.femaleStudentCount = response.result || 0; // عدد الإناث
        }
      },
      (err) => {
        console.error(`Error fetching student count for gender ${gender}:`, err);
        if (gender === 0) this.maleStudentCount = 0;
        if (gender === 1) this.femaleStudentCount = 0;
      }
    );
  }
  logout(): void {
    this.authService.logout(); // استدعاء وظيفة تسجيل الخروج من الخدمة
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
}

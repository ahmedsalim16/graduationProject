import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  studentCount: number = 0; // العدد الكلي للطلاب
  maleStudentCount: number = 0; // عدد الطلاب الذكور
  femaleStudentCount: number = 0; // عدد الطالبات الإناث

  constructor(public shared: SharedService,public authService:AuthService) {}

  ngOnInit(): void {
    // الحصول على العدد الكلي للطلاب
    this.getTotalStudentCount();

    // الحصول على عدد الطلاب حسب الجنس
    this.getStudentCountByGender(0); // طلاب ذكور
    this.getStudentCountByGender(1); // طالبات إناث
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
}

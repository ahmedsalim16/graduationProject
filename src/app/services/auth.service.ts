import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: string | null = null;
  constructor(private router: Router) {}

  // تسجيل الخروج
  logout(): void {
    localStorage.removeItem('token'); // إزالة التوكن من التخزين المحلي
    this.router.navigate(['/welcome']); // الانتقال إلى صفحة تسجيل الدخول
  }

  // التحقق مما إذا كان المستخدم مسجلاً دخوله
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token'); // التحقق من وجود التوكن
  }

  setAdminId(Id: string): void {
    this.userId = Id;
    localStorage.setItem('adminId', Id); // تخزين ID في localStorage
  }

  // الحصول على الـ ID
  getAdminId(): string | null {
    if (!this.userId) {
      this.userId = localStorage.getItem('adminId'); // استرجاع من localStorage
    }
    return this.userId;
  }

  // حذف الـ ID عند تسجيل الخروج
  clearAdminId(): void {
    this.userId = null;
    localStorage.removeItem('adminId');
  }
}

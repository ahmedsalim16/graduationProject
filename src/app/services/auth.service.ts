import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private adminId: string | null = null;
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

  setAdminId(id: string): void {
    this.adminId = id;
    localStorage.setItem('adminId', id); // تخزين ID في localStorage
  }

  // الحصول على الـ ID
  getAdminId(): string | null {
    if (!this.adminId) {
      this.adminId = localStorage.getItem('adminId'); // استرجاع من localStorage
    }
    return this.adminId;
  }

  // حذف الـ ID عند تسجيل الخروج
  clearAdminId(): void {
    this.adminId = null;
    localStorage.removeItem('adminId');
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

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
}

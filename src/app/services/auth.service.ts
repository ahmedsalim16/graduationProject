import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userId: string | null = null;
  private userLoggedIn = new BehaviorSubject<boolean>(false);
  private API_URL = 'https://school-api.runasp.net/api/Account/login';
  constructor(private router: Router,private http: HttpClient,) {}

  login(credentials: { userName: string; password: string }) {
    return this.http.post<any>(`${this.API_URL}`, credentials)
      .pipe(
        tap(response => {
          if (response.isAuthenticated && response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('refreshTokenExpiration', response.refreshTokenExpiration);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('username', response.username);
            localStorage.setItem('email', response.email);
            localStorage.setItem('schoolTenantId', response.schoolTenantId);
            localStorage.setItem('roles', JSON.stringify(response.roles));
            localStorage.setItem('owner', JSON.stringify(response.owner)); 

            this.userLoggedIn.next(true);
          }
        })
      );
  }
  // تسجيل الخروج
  logout(): void {
    const savedEvents = localStorage.getItem('events');

    // مسح كل البيانات من التخزين المحلي
    localStorage.clear();
  
    // إعادة حفظ الأحداث إذا كانت موجودة
    if (savedEvents) {
      localStorage.setItem('events', savedEvents);
    }
    this.userLoggedIn.next(false); // إزالة التوكن من التخزين المحلي
    this.router.navigate(['/welcome']); // الانتقال إلى صفحة تسجيل الدخول
  }

  // التحقق مما إذا كان المستخدم مسجلاً دخوله
  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') { // ✅ التأكد من أن `window` متاح
      return !!localStorage.getItem('token');
    }
    return false;
    // const token = localStorage.getItem('token');
    // const expiration = localStorage.getItem('refreshTokenExpiration');

    // if (!token || !expiration) return false;

    // const isExpired = new Date(expiration) < new Date();
    // if (isExpired) {
    //   this.logout();
    //   return false;
    // }

    // return true;
   
  }

  setAdminId(Id: string): void {
    this.userId = Id;
    localStorage.setItem('userId', Id); // تخزين ID في localStorage
  }

  // الحصول على الـ ID
  getAdminId(): string | null {
    if (!this.userId) {
      this.userId = localStorage.getItem('userId'); // استرجاع من localStorage
    }
    return this.userId;
  }

  // حذف الـ ID عند تسجيل الخروج
  clearAdminId(): void {
    this.userId = null;
    localStorage.removeItem('userId');
  }
}

import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';
// import { LanguageService } from './services/language.service';
// import { LanguageService } from './services/language.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'studentsystem';
  
  constructor(
    private router: Router,
    private authService: AuthService,
    // private languageService: LanguageService
    // private languageService: LanguageService
  ) {}

  ngOnInit() {
    // this.languageService.initialize();
    // المسارات التي لا تحتاج إلى إعادة توجيه
    const skipRedirectRoutes = [
      '/reset-password',
      '/forgot-password',
      '/login',
      '/unauthorized',
      '/welcome'
    ];

    // مراقبة تغييرات المسار
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const currentUrl = event.urlAfterRedirects;
      
      // التحقق مما إذا كان المسار الحالي هو المسار الجذر
      if (currentUrl === '/') {
        this.redirectUser();
      } else if (!skipRedirectRoutes.some(route => currentUrl.startsWith(route))) {
        // للمسارات الأخرى، تحقق من المصادقة فقط إذا لم تكن في قائمة التخطي
        this.checkAuthentication(currentUrl);
      }
    });
  }

  // إعادة توجيه المستخدمين بناءً على الأدوار
  redirectUser() {
    try {
      const token = localStorage.getItem('token');
      let roles = [];
      
      try {
        const rolesStr = localStorage.getItem('roles');
        roles = rolesStr ? JSON.parse(rolesStr) : [];
      } catch (e) {
        console.error('Error parsing roles:', e);
        roles = [];
      }
      
      if (token) {
        if (roles.includes('Admin')) {
          this.router.navigate(['/dashboard']);
        } else if (roles.includes('Manager')) {
          this.router.navigate(['/Dashboard']);
        } else {
          this.router.navigate(['/welcome']);
        }
      } else {
        this.router.navigate(['/welcome']);
      }
    } catch (error) {
      console.error('Error in redirectUser:', error);
      this.router.navigate(['/welcome']);
    }
  }

  // التحقق مما إذا كان المستخدم مصادقًا للمسارات المحمية
  checkAuthentication(currentUrl: string) {
    try {
      const token = localStorage.getItem('token');
      const protectedRoutes = ['/dashboard', '/Dashboard', '/admin', '/student'];
      
      // إذا كان يتم الوصول إلى مسار محمي بدون رمز، فقم بإعادة التوجيه إلى تسجيل الدخول
      if (!token && protectedRoutes.some(route => currentUrl.startsWith(route))) {
        this.router.navigate(['/welcome']);
      }
    } catch (error) {
      console.error('Error in checkAuthentication:', error);
      this.router.navigate(['/welcome']);
    }
  }

  // طريقة تبديل اللغة
  // switchLanguage(language: string) {
  //   this.languageService.changeLanguage(language);
  // }
}
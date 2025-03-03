import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth.service';


  

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'studentsystem';
  constructor(private router: Router, private authService: AuthService) {}

  

  ngOnInit() {
    this.redirectUser();
  }

  redirectUser() {
    const token = localStorage.getItem('token');
    const roles = JSON.parse(localStorage.getItem('roles') || '[]');
   

    if (token) {
      if (roles.includes('Admin')) {
        this.router.navigate(['/add-school']);
      } else if (roles.includes('Manager')) {
        this.router.navigate(['/Dashboard']);
      } else {
        this.router.navigate(['/welcome']); // إذا لم يكن له صلاحية، إعادة توجيهه للصفحة الرئيسية
      }
    } else {
      this.router.navigate(['/welcome']); // إذا لم يكن مسجلاً، إرساله لصفحة تسجيل الدخول
    }
  }











  //private translate:TranslateService
  // constructor(private translate: TranslateService, @Inject(PLATFORM_ID) private platformId: any) {
  //   if (isPlatformBrowser(this.platformId)) { // ✅ يعمل فقط في المتصفح
  //     const browserLang = navigator?.language?.split('-')[0] || 'en';
  //     this.translate.setDefaultLang('en');
  //     this.translate.use(browserLang.match(/en|ar/) ? browserLang : 'en');
  //   } else {
  //     this.translate.setDefaultLang('en'); // 🖥️ يعمل على السيرفر بدون مشاكل
  //   }
  // }
  
  
  //   switchLanguage(language: string) {
  //     this.translate.use(language);
  //     document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  //   }
    
  

  // SwitchLanguage(lang:'ar'|'en'){
  //   this.translate.use(lang);

  // }
}


// import { Injectable } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { BehaviorSubject } from 'rxjs';
// import { PrimeNGConfig } from 'primeng/api';

// @Injectable({
//   providedIn: 'root'
// })
// export class LanguageService {
//   private currentLanguageSubject = new BehaviorSubject<string>('en');
//   public currentLanguage$ = this.currentLanguageSubject.asObservable();

//   constructor(
//     private translate: TranslateService,
//     private primengConfig: PrimeNGConfig
//   ) {}

//   initialize(): Promise<void> {
//     return new Promise((resolve) => {
//       this.translate.setDefaultLang('en');
      
//       try {
//         const savedLang = localStorage.getItem('language');
//         const browserLang = navigator.language?.split('-')[0];
//         const initialLang = savedLang || 
//                          (browserLang && ['en', 'ar'].includes(browserLang) ? browserLang : 'en');
        
//         this.changeLanguage(initialLang);
//         resolve();
//       } catch (error) {
//         console.error('Error initializing language service:', error);
//         this.changeLanguage('en');
//         resolve();
//       }
//     });
//   }

//   changeLanguage(lang: string): void {
//     if (!['en', 'ar'].includes(lang)) {
//       lang = 'en'; // الافتراضي للغات غير المدعومة
//     }
    
//     try {
//       // تعيين اللغة لـ ngx-translate
//       this.translate.use(lang);
      
//       // حفظ في localStorage
//       localStorage.setItem('language', lang);
      
//       // تحديث اتجاه المستند للغات RTL
//       const isRtl = lang === 'ar';
//       document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
//       document.documentElement.lang = lang;
      
//       // تعيين صنف محاذاة النص على عنصر body
//       if (isRtl) {
//         document.body.classList.add('rtl-text');
//       } else {
//         document.body.classList.remove('rtl-text');
//       }
      
//       // تحديث BehaviorSubject
//       this.currentLanguageSubject.next(lang);
      
//       // تحديث ترجمات PrimeNG
//       this.translate.get('primeng').subscribe(res => {
//         this.primengConfig.setTranslation(res);
//       });
//     } catch (error) {
//       console.error('Error changing language:', error);
//     }
//   }

//   getCurrentLanguage(): string {
//     return this.currentLanguageSubject.value;
//   }

//   isRtl(): boolean {
//     return this.getCurrentLanguage() === 'ar';
//   }
// }
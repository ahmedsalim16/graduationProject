// import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
// import { TranslateService } from '@ngx-translate/core';
// import { PrimeNGConfig } from 'primeng/api';
// import { isPlatformBrowser } from '@angular/common';

// @Injectable({
//   providedIn: 'root'
// })
// export class LanguageService {
//   private currentLang = 'en';

//   constructor(
//     private translate: TranslateService,
//     private primeConfig: PrimeNGConfig,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {}

//  initialize(): Promise<void> {
//   return new Promise((resolve) => {
//     this.translate.setDefaultLang('en');
    
//     // Delay to ensure everything is loaded
//     setTimeout(() => {
//       const lang = localStorage.getItem('language') || 'en';
//       this.changeLanguage(lang).then(() => {
//         resolve(); // Ensure the promise resolves
//       }).catch(err => {
//         console.error('Error changing language:', err);
//         resolve(); // Resolve even if there's an error
//       });
//     }, 100);
//   });
// }

//   async changeLanguage(lang: string): Promise<void> {
//     await this.translate.use(lang).toPromise();
//     this.primeConfig.setTranslation(this.getPrimeNGTranslations(lang));
//     document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
//     localStorage.setItem('language', lang);
//   }

//   private getPrimeNGTranslations(lang: string): any {
//     return lang === 'ar' ? {
//       accept: 'موافق',
//       reject: 'رفض',
//       // ... بقية الترجمات
//     } : {
//       accept: 'Accept',
//       reject: 'Cancel',
//       // ... بقية الترجمات
//     };
//   }

//   getCurrentLanguage(): string {
//     return this.currentLang;
//   }

//   isRTL(): boolean {
//     return this.currentLang === 'ar';
//   }
// }
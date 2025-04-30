// import { Component, OnInit } from '@angular/core';
// import { LanguageService } from '../services/language.service';
// import { ButtonModule } from 'primeng/button';
// import { SelectButtonModule } from 'primeng/selectbutton';
// import { RouterModule } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { TranslateModule } from '@ngx-translate/core';

// @Component({
//   selector: 'app-language-switcher',
//   templateUrl: './language-switcher.component.html',
//   styleUrls: ['./language-switcher.component.css'],
//   standalone: true,
//   imports: [ButtonModule, SelectButtonModule, RouterModule, CommonModule, FormsModule, TranslateModule]
// })
// export class LanguageSwitcherComponent implements OnInit {
//   selectedLanguage: string = 'en';
  
//   languages = [
//     { label: 'English', value: 'en' },
//     { label: 'عربي', value: 'ar' }
//   ];
  
//   constructor(private languageService: LanguageService) {}
  
//   ngOnInit() {
//     // Initialize with current language
//     this.selectedLanguage = this.languageService.getCurrentLanguage();
    
//     // Subscribe to language changes
//     this.languageService.currentLanguage$.subscribe(lang => {
//       this.selectedLanguage = lang;
//     });
//   }
  
//   switchLanguage(lang: string) {
//     this.languageService.changeLanguage(lang);
//   }
// }
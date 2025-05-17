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
//   imports: [ButtonModule, SelectButtonModule, RouterModule, CommonModule, FormsModule, TranslateModule],
//  template: `
//     <p-selectButton [options]="languageOptions" 
//                    [(ngModel)]="currentLanguage" 
//                    (onChange)="changeLanguage($event.value)"
//                    [multiple]="false">
//     </p-selectButton>
//   `,
//   styles: [`
//     :host ::ng-deep .p-selectbutton .p-button {
//       min-width: 60px;
//       padding: 0.5rem;
//     }
//     :host ::ng-deep .p-selectbutton .p-button.p-highlight {
//       background-color: var(--primary-color);
//       border-color: var(--primary-color);
//     }
//   `]
// })
// export class LanguageSwitcherComponent implements OnInit {
//      currentLanguage: string;
//   languageOptions = [
//     { label: 'EN', value: 'en' },
//     { label: 'AR', value: 'ar' }
//   ];

//   constructor(private languageService: LanguageService) {}

//   ngOnInit() {
//     this.currentLanguage = this.languageService.getCurrentLanguage();
//   }
//  toggleLanguage() {
//     const newLang = this.currentLanguage === 'en' ? 'ar' : 'en';
//     this.languageService.changeLanguage(newLang);
//     this.currentLanguage = newLang;
//   }
//   changeLanguage(lang: string) {
//   this.languageService.changeLanguage(lang).catch(err => {
//     console.error('Error changing language:', err);
//   });
// }
// }
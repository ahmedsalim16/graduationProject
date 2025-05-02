import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../services/theme.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    <p-button 
      [icon]="themeService.isDarkMode() ? 'pi pi-sun' : 'pi pi-moon'"
      (onClick)="themeService.toggleTheme()"
      [styleClass]="'p-button-rounded p-button-text theme-toggle-btn'"
      [attr.aria-label]="themeService.isDarkMode() ? 'Switch to light mode' : 'Switch to dark mode'"
    ></p-button>
  `,
  styles: [`
    .theme-toggle-btn {
      width: 2.5rem;
      height: 2.5rem;
      transition: transform 0.3s;
    }
    
    .theme-toggle-btn:hover {
      transform: rotate(15deg);
    }
    
    :host ::ng-deep .p-button.p-button-text {
      color: var(--text-color);
    }
    
    /* Adjustments for sidebar placement */
    :host-context(.custom-sidebar) ::ng-deep .p-button.p-button-text {
      color: var(--sidebar-text) !important;
    }
  `]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
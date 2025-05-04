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
    body.dark-theme .theme-toggle-btn {
    color: var(--text-color);
    background-color: var(--primary-color);
    border-radius: 5px;
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  body.dark-theme .theme-toggle-btn:hover {
    background-color: var(--secondary-color);
  }
    :host ::ng-deep .p-button.p-button-text {
      color: var(--table-header-text);
    }
    
    /* Adjustments for sidebar placement */
    :host-context(.custom-sidebar) ::ng-deep .p-button.p-button-text {
      color: var(--sidebar-text) !important;
    }
    @media (max-width: 768px) {
      .theme-toggle-btn {
      width: 2rem;
      height: 2rem;
      margin-left:750px;
      }

      .theme-toggle-btn:hover {
      transform: none;
      }
    }
  `]
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
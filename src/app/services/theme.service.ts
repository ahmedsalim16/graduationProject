import { Injectable, signal, inject, effect } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly THEME_KEY = 'selected-theme';
  private readonly DARK_THEME = 'lara-dark-blue';
  private readonly LIGHT_THEME = 'lara-light-blue';
  
  public isDarkMode = signal<boolean>(false);
  private primengConfig = inject(PrimeNGConfig);
  private themeLink!: HTMLLinkElement;
  
  constructor() {
    this.setupThemeLink();
    this.loadSavedTheme();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (localStorage.getItem(this.THEME_KEY) === null) {
        this.isDarkMode.set(e.matches);
        this.applyTheme();
      }
    });
    
    // Create an effect to update tables whenever theme changes
    effect(() => {
      // The effect automatically tracks the isDarkMode signal
      const isDark = this.isDarkMode();
      this.updateTableStyles(isDark);
    });
  }
  
  private setupThemeLink(): void {
    // Check if theme link already exists
    let existingLink = document.getElementById('app-theme') as HTMLLinkElement;
    
    if (!existingLink) {
      // Create the theme link element if it doesn't exist
      this.themeLink = document.createElement('link');
      this.themeLink.id = 'app-theme';
      this.themeLink.rel = 'stylesheet';
      document.head.appendChild(this.themeLink);
    } else {
      this.themeLink = existingLink;
    }
  }
  
  private loadSavedTheme(): void {
    const savedTheme = localStorage.getItem(this.THEME_KEY);
    
    if (savedTheme) {
      this.isDarkMode.set(savedTheme === 'dark');
    } else {
      // If no saved preference, check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.isDarkMode.set(prefersDark);
    }
    
    this.applyTheme();
  }
  
  toggleTheme(): void {
    this.isDarkMode.update(isDark => !isDark);
    this.applyTheme();
  }
  
  private applyTheme(): void {
    // Save preference to localStorage
    const themeMode = this.isDarkMode() ? 'dark' : 'light';
    localStorage.setItem(this.THEME_KEY, themeMode);
    
    // Apply theme to document body for custom styling
    if (this.isDarkMode()) {
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
      this.themeLink.href = `assets/themes/${this.DARK_THEME}/theme.css`;
    } else {
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
      this.themeLink.href = `assets/themes/${this.LIGHT_THEME}/theme.css`;
    }
    
    // Configure PrimeNG
    this.primengConfig.ripple = true;
    this.updatePrimengColors();
  }
  
  private updatePrimengColors(): void {
    // Override specific PrimeNG CSS variables
    if (this.isDarkMode()) {
      document.documentElement.style.setProperty('--surface-a', '#121212');
      document.documentElement.style.setProperty('--surface-b', '#1e1e1e');
      document.documentElement.style.setProperty('--surface-c', '#262626');
      document.documentElement.style.setProperty('--surface-d', '#333333');
      document.documentElement.style.setProperty('--surface-card', '#1e1e1e');
      document.documentElement.style.setProperty('--surface-border', '#383838');
    } else {
      document.documentElement.style.setProperty('--surface-a', '#ffffff');
      document.documentElement.style.setProperty('--surface-b', '#f8f9fa');
      document.documentElement.style.setProperty('--surface-c', '#e9ecef');
      document.documentElement.style.setProperty('--surface-d', '#dee2e6');
      document.documentElement.style.setProperty('--surface-card', '#ffffff');
      document.documentElement.style.setProperty('--surface-border', '#dee2e6');
    }
  }
  
  // Method to update table styles dynamically
  private updateTableStyles(isDark: boolean): void {
    // This will update any table styling that may need JavaScript intervention
    // Most styling is handled by CSS variables in styles.css
    
    // Example: You could add specific classes to tables if needed
    const tables = document.querySelectorAll('.p-datatable');
    tables.forEach(table => {
      if (isDark) {
        table.classList.add('dark-table');
        table.classList.remove('light-table');
      } else {
        table.classList.add('light-table');
        table.classList.remove('dark-table');
      }
    });
  }
}
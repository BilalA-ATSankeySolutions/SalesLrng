import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  theme = signal<'light' | 'dark'>('light');

  toggle() {
    const next = this.theme() === 'light' ? 'dark' : 'light';
    this.theme.set(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  }

  init() {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = saved ?? preferred;
    this.theme.set(theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
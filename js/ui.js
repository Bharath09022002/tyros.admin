// Tyros Admin - UI Utilities (js/ui.js)

class UIManager {
  constructor() {
    this.themeKey = 'tyros_theme_preference';
    this.initTheme();
  }

  initTheme() {
    if (typeof window === 'undefined') return;
    const stored = localStorage.getItem(this.themeKey);
    if (stored === 'dark' || stored === 'light') {
      this.setTheme(stored);
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.setTheme(prefersDark ? 'dark' : 'light', false);
    }

    // Listen to system changes
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem(this.themeKey)) {
          this.setTheme(e.matches ? 'dark' : 'light', false);
        }
      });
    }
  }

  getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  setTheme(theme, save = true) {
    document.documentElement.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem(this.themeKey, theme);
    }
    // Update theme-color meta tag for Safari header
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#0E0C0B' : '#1F1B18');
    }
    window.dispatchEvent(new CustomEvent('tyros:theme-changed', { detail: { theme } }));
  }

  toggleTheme() {
    const current = this.getTheme();
    const next = current === 'dark' ? 'light' : 'dark';
    this.setTheme(next);
    return next;
  }

  // Safe string escape (prevent XSS)
  escape(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // Currency formatting
  formatCurrency(num) {
    const val = Number(num || 0);
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  }

  // Time format
  formatTime(date = new Date()) {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  }

  // Debounce utility (e.g., 300ms for search)
  debounce(func, waitMs = 300) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), waitMs);
    };
  }
}

export const UI = new UIManager();

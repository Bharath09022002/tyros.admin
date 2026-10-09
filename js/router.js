// SPA Router for Tyros Admin Portal matching Flutter AdminShell routes
import { Auth } from './auth.js';
import { UI } from './ui.js';

export class Router {
  constructor(routes = {}) {
    this.routes = routes;
    this.currentRoute = null;
    this.viewContainer = document.getElementById('view-container');
    this.bottomNav = document.getElementById('bottom-nav');

    window.addEventListener('hashchange', () => this.handleRouting());
    window.addEventListener('popstate', () => this.handleRouting());
  }

  addRoute(path, renderFn, options = {}) {
    this.routes[path] = { renderFn, options };
  }

  navigate(path) {
    window.location.hash = path;
  }

  back() {
    window.history.back();
  }

  async handleRouting() {
    let hash = window.location.hash.slice(1) || '/dashboard';
    const queryIdx = hash.indexOf('?');
    let queryParams = {};
    if (queryIdx !== -1) {
      const qStr = hash.slice(queryIdx + 1);
      queryParams = Object.fromEntries(new URLSearchParams(qStr));
      hash = hash.slice(0, queryIdx);
    }

    // Auth Guard: redirect to login if not authenticated
    if (!Auth.isAuthenticated() && hash !== '/login') {
      window.location.hash = '/login';
      return;
    }

    // If authenticated and tries to visit /login, redirect to dashboard
    if (Auth.isAuthenticated() && hash === '/login') {
      window.location.hash = '/dashboard';
      return;
    }

    // Match Route (exact or parameterized like /entry/:id)
    let matchedHandler = null;
    let params = { ...queryParams };

    for (const [pattern, handler] of Object.entries(this.routes)) {
      if (pattern === hash) {
        matchedHandler = handler;
        break;
      }

      // Check parameterized patterns (e.g., /entry/:id)
      const patternParts = pattern.split('/');
      const hashParts = hash.split('/');

      if (patternParts.length === hashParts.length) {
        let match = true;
        const extracted = {};

        for (let i = 0; i < patternParts.length; i++) {
          if (patternParts[i].startsWith(':')) {
            extracted[patternParts[i].slice(1)] = decodeURIComponent(hashParts[i]);
          } else if (patternParts[i] !== hashParts[i]) {
            match = false;
            break;
          }
        }

        if (match) {
          matchedHandler = handler;
          params = { ...params, ...extracted };
          break;
        }
      }
    }

    if (!matchedHandler) {
      // Default fallback
      window.location.hash = Auth.isAuthenticated() ? '/dashboard' : '/login';
      return;
    }

    this.currentRoute = hash;

    // Show/hide Admin Bottom Navigation Bar
    const showNav = hash !== '/login' && Auth.isAuthenticated();
    if (this.bottomNav) {
      this.bottomNav.style.display = showNav ? 'flex' : 'none';
      this.updateActiveNav(hash);
    }

    // Scroll to top
    if (this.viewContainer) {
      this.viewContainer.scrollTop = 0;
      this.viewContainer.innerHTML = `
        <div style="display:flex; justify-content:center; align-items:center; min-height: 260px;">
          <div class="spinner"></div>
        </div>
      `;

      try {
        const viewEl = await matchedHandler.renderFn(this, params);
        this.viewContainer.innerHTML = '';
        this.viewContainer.appendChild(viewEl);
      } catch (err) {
        console.error('[Router] View render failed:', err);
        this.viewContainer.innerHTML = `
          <div style="padding: 40px 20px; text-align: center; color: var(--status-overdue);">
            <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
            <div style="font-family: var(--font-condensed); font-size: 18px; font-weight: 700;">Failed to Load Page</div>
            <div style="font-size: 12px; color: var(--text-muted); margin: 6px 0 16px;">${err.message || 'An unexpected error occurred'}</div>
            <button class="btn-dark-cta" style="margin: 0 auto; max-width: 200px;" onclick="window.location.reload()">Retry</button>
          </div>
        `;
      }
    }
  }

  updateActiveNav(currentPath) {
    if (!this.bottomNav) return;
    const items = this.bottomNav.querySelectorAll('.nav-item');
    items.forEach(item => {
      const route = item.dataset.route;
      const isActive = currentPath === route || (route === '/entries' && currentPath.startsWith('/entry'));
      item.classList.toggle('active', isActive);
    });
  }
}

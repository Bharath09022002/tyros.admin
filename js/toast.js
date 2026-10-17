// Tyros Admin - Toast Notifications (js/toast.js)
class ToastManager {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (typeof document === 'undefined') return;
    let el = document.getElementById('toast-container');
    if (!el) {
      el = document.createElement('div');
      el.id = 'toast-container';
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      document.body.appendChild(el);
    }
    this.container = el;
  }

  show(message, type = 'info', durationMs = 3500) {
    if (!this.container) this.init();
    if (!this.container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');

    // Icon based on type
    const icons = {
      success: '✓',
      error: '✕',
      info: 'ℹ'
    };
    const iconSpan = document.createElement('span');
    iconSpan.style.fontWeight = '700';
    iconSpan.style.fontSize = '16px';
    iconSpan.textContent = icons[type] || 'ℹ';

    const textSpan = document.createElement('span');
    textSpan.style.flex = '1';
    textSpan.textContent = message;

    toast.appendChild(iconSpan);
    toast.appendChild(textSpan);
    this.container.appendChild(toast);

    const timer = setTimeout(() => {
      this.dismiss(toast);
    }, durationMs);

    toast.addEventListener('click', () => {
      clearTimeout(timer);
      this.dismiss(toast);
    });
  }

  dismiss(toast) {
    if (!toast || !toast.parentNode) return;
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px) scale(0.95)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 200);
  }

  success(msg, duration) {
    this.show(msg, 'success', duration);
  }

  error(msg, duration) {
    this.show(msg, 'error', duration);
  }

  info(msg, duration) {
    this.show(msg, 'info', duration);
  }
}

export const Toast = new ToastManager();
